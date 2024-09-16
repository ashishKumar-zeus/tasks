
//     // //POST method to add multiple DataModels
//     // [HttpPost("insertMultipleData1")]
//     // public async Task<IActionResult> PostMultipleData1(IFormFile file)
//     // {

//     //     //this method posts a csv data ie. multiple data into mysql with single query without using any chunks

//     //     var watch = new System.Diagnostics.Stopwatch();
//     //     watch.Start();

//     //     if (file == null || file.Length == 0)
//     //     {
//     //         return BadRequest("No file uploaded.");
//     //     }

//     //     // await ProcessCsvFile1(file); //without chunking

//     //     await ProcessCsvFile1(file);//with chunking
//     //     watch.Stop();
//     //     Console.WriteLine($"time  : {watch.ElapsedMilliseconds} ms");
//     //     return Ok();

//     // }

//     // //POST method to add multiple DataModels
//     // [HttpPost("insertMultipleData2")]
//     // public async Task<IActionResult> PostMultipleData2(IFormFile file)
//     // {

//     //     //this method posts a csv data ie. multiple data into mysql with single query without using any chunks

//     //     var watch = new System.Diagnostics.Stopwatch();
//     //     watch.Start();
//     //     if (file == null || file.Length == 0)
//     //     {
//     //         return BadRequest("No file uploaded.");
//     //     }

//     //     // await ProcessCsvFile1(file); //without chunking

//     //     await ProcessCsvFile2(file);//with chunking

//     //     watch.Stop();
//     //     Console.WriteLine($"time : {watch.ElapsedMilliseconds} ms");
//     //     return Ok();

//     // }

//     // //POST method to add multiple DataModels
//     // [HttpPost("insertMultipleData3")]
//     // public async Task<IActionResult> PostMultipleData3(IFormFile file)
//     // {

//     //     if (file == null || file.Length == 0)
//     //     {
//     //         return BadRequest("No file uploaded.");
//     //     }

//     //     // await ProcessCsvFile1(file); //without chunking

//     //     await ProcessCsvFile3(file);//with chunking

//     //     return Ok();

//     // }

























//     // private async Task ProcessCsvFile1(IFormFile file)
//     // {
//     //     const int batchSize = 10000;
//     //     using var stream = file.OpenReadStream();
//     //     using var reader = new StreamReader(stream);

//     //     await reader.ReadLineAsync(); // Skip header

//     //     var records = new List<DataModel>(batchSize);
//     //     string? line;

//     //     while ((line = await reader.ReadLineAsync()) != null)
//     //     {
//     //         var columns = line.Split(',');
//     //         records.Add(new DataModel
//     //         {
//     //             Email_id = columns[0],
//     //             Name = columns[1],
//     //             Country = columns[2],
//     //             State = columns[3],
//     //             City = columns[4],
//     //             Telephone_number = (int)Int64.Parse(columns[5]),
//     //             Address_line_1 = columns[6],
//     //             Address_line_2 = columns[7],
//     //             Date_of_birth = columns[8],
//     //             Gross_salary_FY2019_20 = (int)Int64.Parse(columns[9]),
//     //             Gross_salary_FY2020_21 = (int)Int64.Parse(columns[10]),
//     //             Gross_salary_FY2021_22 = (int)Int64.Parse(columns[11]),
//     //             Gross_salary_FY2022_23 = (int)Int64.Parse(columns[12]),
//     //             Gross_salary_FY2023_24 = (int)Int64.Parse(columns[13])
//     //         });

//     //         if (records.Count == batchSize)
//     //         {

//     //             var recordsCopy = new List<DataModel>(records);
//     //             records.Clear();

//     //             _ = InsertIntoDB1(recordsCopy); // Fire and forget
//     //         }
//     //     }

//     //     if (records.Count > 0)
//     //     {
//     //         _ = InsertIntoDB1(records);
//     //     }
//     // }
//     // //2s
//     // private async Task ProcessCsvFile2(IFormFile file)
//     // {
//     //     const int batchSize = 10000;
//     //     using var stream = file.OpenReadStream();
//     //     using var reader = new StreamReader(stream);

