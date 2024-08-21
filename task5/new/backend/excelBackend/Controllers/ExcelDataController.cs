

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using excelBackend.Models;
using MySqlConnector;
using System.Data;
using System.Text.Json.Nodes;
using Microsoft.CodeAnalysis.Elfie.Model.Strings;
using System.Text;


namespace excelBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExcelDataController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly Publisher _publisher;
        private MySqlConnection connection;

        public ExcelDataController(IConfiguration configuration , Publisher publisher )
        {
            _configuration = configuration;
            _publisher = publisher;
            connection = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection")!);
        }

        [HttpGet]
        public async Task<IActionResult> GetItems()
        {
            var items = new List<ExcelData>();

            await connection.OpenAsync();

            using var command = new MySqlCommand("SELECT * FROM user;", connection);
            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {

                var excelData = new ExcelData
                {
                    Id = reader.GetInt32("id"),
                    Name = reader.GetString("name")
                };

                var value = reader.GetValue(0).ToString();  // Adjust indexing and type as per your actual table schema
                var value2 = reader.GetValue(1).ToString();  // Adjust indexing and type as per your actual table schema

                // string[] data = [value,value2];
                items.Add(excelData);

            }

            return Ok(items);
        }

        [HttpPost]
        public async Task<ActionResult<ExcelData>> PostExcelData(ExcelData excelData)
        {

            await connection.OpenAsync();

            var id = excelData.Id;
            var name = excelData.Name;

            using var command = new MySqlCommand($"insert into user (id,name) values ({id},'{name}');", connection);
            using var reader = await command.ExecuteReaderAsync();

            return Ok();

        }

        
        [HttpPost]
        [Route("sendToRabbitMq")]
        public IActionResult PostMessage(string message)
        {
            _publisher.SendMessage(message);

            return Ok();
        }

        [HttpPut]
        public async Task<ActionResult<ExcelData>> PutExcelData(ExcelData excelData)
        {
            try
            {

                await connection.OpenAsync();

                var id = excelData.Id;
                var name = excelData.Name;

                using var command = new MySqlCommand($"update user set id = {id}, name = '{name}' where id = {id}", connection);

                // using var res =  command.ExecuteNonQueryAsync();

                await command.ExecuteNonQueryAsync();

                return Ok();

            }
            catch (Exception e)
            {
                Console.Write(e);
            }

            return BadRequest();


        }

        [HttpDelete]
        public async Task<ActionResult<ExcelData>> DeleteExcelData(int id)
        {
            try
            {

                await connection.OpenAsync();

                using var command = new MySqlCommand($"delete from user where id = {id}", connection);

                Console.WriteLine(command.ExecuteNonQuery());

                if (command.ExecuteNonQuery() != 0)
                {
                    return Ok();
                }

            }
            catch (Exception e)
            {
                Console.Write(e);
            }

            return BadRequest();
        }


        [HttpPost]
        [Route("handleCsv")]
        public async Task<IActionResult> HandleCsv(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("File not found!!");
            }
            using var stream = new MemoryStream();
            await file.CopyToAsync(stream);
            var csvContent = Encoding.UTF8.GetString(stream.ToArray());
            List<ExcelData> jsonContent = ConverStringToJson(csvContent);
            await MultipleInsert(jsonContent);
            return Ok("Csv data added to MySQL");
        }

        private List<ExcelData> ConverStringToJson(string content)
        {
            var line = content.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
            var headers = line[0].Split(',');
            var csvData = new List<ExcelData>();
            foreach (var l in line.Skip(1))
            {
                var values = l.Split(',');
                var row = new ExcelData
                {
                    Id = Convert.ToInt32(values[0]),
                    Name = values[1],

                };
                csvData.Add(row);
            }
            return csvData;
        }

        private async Task MultipleInsert(List<ExcelData> csvRecords)
        {
            await connection.OpenAsync();
            var sql = new StringBuilder();
            sql.Append("INSERT INTO user (id, name) VALUES");
            foreach (var record in csvRecords)
            {
                sql.Append($"({record.Id}, '{record.Name}'),");
            }
            sql.Length--;
            Console.WriteLine(sql.ToString());
            using var command = new MySqlCommand(sql.ToString(), connection);
            await command.ExecuteNonQueryAsync();
        }


    }


    // [Route("handleUpload/")]
    // public class HandleUploadController : ControllerBase
    // {

    //     [HttpPost]
    //     public async Task<ActionResult<List<ExcelData>>> PostMultipleExcelData(IFormFile csv)
    //     {
    //         if (csv == null || csv.Length == 0)
    //         {
    //             return BadRequest();
    //         }

    //         var records = new List<ExcelData>();

    //         using (var stream = new StreamReader(csv.OpenReadStream()))
    //         {
    //             while (!stream.EndOfStream)
    //             {
    //                 var line = await stream.ReadLineAsync();
    //                 var values = line.Split(',');

    //                 var record = new ExcelData
    //                 {
    //                     Id = int.Parse(values[0]),
    //                     Name = values[1]
    //                 };

    //                 records.Add(record);
    //             }
    //         }

    //         return Ok(records);
    //     }
    // }






}
