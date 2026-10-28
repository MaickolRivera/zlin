namespace Zlin.Api.Services;

public class AppOptions
{
    public const string Section = "App";

    // Dominio público donde viven los enlaces cortos (ej: https://zlin.vercel.app).
    public string PublicUrl { get; set; } = "http://localhost:5173";
    public string[] CorsOrigins { get; set; } = [];
}
