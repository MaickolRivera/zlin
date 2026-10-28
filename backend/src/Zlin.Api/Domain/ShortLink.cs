namespace Zlin.Api.Domain;

public class ShortLink
{
    public long Id { get; set; }
    public required string Code { get; set; }
    public required string OriginalUrl { get; set; }
    public int Clicks { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ExpiresAt { get; set; }

    // Null cuando el enlace lo creó alguien sin sesión.
    public Guid? UserId { get; set; }
    public User? User { get; set; }
}
