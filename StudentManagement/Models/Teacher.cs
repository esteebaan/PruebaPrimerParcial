namespace StudentManagement.Models
{
    public class Teacher
    {
        public string TeacherId { get; set; }
        public string FirstName { get; set; } // Obligatorio
        public string? MiddleName { get; set; } // Opcional
        public string LastName { get; set; } // Obligatorio
        public string? SecondLastName { get; set; } // Opcional
        public string Email { get; set; }
    }
}