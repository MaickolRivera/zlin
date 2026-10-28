using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Zlin.Api.Data;
using Zlin.Api.Domain;
using Zlin.Api.Dtos;

namespace Zlin.Api.Services;

public class AuthService(AppDbContext db, TokenService tokens)
{
    private readonly PasswordHasher<User> _hasher = new();

    public async Task<(AuthResponse? Result, string? Error)> RegisterAsync(RegisterRequest req)
    {
        var email = req.Email.Trim().ToLowerInvariant();
        var username = req.Username.Trim();

        if (await db.Users.AnyAsync(u => u.Email == email))
            return (null, "El email ya está registrado.");
        if (await db.Users.AnyAsync(u => u.Username == username))
            return (null, "El nombre de usuario ya está en uso.");

        var user = new User { Email = email, Username = username, PasswordHash = "" };
        user.PasswordHash = _hasher.HashPassword(user, req.Password);

        db.Users.Add(user);
        await db.SaveChangesAsync();

        return (BuildResponse(user), null);
    }

    public async Task<AuthResponse?> LoginAsync(LoginRequest req)
    {
        var email = req.Email.Trim().ToLowerInvariant();
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (user is null) return null;

        var result = _hasher.VerifyHashedPassword(user, user.PasswordHash, req.Password);
        return result == PasswordVerificationResult.Failed ? null : BuildResponse(user);
    }

    public static UserResponse ToResponse(User u) => new(u.Id, u.Email, u.Username, u.CreatedAt);

    private AuthResponse BuildResponse(User user)
    {
        var (token, expires) = tokens.Create(user);
        return new AuthResponse(token, expires, ToResponse(user));
    }
}
