namespace StudentManagement.Models
{
    public class Grade
    {
        public int GradeId { get; set; }
        public int EnrollmentId { get; set; }
        public decimal Score1 { get; set; }
        public decimal Score2 { get; set; }
        public Enrollment Enrollment { get; set; }
    }
}
