using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Zlin.Api.Endpoints;

public static class ClaimsExtensions
{
    public static Guid? GetUserId(this ClaimsPrincipal principal)
    {
        var sub = principal.FindFirstValue(JwtRegisteredClaimNames.Sub)
                  ?? principal.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(sub, out var id) ? id : null;
    }
}
