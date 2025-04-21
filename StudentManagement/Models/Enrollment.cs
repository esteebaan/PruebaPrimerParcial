namespace StudentManagement.Models
{
    public class Enrollment
    {
        public int EnrollmentId { get; set; }
        public string StudentId { get; set; }
        public int CourseId { get; set; }
        public DateTime EnrollmentDate { get; set; }
        public Student Student { get; set; }
        public Course Course { get; set; }
    }
}
