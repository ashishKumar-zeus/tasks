
using System.Text;
using RabbitMQ.Client;


public class Consumer 
{

    private readonly IConnectionFactory factory;

    public Consumer(IConnectionFactory c_factory)
    {
        factory = c_factory;
        ReceiveMessage();
    }

    public void ReceiveMessage()
    {
        using var connection = factory.CreateConnection();
        using var channel = connection.CreateModel();

        channel.QueueDeclare(queue: "hello",
                            durable: false,
                            exclusive: false,
                            autoDelete: false,
                            arguments: null);

        Console.WriteLine(" [*] Waiting for messages.");

        var consumer = new EventingBasicConsumer(channel);
        consumer.Received += (model, ea) =>
        {
            var body = ea.Body.ToArray();
            var message = Encoding.UTF8.GetString(body);
            Console.WriteLine($" [x] Received {message}");
        };
        channel.BasicConsume(queue: "hello",
                            autoAck: true,
                            consumer: consumer);

        Console.WriteLine(" Press [enter] to exit.");
        Console.ReadLine();

    }
}