//     //     await reader.ReadLineAsync(); // Skip header

//     //     var records = new List<DataModel>(batchSize);
//     //     string? line;

//     //     while ((line = await reader.ReadLineAsync()) != null)
//     //     {
//     //         var columns = line.Split(',');
//     //         records.Add(new DataModel
//     //         {
//     //             Email_id = columns[0],
//     //             Name = columns[1],
//     //             Country = columns[2],
//     //             State = columns[3],
//     //             City = columns[4],
//     //             Telephone_number = (int)Int64.Parse(columns[5]),
//     //             Address_line_1 = columns[6],
//     //             Address_line_2 = columns[7],
//     //             Date_of_birth = columns[8],
//     //             Gross_salary_FY2019_20 = (int)Int64.Parse(columns[9]),
//     //             Gross_salary_FY2020_21 = (int)Int64.Parse(columns[10]),
//     //             Gross_salary_FY2021_22 = (int)Int64.Parse(columns[11]),
//     //             Gross_salary_FY2022_23 = (int)Int64.Parse(columns[12]),
//     //             Gross_salary_FY2023_24 = (int)Int64.Parse(columns[13])
//     //         });

//     //         if (records.Count == batchSize)
//     //         {

//     //             var recordsCopy = new List<DataModel>(records);
//     //             records.Clear();

//     //             _ = InsertIntoDB2(recordsCopy); // Fire and forget
//     //         }
//     //     }

//     //     if (records.Count > 0)
//     //     {
//     //         _ = InsertIntoDB2(records);
//     //     }
//     // }
//     // //8s
//     // private async Task ProcessCsvFile3(IFormFile file)
//     // {
//     //     const int batchSize = 10000;
//     //     using var stream = file.OpenReadStream();
//     //     using var reader = new StreamReader(stream);

//     //     await reader.ReadLineAsync(); // Skip header

//     //     var records = new List<DataModel>(batchSize);
//     //     string? line;

//     //     while ((line = await reader.ReadLineAsync()) != null)
//     //     {
//     //         var columns = line.Split(',');
//     //         records.Add(new DataModel
//     //         {
//     //             Email_id = columns[0],
//     //             Name = columns[1],
//     //             Country = columns[2],
//     //             State = columns[3],
//     //             City = columns[4],
//     //             Telephone_number = (int)Int64.Parse(columns[5]),
//     //             Address_line_1 = columns[6],
//     //             Address_line_2 = columns[7],
//     //             Date_of_birth = columns[8],
//     //             Gross_salary_FY2019_20 = (int)Int64.Parse(columns[9]),
//     //             Gross_salary_FY2020_21 = (int)Int64.Parse(columns[10]),
//     //             Gross_salary_FY2021_22 = (int)Int64.Parse(columns[11]),
//     //             Gross_salary_FY2022_23 = (int)Int64.Parse(columns[12]),
//     //             Gross_salary_FY2023_24 = (int)Int64.Parse(columns[13])
//     //         });

//     //         if (records.Count == batchSize)
//     //         {

//     //             var recordsCopy = new List<DataModel>(records);
//     //             records.Clear();

//     //             _ = InsertIntoDB3(recordsCopy); // Fire and forget
//     //         }
//     //     }

//     //     if (records.Count > 0)
//     //     {
//     //         _ = InsertIntoDB3(records);
//     //     }
//     // }
//     // //8s





















//     // //functions required to process the csv file ( chunking data and calling bulk query insert for this chunks)


//     // private async Task InsertIntoDB1(List<DataModel> records)
//     // {
//     //     //this function receives a list of records and send it chunk wise to mysql db without using Parameters for query builders
//     //     //this may be prone to sql injection

//     //     var queryBuilder = new StringBuilder();
//     //     queryBuilder.Append("INSERT INTO usertest2 (Email_id, Name, Country, State, City, Telephone_number, Address_line_1, Address_line_2, Date_of_birth, Gross_salary_FY2019_20, Gross_salary_FY2020_21, Gross_salary_FY2021_22, Gross_salary_FY2022_23, Gross_salary_FY2023_24) VALUES ");

