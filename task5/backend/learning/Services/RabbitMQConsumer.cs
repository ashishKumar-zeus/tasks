using System.Text;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using MySql.Data.MySqlClient;


namespace learning.Services;


public class RabbitMQConsumer
{

    private readonly IConnectionFactory connectionFactory;
    private readonly IConnection connection;

    // private MySqlConnection mySQLConnection;
    private readonly IModel channel;

    public IConfiguration? configuration;//this will store the configuration settings present in appsetting.json
    private readonly string? dbConnString;//this is the string required to connect to mysql db


    public int currQueueIndex = 0;

    public RabbitMQConsumer(IConfiguration _configuration, IConnectionFactory _connectionFactory)
    {
        //constructor
        connectionFactory = _connectionFactory;
        connection = connectionFactory.CreateConnection();
        channel = connection.CreateModel();

        //constructor
        configuration = _configuration;//updating the value
        dbConnString = configuration.GetConnectionString("DBConnectionString");//updating the value

        // mySQLConnection = new MySqlConnection(dbConnString);

        var numberOfQueues = 10;

        for (int i = 0; i < numberOfQueues; i++)
        {
            channel.QueueDeclare(queue: $"queue{i}",
                     durable: false,
                     exclusive: false,
                     autoDelete: false,
                     arguments: null);

        }
    }

    public void StartListeningToQueue(int queueNumber)
    {
        // Console.WriteLine("Started listening to queue " + queueNumber);
        var consumer = new EventingBasicConsumer(channel);//creating a consumer that can listen to queue

        consumer.Received += async (model, ea) =>
        {
            //this is event that is triggered as the queue has got some data in it
            //dealing with body once received
            var body = ea.Body.ToArray();
            var message = Encoding.UTF8.GetString(body);

            //call functiont to insert in db
            Console.WriteLine("calling to db for queue " + queueNumber + ((DateTimeOffset)DateTime.UtcNow).ToUnixTimeMilliseconds());

            await InsertToDBAsync(message, queueNumber);
        };
        //listening to queue

        channel.BasicConsume(queue: $"queue{queueNumber}",
                             autoAck: true,
                             consumer: consumer);

        Console.WriteLine("out here");

    }


    public async Task InsertToDBAsync(string query, int queueN)
    {
        //inserting to db

        long start = ((DateTimeOffset)DateTime.UtcNow).ToUnixTimeMilliseconds();

        // Console.WriteLine("insert into db called ");


        await Task.Run(() =>
        {
            {

                using var mySQLConnection = new MySqlConnection(dbConnString);
                // Console.WriteLine("Connection established");

                // Console.WriteLine("running task to db");
                mySQLConnection.Open();

                using (var command = new MySqlCommand(query.ToString(), mySQLConnection))
                {
                    var watch = new System.Diagnostics.Stopwatch();
                    watch.Start();
                    command.ExecuteNonQuery();
                    // Console.WriteLine("execution completed " + ((DateTimeOffset)DateTime.UtcNow).ToUnixTimeMilliseconds());

                    watch.Stop();
                    Console.WriteLine($"DB Execution Time: {watch.ElapsedMilliseconds} ms");
                }
                mySQLConnection.Close();
                long end = ((DateTimeOffset)DateTime.UtcNow).ToUnixTimeMilliseconds();
                Console.WriteLine("INSERT finally ended at for " + queueN + end);


            }
        });

        long end = ((DateTimeOffset)DateTime.UtcNow).ToUnixTimeMilliseconds();
        // Console.WriteLine($"diff time  {queueN} {end - start}");
        // Console.WriteLine("insert ended at for " + queueN + end);
    }

}














// try
//                 {
//                     // Process and save the chunk to MySQL
//                     await MultipleInsert(message);
//                     log.IsSuccess = true;
//                     _logger.LogInformation("Chunk successfully processed");
//                     await SendProgressUpdate(message);
//                 }
//                 catch (Exception ex)
//                 {
//                     log.IsSuccess = false;
//                     log.ErrorMessage = ex.Message;
//                     _logger.LogError(ex, "Error occurred while saving chunk to MySQL. Will retry.");
//                 }
//                 finally
//                 {
//                     await SaveLogsToDB(log);
//                     if(log.IsSuccess){
//                         // Acknowledge the message to RabbitMQ only after successful processing
//                         channel.BasicAck(deliveryTag: ea.DeliveryTag, multiple: false);
//                     }else{
//                         // Do not acknowledge the message (it will be requeued by RabbitMQ)
//                         channel.BasicNack(deliveryTag: ea.DeliveryTag, multiple: false, requeue: true);
//                     }
//                 }