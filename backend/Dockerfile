# Stage 1: Build the backend
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["InfraPM.Api.csproj", "./"]
RUN dotnet restore "InfraPM.Api.csproj"

# Copy the rest of the code and build
COPY . .
RUN dotnet build "InfraPM.Api.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "InfraPM.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Serve the application
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Install native dependencies required for SkiaSharp on Linux
RUN apt-get update && apt-get install -y libfontconfig1 libfreetype6

COPY --from=publish /app/publish .

# Create volume directories for image uploads
RUN mkdir -p /app/Storage/Images/Originals
RUN mkdir -p /app/Storage/Images/Thumbnails

EXPOSE 8080

ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "InfraPM.Api.dll"]