using System.Text;
using RabbitMQ.Client;

public class Publisher
{

    private readonly IConnectionFactory factory;

    public Publisher(IConnectionFactory c_factory)
    {
        factory = c_factory;
    }

    public void SendMessage(string message)
    {
        string _message = message;
        using var connection = factory.CreateConnection();
        using var channel = connection.CreateModel();

        channel.QueueDeclare(queue: "hello",
                            durable: false,
                            exclusive: false,
                            autoDelete: false,
                            arguments: null);

        var body = Encoding.UTF8.GetBytes(_message);

        channel.BasicPublish(exchange: string.Empty,
                            routingKey: "hello",
                            basicProperties: null,
                            body: body);
                        
        Console.WriteLine($" [x] Sent {_message}");

        Console.WriteLine(" Press [enter] to exit.");
        Console.ReadLine();

    }
}