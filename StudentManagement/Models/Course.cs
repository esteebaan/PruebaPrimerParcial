namespace StudentManagement.Models
{
    public class Course
    {
        public int CourseId { get; set; }
        public string Name { get; set; }
        public int Credits { get; set; }
        public string TeacherId { get; set; }
        public Teacher Teacher { get; set; }
    }
}
