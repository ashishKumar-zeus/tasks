using System.Text;
using learning.Models;
using learning.Services;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;


using System.IO;
using System.Data;

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
    public ActionResult<List<DataModel>> GetDataAll()
    {
        //this method returns a actionresult (status code) and list of datamodels

        var listOfData = new List<DataModel> { };//defining a list of datamodels with initally nothing in it


        //using is used to dispose the variable once finished using it which is used only inside {}
        using var connection = new MySqlConnection(dbConnString);
        connection.Open();

        var query = "SELECT * FROM usertest2 limit 10";//creating the syntax

        using (var command = new MySqlCommand(query, connection))
        {
            using var reader = command.ExecuteReader();
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


        return Ok(listOfData);

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

            return CreatedAtAction(nameof(GetDataAll), new { email_id = dataModel.Email_id }, dataModel);
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





    [HttpPost("insertMultipleData4")]
    public async Task<IActionResult> PostMultipleData4(IFormFile file)
    {

        //this method posts a csv data ie. multiple data into mysql with single query without using any chunks

        Console.WriteLine("-------------");
        Console.WriteLine("start time " + ((DateTimeOffset)DateTime.UtcNow).ToUnixTimeMilliseconds());

        if (file == null || file.Length == 0)
        {
            return BadRequest("No file uploaded.");
        }

        // await ProcessCsvFile4(file);//with chunking

        //processing it

        Task[] tasks = new Task[10];

        const int batchSize = 10000;
        using var stream = file.OpenReadStream();
        using var reader = new StreamReader(stream);



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
                // Console.WriteLine("created task for "+i);

                i++;
            }
        }

        if (records.Count > 0)
        {
            tasks[i] = Task.Run(() => ConvertToQuery(records));

        }

        await Task.WhenAll(tasks);

        Console.WriteLine("end time " + ((DateTimeOffset)DateTime.UtcNow).ToUnixTimeMilliseconds());

        // fetchData()



        return Ok();

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



        // Console.WriteLine("---------------------------------------------");

        //query is generated
        // Console.WriteLine("Sending to publisher ");
        publisher.SendChunk(queryBuilder.ToString());
        // Console.WriteLine("abff");

    }






    [HttpPost("insertMultipleData6")]
    public async Task<IActionResult> PostMultipleData6(IFormFile file)
    {


        var watch = new System.Diagnostics.Stopwatch();
        watch.Start();

        Console.WriteLine("-------------");
        Console.WriteLine("start time " + ((DateTimeOffset)DateTime.UtcNow).ToUnixTimeMilliseconds());

        if (file == null || file.Length == 0)
        {
            return BadRequest("No file uploaded.");
        }


        const int batchSize = 10000;
        using var stream = file.OpenReadStream();
        using var reader = new StreamReader(stream);

        await reader.ReadLineAsync(); // Skip header

        string? line;


        var queryBuilder = new StringBuilder();
        queryBuilder.Append("INSERT INTO usertest2 (Email_id, Name, Country, State, City, Telephone_number, Address_line_1, Address_line_2, Date_of_birth, Gross_salary_FY2019_20, Gross_salary_FY2020_21, Gross_salary_FY2021_22, Gross_salary_FY2022_23, Gross_salary_FY2023_24) VALUES ");

        int queryCount = 0;
        int i = 0;

        Task[] tasks = new Task[10];

        while ((line = await reader.ReadLineAsync()) != null)
        {


            var dataOfLine = line.Split(',');

            queryBuilder.Append($"(" +
                $"'{dataOfLine[0]}', " +
                $"'{dataOfLine[1]}', " +
                $"'{dataOfLine[2]}', " +
                $"'{dataOfLine[3]}', " +
                $"'{dataOfLine[4]}', " +
                $"{(int)Int64.Parse(dataOfLine[5])}, " +
                $"'{dataOfLine[6]}', " +
                $"'{dataOfLine[7]}', " +
                $"'{dataOfLine[8]}', " +
                $"{(int)Int64.Parse(dataOfLine[9])}, " +
                $"{(int)Int64.Parse(dataOfLine[10])}, " +
                $"{(int)Int64.Parse(dataOfLine[11])}, " +
                $"{(int)Int64.Parse(dataOfLine[12])}, " +
                $"{(int)long.Parse(dataOfLine[13])}),");

            // Console.WriteLine(queryBuilder);
            queryCount += 1;

            if (queryCount == batchSize)
            {

                queryBuilder.Length--;
                queryBuilder.Append(';');

                string copiedString = queryBuilder.ToString();
                tasks[i] = Task.Run(() => publisher.SendChunk(copiedString));

                i++;
                queryBuilder.Clear();
                queryBuilder.Append("INSERT INTO usertest2 (Email_id, Name, Country, State, City, Telephone_number, Address_line_1, Address_line_2, Date_of_birth, Gross_salary_FY2019_20, Gross_salary_FY2020_21, Gross_salary_FY2021_22, Gross_salary_FY2022_23, Gross_salary_FY2023_24) VALUES ");

                queryCount = 0;
            }
        }

        if (queryCount > 0)
        {
            queryBuilder.Length--;
            queryBuilder.Append(';');
            // Console.WriteLine(queryBuilder.ToString());

            string copiedString = queryBuilder.ToString();
            tasks[i] = Task.Run(() => publisher.SendChunk(copiedString));

            queryBuilder.Clear();
            queryBuilder.Append("INSERT INTO usertest2 (Email_id, Name, Country, State, City, Telephone_number, Address_line_1, Address_line_2, Date_of_birth, Gross_salary_FY2019_20, Gross_salary_FY2020_21, Gross_salary_FY2021_22, Gross_salary_FY2022_23, Gross_salary_FY2023_24) VALUES ");

            queryCount = 0;
            i++;

        }

        await Task.WhenAll(tasks);

        // List<DataModel> startData = await GetDataInRange(start,limit);

        watch.Stop();
        Console.WriteLine($"whole execution time: {watch.ElapsedMilliseconds} ms");
        return Ok();

    }
    




    [HttpGet("getDataInRange")]
    public async Task<List<DataModel>> GetDataInRange([FromQuery] int start,[FromQuery] int limit)
    {

        Console.WriteLine(start);
        Console.WriteLine(limit);
        var listOfData = new List<DataModel>();

        using (var connection = new MySqlConnection(dbConnString))
        {
            await connection.OpenAsync();

            var query = $"SELECT * FROM usertest2 LIMIT {limit} OFFSET {start}";

            using (var command = new MySqlCommand(query, connection))
            {
                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
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
            await connection.CloseAsync();

            Console.WriteLine("returning the data");

        }

        return listOfData;
    }




// async renderPrv(){
//         if(this.i===0 || this.grid.cells[this.i][this.j].value===this.cellInput.value){
//             return;
//         }
//         this.grid.cells[this.i][this.j].value=this.cellInput.value
//         try {
//             const dataModel = {
//                 row_num: this.i,
//                 email_id: this.grid.cells[this.i][0].value,
//                 name: this.grid.cells[this.i][1].value,
//                 country: this.grid.cells[this.i][2].value,
//                 state: this.grid.cells[this.i][3].value,
//                 city: this.grid.cells[this.i][4].value,
//                 telephone_number: this.grid.cells[this.i][5].value,
//                 address_line_1: this.grid.cells[this.i][6].value,
//                 address_line_2: this.grid.cells[this.i][7].value,
//                 date_of_birth: this.grid.cells[this.i][8].value,
//                 gross_salary_FY2019_20: this.grid.cells[this.i][9].value,
//                 gross_salary_FY2020_21: this.grid.cells[this.i][10].value,
//                 gross_salary_FY2021_22: this.grid.cells[this.i][11].value,
//                 gross_salary_FY2022_23: this.grid.cells[this.i][12].value,
//                 gross_salary_FY2023_24: this.grid.cells[this.i][13].value
//             };
//             let response = await fetch('https://localhost:7009/api/csv/updateRecord',
//                 {
//                     method: "POST",
//                     headers: {
//                         'Content-Type': 'application/json', 
//                     },
//                     body: JSON.stringify(dataModel),
//                 }
//             ); 
              
//         } catch (error) {
//             console.error('error now update the cell',error);
//         }
//         this.sheetRender();
//     }



    // public async Task<IActionResult> updateRecord([FromBody] DataModel record)
    //     {
    //         Console.WriteLine("Updating");
    //         var sql = new StringBuilder("UPDATE usertest2 SET ");
    //         var properties = record.GetType().GetProperties();
    //         foreach (var field in properties)
    //         {
    //             sql.Append($"{field.Name}='{field.GetValue(record)}',");
    //         }
    //         sql.Length--;
    //         sql.Append($" WHERE row_num={record.row_num};");
    //         Console.WriteLine(sql.ToString());
    //         using (var connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")!))
    //         {
    //             await connection.OpenAsync();
    //             using var command = new MySqlCommand(sql.ToString(), connection);
    //             var result = await command.ExecuteNonQueryAsync();
    //             await connection.CloseAsync();
    //             if (result == 0) { 
    //                 return BadRequest(); 
    //             }
    //             else{
    //                 return Ok(result);
    //             }
    //         }
    //     }





}






































































































































































