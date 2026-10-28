namespace Zlin.Api.Services;

public class JwtOptions
{
    public const string Section = "Jwt";

    public string Issuer { get; set; } = "Zlin";
    public string Audience { get; set; } = "Zlin";
    public string Key { get; set; } = "";
    public int ExpiresMinutes { get; set; } = 60;
}
