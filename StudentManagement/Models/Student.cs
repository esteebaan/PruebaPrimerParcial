namespace StudentManagement.Models
{
    public class Student
    {
        public string StudentId { get; set; }
        public string FirstName { get; set; } // Obligatorio
        public string? MiddleName { get; set; } // Opcional
        public string LastName { get; set; } // Obligatorio
        public string? SecondLastName { get; set; } // Opcional
        public string Email { get; set; }
        public DateTime DateOfBirth { get; set; }
    }
}