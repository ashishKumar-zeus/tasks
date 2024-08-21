using System.Text;
using learning.Models;
using learning.Services;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

namespace learning.Controllers;

[ApiController]

[Route("api/[controller]")]

public class DataController : ControllerBase
{
    //this class will handle various apis for the data

    public IConfiguration? configuration;//this will store the configuration settings present in appsetting.json
    private readonly string? dbConnString;//this is the string required to connect to mysql db


    //initializing the rabbitmq publisher and consumer

    private readonly RabbitMQPublisher publisher;

    public DataController(IConfiguration _configuration, RabbitMQPublisher _publisher)
    {
        //constructor
        configuration = _configuration;//updating the value
        dbConnString = configuration.GetConnectionString("DBConnectionString");//updating the value

        publisher = _publisher;
    }

    [HttpGet]// identifies a action as GET
    public ActionResult<List<DataModel>> GetData()
    {
        //this method returns a actionresult (status code) and list of datamodels

        var listOfData = new List<DataModel> { };//defining a list of datamodels with initally nothing in it


        //using is used to dispose the variable once finished using it which is used only inside {}
        using (var connection = new MySqlConnection(dbConnString))
        {
            connection.Open();

            var query = "SELECT * FROM usertest2";//creating the syntax

            using (var command = new MySqlCommand(query, connection))
            {
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {

                        var data = new DataModel
                        {
                            Email_id = reader.GetString("Email_id"),
                            Name = reader.GetString("Name"),
                            Country = reader.GetString("Country"),
                            State = reader.GetString("State"),
                            City = reader.GetString("City"),
                            Telephone_number = (int)reader.GetInt64("Telephone_number"),
                            Address_line_1 = reader.GetString("Address_line_1"),
                            Address_line_2 = reader.GetString("Address_line_2"),
                            Date_of_birth = reader.GetString("Date_of_birth"),
                            Gross_salary_FY2019_20 = (int)reader.GetInt64("Gross_salary_FY2019_20"),
                            Gross_salary_FY2020_21 = (int)reader.GetInt64("Gross_salary_FY2020_21"),
                            Gross_salary_FY2021_22 = (int)reader.GetInt64("Gross_salary_FY2021_22"),
                            Gross_salary_FY2022_23 = (int)reader.GetInt64("Gross_salary_FY2022_23"),
                            Gross_salary_FY2023_24 = (int)reader.GetInt64("Gross_salary_FY2023_24")

                        };

                        listOfData.Add(data);
                    }

                }

            }


            return Ok(listOfData);
        }

    }

    // POST method to add a new DataModel
    [HttpPost("insertSingleData")]
    public async Task<IActionResult> PostData(DataModel dataModel)
    {
        if (dataModel == null)
        {
            return BadRequest("DataModel object is null.");
        }

        try
        {
            using (var connection = new MySqlConnection(dbConnString))
            {
                await connection.OpenAsync();

                var query = @"
                        INSERT INTO usertest2 
                        (Email_id, Name, Country, State, City, Telephone_number, Address_line_1, Address_line_2, Date_of_birth, Gross_salary_FY2019_20, Gross_salary_FY2020_21, Gross_salary_FY2021_22, Gross_salary_FY2022_23, Gross_salary_FY2023_24) 
                        VALUES 
                        (@Email_id, @Name, @Country, @State, @City, @Telephone_number, @Address_line_1, @Address_line_2, @Date_of_birth, @Gross_salary_FY2019_20, @Gross_salary_FY2020_21, @Gross_salary_FY2021_22, @Gross_salary_FY2022_23, @Gross_salary_FY2023_24);";

                using (var command = new MySqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Email_id", dataModel.Email_id);
                    command.Parameters.AddWithValue("@Name", dataModel.Name);
                    command.Parameters.AddWithValue("@Country", dataModel.Country);
                    command.Parameters.AddWithValue("@State", dataModel.State);
                    command.Parameters.AddWithValue("@City", dataModel.City);
                    command.Parameters.AddWithValue("@Telephone_number", dataModel.Telephone_number);
                    command.Parameters.AddWithValue("@Address_line_1", dataModel.Address_line_1);
                    command.Parameters.AddWithValue("@Address_line_2", dataModel.Address_line_2);
                    command.Parameters.AddWithValue("@Date_of_birth", dataModel.Date_of_birth);
                    command.Parameters.AddWithValue("@Gross_salary_FY2019_20", dataModel.Gross_salary_FY2019_20);
                    command.Parameters.AddWithValue("@Gross_salary_FY2020_21", dataModel.Gross_salary_FY2020_21);
                    command.Parameters.AddWithValue("@Gross_salary_FY2021_22", dataModel.Gross_salary_FY2021_22);
                    command.Parameters.AddWithValue("@Gross_salary_FY2022_23", dataModel.Gross_salary_FY2022_23);
                    command.Parameters.AddWithValue("@Gross_salary_FY2023_24", dataModel.Gross_salary_FY2023_24);

                    await command.ExecuteNonQueryAsync();
                }
            }

            return CreatedAtAction(nameof(GetData), new { email_id = dataModel.Email_id }, dataModel);
            // 1. Action name to retrieve the resource
            // 2. Route values (identifier of the newly created resource)
            // 3. The newly created resource to return in the response body
        }
        catch (Exception ex)
        {
            // Handle exceptions (e.g., log the error)
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }


    //POST method to add multiple DataModels
    [HttpPost("insertMultipleData1")]
    public async Task<IActionResult> PostMultipleData1(IFormFile file)
    {

        //this method posts a csv data ie. multiple data into mysql with single query without using any chunks

        var watch = new System.Diagnostics.Stopwatch();
        watch.Start();

        if (file == null || file.Length == 0)
        {
            return BadRequest("No file uploaded.");
        }

        // await ProcessCsvFile1(file); //without chunking

        await ProcessCsvFile1(file);//with chunking
        watch.Stop();
        Console.WriteLine($"time  : {watch.ElapsedMilliseconds} ms");
        return Ok();

    }

    //POST method to add multiple DataModels
    [HttpPost("insertMultipleData2")]
    public async Task<IActionResult> PostMultipleData2(IFormFile file)
    {

        //this method posts a csv data ie. multiple data into mysql with single query without using any chunks

        var watch = new System.Diagnostics.Stopwatch();
        watch.Start();
        if (file == null || file.Length == 0)
        {
            return BadRequest("No file uploaded.");
        }

        // await ProcessCsvFile1(file); //without chunking

        await ProcessCsvFile2(file);//with chunking

        watch.Stop();
        Console.WriteLine($"time : {watch.ElapsedMilliseconds} ms");
        return Ok();

    }

    //POST method to add multiple DataModels
    [HttpPost("insertMultipleData3")]
    public async Task<IActionResult> PostMultipleData3(IFormFile file)
    {

        if (file == null || file.Length == 0)
        {
            return BadRequest("No file uploaded.");
        }

        // await ProcessCsvFile1(file); //without chunking

        await ProcessCsvFile3(file);//with chunking

        return Ok();

    }

    [HttpPost("insertMultipleData4")]
    public async Task<IActionResult> PostMultipleData4(IFormFile file)
    {

        //this method posts a csv data ie. multiple data into mysql with single query without using any chunks

        Console.WriteLine("-------------");
        Console.WriteLine(((DateTimeOffset)DateTime.UtcNow).ToUnixTimeMilliseconds());

        if (file == null || file.Length == 0)
        {
            return BadRequest("No file uploaded.");
        }

        // await ProcessCsvFile1(file); //without chunking

        await ProcessCsvFile4(file);//with chunking

        return Ok();

    }

    private async Task ProcessCsvFile1(IFormFile file)
    {
        const int batchSize = 10000;
        using var stream = file.OpenReadStream();
        using var reader = new StreamReader(stream);

        await reader.ReadLineAsync(); // Skip header

        var records = new List<DataModel>(batchSize);
        string? line;

        while ((line = await reader.ReadLineAsync()) != null)
        {
            var columns = line.Split(',');
            records.Add(new DataModel
            {
                Email_id = columns[0],
                Name = columns[1],
                Country = columns[2],
                State = columns[3],
                City = columns[4],
                Telephone_number = (int)Int64.Parse(columns[5]),
                Address_line_1 = columns[6],
                Address_line_2 = columns[7],
                Date_of_birth = columns[8],
                Gross_salary_FY2019_20 = (int)Int64.Parse(columns[9]),
                Gross_salary_FY2020_21 = (int)Int64.Parse(columns[10]),
                Gross_salary_FY2021_22 = (int)Int64.Parse(columns[11]),
                Gross_salary_FY2022_23 = (int)Int64.Parse(columns[12]),
                Gross_salary_FY2023_24 = (int)Int64.Parse(columns[13])
            });

            if (records.Count == batchSize)
            {

                var recordsCopy = new List<DataModel>(records);
                records.Clear();

                _ = InsertIntoDB1(recordsCopy); // Fire and forget
            }
        }

        if (records.Count > 0)
        {
            _ = InsertIntoDB1(records);
        }
    }
    //2s
    private async Task ProcessCsvFile2(IFormFile file)
    {
        const int batchSize = 10000;
        using var stream = file.OpenReadStream();
        using var reader = new StreamReader(stream);

        await reader.ReadLineAsync(); // Skip header

        var records = new List<DataModel>(batchSize);
        string? line;

        while ((line = await reader.ReadLineAsync()) != null)
        {
            var columns = line.Split(',');
            records.Add(new DataModel
            {
                Email_id = columns[0],
                Name = columns[1],
                Country = columns[2],
                State = columns[3],
                City = columns[4],
                Telephone_number = (int)Int64.Parse(columns[5]),
                Address_line_1 = columns[6],
                Address_line_2 = columns[7],
                Date_of_birth = columns[8],
                Gross_salary_FY2019_20 = (int)Int64.Parse(columns[9]),
                Gross_salary_FY2020_21 = (int)Int64.Parse(columns[10]),
                Gross_salary_FY2021_22 = (int)Int64.Parse(columns[11]),
                Gross_salary_FY2022_23 = (int)Int64.Parse(columns[12]),
                Gross_salary_FY2023_24 = (int)Int64.Parse(columns[13])
            });

            if (records.Count == batchSize)
            {

                var recordsCopy = new List<DataModel>(records);
                records.Clear();

                _ = InsertIntoDB2(recordsCopy); // Fire and forget
            }
        }

        if (records.Count > 0)
        {
            _ = InsertIntoDB2(records);
        }
    }
    //8s
    private async Task ProcessCsvFile3(IFormFile file)
    {
        const int batchSize = 10000;
        using var stream = file.OpenReadStream();
        using var reader = new StreamReader(stream);

        await reader.ReadLineAsync(); // Skip header

        var records = new List<DataModel>(batchSize);
        string? line;

        while ((line = await reader.ReadLineAsync()) != null)
        {
            var columns = line.Split(',');
            records.Add(new DataModel
            {
                Email_id = columns[0],
                Name = columns[1],
                Country = columns[2],
                State = columns[3],
                City = columns[4],
                Telephone_number = (int)Int64.Parse(columns[5]),
                Address_line_1 = columns[6],
                Address_line_2 = columns[7],
                Date_of_birth = columns[8],
                Gross_salary_FY2019_20 = (int)Int64.Parse(columns[9]),
                Gross_salary_FY2020_21 = (int)Int64.Parse(columns[10]),
                Gross_salary_FY2021_22 = (int)Int64.Parse(columns[11]),
                Gross_salary_FY2022_23 = (int)Int64.Parse(columns[12]),
                Gross_salary_FY2023_24 = (int)Int64.Parse(columns[13])
            });

            if (records.Count == batchSize)
            {

                var recordsCopy = new List<DataModel>(records);
                records.Clear();

                _ = InsertIntoDB3(recordsCopy); // Fire and forget
            }
        }

        if (records.Count > 0)
        {
            _ = InsertIntoDB3(records);
        }
    }
    //8s

    private async Task ProcessCsvFile4(IFormFile file)
    {

        Task[] tasks = new Task[20];

        const int batchSize = 5000;
        using var stream = file.OpenReadStream();
        using var reader = new StreamReader(stream);

        Console.WriteLine(((DateTimeOffset)DateTime.UtcNow).ToUnixTimeMilliseconds());


        await reader.ReadLineAsync(); // Skip header

        var records = new List<DataModel>(batchSize);
        string? line;

        int i = 0;

        while ((line = await reader.ReadLineAsync()) != null)
        {
            var columns = line.Split(',');
            records.Add(new DataModel
            {
                Email_id = columns[0],
                Name = columns[1],
                Country = columns[2],
                State = columns[3],
                City = columns[4],
                Telephone_number = (int)Int64.Parse(columns[5]),
                Address_line_1 = columns[6],
                Address_line_2 = columns[7],
                Date_of_birth = columns[8],
                Gross_salary_FY2019_20 = (int)Int64.Parse(columns[9]),
                Gross_salary_FY2020_21 = (int)Int64.Parse(columns[10]),
                Gross_salary_FY2021_22 = (int)Int64.Parse(columns[11]),
                Gross_salary_FY2022_23 = (int)Int64.Parse(columns[12]),
                Gross_salary_FY2023_24 = (int)Int64.Parse(columns[13])
            });

            if (records.Count == batchSize)
            {
                // Console.WriteLine("Ram");
                var recordsCopy = new List<DataModel>(records);
                records.Clear();
                // Console.WriteLine("siya");

                tasks[i] = Task.Run(() => ConvertToQuery(recordsCopy));
                i++;
            }
        }

        if (records.Count > 0)
        {
            tasks[i] = Task.Run(() => ConvertToQuery(records));
        }

        await Task.WhenAll(tasks);
        Console.WriteLine(((DateTimeOffset)DateTime.UtcNow).ToUnixTimeMilliseconds());

    }


    //functions required to process the csv file ( chunking data and calling bulk query insert for this chunks)


    private async Task InsertIntoDB1(List<DataModel> records)
    {
        //this function receives a list of records and send it chunk wise to mysql db without using Parameters for query builders
        //this may be prone to sql injection

        var queryBuilder = new StringBuilder();
        queryBuilder.Append("INSERT INTO usertest2 (Email_id, Name, Country, State, City, Telephone_number, Address_line_1, Address_line_2, Date_of_birth, Gross_salary_FY2019_20, Gross_salary_FY2020_21, Gross_salary_FY2021_22, Gross_salary_FY2022_23, Gross_salary_FY2023_24) VALUES ");

        bool isFirstValueEntry = true;

        foreach (var record in records)
        {
            if (!isFirstValueEntry)
            {
                queryBuilder.Append(',');
            }

            queryBuilder.Append($"(" +
                $"'{MySqlHelper.EscapeString(record.Email_id)}', " +
                $"'{MySqlHelper.EscapeString(record.Name)}', " +
                $"'{MySqlHelper.EscapeString(record.Country)}', " +
                $"'{MySqlHelper.EscapeString(record.State)}', " +
                $"'{MySqlHelper.EscapeString(record.City)}', " +
                $"{record.Telephone_number}, " +
                $"'{MySqlHelper.EscapeString(record.Address_line_1)}', " +
                $"'{MySqlHelper.EscapeString(record.Address_line_2)}', " +
                $"'{MySqlHelper.EscapeString(record.Date_of_birth)}', " +
                $"{record.Gross_salary_FY2019_20}, " +
                $"{record.Gross_salary_FY2020_21}, " +
                $"{record.Gross_salary_FY2021_22}, " +
                $"{record.Gross_salary_FY2022_23}, " +
                $"{record.Gross_salary_FY2023_24})");

            isFirstValueEntry = false;
        }

        queryBuilder.Append(';');

        using (var connection = new MySqlConnection(dbConnString))
        {
            await connection.OpenAsync();
            using (var command = new MySqlCommand(queryBuilder.ToString(), connection))
            {
                await command.ExecuteNonQueryAsync();
            }
            await connection.CloseAsync();
        }
    }

    private async Task InsertIntoDB2(List<DataModel> records)
    {
        //this function receives a list of records and send it chunk wise to mysql db using Parameters for query builders

        if (records == null || records.Count == 0)
            return;

        // Create the base insert query
        var queryBuilder = new StringBuilder();
        queryBuilder.Append("INSERT INTO usertest2 (Email_id, Name, Country, State, City, Telephone_number, Address_line_1, Address_line_2, Date_of_birth, Gross_salary_FY2019_20, Gross_salary_FY2020_21, Gross_salary_FY2021_22, Gross_salary_FY2022_23, Gross_salary_FY2023_24) VALUES ");

        // Add placeholders for the parameters
        var parameters = new List<MySqlParameter>();
        for (int i = 0; i < records.Count; i++)
        {
            if (i > 0)
                queryBuilder.Append(',');

            // Add placeholders for each column
            queryBuilder.Append($"(@Email_id{i}, @Name{i}, @Country{i}, @State{i}, @City{i}, @Telephone_number{i}, @Address_line_1{i}, @Address_line_2{i}, @Date_of_birth{i}, @Gross_salary_FY2019_20{i}, @Gross_salary_FY2020_21{i}, @Gross_salary_FY2021_22{i}, @Gross_salary_FY2022_23{i}, @Gross_salary_FY2023_24{i})");

            // Add parameters for this record
            parameters.Add(new MySqlParameter($"@Email_id{i}", records[i].Email_id));
            parameters.Add(new MySqlParameter($"@Name{i}", records[i].Name));
            parameters.Add(new MySqlParameter($"@Country{i}", records[i].Country));
            parameters.Add(new MySqlParameter($"@State{i}", records[i].State));
            parameters.Add(new MySqlParameter($"@City{i}", records[i].City));
            parameters.Add(new MySqlParameter($"@Telephone_number{i}", records[i].Telephone_number));
            parameters.Add(new MySqlParameter($"@Address_line_1{i}", records[i].Address_line_1));
            parameters.Add(new MySqlParameter($"@Address_line_2{i}", records[i].Address_line_2));
            parameters.Add(new MySqlParameter($"@Date_of_birth{i}", records[i].Date_of_birth));
            parameters.Add(new MySqlParameter($"@Gross_salary_FY2019_20{i}", records[i].Gross_salary_FY2019_20));
            parameters.Add(new MySqlParameter($"@Gross_salary_FY2020_21{i}", records[i].Gross_salary_FY2020_21));
            parameters.Add(new MySqlParameter($"@Gross_salary_FY2021_22{i}", records[i].Gross_salary_FY2021_22));
            parameters.Add(new MySqlParameter($"@Gross_salary_FY2022_23{i}", records[i].Gross_salary_FY2022_23));
            parameters.Add(new MySqlParameter($"@Gross_salary_FY2023_24{i}", records[i].Gross_salary_FY2023_24));
        }

        // Finalize the query
        queryBuilder.Append(';');

        using (var connection = new MySqlConnection(dbConnString))
        {
            await connection.OpenAsync();
            using (var command = new MySqlCommand(queryBuilder.ToString(), connection))
            {
                command.Parameters.AddRange(parameters.ToArray());
                await command.ExecuteNonQueryAsync();
            }
            await connection.CloseAsync();
        }
    }

    private async Task InsertIntoDB3(List<DataModel> records)
    {

        //this function receives a list of records and send it chunk wise to mysql db using Parameters for query builders

        if (records == null || records.Count == 0)
            return;

        // Create the base insert query
        var queryBuilder = new StringBuilder();
        queryBuilder.Append("INSERT INTO usertest2 (Email_id, Name, Country, State, City, Telephone_number, Address_line_1, Address_line_2, Date_of_birth, Gross_salary_FY2019_20, Gross_salary_FY2020_21, Gross_salary_FY2021_22, Gross_salary_FY2022_23, Gross_salary_FY2023_24) VALUES ");

        for (int i = 0; i < records.Count; i++)
        {
            if (i > 0)
                queryBuilder.Append(',');


            queryBuilder.Append($"(@Email_id{i}, @Name{i}, @Country{i}, @State{i}, @City{i}, @Telephone_number{i}, @Address_line_1{i}, @Address_line_2{i}, @Date_of_birth{i}, @Gross_salary_FY2019_20{i}, @Gross_salary_FY2020_21{i}, @Gross_salary_FY2021_22{i}, @Gross_salary_FY2022_23{i}, @Gross_salary_FY2023_24{i})");

        }

        // Finalize the query
        queryBuilder.Append(';');

        using (var connection = new MySqlConnection(dbConnString))
        {
            await connection.OpenAsync();
            using (var command = new MySqlCommand(queryBuilder.ToString(), connection))
            {
                for (int i = 0; i < records.Count; i++)
                {

                    var r = records[i];
                    command.Parameters.AddWithValue($"@Email_id{i}", r.Email_id);
                    command.Parameters.AddWithValue($"@Name{i}", r.Name);
                    command.Parameters.AddWithValue($"@Country{i}", r.Country);
                    command.Parameters.AddWithValue($"@State{i}", r.State);
                    command.Parameters.AddWithValue($"@City{i}", r.City);
                    command.Parameters.AddWithValue($"@Telephone_number{i}", r.Telephone_number);
                    command.Parameters.AddWithValue($"@Address_line_1{i}", r.Address_line_1);
                    command.Parameters.AddWithValue($"@Address_line_2{i}", r.Address_line_2);
                    command.Parameters.AddWithValue($"@Date_of_birth{i}", r.Date_of_birth);
                    command.Parameters.AddWithValue($"@Gross_salary_FY2019_20{i}", r.Gross_salary_FY2019_20);
                    command.Parameters.AddWithValue($"@Gross_salary_FY2020_21{i}", r.Gross_salary_FY2020_21);
                    command.Parameters.AddWithValue($"@Gross_salary_FY2021_22{i}", r.Gross_salary_FY2021_22);
                    command.Parameters.AddWithValue($"@Gross_salary_FY2022_23{i}", r.Gross_salary_FY2022_23);
                    command.Parameters.AddWithValue($"@Gross_salary_FY2023_24{i}", r.Gross_salary_FY2023_24);
                }
                await command.ExecuteNonQueryAsync();
            }
            await connection.CloseAsync();
        }

    }


    private void ConvertToQuery(List<DataModel> records)
    {
        //this function receives a list of records and send it chunk wise to mysql db without using Parameters for query builders


        var queryBuilder = new StringBuilder();
        queryBuilder.Append("INSERT INTO usertest2 (Email_id, Name, Country, State, City, Telephone_number, Address_line_1, Address_line_2, Date_of_birth, Gross_salary_FY2019_20, Gross_salary_FY2020_21, Gross_salary_FY2021_22, Gross_salary_FY2022_23, Gross_salary_FY2023_24) VALUES ");

        bool isFirstValueEntry = true;

        foreach (var record in records)
        {
            if (!isFirstValueEntry)
            {
                queryBuilder.Append(',');
            }

            queryBuilder.Append($"(" +
                $"'{MySqlHelper.EscapeString(record.Email_id)}', " +
                $"'{MySqlHelper.EscapeString(record.Name)}', " +
                $"'{MySqlHelper.EscapeString(record.Country)}', " +
                $"'{MySqlHelper.EscapeString(record.State)}', " +
                $"'{MySqlHelper.EscapeString(record.City)}', " +
                $"{record.Telephone_number}, " +
                $"'{MySqlHelper.EscapeString(record.Address_line_1)}', " +
                $"'{MySqlHelper.EscapeString(record.Address_line_2)}', " +
                $"'{MySqlHelper.EscapeString(record.Date_of_birth)}', " +
                $"{record.Gross_salary_FY2019_20}, " +
                $"{record.Gross_salary_FY2020_21}, " +
                $"{record.Gross_salary_FY2021_22}, " +
                $"{record.Gross_salary_FY2022_23}, " +
                $"{record.Gross_salary_FY2023_24})");

            isFirstValueEntry = false;
        }

        queryBuilder.Append(';');

        //query is generated

        publisher.SendChunk(queryBuilder.ToString());
        // Console.WriteLine("abff");

    }

}