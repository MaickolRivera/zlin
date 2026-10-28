using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Zlin.Api.Data;
using Zlin.Api.Domain;
using Zlin.Api.Dtos;

namespace Zlin.Api.Services;

public class LinkService(AppDbContext db, IOptions<AppOptions> options)
{
    private const string Alphabet = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private const int CodeLength = 7;
    private const int MaxAttempts = 5;

    private readonly string _publicUrl = options.Value.PublicUrl.TrimEnd('/');

    public static bool IsValidUrl(string value) =>
        Uri.TryCreate(value, UriKind.Absolute, out var uri) && uri.Scheme is "http" or "https";

    public async Task<ShortLink> CreateAsync(CreateLinkRequest req, Guid? userId)
    {
        for (var attempt = 0; attempt < MaxAttempts; attempt++)
        {
            var link = new ShortLink
            {
                Code = NewCode(),
                OriginalUrl = req.Url.Trim(),
                ExpiresAt = req.ExpiresAt?.ToUniversalTime(),
                UserId = userId,
            };

            db.Links.Add(link);
            try
            {
                await db.SaveChangesAsync();
                return link;
            }
            catch (DbUpdateException)
            {
                // Colisión en el índice único de Code: reintenta con otro código.
                db.Entry(link).State = EntityState.Detached;
            }
        }

        throw new InvalidOperationException("No se pudo generar un código único.");
    }

    public Task<List<ShortLink>> ListAsync(Guid userId) =>
        db.Links.AsNoTracking()
            .Where(l => l.UserId == userId)
            .OrderByDescending(l => l.CreatedAt)
            .ToListAsync();

    public async Task<bool> DeleteAsync(string code, Guid userId) =>
        await db.Links.Where(l => l.Code == code && l.UserId == userId).ExecuteDeleteAsync() > 0;

    // Devuelve la URL destino y suma un clic, o el motivo por el que no se puede resolver.
    public async Task<(string? Url, bool Expired)> ResolveAsync(string code)
    {
        var link = await db.Links.AsNoTracking()
            .Where(l => l.Code == code)
            .Select(l => new { l.OriginalUrl, l.ExpiresAt })
            .FirstOrDefaultAsync();

        if (link is null) return (null, false);
        if (link.ExpiresAt is { } exp && exp <= DateTime.UtcNow) return (null, true);

        await db.Links.Where(l => l.Code == code)
            .ExecuteUpdateAsync(s => s.SetProperty(l => l.Clicks, l => l.Clicks + 1));

        return (link.OriginalUrl, false);
    }

    public LinkResponse ToResponse(ShortLink l) =>
        new(l.Code, $"{_publicUrl}/{l.Code}", l.OriginalUrl, l.Clicks, l.CreatedAt, l.ExpiresAt);

    private static string NewCode() =>
        string.Create(CodeLength, 0, (span, _) =>
        {
            for (var i = 0; i < span.Length; i++)
                span[i] = Alphabet[RandomNumberGenerator.GetInt32(Alphabet.Length)];
        });
}
