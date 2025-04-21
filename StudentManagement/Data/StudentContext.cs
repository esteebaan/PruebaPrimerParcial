using Microsoft.EntityFrameworkCore;
using StudentManagement.Models;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace StudentManagement.Data
{
    public class StudentContext : DbContext
    {
        public StudentContext(DbContextOptions<StudentContext> options)
            : base(options)
        {
        }

        public DbSet<Student> Students { get; set; }
        public DbSet<Teacher> Teachers { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Enrollment> Enrollments { get; set; }
        public DbSet<Grade> Grades { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Student>()
                .HasKey(s => s.StudentId);
            modelBuilder.Entity<Student>()
                .Property(s => s.StudentId)
                .HasMaxLength(10)
                .IsFixedLength();

            modelBuilder.Entity<Teacher>()
                .HasKey(t => t.TeacherId);
            modelBuilder.Entity<Teacher>()
                .Property(t => t.TeacherId)
                .HasMaxLength(10)
                .IsFixedLength();

            modelBuilder.Entity<Student>()
                .HasIndex(s => s.Email)
                .IsUnique();

            modelBuilder.Entity<Teacher>()
                .HasIndex(t => t.Email)
                .IsUnique();

            modelBuilder.Entity<Grade>()
                .Property(g => g.Score1)
                .HasPrecision(4, 2);

            modelBuilder.Entity<Grade>()
                .Property(g => g.Score2)
                .HasPrecision(4, 2);
        }
    }
}