//     //     bool isFirstValueEntry = true;

//     //     foreach (var record in records)
//     //     {
//     //         if (!isFirstValueEntry)
//     //         {
//     //             queryBuilder.Append(',');
//     //         }

//     //         queryBuilder.Append($"(" +
//     //             $"'{MySqlHelper.EscapeString(record.Email_id)}', " +
//     //             $"'{MySqlHelper.EscapeString(record.Name)}', " +
//     //             $"'{MySqlHelper.EscapeString(record.Country)}', " +
//     //             $"'{MySqlHelper.EscapeString(record.State)}', " +
//     //             $"'{MySqlHelper.EscapeString(record.City)}', " +
//     //             $"{record.Telephone_number}, " +
//     //             $"'{MySqlHelper.EscapeString(record.Address_line_1)}', " +
//     //             $"'{MySqlHelper.EscapeString(record.Address_line_2)}', " +
//     //             $"'{MySqlHelper.EscapeString(record.Date_of_birth)}', " +
//     //             $"{record.Gross_salary_FY2019_20}, " +
//     //             $"{record.Gross_salary_FY2020_21}, " +
//     //             $"{record.Gross_salary_FY2021_22}, " +
//     //             $"{record.Gross_salary_FY2022_23}, " +
//     //             $"{record.Gross_salary_FY2023_24})");

//     //         isFirstValueEntry = false;
//     //     }

//     //     queryBuilder.Append(';');

//     //     using (var connection = new MySqlConnection(dbConnString))
//     //     {
//     //         await connection.OpenAsync();
//     //         using (var command = new MySqlCommand(queryBuilder.ToString(), connection))
//     //         {
//     //             await command.ExecuteNonQueryAsync();
//     //         }
//     //         await connection.CloseAsync();
//     //     }
//     // }

//     // private async Task InsertIntoDB2(List<DataModel> records)
//     // {
//     //     //this function receives a list of records and send it chunk wise to mysql db using Parameters for query builders

//     //     if (records == null || records.Count == 0)
//     //         return;

//     //     // Create the base insert query
//     //     var queryBuilder = new StringBuilder();
//     //     queryBuilder.Append("INSERT INTO usertest2 (Email_id, Name, Country, State, City, Telephone_number, Address_line_1, Address_line_2, Date_of_birth, Gross_salary_FY2019_20, Gross_salary_FY2020_21, Gross_salary_FY2021_22, Gross_salary_FY2022_23, Gross_salary_FY2023_24) VALUES ");

//     //     // Add placeholders for the parameters
//     //     var parameters = new List<MySqlParameter>();
//     //     for (int i = 0; i < records.Count; i++)
//     //     {
//     //         if (i > 0)
//     //             queryBuilder.Append(',');

//     //         // Add placeholders for each column
//     //         queryBuilder.Append($"(@Email_id{i}, @Name{i}, @Country{i}, @State{i}, @City{i}, @Telephone_number{i}, @Address_line_1{i}, @Address_line_2{i}, @Date_of_birth{i}, @Gross_salary_FY2019_20{i}, @Gross_salary_FY2020_21{i}, @Gross_salary_FY2021_22{i}, @Gross_salary_FY2022_23{i}, @Gross_salary_FY2023_24{i})");

//     //         // Add parameters for this record
//     //         parameters.Add(new MySqlParameter($"@Email_id{i}", records[i].Email_id));
//     //         parameters.Add(new MySqlParameter($"@Name{i}", records[i].Name));
//     //         parameters.Add(new MySqlParameter($"@Country{i}", records[i].Country));
//     //         parameters.Add(new MySqlParameter($"@State{i}", records[i].State));
//     //         parameters.Add(new MySqlParameter($"@City{i}", records[i].City));
//     //         parameters.Add(new MySqlParameter($"@Telephone_number{i}", records[i].Telephone_number));
//     //         parameters.Add(new MySqlParameter($"@Address_line_1{i}", records[i].Address_line_1));
//     //         parameters.Add(new MySqlParameter($"@Address_line_2{i}", records[i].Address_line_2));
//     //         parameters.Add(new MySqlParameter($"@Date_of_birth{i}", records[i].Date_of_birth));
//     //         parameters.Add(new MySqlParameter($"@Gross_salary_FY2019_20{i}", records[i].Gross_salary_FY2019_20));
//     //         parameters.Add(new MySqlParameter($"@Gross_salary_FY2020_21{i}", records[i].Gross_salary_FY2020_21));
//     //         parameters.Add(new MySqlParameter($"@Gross_salary_FY2021_22{i}", records[i].Gross_salary_FY2021_22));
//     //         parameters.Add(new MySqlParameter($"@Gross_salary_FY2022_23{i}", records[i].Gross_salary_FY2022_23));
//     //         parameters.Add(new MySqlParameter($"@Gross_salary_FY2023_24{i}", records[i].Gross_salary_FY2023_24));
//     //     }

