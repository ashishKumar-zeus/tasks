
    // //POST method to add multiple DataModels
    // [HttpPost("insertMultipleData1")]
    // public async Task<IActionResult> PostMultipleData1(IFormFile file)
    // {

    //     //this method posts a csv data ie. multiple data into mysql with single query without using any chunks

    //     var watch = new System.Diagnostics.Stopwatch();
    //     watch.Start();

    //     if (file == null || file.Length == 0)
    //     {
    //         return BadRequest("No file uploaded.");
    //     }

    //     // await ProcessCsvFile1(file); //without chunking

    //     await ProcessCsvFile1(file);//with chunking
    //     watch.Stop();
    //     Console.WriteLine($"time  : {watch.ElapsedMilliseconds} ms");
    //     return Ok();

    // }

    // //POST method to add multiple DataModels
    // [HttpPost("insertMultipleData2")]
    // public async Task<IActionResult> PostMultipleData2(IFormFile file)
    // {

    //     //this method posts a csv data ie. multiple data into mysql with single query without using any chunks

    //     var watch = new System.Diagnostics.Stopwatch();
    //     watch.Start();
    //     if (file == null || file.Length == 0)
    //     {
    //         return BadRequest("No file uploaded.");
    //     }

    //     // await ProcessCsvFile1(file); //without chunking

    //     await ProcessCsvFile2(file);//with chunking

    //     watch.Stop();
    //     Console.WriteLine($"time : {watch.ElapsedMilliseconds} ms");
    //     return Ok();

    // }

    // //POST method to add multiple DataModels
    // [HttpPost("insertMultipleData3")]
    // public async Task<IActionResult> PostMultipleData3(IFormFile file)
    // {

    //     if (file == null || file.Length == 0)
    //     {
    //         return BadRequest("No file uploaded.");
    //     }

    //     // await ProcessCsvFile1(file); //without chunking

    //     await ProcessCsvFile3(file);//with chunking

    //     return Ok();

    // }

























    // private async Task ProcessCsvFile1(IFormFile file)
    // {
    //     const int batchSize = 10000;
    //     using var stream = file.OpenReadStream();
    //     using var reader = new StreamReader(stream);

    //     await reader.ReadLineAsync(); // Skip header

    //     var records = new List<DataModel>(batchSize);
    //     string? line;

    //     while ((line = await reader.ReadLineAsync()) != null)
    //     {
    //         var columns = line.Split(',');
    //         records.Add(new DataModel
    //         {
    //             Email_id = columns[0],
    //             Name = columns[1],
    //             Country = columns[2],
    //             State = columns[3],
    //             City = columns[4],
    //             Telephone_number = (int)Int64.Parse(columns[5]),
    //             Address_line_1 = columns[6],
    //             Address_line_2 = columns[7],
    //             Date_of_birth = columns[8],
    //             Gross_salary_FY2019_20 = (int)Int64.Parse(columns[9]),
    //             Gross_salary_FY2020_21 = (int)Int64.Parse(columns[10]),
    //             Gross_salary_FY2021_22 = (int)Int64.Parse(columns[11]),
    //             Gross_salary_FY2022_23 = (int)Int64.Parse(columns[12]),
    //             Gross_salary_FY2023_24 = (int)Int64.Parse(columns[13])
    //         });

    //         if (records.Count == batchSize)
    //         {

    //             var recordsCopy = new List<DataModel>(records);
    //             records.Clear();

    //             _ = InsertIntoDB1(recordsCopy); // Fire and forget
    //         }
    //     }

    //     if (records.Count > 0)
    //     {
    //         _ = InsertIntoDB1(records);
    //     }
    // }
    // //2s
    // private async Task ProcessCsvFile2(IFormFile file)
    // {
    //     const int batchSize = 10000;
    //     using var stream = file.OpenReadStream();
    //     using var reader = new StreamReader(stream);

    //     await reader.ReadLineAsync(); // Skip header

    //     var records = new List<DataModel>(batchSize);
    //     string? line;

    //     while ((line = await reader.ReadLineAsync()) != null)
    //     {
    //         var columns = line.Split(',');
    //         records.Add(new DataModel
    //         {
    //             Email_id = columns[0],
    //             Name = columns[1],
    //             Country = columns[2],
    //             State = columns[3],
    //             City = columns[4],
    //             Telephone_number = (int)Int64.Parse(columns[5]),
    //             Address_line_1 = columns[6],
    //             Address_line_2 = columns[7],
    //             Date_of_birth = columns[8],
    //             Gross_salary_FY2019_20 = (int)Int64.Parse(columns[9]),
    //             Gross_salary_FY2020_21 = (int)Int64.Parse(columns[10]),
    //             Gross_salary_FY2021_22 = (int)Int64.Parse(columns[11]),
    //             Gross_salary_FY2022_23 = (int)Int64.Parse(columns[12]),
    //             Gross_salary_FY2023_24 = (int)Int64.Parse(columns[13])
    //         });

    //         if (records.Count == batchSize)
    //         {

    //             var recordsCopy = new List<DataModel>(records);
    //             records.Clear();

    //             _ = InsertIntoDB2(recordsCopy); // Fire and forget
    //         }
    //     }

    //     if (records.Count > 0)
    //     {
    //         _ = InsertIntoDB2(records);
    //     }
    // }
    // //8s
    // private async Task ProcessCsvFile3(IFormFile file)
    // {
    //     const int batchSize = 10000;
    //     using var stream = file.OpenReadStream();
    //     using var reader = new StreamReader(stream);

    //     await reader.ReadLineAsync(); // Skip header

    //     var records = new List<DataModel>(batchSize);
    //     string? line;

    //     while ((line = await reader.ReadLineAsync()) != null)
    //     {
    //         var columns = line.Split(',');
    //         records.Add(new DataModel
    //         {
    //             Email_id = columns[0],
    //             Name = columns[1],
    //             Country = columns[2],
    //             State = columns[3],
    //             City = columns[4],
    //             Telephone_number = (int)Int64.Parse(columns[5]),
    //             Address_line_1 = columns[6],
    //             Address_line_2 = columns[7],
    //             Date_of_birth = columns[8],
    //             Gross_salary_FY2019_20 = (int)Int64.Parse(columns[9]),
    //             Gross_salary_FY2020_21 = (int)Int64.Parse(columns[10]),
    //             Gross_salary_FY2021_22 = (int)Int64.Parse(columns[11]),
    //             Gross_salary_FY2022_23 = (int)Int64.Parse(columns[12]),
    //             Gross_salary_FY2023_24 = (int)Int64.Parse(columns[13])
    //         });

    //         if (records.Count == batchSize)
    //         {

    //             var recordsCopy = new List<DataModel>(records);
    //             records.Clear();

    //             _ = InsertIntoDB3(recordsCopy); // Fire and forget
    //         }
    //     }

    //     if (records.Count > 0)
    //     {
    //         _ = InsertIntoDB3(records);
    //     }
    // }
    // //8s





















    // //functions required to process the csv file ( chunking data and calling bulk query insert for this chunks)


    // private async Task InsertIntoDB1(List<DataModel> records)
    // {
    //     //this function receives a list of records and send it chunk wise to mysql db without using Parameters for query builders
    //     //this may be prone to sql injection

    //     var queryBuilder = new StringBuilder();
    //     queryBuilder.Append("INSERT INTO usertest2 (Email_id, Name, Country, State, City, Telephone_number, Address_line_1, Address_line_2, Date_of_birth, Gross_salary_FY2019_20, Gross_salary_FY2020_21, Gross_salary_FY2021_22, Gross_salary_FY2022_23, Gross_salary_FY2023_24) VALUES ");

    //     bool isFirstValueEntry = true;

    //     foreach (var record in records)
    //     {
    //         if (!isFirstValueEntry)
    //         {
    //             queryBuilder.Append(',');
    //         }

    //         queryBuilder.Append($"(" +
    //             $"'{MySqlHelper.EscapeString(record.Email_id)}', " +
    //             $"'{MySqlHelper.EscapeString(record.Name)}', " +
    //             $"'{MySqlHelper.EscapeString(record.Country)}', " +
    //             $"'{MySqlHelper.EscapeString(record.State)}', " +
    //             $"'{MySqlHelper.EscapeString(record.City)}', " +
    //             $"{record.Telephone_number}, " +
    //             $"'{MySqlHelper.EscapeString(record.Address_line_1)}', " +
    //             $"'{MySqlHelper.EscapeString(record.Address_line_2)}', " +
    //             $"'{MySqlHelper.EscapeString(record.Date_of_birth)}', " +
    //             $"{record.Gross_salary_FY2019_20}, " +
    //             $"{record.Gross_salary_FY2020_21}, " +
    //             $"{record.Gross_salary_FY2021_22}, " +
    //             $"{record.Gross_salary_FY2022_23}, " +
    //             $"{record.Gross_salary_FY2023_24})");

    //         isFirstValueEntry = false;
    //     }

    //     queryBuilder.Append(';');

    //     using (var connection = new MySqlConnection(dbConnString))
    //     {
    //         await connection.OpenAsync();
    //         using (var command = new MySqlCommand(queryBuilder.ToString(), connection))
    //         {
    //             await command.ExecuteNonQueryAsync();
    //         }
    //         await connection.CloseAsync();
    //     }
    // }

    // private async Task InsertIntoDB2(List<DataModel> records)
    // {
    //     //this function receives a list of records and send it chunk wise to mysql db using Parameters for query builders

    //     if (records == null || records.Count == 0)
    //         return;

    //     // Create the base insert query
    //     var queryBuilder = new StringBuilder();
    //     queryBuilder.Append("INSERT INTO usertest2 (Email_id, Name, Country, State, City, Telephone_number, Address_line_1, Address_line_2, Date_of_birth, Gross_salary_FY2019_20, Gross_salary_FY2020_21, Gross_salary_FY2021_22, Gross_salary_FY2022_23, Gross_salary_FY2023_24) VALUES ");

    //     // Add placeholders for the parameters
    //     var parameters = new List<MySqlParameter>();
    //     for (int i = 0; i < records.Count; i++)
    //     {
    //         if (i > 0)
    //             queryBuilder.Append(',');

    //         // Add placeholders for each column
    //         queryBuilder.Append($"(@Email_id{i}, @Name{i}, @Country{i}, @State{i}, @City{i}, @Telephone_number{i}, @Address_line_1{i}, @Address_line_2{i}, @Date_of_birth{i}, @Gross_salary_FY2019_20{i}, @Gross_salary_FY2020_21{i}, @Gross_salary_FY2021_22{i}, @Gross_salary_FY2022_23{i}, @Gross_salary_FY2023_24{i})");

    //         // Add parameters for this record
    //         parameters.Add(new MySqlParameter($"@Email_id{i}", records[i].Email_id));
    //         parameters.Add(new MySqlParameter($"@Name{i}", records[i].Name));
    //         parameters.Add(new MySqlParameter($"@Country{i}", records[i].Country));
    //         parameters.Add(new MySqlParameter($"@State{i}", records[i].State));
    //         parameters.Add(new MySqlParameter($"@City{i}", records[i].City));
    //         parameters.Add(new MySqlParameter($"@Telephone_number{i}", records[i].Telephone_number));
    //         parameters.Add(new MySqlParameter($"@Address_line_1{i}", records[i].Address_line_1));
    //         parameters.Add(new MySqlParameter($"@Address_line_2{i}", records[i].Address_line_2));
    //         parameters.Add(new MySqlParameter($"@Date_of_birth{i}", records[i].Date_of_birth));
    //         parameters.Add(new MySqlParameter($"@Gross_salary_FY2019_20{i}", records[i].Gross_salary_FY2019_20));
    //         parameters.Add(new MySqlParameter($"@Gross_salary_FY2020_21{i}", records[i].Gross_salary_FY2020_21));
    //         parameters.Add(new MySqlParameter($"@Gross_salary_FY2021_22{i}", records[i].Gross_salary_FY2021_22));
    //         parameters.Add(new MySqlParameter($"@Gross_salary_FY2022_23{i}", records[i].Gross_salary_FY2022_23));
    //         parameters.Add(new MySqlParameter($"@Gross_salary_FY2023_24{i}", records[i].Gross_salary_FY2023_24));
    //     }

    //     // Finalize the query
    //     queryBuilder.Append(';');

    //     using (var connection = new MySqlConnection(dbConnString))
    //     {
    //         await connection.OpenAsync();
    //         using (var command = new MySqlCommand(queryBuilder.ToString(), connection))
    //         {
    //             command.Parameters.AddRange(parameters.ToArray());
    //             await command.ExecuteNonQueryAsync();
    //         }
    //         await connection.CloseAsync();
    //     }
    // }

    // private async Task InsertIntoDB3(List<DataModel> records)
    // {

    //     //this function receives a list of records and send it chunk wise to mysql db using Parameters for query builders

    //     if (records == null || records.Count == 0)
    //         return;

    //     // Create the base insert query
    //     var queryBuilder = new StringBuilder();
    //     queryBuilder.Append("INSERT INTO usertest2 (Email_id, Name, Country, State, City, Telephone_number, Address_line_1, Address_line_2, Date_of_birth, Gross_salary_FY2019_20, Gross_salary_FY2020_21, Gross_salary_FY2021_22, Gross_salary_FY2022_23, Gross_salary_FY2023_24) VALUES ");

    //     for (int i = 0; i < records.Count; i++)
    //     {
    //         if (i > 0)
    //             queryBuilder.Append(',');


    //         queryBuilder.Append($"(@Email_id{i}, @Name{i}, @Country{i}, @State{i}, @City{i}, @Telephone_number{i}, @Address_line_1{i}, @Address_line_2{i}, @Date_of_birth{i}, @Gross_salary_FY2019_20{i}, @Gross_salary_FY2020_21{i}, @Gross_salary_FY2021_22{i}, @Gross_salary_FY2022_23{i}, @Gross_salary_FY2023_24{i})");

    //     }

    //     // Finalize the query
    //     queryBuilder.Append(';');

    //     using (var connection = new MySqlConnection(dbConnString))
    //     {
    //         await connection.OpenAsync();
    //         using (var command = new MySqlCommand(queryBuilder.ToString(), connection))
    //         {
    //             for (int i = 0; i < records.Count; i++)
    //             {

    //                 var r = records[i];
    //                 command.Parameters.AddWithValue($"@Email_id{i}", r.Email_id);
    //                 command.Parameters.AddWithValue($"@Name{i}", r.Name);
    //                 command.Parameters.AddWithValue($"@Country{i}", r.Country);
    //                 command.Parameters.AddWithValue($"@State{i}", r.State);
    //                 command.Parameters.AddWithValue($"@City{i}", r.City);
    //                 command.Parameters.AddWithValue($"@Telephone_number{i}", r.Telephone_number);
    //                 command.Parameters.AddWithValue($"@Address_line_1{i}", r.Address_line_1);
    //                 command.Parameters.AddWithValue($"@Address_line_2{i}", r.Address_line_2);
    //                 command.Parameters.AddWithValue($"@Date_of_birth{i}", r.Date_of_birth);
    //                 command.Parameters.AddWithValue($"@Gross_salary_FY2019_20{i}", r.Gross_salary_FY2019_20);
    //                 command.Parameters.AddWithValue($"@Gross_salary_FY2020_21{i}", r.Gross_salary_FY2020_21);
    //                 command.Parameters.AddWithValue($"@Gross_salary_FY2021_22{i}", r.Gross_salary_FY2021_22);
    //                 command.Parameters.AddWithValue($"@Gross_salary_FY2022_23{i}", r.Gross_salary_FY2022_23);
    //                 command.Parameters.AddWithValue($"@Gross_salary_FY2023_24{i}", r.Gross_salary_FY2023_24);
    //             }
    //             await command.ExecuteNonQueryAsync();
    //         }
    //         await connection.CloseAsync();
    //     }

    // }
