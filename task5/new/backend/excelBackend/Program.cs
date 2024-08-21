using excelBackend.Models;
using excelBackend.Controllers;


using NuGet.Protocol.Plugins;
using RabbitMQ.Client;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<IConnectionFactory>(sp =>
{
    var factory = new ConnectionFactory { HostName = "localhost" };
    return factory;
});

builder.Services.AddSingleton<Publisher>();
builder.Services.AddHostedServices<Consumer>();

// builder.Services.AddSingleton<Receiver>();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}



// using var connection = new MySqlConnection(builder.Configuration.GetConnectionString("DefaultConnection"));

// await connection.OpenAsync();

// using var command = new MySqlCommand("SELECT * FROM user;", connection);
// using var reader = await command.ExecuteReaderAsync();
// while (await reader.ReadAsync())
// {
//     var value = reader.GetValue(0);
//     var value2 = reader.GetValue(1);

//     Console.Write(value);
//     Console.Write(value2);

//     // do something with 'value'
// }

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();