// using System.Data;
// using System.Text;
// using learning.Models;
// using learning.Services;
// using Microsoft.AspNetCore.Mvc;
// using MySql.Data.MySqlClient;

// namespace learning.Controllers;

// [ApiController]

// [Route("api/[controller]")]

// public class DataController : ControllerBase
// {
//     //this class will handle various apis for the data

//     public IConfiguration? configuration;//this will store the configuration settings present in appsetting.json
//     private readonly string? dbConnString;//this is the string required to connect to mysql db

//     //initializing the rabbitmq publisher
//     private readonly RabbitMQPublisher publisher;




//     //constructor
//     public DataController(IConfiguration _configuration, RabbitMQPublisher _publisher)
//     {
//         configuration = _configuration;//updating the value
//         dbConnString = configuration.GetConnectionString("DBConnectionString");//updating the value

//         publisher = _publisher;
//     }






//     [HttpGet]// identifies a action as GET
//     public ActionResult<List<DataModel>> GetData()
//     {
//         //this method returns a actionresult (status code) and list of datamodels

//         var listOfData = new List<DataModel> { };//defining a list of datamodels with initally nothing in it


//         //using is used to dispose the variable once finished using it which is used only inside {}
//         using (var connection = new MySqlConnection(dbConnString))
//         {
//             connection.Open();

