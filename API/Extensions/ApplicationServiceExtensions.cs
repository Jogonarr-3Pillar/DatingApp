using API.Data;
using API.Interfaces;
using API.Services;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration) {
            services.AddScoped<ITokenService, TokenService>();

            var connectionString = configuration.GetConnectionString("DefaultConnection");
            services.AddDbContext<DataContext>(x => x.UseSqlite(connectionString));

            return services;
        }
    }
}