//     //     // Finalize the query
//     //     queryBuilder.Append(';');

//     //     using (var connection = new MySqlConnection(dbConnString))
//     //     {
//     //         await connection.OpenAsync();
//     //         using (var command = new MySqlCommand(queryBuilder.ToString(), connection))
//     //         {
//     //             command.Parameters.AddRange(parameters.ToArray());
//     //             await command.ExecuteNonQueryAsync();
//     //         }
//     //         await connection.CloseAsync();
//     //     }
//     // }

//     // private async Task InsertIntoDB3(List<DataModel> records)
//     // {

//     //     //this function receives a list of records and send it chunk wise to mysql db using Parameters for query builders

//     //     if (records == null || records.Count == 0)
//     //         return;

//     //     // Create the base insert query
//     //     var queryBuilder = new StringBuilder();
//     //     queryBuilder.Append("INSERT INTO usertest2 (Email_id, Name, Country, State, City, Telephone_number, Address_line_1, Address_line_2, Date_of_birth, Gross_salary_FY2019_20, Gross_salary_FY2020_21, Gross_salary_FY2021_22, Gross_salary_FY2022_23, Gross_salary_FY2023_24) VALUES ");

//     //     for (int i = 0; i < records.Count; i++)
//     //     {
//     //         if (i > 0)
//     //             queryBuilder.Append(',');


//     //         queryBuilder.Append($"(@Email_id{i}, @Name{i}, @Country{i}, @State{i}, @City{i}, @Telephone_number{i}, @Address_line_1{i}, @Address_line_2{i}, @Date_of_birth{i}, @Gross_salary_FY2019_20{i}, @Gross_salary_FY2020_21{i}, @Gross_salary_FY2021_22{i}, @Gross_salary_FY2022_23{i}, @Gross_salary_FY2023_24{i})");

//     //     }

//     //     // Finalize the query
//     //     queryBuilder.Append(';');

//     //     using (var connection = new MySqlConnection(dbConnString))
//     //     {
//     //         await connection.OpenAsync();
//     //         using (var command = new MySqlCommand(queryBuilder.ToString(), connection))
//     //         {
//     //             for (int i = 0; i < records.Count; i++)
//     //             {

//     //                 var r = records[i];
//     //                 command.Parameters.AddWithValue($"@Email_id{i}", r.Email_id);
//     //                 command.Parameters.AddWithValue($"@Name{i}", r.Name);
//     //                 command.Parameters.AddWithValue($"@Country{i}", r.Country);
//     //                 command.Parameters.AddWithValue($"@State{i}", r.State);
//     //                 command.Parameters.AddWithValue($"@City{i}", r.City);
//     //                 command.Parameters.AddWithValue($"@Telephone_number{i}", r.Telephone_number);
//     //                 command.Parameters.AddWithValue($"@Address_line_1{i}", r.Address_line_1);
//     //                 command.Parameters.AddWithValue($"@Address_line_2{i}", r.Address_line_2);
//     //                 command.Parameters.AddWithValue($"@Date_of_birth{i}", r.Date_of_birth);
//     //                 command.Parameters.AddWithValue($"@Gross_salary_FY2019_20{i}", r.Gross_salary_FY2019_20);
//     //                 command.Parameters.AddWithValue($"@Gross_salary_FY2020_21{i}", r.Gross_salary_FY2020_21);
//     //                 command.Parameters.AddWithValue($"@Gross_salary_FY2021_22{i}", r.Gross_salary_FY2021_22);
//     //                 command.Parameters.AddWithValue($"@Gross_salary_FY2022_23{i}", r.Gross_salary_FY2022_23);
//     //                 command.Parameters.AddWithValue($"@Gross_salary_FY2023_24{i}", r.Gross_salary_FY2023_24);
//     //             }
//     //             await command.ExecuteNonQueryAsync();
//     //         }
//     //         await connection.CloseAsync();
//     //     }