//             var query = "SELECT * FROM usertest2";//creating the syntax

//             using (var command = new MySqlCommand(query, connection))
//             {
//                 using (var reader = command.ExecuteReader())
//                 {
//                     while (reader.Read())
//                     {

//                         var data = new DataModel
//                         {
//                             Email_id = reader.GetString("Email_id"),
//                             Name = reader.GetString("Name"),
//                             Country = reader.GetString("Country"),
//                             State = reader.GetString("State"),
//                             City = reader.GetString("City"),
//                             Telephone_number = (int)reader.GetInt64("Telephone_number"),
//                             Address_line_1 = reader.GetString("Address_line_1"),
//                             Address_line_2 = reader.GetString("Address_line_2"),
//                             Date_of_birth = reader.GetString("Date_of_birth"),
//                             Gross_salary_FY2019_20 = (int)reader.GetInt64("Gross_salary_FY2019_20"),
//                             Gross_salary_FY2020_21 = (int)reader.GetInt64("Gross_salary_FY2020_21"),
//                             Gross_salary_FY2021_22 = (int)reader.GetInt64("Gross_salary_FY2021_22"),
//                             Gross_salary_FY2022_23 = (int)reader.GetInt64("Gross_salary_FY2022_23"),
//                             Gross_salary_FY2023_24 = (int)reader.GetInt64("Gross_salary_FY2023_24")

