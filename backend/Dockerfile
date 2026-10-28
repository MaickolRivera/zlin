FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY src/Zlin.Api/Zlin.Api.csproj src/Zlin.Api/
RUN dotnet restore src/Zlin.Api/Zlin.Api.csproj
COPY src/Zlin.Api/ src/Zlin.Api/
RUN dotnet publish src/Zlin.Api/Zlin.Api.csproj -c Release -o /app --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app .
ENV ASPNETCORE_ENVIRONMENT=Production
ENTRYPOINT ["dotnet", "Zlin.Api.dll"]