//     // }




















// // https://chatgpt.com/share/f175a43b-fb69-4ea5-a55d-ca0656c48997

//   /**
//    * Updates a specific cell in the grid and sends the updated data to the server.
//    * 
//    * @async
//    * @param {number} index - The index of the row to update.
//    * @returns {Promise<void>} - A promise that resolves when the update is complete.
//    * @throws Will throw an error if the fetch request fails.
// //  */
// //   async updateCell(index) {
// //     try {
// //     // Prepare the data model from the grid, with id starting from 1
// //     const dataModel = {
// //       id: index + 1, // The id starts from 1, so add 1 to the index
// //         email_id: this.mainGrid.mainCells[index][0].value,
// //         name: this.mainGrid.mainCells[index][1].value,
// //         country: this.mainGrid.mainCells[index][2].value,
// //         state: this.mainGrid.mainCells[index][3].value,
// //         city: this.mainGrid.mainCells[index][4].value,
// //         telephone_number: this.mainGrid.mainCells[index][5].value,
// //         address_line_1: this.mainGrid.mainCells[index][6].value,
// //         address_line_2: this.mainGrid.mainCells[index][7].value,
// //         date_of_birth: this.mainGrid.mainCells[index][8].value,
// //         gross_salary_FY2019_20:
// //           this.mainGrid.mainCells[index][9].value,
// //         gross_salary_FY2020_21:
// //           this.mainGrid.mainCells[index][10].value,
// //         gross_salary_FY2021_22:
// //           this.mainGrid.mainCells[index][11].value,
// //         gross_salary_FY2022_23:
// //           this.mainGrid.mainCells[index][12].value,
// //         gross_salary_FY2023_24:
// //           this.mainGrid.mainCells[index][13].value,
// //       };
// //       // Send a POST request to update the record in the server
// //       let response = await fetch(
// //         "https://localhost:7220/ExcelApi/UpdateRecord",
// //         {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //           },
// //           body: JSON.stringify(dataModel),
// //         }
// //       );

// //       // Optionally handle the response here if necessary (e.g., check response status)
// //       if (!response.ok) {
// //         throw new Error(`Server responded with status ${response.status}`);
// //       }
// //     } catch (error) {
// //       // Log any errors that occur during the update
// //       console.error("error in updating the cell", error);
// //     }
// //   }
// // }



// //     [HttpPost("UpdateRecord")]
// //     public async Task<IActionResult> UpdateRecord([FromBody] Excel record)
// //     {
// //         // Validate the incoming record
// //         if (record == null)
// //         {
// //             return BadRequest("Invalid record data.");
// //         }

// //         // Build the SQL update statement dynamically
// //         var query = new StringBuilder("UPDATE FILE SET ");

// //         var properties = record.GetType().GetProperties();

// //         // Append each property and its value to the SQL update statement
// //         foreach (var property in properties)
// //         {
// //             // Ensure the value is correctly formatted, handling nulls as empty strings
// //             string value = property.GetValue(record)?.ToString() ?? string.Empty;
// //             // Properly escape single quotes to prevent SQL injection
// //             string escapedValue = value.Replace("'", "''");
// //             query.Append($"{property.Name}='{value}',");
// //         }
// //         // Remove the trailing comma from the SQL statement
// //         query.Length--;

// //         // Add the WHERE clause to target the specific record by row number
// //         query.Append($" WHERE id={record.id};");

// //         // Execute the update query within a try-catch block for error handling
// //         try
// //         {
// //             await _connection.OpenAsync();
// //             await using var command = new MySqlCommand(query.ToString(), _connection);