//                         };

//                         listOfData.Add(data);
//                     }

//                 }

//             }


//             return Ok(listOfData);
//         }

//     }




//     // POST method to add a new DataModel
//     [HttpPost("insertSingleData")]
//     public async Task<IActionResult> PostData(DataModel dataModel)
//     {
//         if (dataModel == null)
//         {
//             return BadRequest("DataModel object is null.");
//         }

//         try
//         {
//             using (var connection = new MySqlConnection(dbConnString))
//             {
//                 await connection.OpenAsync();

//                 var query = @"
//                             INSERT INTO usertest2 
//                             (Email_id, Name, Country, State, City, Telephone_number, Address_line_1, Address_line_2, Date_of_birth, Gross_salary_FY2019_20, Gross_salary_FY2020_21, Gross_salary_FY2021_22, Gross_salary_FY2022_23, Gross_salary_FY2023_24) 
//                             VALUES 
//                             (@Email_id, @Name, @Country, @State, @City, @Telephone_number, @Address_line_1, @Address_line_2, @Date_of_birth, @Gross_salary_FY2019_20, @Gross_salary_FY2020_21, @Gross_salary_FY2021_22, @Gross_salary_FY2022_23, @Gross_salary_FY2023_24);";

//                 using (var command = new MySqlCommand(query, connection))
//                 {
//                     command.Parameters.AddWithValue("@Email_id", dataModel.Email_id);
//                     command.Parameters.AddWithValue("@Name", dataModel.Name);
//                     command.Parameters.AddWithValue("@Country", dataModel.Country);
//                     command.Parameters.AddWithValue("@State", dataModel.State);
//                     command.Parameters.AddWithValue("@City", dataModel.City);
//                     command.Parameters.AddWithValue("@Telephone_number", dataModel.Telephone_number);
//                     command.Parameters.AddWithValue("@Address_line_1", dataModel.Address_line_1);
//                     command.Parameters.AddWithValue("@Address_line_2", dataModel.Address_line_2);
//                     command.Parameters.AddWithValue("@Date_of_birth", dataModel.Date_of_birth);
//                     command.Parameters.AddWithValue("@Gross_salary_FY2019_20", dataModel.Gross_salary_FY2019_20);
//                     command.Parameters.AddWithValue("@Gross_salary_FY2020_21", dataModel.Gross_salary_FY2020_21);
//                     command.Parameters.AddWithValue("@Gross_salary_FY2021_22", dataModel.Gross_salary_FY2021_22);
//                     command.Parameters.AddWithValue("@Gross_salary_FY2022_23", dataModel.Gross_salary_FY2022_23);
//                     command.Parameters.AddWithValue("@Gross_salary_FY2023_24", dataModel.Gross_salary_FY2023_24);

//                     await command.ExecuteNonQueryAsync();
//                 }
//             }

//             return CreatedAtAction(nameof(GetData), new { email_id = dataModel.Email_id }, dataModel);
//             // 1. Action name to retrieve the resource
//             // 2. Route values (identifier of the newly created resource)
//             // 3. The newly created resource to return in the response body
//         }
//         catch (Exception ex)
//         {
//             // Handle exceptions (e.g., log the error)
//             return StatusCode(500, $"Internal server error: {ex.Message}");
//         }
//     }



//     [HttpPost("insertMultipleData4")]
//     public async Task<IActionResult> PostMultipleData4(IFormFile file)
//     {

//         //this method posts a csv data ie. multiple data into mysql with single query without using any chunks

