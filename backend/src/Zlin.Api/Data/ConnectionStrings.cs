using Npgsql;

namespace Zlin.Api.Data;

public static class ConnectionStrings
{
    // Neon y Render entregan una URI (postgres://user:pass@host/db); Npgsql espera pares clave=valor.
    public static string ToNpgsql(string value)
    {
        if (!value.StartsWith("postgres://") && !value.StartsWith("postgresql://"))
            return value;

        var uri = new Uri(value);
        var userInfo = uri.UserInfo.Split(':', 2);

        return new NpgsqlConnectionStringBuilder
        {
            Host = uri.Host,
            Port = uri.Port > 0 ? uri.Port : 5432,
            Database = uri.AbsolutePath.TrimStart('/'),
            Username = Uri.UnescapeDataString(userInfo[0]),
            Password = userInfo.Length > 1 ? Uri.UnescapeDataString(userInfo[1]) : null,
            SslMode = SslMode.Require,
        }.ConnectionString;
    }
}
