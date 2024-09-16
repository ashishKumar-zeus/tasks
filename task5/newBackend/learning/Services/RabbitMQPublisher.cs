using System.Text;
using RabbitMQ.Client;

namespace learning.Services;



public class RabbitMQPublisher
{

    private readonly RabbitMQConsumer consumer;

    private readonly IConnectionFactory connectionFactory;
    private readonly IConnection connection;
    private readonly IModel channel;

    public int currQueueIndex;

    public RabbitMQPublisher(IConnectionFactory _connectionFactory, RabbitMQConsumer _consumer)
    {

        //constructor
        connectionFactory = _connectionFactory;
        connection = connectionFactory.CreateConnection();
        channel = connection.CreateModel();
        consumer = _consumer;

        var numberOfQueues = 10;
        currQueueIndex = 0;

        for (int i = 0; i < numberOfQueues; i++)
        {
            channel.QueueDeclare(queue: $"queue{i}",
                     durable: false,
                     exclusive: false,
                     autoDelete: false,
                     arguments: null);

        }
    }

    public  void SendChunk(string chunks)
    {

        if (currQueueIndex == 10)
        {
            currQueueIndex = 0;
        }
        var body = Encoding.UTF8.GetBytes(chunks);

        consumer.StartListeningToQueue(currQueueIndex);

        channel.BasicPublish(exchange: string.Empty,
                             routingKey: $"queue{currQueueIndex}",
                             basicProperties: null,
                             body: body);

        currQueueIndex += 1;


    }


}