//         Console.WriteLine("-------------");
//         Console.WriteLine("start time " + ((DateTimeOffset)DateTime.UtcNow).ToUnixTimeMilliseconds());

//         if (file == null || file.Length == 0)
//         {
//             return BadRequest("No file uploaded.");
//         }

//         // await ProcessCsvFile4(file);//with chunking

//         //processing it

//         Task[] tasks = new Task[10];

//         const int batchSize = 10000;
//         using var stream = file.OpenReadStream();
//         using var reader = new StreamReader(stream);



//         await reader.ReadLineAsync(); // Skip header

//         var records = new List<DataModel>(batchSize);
//         string? line;

//         int i = 0;

//         while ((line = await reader.ReadLineAsync()) != null)
//         {
//             var columns = line.Split(',');
//             records.Add(new DataModel
//             {
//                 Email_id = columns[0],
//                 Name = columns[1],
//                 Country = columns[2],
//                 State = columns[3],
//                 City = columns[4],
//                 Telephone_number = (int)Int64.Parse(columns[5]),
//                 Address_line_1 = columns[6],
//                 Address_line_2 = columns[7],
//                 Date_of_birth = columns[8],
//                 Gross_salary_FY2019_20 = (int)Int64.Parse(columns[9]),
//                 Gross_salary_FY2020_21 = (int)Int64.Parse(columns[10]),
//                 Gross_salary_FY2021_22 = (int)Int64.Parse(columns[11]),
//                 Gross_salary_FY2022_23 = (int)Int64.Parse(columns[12]),
//                 Gross_salary_FY2023_24 = (int)Int64.Parse(columns[13])
//             });

//             if (records.Count == batchSize)
//             {
//                 // Console.WriteLine("Ram");
//                 var recordsCopy = new List<DataModel>(records);
//                 records.Clear();
//                 // Console.WriteLine("siya");

//                 tasks[i] = Task.Run(() => ConvertToQuery(recordsCopy));
//                 // Console.WriteLine("created task for "+i);

//                 i++;
//             }
//         }

//         if (records.Count > 0)
//         {
//             tasks[i] = Task.Run(() => ConvertToQuery(records));

//         }

//         // await Task.WhenAll(tasks);
//         Console.WriteLine("end time " + ((DateTimeOffset)DateTime.UtcNow).ToUnixTimeMilliseconds());

//         return Ok();

//     }



//     [HttpPost("insertMultipleData5")]
//     public async Task<IActionResult> PostMultipleData5(IFormFile file)
//     {

//         var watch = new System.Diagnostics.Stopwatch();
//         watch.Start();

//         Console.WriteLine("-------------");
//         Console.WriteLine("start time " + ((DateTimeOffset)DateTime.UtcNow).ToUnixTimeMilliseconds());

//         if (file == null || file.Length == 0)
//         {
//             return BadRequest("No file uploaded.");
//         }


//         const int batchSize = 10000;
//         using var stream = file.OpenReadStream();
//         using var reader = new StreamReader(stream);

//         await reader.ReadLineAsync(); // Skip header

//         string? line;


//         var queryBuilder = new StringBuilder();
//         queryBuilder.Append("INSERT INTO usertest2 (Email_id, Name, Country, State, City, Telephone_number, Address_line_1, Address_line_2, Date_of_birth, Gross_salary_FY2019_20, Gross_salary_FY2020_21, Gross_salary_FY2021_22, Gross_salary_FY2022_23, Gross_salary_FY2023_24) VALUES ");

//         int queryCount = 0;
//         int i = 0;

//         Task[] tasks = new Task[10];

//         while ((line = await reader.ReadLineAsync()) != null)
//         {


//             var dataOfLine = line.Split(',');

