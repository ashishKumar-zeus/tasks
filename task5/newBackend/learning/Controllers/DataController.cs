using System.Text;
using learning.Models;
using learning.Services;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using Newtonsoft.Json;



using System.IO;
using System.Data;
using Google.Protobuf.WellKnownTypes;

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
                    row_id = reader.GetInt32("row_id"),
                    Email_id = reader.GetString("Email_id"),
                    Name = reader.GetString("Name"),
                    Country = reader.GetString("Country"),
                    State = reader.GetString("State"),
                    City = reader.GetString("City"),
                    Telephone_number = reader.GetString("Telephone_number"),
                    Address_line_1 = reader.GetString("Address_line_1"),
                    Address_line_2 = reader.GetString("Address_line_2"),
                    Date_of_birth = reader.GetString("Date_of_birth"),
                    Gross_salary_FY2019_20 = reader.GetString("Gross_salary_FY2019_20"),
                    Gross_salary_FY2020_21 = reader.GetString("Gross_salary_FY2020_21"),
                    Gross_salary_FY2021_22 = reader.GetString("Gross_salary_FY2021_22"),
                    Gross_salary_FY2022_23 = reader.GetString("Gross_salary_FY2022_23"),
                    Gross_salary_FY2023_24 = reader.GetString("Gross_salary_FY2023_24")
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
                Telephone_number = columns[5],
                Address_line_1 = columns[6],
                Address_line_2 = columns[7],
                Date_of_birth = columns[8],
                Gross_salary_FY2019_20 = columns[9],
                Gross_salary_FY2020_21 = columns[10],
                Gross_salary_FY2021_22 = columns[11],
                Gross_salary_FY2022_23 = columns[12],
                Gross_salary_FY2023_24 = columns[13]
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
                $"{MySqlHelper.EscapeString(record.Telephone_number)}, " +
                $"'{MySqlHelper.EscapeString(record.Address_line_1)}', " +
                $"'{MySqlHelper.EscapeString(record.Address_line_2)}', " +
                $"'{MySqlHelper.EscapeString(record.Date_of_birth)}', " +
                $"{MySqlHelper.EscapeString(record.Gross_salary_FY2019_20)}, " +
                $"{MySqlHelper.EscapeString(record.Gross_salary_FY2020_21)}, " +
                $"{MySqlHelper.EscapeString(record.Gross_salary_FY2021_22)}, " +
                $"{MySqlHelper.EscapeString(record.Gross_salary_FY2022_23)}, " +
                $"{MySqlHelper.EscapeString(record.Gross_salary_FY2023_24)})");

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
                $"{dataOfLine[5]}, " +
                $"'{dataOfLine[6]}', " +
                $"'{dataOfLine[7]}', " +
                $"'{dataOfLine[8]}', " +
                $"{dataOfLine[9]}, " +
                $"{dataOfLine[10]}, " +
                $"{dataOfLine[11]}, " +
                $"{dataOfLine[12]}, " +
                $"{dataOfLine[13]}),");

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
    public async Task<List<DataModel>> GetDataInRange([FromQuery] int start, [FromQuery] int limit)
    {

        Console.WriteLine(start);
        Console.WriteLine(limit);
        var listOfData = new List<DataModel>();

        using (var connection = new MySqlConnection(dbConnString))
        {
            await connection.OpenAsync();

            var query = $"SELECT * FROM usertest2  order by row_id LIMIT {limit} OFFSET {start}";

            using (var command = new MySqlCommand(query, connection))
            {
                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        var data = new DataModel
                        {
                            row_id = reader.GetInt32("row_id"),
                            Email_id = reader.GetString("Email_id"),
                            Name = reader.GetString("Name"),
                            Country = reader.GetString("Country"),
                            State = reader.GetString("State"),
                            City = reader.GetString("City"),
                            Telephone_number = reader.GetString("Telephone_number"),
                            Address_line_1 = reader.GetString("Address_line_1"),
                            Address_line_2 = reader.GetString("Address_line_2"),
                            Date_of_birth = reader.GetString("Date_of_birth"),
                            Gross_salary_FY2019_20 = reader.GetString("Gross_salary_FY2019_20"),
                            Gross_salary_FY2020_21 = reader.GetString("Gross_salary_FY2020_21"),
                            Gross_salary_FY2021_22 = reader.GetString("Gross_salary_FY2021_22"),
                            Gross_salary_FY2022_23 = reader.GetString("Gross_salary_FY2022_23"),
                            Gross_salary_FY2023_24 = reader.GetString("Gross_salary_FY2023_24")
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


    public class UpdateModel
    {
        public int? rowId { get; set; }
        public string? columnName { get; set; }

        public string? value { get; set; }

    }

    [HttpPost("UpdateRecord")]
    public async Task<IActionResult> UpdateRecord(string record)
    {
        if (string.IsNullOrEmpty(record))
        {
            return BadRequest("Invalid record data.");
        }

        Console.WriteLine($"{record}");

        // Deserialize the record into the UpdateModel
        var json = JsonConvert.DeserializeObject<UpdateModel>(record);

        if (json == null)
        {
            return BadRequest("Deserialization failed.");
        }

        // Extract email_id, columnName, and value from the deserialized object
        int? rowId = json.rowId;
        string columnName = json.columnName ?? string.Empty;
        string value = json.value ?? string.Empty;

        if (rowId < 0 || string.IsNullOrEmpty(columnName) || string.IsNullOrEmpty(value))
        {
            return BadRequest("Missing required data (email_id, columnName, or value).");
        }

        // Build the update query
        var query = new StringBuilder($"UPDATE usertest2 SET ");
        query.Append($"{columnName} = @value WHERE row_id = @rowId");

        try
        {
            // Establish connection with the database
            using var mySqlConnection = new MySqlConnection(dbConnString);
            await mySqlConnection.OpenAsync();

            // Prepare the SQL command with parameterized query to avoid SQL injection
            using var command = new MySqlCommand(query.ToString(), mySqlConnection);
            command.Parameters.AddWithValue("@value", value);
            command.Parameters.AddWithValue("@rowId", rowId);

            // Execute the update command
            var result = await command.ExecuteNonQueryAsync();

            // Close the connection (optional as it's within using statement)
            await mySqlConnection.CloseAsync();

            // Check if any rows were affected, indicating a successful update
            if (result == 0)
            {
                return BadRequest("Update failed: No records were affected.");
            }

            Console.WriteLine($"Update successful: {result} record(s) updated.");
            return Ok(new { Message = "Update successful", RowsAffected = result });
        }
        catch (MySqlException ex)
        {
            // Log the exception and return an InternalServerError response
            Console.WriteLine($"Database error occurred: {ex.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while updating the record.");
        }
    }




    public class BatchUpdateModel
    {
        public string? Email { get; set; }
        public List<ColumnUpdate>? Columns { get; set; }
    }

    public class ColumnUpdate
    {
        public string? ColumnName { get; set; }
        public string? Value { get; set; }
    }



    [HttpPost("UpdateRecordsBatch")]
    public async Task<IActionResult> UpdateRecordsBatch(List<BatchUpdateModel> updates)
    {

        Console.WriteLine("hello update bulik");
        if (updates == null || updates.Count == 0)
        {
            return BadRequest("Invalid update data.");
        }

        var query = new StringBuilder();
        var emailList = new List<string>();

        try
        {
            // Loop through each update entry
            foreach (var update in updates)
            {
                var email = update.Email;
                if (string.IsNullOrEmpty(email) || update.Columns == null || update.Columns.Count == 0)
                {
                    continue;
                }

                emailList.Add(email);

                // Create the dynamic update query for each column
                foreach (var columnUpdate in update.Columns)
                {
                    query.AppendLine($"UPDATE usertest2 SET {columnUpdate.ColumnName} = CASE email_id");
                    foreach (var emailId in emailList)
                    {
                        query.AppendLine($" WHEN '{emailId}' THEN @Value_{emailId}_{columnUpdate.ColumnName}");
                    }
                    query.AppendLine($" END WHERE email_id IN ({string.Join(",", emailList.Select(e => $"'{e}'"))});");
                }
            }

            // Establish the database connection
            using var mySqlConnection = new MySqlConnection(dbConnString);
            await mySqlConnection.OpenAsync();

            // Prepare the SQL command
            using var command = new MySqlCommand(query.ToString(), mySqlConnection);

            // Add parameters for each update value
            foreach (var update in updates)
            {
                foreach (var columnUpdate in update.Columns!)
                {
                    command.Parameters.AddWithValue($"@Value_{update.Email}_{columnUpdate.ColumnName}", columnUpdate.Value);
                }
            }

            // Execute the update query
            var result = await command.ExecuteNonQueryAsync();

            // Close the connection
            await mySqlConnection.CloseAsync();

            // Check if rows were affected
            if (result == 0)
            {
                return BadRequest("Update failed: No records were affected.");
            }

            Console.WriteLine($"Batch update successful: {result} record(s) updated.");
            return Ok(new { Message = "Batch update successful", RowsAffected = result });
        }
        catch (MySqlException ex)
        {
            // Log the exception and return an error response
            Console.WriteLine($"Database error occurred: {ex.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while updating the records.");
        }
    }





    [HttpPost("FindRow")]
    public async Task<IActionResult> FindIds([FromBody] string findText)
    {
        if (string.IsNullOrWhiteSpace(findText))
        {
            return BadRequest("Search term cannot be empty.");
        }

        var ids = new List<int>();

        // Get property names of the Excel class
        var properties = typeof(DataModel).GetProperties();

        // Build SQL query with proper syntax
        var queryBuilder = new StringBuilder("SELECT row_id FROM usertest2 WHERE ");

        for (int i = 0; i < properties.Length; i++)
        {
            var property = properties[i];
            queryBuilder.Append($"{property.Name} LIKE @searchTerm");
            if (i < properties.Length - 1)
            {
                queryBuilder.Append(" OR ");
            }
        }

        var query = queryBuilder.ToString();

        try
        {
            using var mySqlConnection = new MySqlConnection(dbConnString);

            // Establish connection to MySQL
            await mySqlConnection.OpenAsync();

            // Create the command
            await using var command = new MySqlCommand(query, mySqlConnection);
            command.Parameters.AddWithValue("@searchTerm", "%" + findText + "%");

            // Execute the query and process results
            await using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                ids.Add(reader.GetInt32("row_id"));
            }

            await mySqlConnection.CloseAsync();
        }
        catch (MySqlException ex)
        {
            return StatusCode(500, $"Database error: {ex.Message}");
        }

        if (ids.Count == 0)
        {
            return NotFound("No records found matching the search term.");
        }

        // Return the list of matching IDs
        return Ok(ids);
    }
    // [HttpPost("DeleteRows")]
    // public async Task<IActionResult> DeleteRows([FromBody] List<int> rowIds)
    // {
    //     Console.WriteLine($"Request to Delete {rowIds.Count}");

    //     if (rowIds == null || rowIds.Count == 0)
    //     {
    //         return Ok(false); // Return false if no row IDs are provided
    //     }

    //     // Build SQL query with proper syntax
    //     var queryBuilder = new StringBuilder("DELETE FROM usertest2 WHERE row_id IN (");

    //     for (int i = 0; i < rowIds.Count; i++)
    //     {
    //         queryBuilder.Append("@id" + i);
    //         if (i < rowIds.Count - 1)
    //         {
    //             queryBuilder.Append(", ");
    //         }
    //     }

    //     queryBuilder.Append(")");

    //     var query = queryBuilder.ToString();
    //     Console.WriteLine(query.ToString());

    //     try
    //     {
    //         using var mySqlConnection = new MySqlConnection(dbConnString);

    //         // Establish connection to MySQL
    //         await mySqlConnection.OpenAsync();

    //         // Create the command
    //         await using var command = new MySqlCommand(query, mySqlConnection);

    //         // Add parameters to the command
    //         for (int i = 0; i < rowIds.Count; i++)
    //         {
    //             command.Parameters.AddWithValue("@id" + i, rowIds[i]);
    //         }

    //         // Execute the command
    //         var rowsAffected = await command.ExecuteNonQueryAsync();

    //         await mySqlConnection.CloseAsync();

    //         if (rowsAffected > 0)
    //         {
    //             Console.WriteLine($"Deleted {rowsAffected} rows");
    //             return Ok(true); // Return true if rows are deleted successfully
    //         }
    //         else
    //         {
    //             Console.WriteLine("No rows found to delete");
    //             return Ok(false); // Return false if no rows were deleted
    //         }
    //     }
    //     catch (MySqlException ex)
    //     {
    //         Console.WriteLine($"Database error: {ex.Message}");
    //         return Ok(false); // Return false in case of an exception
    //     }
    // }


    [HttpPost("DeleteRows")]
    public async Task<IActionResult> DeleteRows([FromBody] List<int> rowIds)
    {
        if (rowIds == null || rowIds.Count == 0)
        {
            return Ok(false); // Return false if no row IDs are provided
        }

        // Ensure the rowIds list is ordered in descending order to avoid issues while updating
        rowIds.Sort((a, b) => b.CompareTo(a));

        // Determine the number of rows to delete
        int rowsToDelete = rowIds.Count;

        // Build SQL query for deleting rows
        var deleteQueryBuilder = new StringBuilder("DELETE FROM usertest2 WHERE row_id IN (");

        for (int i = 0; i < rowIds.Count; i++)
        {
            deleteQueryBuilder.Append("@id" + i);
            if (i < rowIds.Count - 1)
            {
                deleteQueryBuilder.Append(", ");
            }
        }

        deleteQueryBuilder.Append(")");

        var deleteQuery = deleteQueryBuilder.ToString();

        // Build SQL query for updating row IDs
        var updateQuery = "UPDATE usertest2 SET row_id = row_id - @rowsToDelete WHERE row_id > @maxRowId";

        try
        {
            using var mySqlConnection = new MySqlConnection(dbConnString);
            await mySqlConnection.OpenAsync();

            using var transaction = await mySqlConnection.BeginTransactionAsync();

            // Delete the rows with specified rowIds
            await using (var deleteCommand = new MySqlCommand(deleteQuery, mySqlConnection, transaction))
            {
                for (int i = 0; i < rowIds.Count; i++)
                {
                    Console.WriteLine($"deleting {rowIds[i]} ");
                    deleteCommand.Parameters.AddWithValue("@id" + i, rowIds[i]);
                }

                var rowsDeleted = await deleteCommand.ExecuteNonQueryAsync();
                Console.WriteLine($"Deleted {rowsDeleted} rows");

                // Determine the maximum row ID for the update
                int maxRowId = rowIds.Max();

                // Update subsequent rows to adjust their rowId
                await using (var updateCommand = new MySqlCommand(updateQuery, mySqlConnection, transaction))
                {
                    updateCommand.Parameters.AddWithValue("@rowsToDelete", rowsToDelete);
                    updateCommand.Parameters.AddWithValue("@maxRowId", maxRowId);
                    var rowsUpdated = await updateCommand.ExecuteNonQueryAsync();
                    Console.WriteLine($"Updated {rowsUpdated} rows");
                }


                // Reset row_id to sequential values from 1 to the total number of rows left
                // var resetQuery = @"
                // SET @row_number = 0;
                // UPDATE usertest2 SET row_id = (@row_number := @row_number + 1)
                // ORDER BY row_id;";


                // await using (var resetCommand = new MySqlCommand(resetQuery, mySqlConnection, transaction))
                // {
                //     // Console.WriteLine
                //     var rowsReset = await resetCommand.ExecuteNonQueryAsync();
                //     Console.WriteLine($"Reset {rowsReset} rows with sequential IDs");
                // }

                // Commit transaction
                await transaction.CommitAsync();

                return Ok(true); // Return true if operations were successful
            }
        }
        catch (MySqlException ex)
        {
            Console.WriteLine($"Database error: {ex.Message}");
            return Ok(false); // Return false in case of an exception
        }
    }



    // [HttpPost("InsertRows")]
    // public async Task<IActionResult> InsertRows([FromBody] InsertRowsRequest request)
    // {
    //     if (request.StartInd < 1 || request.NumberOfRows < 1)
    //     {
    //         return BadRequest("Invalid start index or number of rows.");
    //     }

    //     // Extract request parameters
    //     int startInd = request.StartInd;
    //     int numberOfRows = request.NumberOfRows;

    //     // Build SQL query for updating row IDs
    //     var updateQuery = "UPDATE usertest2 SET row_id = row_id + @numberOfRows WHERE row_id >= @startInd";

    //     // Build SQL query for inserting new rows
    //     var insertQuery = "INSERT INTO usertest2 (row_id) VALUES ";

    //     // Prepare the list of new rows to be inserted
    //     var values = new List<string>();
    //     for (int i = 0; i < numberOfRows; i++)
    //     {
    //         values.Add($"(@newRowId{i})");
    //     }
    //     insertQuery += string.Join(", ", values);

    //     try
    //     {
    //         using var mySqlConnection = new MySqlConnection(dbConnString);
    //         await mySqlConnection.OpenAsync();

    //         using var transaction = await mySqlConnection.BeginTransactionAsync();

    //         // First, update existing rows to shift their row IDs
    //         await using (var updateCommand = new MySqlCommand(updateQuery, mySqlConnection, transaction))
    //         {
    //             updateCommand.Parameters.AddWithValue("@numberOfRows", numberOfRows);
    //             updateCommand.Parameters.AddWithValue("@startInd", startInd);
    //             await updateCommand.ExecuteNonQueryAsync();
    //         }

    //         // Then, insert new rows with the specified start index
    //         await using (var insertCommand = new MySqlCommand(insertQuery, mySqlConnection, transaction))
    //         {
    //             for (int i = 0; i < numberOfRows; i++)
    //             {
    //                 insertCommand.Parameters.AddWithValue($"@newRowId{i}", startInd + i);
    //             }
    //             await insertCommand.ExecuteNonQueryAsync();
    //         }

    //         // Commit transaction
    //         await transaction.CommitAsync();

    //         return Ok(true); // Return true if operations were successful
    //     }
    //     catch (MySqlException ex)
    //     {
    //         Console.WriteLine($"Database error: {ex.Message}");
    //         return StatusCode(500, "An error occurred while processing the request.");
    //     }
    // }

    public class InsertRowsRequest
    {
        public int StartInd { get; set; }
        public int NumberOfRows { get; set; }
    }

    [HttpPost("InsertRows")]
    public async Task<IActionResult> InsertRows([FromBody] InsertRowsRequest request)
    {
        if (request == null || request.NumberOfRows <= 0)
        {
            return BadRequest("Invalid request.");
        }

        int startInd = request.StartInd;
        int numberOfRows = request.NumberOfRows;

        // First pass: Shift existing rows downwards
        var updateQuery = @"UPDATE usertest2 
                        SET row_id = row_id + @numberOfRows 
                        WHERE row_id >= @startInd
                        ORDER BY row_id DESC";

        // Insert new rows query
        var insertQuery = new StringBuilder("INSERT INTO usertest2 (row_id) VALUES ");
        for (int i = 0; i < numberOfRows; i++)
        {
            insertQuery.Append($"(@startInd{i}), ");
        }
        insertQuery.Length -= 2; // Remove the trailing comma and space

        try
        {
            using var mySqlConnection = new MySqlConnection(dbConnString);
            await mySqlConnection.OpenAsync();
            using var transaction = await mySqlConnection.BeginTransactionAsync();

            // Step 1: Update existing row_id values, starting from the largest (to avoid conflicts)
            using var updateCommand = new MySqlCommand(updateQuery, mySqlConnection, transaction);
            updateCommand.Parameters.AddWithValue("@numberOfRows", numberOfRows);
            updateCommand.Parameters.AddWithValue("@startInd", startInd);
            var rowsUpdated = await updateCommand.ExecuteNonQueryAsync();
            Console.WriteLine($"Updated {rowsUpdated} rows");

            // Step 2: Insert the new rows
            using var insertCommand = new MySqlCommand(insertQuery.ToString(), mySqlConnection, transaction);
            for (int i = 0; i < numberOfRows; i++)
            {
                insertCommand.Parameters.AddWithValue($"@startInd{i}", startInd + i);
            }
            var rowsInserted = await insertCommand.ExecuteNonQueryAsync();
            Console.WriteLine($"Inserted {rowsInserted} rows");

            // Commit the transaction
            await transaction.CommitAsync();

            return Ok(true); // Success
        }
        catch (MySqlException ex)
        {
            Console.WriteLine($"Database error: {ex.Message}");
            return StatusCode(500, "Internal server error.");
        }
    }

}
