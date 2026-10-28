namespace Zlin.Api.Services;

public class RateLimitOptions
{
    public const string Section = "RateLimit";

    // Peticiones por minuto. Los anónimos se miden por IP; los autenticados, por usuario.
    public int AnonymousLinksPerMinute { get; set; } = 10;
    public int UserLinksPerMinute { get; set; } = 60;

    // Login y registro, por IP: frena la fuerza bruta de contraseñas.
    public int AuthPerMinute { get; set; } = 10;
}