//             queryBuilder.Append($"(" +
//                 $"'{dataOfLine[0]}', " +
//                 $"'{dataOfLine[1]}', " +
//                 $"'{dataOfLine[2]}', " +
//                 $"'{dataOfLine[3]}', " +
//                 $"'{dataOfLine[4]}', " +
//                 $"{(int)Int64.Parse(dataOfLine[5])}, " +
//                 $"'{dataOfLine[6]}', " +
//                 $"'{dataOfLine[7]}', " +
//                 $"'{dataOfLine[8]}', " +
//                 $"{(int)Int64.Parse(dataOfLine[9])}, " +
//                 $"{(int)Int64.Parse(dataOfLine[10])}, " +
//                 $"{(int)Int64.Parse(dataOfLine[11])}, " +
//                 $"{(int)Int64.Parse(dataOfLine[12])}, " +
//                 $"{(int)long.Parse(dataOfLine[13])}),");

//             // Console.WriteLine(queryBuilder);
//             queryCount += 1;

//             if (queryCount == batchSize)
//             {

//                 queryBuilder.Length--;
//                 queryBuilder.Append(';');

//                 string copiedString = queryBuilder.ToString();
//                 tasks[i] = Task.Run(() => publisher.SendChunk(copiedString));

//                 i++;
//                 queryBuilder.Clear();
//                 queryBuilder.Append("INSERT INTO usertest2 (Email_id, Name, Country, State, City, Telephone_number, Address_line_1, Address_line_2, Date_of_birth, Gross_salary_FY2019_20, Gross_salary_FY2020_21, Gross_salary_FY2021_22, Gross_salary_FY2022_23, Gross_salary_FY2023_24) VALUES ");

//                 queryCount = 0;
//             }
//         }

//         if (queryCount > 0)
//         {
//             queryBuilder.Length--;
//             queryBuilder.Append(';');
//             // Console.WriteLine(queryBuilder.ToString());

//             string copiedString = queryBuilder.ToString();
//             tasks[i] = Task.Run(() => publisher.SendChunk(copiedString));

//             queryBuilder.Clear();
//             queryBuilder.Append("INSERT INTO usertest2 (Email_id, Name, Country, State, City, Telephone_number, Address_line_1, Address_line_2, Date_of_birth, Gross_salary_FY2019_20, Gross_salary_FY2020_21, Gross_salary_FY2021_22, Gross_salary_FY2022_23, Gross_salary_FY2023_24) VALUES ");

//             queryCount = 0;
//             i++;

//         }

//         // await Task.WhenAll(tasks);

//         watch.Stop();
//         Console.WriteLine($"whole execution time: {watch.ElapsedMilliseconds} ms");
//         return Ok();

//     }


//     [HttpPost("insertMultipleData6")]
//     public async Task<IActionResult> PostMultipleData6(IFormFile file)
//     {


//         var watch = new System.Diagnostics.Stopwatch();
//         watch.Start();

//         Console.WriteLine("-------------");
//         Console.WriteLine("start time " + ((DateTimeOffset)DateTime.UtcNow).ToUnixTimeMilliseconds());

//         if (file == null || file.Length == 0)
//         {
//             return BadRequest("No file uploaded.");
//         }


//         const int batchSize = 10000;
//         using var stream = file.OpenReadStream();
//         using var reader = new StreamReader(stream);

//         await reader.ReadLineAsync(); // Skip header

//         string? line;


//         var queryBuilder = new StringBuilder();
//         queryBuilder.Append("INSERT INTO usertest2 (Email_id, Name, Country, State, City, Telephone_number, Address_line_1, Address_line_2, Date_of_birth, Gross_salary_FY2019_20, Gross_salary_FY2020_21, Gross_salary_FY2021_22, Gross_salary_FY2022_23, Gross_salary_FY2023_24) VALUES ");

//         int queryCount = 0;
//         int i = 0;

//         Task[] tasks = new Task[10];

//         while ((line = await reader.ReadLineAsync()) != null)
//         {


//             var dataOfLine = line.Split(',');

