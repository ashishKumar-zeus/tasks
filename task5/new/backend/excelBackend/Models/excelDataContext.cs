using Microsoft.EntityFrameworkCore;

namespace excelBackend.Models;

public class ExcelDataContext : DbContext
{
    public ExcelDataContext(DbContextOptions<ExcelDataContext> options)
        : base(options)
    {

    }

    public DbSet<ExcelData> ExcelDatas { get; set; } = null!;
}
