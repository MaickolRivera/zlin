using System.Security.Claims;
using Microsoft.AspNetCore.RateLimiting;
using Zlin.Api.Dtos;
using Zlin.Api.Services;

namespace Zlin.Api.Endpoints;

public static class LinkEndpoints
{
    public static void MapLinkEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/links").WithTags("Links");

        // Anónimo permitido: si llega un JWT válido, el enlace queda a nombre del usuario.
        group.MapPost("/", async (CreateLinkRequest req, ClaimsPrincipal principal, LinkService links) =>
        {
            if (!LinkService.IsValidUrl(req.Url))
                return Results.ValidationProblem(new Dictionary<string, string[]>
                {
                    ["Url"] = ["Debe ser una URL absoluta http o https."],
                });

            if (req.ExpiresAt is { } exp && exp.ToUniversalTime() <= DateTime.UtcNow)
                return Results.ValidationProblem(new Dictionary<string, string[]>
                {
                    ["ExpiresAt"] = ["La fecha de expiración debe ser futura."],
                });

            var link = await links.CreateAsync(req, principal.GetUserId());
            return Results.Created($"/{link.Code}", links.ToResponse(link));
        })
        .RequireRateLimiting(RateLimiting.CreateLink);

        group.MapGet("/", async (ClaimsPrincipal principal, LinkService links) =>
        {
            if (principal.GetUserId() is not { } userId) return Results.Unauthorized();
            var list = await links.ListAsync(userId);
            return Results.Ok(list.Select(links.ToResponse));
        })
        .RequireAuthorization();

        group.MapDelete("/{code}", async (string code, ClaimsPrincipal principal, LinkService links) =>
        {
            if (principal.GetUserId() is not { } userId) return Results.Unauthorized();
            return await links.DeleteAsync(code, userId) ? Results.NoContent() : Results.NotFound();
        })
        .RequireAuthorization();

        // Redirección pública. Un solo segmento de 4 a 16 chars; no choca con /api ni /openapi.
        app.MapGet("/{code:length(4,16)}", async (string code, LinkService links) =>
        {
            var (url, expired) = await links.ResolveAsync(code);
            if (url is not null) return Results.Redirect(url);
            return expired ? Results.StatusCode(StatusCodes.Status410Gone) : Results.NotFound();
        })
        .WithTags("Links")
        .ExcludeFromDescription();
    }
}
