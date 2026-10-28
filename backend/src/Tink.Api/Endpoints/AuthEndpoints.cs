using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Tink.Api.Data;
using Tink.Api.Dtos;
using Tink.Api.Services;

namespace Tink.Api.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/auth").WithTags("Auth");

        group.MapPost("/register", async (RegisterRequest req, AuthService auth) =>
        {
            var (result, error) = await auth.RegisterAsync(req);
            return result is null
                ? Results.Conflict(new { error })
                : Results.Created("/api/users/me", result);
        });

        group.MapPost("/login", async (LoginRequest req, AuthService auth) =>
        {
            var result = await auth.LoginAsync(req);
            return result is null
                ? Results.Unauthorized()
                : Results.Ok(result);
        });

        app.MapGet("/api/users/me", async (ClaimsPrincipal principal, AppDbContext db) =>
        {
            var sub = principal.FindFirstValue(JwtRegisteredClaimNames.Sub)
                      ?? principal.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(sub, out var id)) return Results.Unauthorized();

            var user = await db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == id);
            return user is null ? Results.NotFound() : Results.Ok(AuthService.ToResponse(user));
        })
        .WithTags("Users")
        .RequireAuthorization();
    }
}


