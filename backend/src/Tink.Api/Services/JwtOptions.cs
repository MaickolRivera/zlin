namespace Tink.Api.Services;

public class JwtOptions
{
    public const string Section = "Jwt";

    public string Issuer { get; set; } = "Tink";
    public string Audience { get; set; } = "Tink";
    public string Key { get; set; } = "";
    public int ExpiresMinutes { get; set; } = 60;
}