//             queryBuilder.Append($"(" +
//                 $"'{dataOfLine[0]}', " +
//                 $"'{dataOfLine[1]}', " +
//                 $"'{dataOfLine[2]}', " +
//                 $"'{dataOfLine[3]}', " +
//                 $"'{dataOfLine[4]}', " +
//                 $"{(int)Int64.Parse(dataOfLine[5])}, " +
//                 $"'{dataOfLine[6]}', " +
//                 $"'{dataOfLine[7]}', " +
//                 $"'{dataOfLine[8]}', " +
//                 $"{(int)Int64.Parse(dataOfLine[9])}, " +
//                 $"{(int)Int64.Parse(dataOfLine[10])}, " +
//                 $"{(int)Int64.Parse(dataOfLine[11])}, " +
//                 $"{(int)Int64.Parse(dataOfLine[12])}, " +
//                 $"{(int)long.Parse(dataOfLine[13])}),");

//             // Console.WriteLine(queryBuilder);
//             queryCount += 1;

//             if (queryCount == batchSize)
//             {

//                 queryBuilder.Length--;
//                 queryBuilder.Append(';');

//                 string copiedString = queryBuilder.ToString();
//                 tasks[i] = Task.Run(() => publisher.SendChunk(copiedString));

//                 i++;
//                 queryBuilder.Clear();
//                 queryBuilder.Append("INSERT INTO usertest2 (Email_id, Name, Country, State, City, Telephone_number, Address_line_1, Address_line_2, Date_of_birth, Gross_salary_FY2019_20, Gross_salary_FY2020_21, Gross_salary_FY2021_22, Gross_salary_FY2022_23, Gross_salary_FY2023_24) VALUES ");

//                 queryCount = 0;
//             }
//         }

//         if (queryCount > 0)
//         {
//             queryBuilder.Length--;
//             queryBuilder.Append(';');
//             // Console.WriteLine(queryBuilder.ToString());

//             string copiedString = queryBuilder.ToString();
//             tasks[i] = Task.Run(() => publisher.SendChunk(copiedString));

//             queryBuilder.Clear();
//             queryBuilder.Append("INSERT INTO usertest2 (Email_id, Name, Country, State, City, Telephone_number, Address_line_1, Address_line_2, Date_of_birth, Gross_salary_FY2019_20, Gross_salary_FY2020_21, Gross_salary_FY2021_22, Gross_salary_FY2022_23, Gross_salary_FY2023_24) VALUES ");

//             queryCount = 0;
//             i++;

//         }

//         await Task.WhenAll(tasks);

//         int start = 0;
//         int limit = 1000;

//         List<DataModel> startData = await GetDataInRange(start,limit);

//         watch.Stop();
//         Console.WriteLine($"whole execution time: {watch.ElapsedMilliseconds} ms");
//         return Ok(startData);

//     }



//     private void ConvertToQuery(List<DataModel> records)
//     {
//         //this function receives a list of records and send it chunk wise to mysql db without using Parameters for query builders


//         var queryBuilder = new StringBuilder();
//         queryBuilder.Append("INSERT INTO usertest2 (Email_id, Name, Country, State, City, Telephone_number, Address_line_1, Address_line_2, Date_of_birth, Gross_salary_FY2019_20, Gross_salary_FY2020_21, Gross_salary_FY2021_22, Gross_salary_FY2022_23, Gross_salary_FY2023_24) VALUES ");

//         bool isFirstValueEntry = true;

//         foreach (var record in records)
//         {
//             if (!isFirstValueEntry)
//             {
//                 queryBuilder.Append(',');
//             }

