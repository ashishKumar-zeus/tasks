using learning.Services;
using RabbitMQ.Client;
using learning.Hubs;


var builder = WebApplication.CreateBuilder(args);

{
    // Add services to the container.

    builder.Services.AddControllers();

    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();

    //creating the connectionfactory for rabbitmq
    builder.Services.AddSingleton<IConnectionFactory>(sp =>
    {
        var factory = new ConnectionFactory { HostName = "localhost" };
        return factory;
    });

    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowSpecificOrigins",
            builder =>
            {
                builder.WithOrigins("http://localhost:5500")
                       .AllowAnyMethod()
                       .AllowAnyHeader()
                       .AllowCredentials();
            });
    });

    //adding some more services
    builder.Services.AddSingleton<RabbitMQPublisher>();
    builder.Services.AddSingleton<RabbitMQConsumer>();
    builder.Services.AddSignalR();

    // builder.Services.AddTransient<RabbitMQConsumer>();//Add transient is for making the consumer trigger once post is made and stop once its finished
}

var app = builder.Build();

{
    // Configure the HTTP request pipeline./ middlewares

    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseHttpsRedirection();

    app.UseAuthorization();

    app.UseCors("AllowSpecificOrigins");
    
    // app.UseEndpoints(endpoint => {
    //     endpoint.
    // });

    app.MapHub<ProgressHub>("/hubs/progressHub");

    app.MapControllers();


}

app.Run();