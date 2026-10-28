using System.ComponentModel.DataAnnotations;

namespace Tink.Api.Dtos;

public record RegisterRequest(
    [Required, EmailAddress, MaxLength(256)] string Email,
    [Required, RegularExpression(@"^[a-zA-Z0-9_]{3,50}$")] string Username,
    [Required, MinLength(8), MaxLength(128)] string Password);

public record LoginRequest(
    [Required] string Email,
    [Required] string Password);

public record UserResponse(Guid Id, string Email, string Username, DateTime CreatedAt);

public record AuthResponse(string Token, DateTime ExpiresAt, UserResponse User);