//             queryBuilder.Append($"(" +
//                 $"'{MySqlHelper.EscapeString(record.Email_id)}', " +
//                 $"'{MySqlHelper.EscapeString(record.Name)}', " +
//                 $"'{MySqlHelper.EscapeString(record.Country)}', " +
//                 $"'{MySqlHelper.EscapeString(record.State)}', " +
//                 $"'{MySqlHelper.EscapeString(record.City)}', " +
//                 $"{record.Telephone_number}, " +
//                 $"'{MySqlHelper.EscapeString(record.Address_line_1)}', " +
//                 $"'{MySqlHelper.EscapeString(record.Address_line_2)}', " +
//                 $"'{MySqlHelper.EscapeString(record.Date_of_birth)}', " +
//                 $"{record.Gross_salary_FY2019_20}, " +
//                 $"{record.Gross_salary_FY2020_21}, " +
//                 $"{record.Gross_salary_FY2021_22}, " +
//                 $"{record.Gross_salary_FY2022_23}, " +
//                 $"{record.Gross_salary_FY2023_24})");

//             isFirstValueEntry = false;
//         }

//         queryBuilder.Append(';');



//         // Console.WriteLine("---------------------------------------------");

//         //query is generated
//         // Console.WriteLine("Sending to publisher ");
//         publisher.SendChunk(queryBuilder.ToString());
//         // Console.WriteLine("abff");

//     }

//     [HttpGet("getDataInRange")]
//     public async Task<List<DataModel>> GetDataInRange(int start, int limit)
//     {
//         var listOfData = new List<DataModel>();

//         using (var connection = new MySqlConnection(dbConnString))
//         {
//             await connection.OpenAsync();

//             var query = $"SELECT * FROM usertest2 LIMIT {limit} OFFSET {start}";

//             using (var command = new MySqlCommand(query, connection))
//             {
//                 using (var reader = await command.ExecuteReaderAsync())
//                 {
//                     while (await reader.ReadAsync())
//                     {
//                         var data = new DataModel
//                         {
//                             Email_id = reader.GetString("Email_id"),
//                             Name = reader.GetString("Name"),
//                             Country = reader.GetString("Country"),
//                             State = reader.GetString("State"),
//                             City = reader.GetString("City"),
//                             Telephone_number = (int)reader.GetInt64("Telephone_number"),
//                             Address_line_1 = reader.GetString("Address_line_1"),
//                             Address_line_2 = reader.GetString("Address_line_2"),
//                             Date_of_birth = reader.GetString("Date_of_birth"),
//                             Gross_salary_FY2019_20 = (int)reader.GetInt64("Gross_salary_FY2019_20"),
//                             Gross_salary_FY2020_21 = (int)reader.GetInt64("Gross_salary_FY2020_21"),
//                             Gross_salary_FY2021_22 = (int)reader.GetInt64("Gross_salary_FY2021_22"),
//                             Gross_salary_FY2022_23 = (int)reader.GetInt64("Gross_salary_FY2022_23"),
//                             Gross_salary_FY2023_24 = (int)reader.GetInt64("Gross_salary_FY2023_24")
//                         };

//                         listOfData.Add(data);
//                     }
//                 }
//             }
//             await connection.CloseAsync();

//             Console.WriteLine("returning the data");

//         }

//         return listOfData;
//     }

// }



























// export class navFunctionalities {

//     constructor() {
//         //nothing to do now
//         this.init();
//     }


//     init() {
//         //blank now
//         this.handleEvents();
//     }

//     async handleUpload(e) {
//         e.preventDefault();

//         const fileInput = document.getElementById('uploadInput');
//         const file = fileInput.files[0];

//         if (file) {
//             console.log("file found");
//             const formData = new FormData();
//             formData.append('file', file);

//             await fetch('http://localhost:5249/api/Data/insertMultipleData6', {
//                 method: 'POST',
//                 body: formData,
//             })
//                 .then(async (response) => response.json())
//                 .then(async (data)=>{console.log(data)})
//                 .catch(error => {
//                     console.error('Error:', error);
//                 });
//         } else {
//             alert('Please select a file to upload.');
//         }

//     }

//     handleEvents() {
//         document.getElementById('uploadForm').addEventListener('submit', (e) => { this.handleUpload(e) });
//     }

// }












