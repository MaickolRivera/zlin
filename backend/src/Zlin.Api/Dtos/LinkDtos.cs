using System.ComponentModel.DataAnnotations;

namespace Zlin.Api.Dtos;

public record CreateLinkRequest(
    [Required, MaxLength(2048)] string Url,
    DateTime? ExpiresAt);

public record LinkResponse(
    string Code,
    string ShortUrl,
    string OriginalUrl,
    int Clicks,
    DateTime CreatedAt,
    DateTime? ExpiresAt);