// //             // Execute the query and get the number of affected rows
// //             var result = await command.ExecuteNonQueryAsync();

// //             // Close the connection explicitly (optional due to using statement)
// //             await _connection.CloseAsync();

// //             // Check if any rows were affected, indicating a successful update
// //             if (result == 0)
// //             {
// //                 // Log the failure and return a BadRequest response
// //                 return BadRequest("Update failed: No records were affected.");
// //             }

// //             // Log the success and return an Ok response with the number of affected rows
// //             Console.WriteLine($"Update successful: {result} record(s) updated.");
// //             return Ok(new { Message = "Update successful", RowsAffected = result });
// //         }
// //         catch (MySqlException ex)
// //         {
// //             // Log the exception and return an InternalServerError response
// //             Console.WriteLine($"Database error occurred: {ex.Message}");
// //             return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while updating the record.");
// //         }
// //     }
    
// //     create table file (
// // 	id int not null auto_increment,
// //     email_id varchar(255),
// //     name varchar(255),
// //     country varchar(255),
// //     state varchar(255),
// //     city varchar(255),
// //     telephone_number varchar(255),
// //     address_line_1 varchar(255),
// //     address_line_2 varchar(255),
// //     date_of_birth varchar(255),
// //     gross_salary_FY2019_20 varchar(255),
// //     gross_salary_FY2020_21 varchar(255),
// //     gross_salary_FY2021_22 varchar(255),
// //     gross_salary_FY2022_23 varchar(255),
// //     gross_salary_FY2023_24 varchar(255),
// // 	PRIMARY KEY (id)
// // );












// [HttpPost("DeleteRows")]
// public async Task<IActionResult> DeleteRows([FromBody] List<int> rowIds)
// {
//     if (rowIds == null || rowIds.Count == 0)
//     {
//         return Ok(false); // Return false if no row IDs are provided
//     }

//     // Ensure the rowIds list is ordered in descending order to avoid issues while updating
//     rowIds.Sort((a, b) => b.CompareTo(a));

//     // Build SQL query for deleting rows
//     var deleteQueryBuilder = new StringBuilder("DELETE FROM usertest2 WHERE row_id IN (");

//     for (int i = 0; i < rowIds.Count; i++)
//     {
//         deleteQueryBuilder.Append("@id" + i);
//         if (i < rowIds.Count - 1)
//         {
//             deleteQueryBuilder.Append(", ");
//         }
//     }

//     deleteQueryBuilder.Append(")");

//     var deleteQuery = deleteQueryBuilder.ToString();

//     try
//     {
//         using var mySqlConnection = new MySqlConnection(dbConnString);
//         await mySqlConnection.OpenAsync();

//         using var transaction = await mySqlConnection.BeginTransactionAsync();

//         // Delete the rows with specified rowIds
//         await using (var deleteCommand = new MySqlCommand(deleteQuery, mySqlConnection, transaction))
//         {
//             for (int i = 0; i < rowIds.Count; i++)
//             {
//                 deleteCommand.Parameters.AddWithValue("@id" + i, rowIds[i]);
//             }

//             var rowsDeleted = await deleteCommand.ExecuteNonQueryAsync();
//             Console.WriteLine($"Deleted {rowsDeleted} rows");

//             // Reset row_id to sequential values from 1 to the total number of rows left
//             var resetQuery = @"
//                 SET @row_number = 0;
//                 UPDATE usertest2 SET row_id = (@row_number := @row_number + 1)
//                 ORDER BY row_id;";

//             await using (var resetCommand = new MySqlCommand(resetQuery, mySqlConnection, transaction))
//             {
//                 var rowsReset = await resetCommand.ExecuteNonQueryAsync();
//                 Console.WriteLine($"Reset {rowsReset} rows with sequential IDs");
//             }

//             // Commit transaction
//             await transaction.CommitAsync();

//             return Ok(true); // Return true if operations were successful
//         }
//     }
//     catch (MySqlException ex)
//     {
//         Console.WriteLine($"Database error: {ex.Message}");
//         return Ok(false); // Return false in case of an exception
//     }
// }
