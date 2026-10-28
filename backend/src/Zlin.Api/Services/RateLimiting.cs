using System.Threading.RateLimiting;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.Options;
using Zlin.Api.Endpoints;

namespace Zlin.Api.Services;

public static class RateLimiting
{
    public const string CreateLink = "create-link";
    public const string Auth = "auth";

    public static IServiceCollection AddZlinRateLimiting(this IServiceCollection services, IConfiguration config)
    {
        services.Configure<RateLimitOptions>(config.GetSection(RateLimitOptions.Section));
        var limits = config.GetSection(RateLimitOptions.Section).Get<RateLimitOptions>() ?? new RateLimitOptions();

        services.AddRateLimiter(o =>
        {
            o.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

            // Un usuario con sesión tiene su propio cupo; los anónimos comparten el de su IP.
            o.AddPolicy(CreateLink, ctx => ctx.User.GetUserId() is { } userId
                ? Window($"user:{userId}", limits.UserLinksPerMinute)
                : Window($"ip:{ClientIp(ctx)}", limits.AnonymousLinksPerMinute));

            o.AddPolicy(Auth, ctx => Window($"ip:{ClientIp(ctx)}", limits.AuthPerMinute));

            o.OnRejected = async (context, token) =>
            {
                if (context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter))
                    context.HttpContext.Response.Headers.RetryAfter = ((int)Math.Ceiling(retryAfter.TotalSeconds)).ToString();

                await context.HttpContext.Response.WriteAsJsonAsync(
                    new { error = "Demasiadas solicitudes. Intenta de nuevo en un momento." }, token);
            };
        });

        return services;
    }

    private static RateLimitPartition<string> Window(string key, int permitLimit) =>
        RateLimitPartition.GetFixedWindowLimiter(key, _ => new FixedWindowRateLimiterOptions
        {
            PermitLimit = permitLimit,
            Window = TimeSpan.FromMinutes(1),
            QueueLimit = 0,
        });

    // Detrás del proxy de Render esto es la IP real, gracias a UseForwardedHeaders.
    private static string ClientIp(HttpContext ctx) => ctx.Connection.RemoteIpAddress?.ToString() ?? "unknown";
}
