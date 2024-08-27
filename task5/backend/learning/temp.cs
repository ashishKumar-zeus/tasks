// public async Task<IActionResult> UploadCsv(IFormFile csvFile)
// {
//     using var reader = new StreamReader(csvFile.OpenReadStream());

//     // Read the header line to get the column names
//     string headerLine = await reader.ReadLineAsync();
//     if (headerLine == null)
//         return BadRequest("CSV file is empty.");

//     var columnNames = headerLine.Split(',');

//     // Prepare a list to store the column values for type inference
//     var columnsData = new Dictionary<string, List<string>>();
//     foreach (var columnName in columnNames)
//     {
//         columnsData[columnName] = new List<string>();
//     }

//     // Read the rest of the file line by line
//     string line;
//     while ((line = await reader.ReadLineAsync()) != null)
//     {
//         var values = line.Split(',');

//         for (int i = 0; i < columnNames.Length; i++)
//         {
//             columnsData[columnNames[i]].Add(values[i]);
//         }
//     }

//     // Step 2: Infer column types
//     var columns = new Dictionary<string, Type>();
//     foreach (var column in columnsData)
//     {
//         columns[column.Key] = InferType(column.Value);
//     }

//     // Step 3: Map CSV data to dynamic models
//     var dynamicModels = new List<ExpandoObject>();
//     foreach (var rowValues in columnsData.Values.First().Select((_, index) => 
//         columnsData.ToDictionary(col => col.Key, col => col.Value[index])))
//     {
//         dynamic dynamicRow = new ExpandoObject();
//         var dict = (IDictionary<string, object>)dynamicRow;

//         foreach (var column in columns)
//         {
//             var value = rowValues[column.Key];

//             if (column.Value == typeof(int))
//                 dict[column.Key] = int.Parse(value);
//             else if (column.Value == typeof(double))
//                 dict[column.Key] = double.Parse(value);
//             else if (column.Value == typeof(DateTime))
//                 dict[column.Key] = DateTime.Parse(value);
//             else
//                 dict[column.Key] = value;
//         }

//         dynamicModels.Add(dynamicRow);
//     }

//     // Here you can proceed with inserting the data into the dynamically created MySQL table
//     return Ok("CSV processed successfully.");
// }

// private Type InferType(IEnumerable<string> values)
// {
//     if (values.All(v => int.TryParse(v, out _)))
//         return typeof(int);
//     if (values.All(v => double.TryParse(v, out _)))
//         return typeof(double);
//     if (values.All(v => DateTime.TryParse(v, out _)))
//         return typeof(DateTime);

//     return typeof(string);
// }
