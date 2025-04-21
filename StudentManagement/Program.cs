using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Builder;
using System.Linq;
using StudentManagement.Models;
using StudentManagement.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<StudentContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

// Validación de ID de 10 dígitos
bool IsValidId(string id) => id != null && Regex.IsMatch(id, @"^\d{10}$");

// Estudiantes
app.MapGet("/api/students", async (StudentContext db) =>
    await db.Students.ToListAsync());

app.MapGet("/api/students/{id}", async (StudentContext db, string id) =>
    await db.Students.FindAsync(id)
        is Student student
            ? Results.Ok(student)
            : Results.NotFound());

app.MapPost("/api/students", async (StudentContext db, Student student) =>
{
    if (!IsValidId(student.StudentId))
        return Results.BadRequest("El ID debe tener exactamente 10 dígitos numéricos.");

    if (string.IsNullOrEmpty(student.FirstName) || string.IsNullOrEmpty(student.LastName))
        return Results.BadRequest("El primer nombre y el primer apellido son obligatorios.");

    if (await db.Students.AnyAsync(s => s.StudentId == student.StudentId))
        return Results.BadRequest("El ID ya existe.");

    db.Students.Add(student);
    await db.SaveChangesAsync();
    return Results.Created($"/api/students/{student.StudentId}", student);
});

app.MapPut("/api/students/{id}", async (StudentContext db, string id, Student updatedStudent) =>
{
    if (!IsValidId(id) || id != updatedStudent.StudentId)
        return Results.BadRequest("ID inválido o no coincide.");

    if (string.IsNullOrEmpty(updatedStudent.FirstName) || string.IsNullOrEmpty(updatedStudent.LastName))
        return Results.BadRequest("El primer nombre y el primer apellido son obligatorios.");

    var student = await db.Students.FindAsync(id);
    if (student is null) return Results.NotFound();

    student.FirstName = updatedStudent.FirstName;
    student.MiddleName = updatedStudent.MiddleName;
    student.LastName = updatedStudent.LastName;
    student.SecondLastName = updatedStudent.SecondLastName;
    student.Email = updatedStudent.Email;
    student.DateOfBirth = updatedStudent.DateOfBirth;

    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.MapDelete("/api/students/{id}", async (StudentContext db, string id) =>
{
    var student = await db.Students.FindAsync(id);
    if (student is null) return Results.NotFound();

    db.Students.Remove(student);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// Docentes
app.MapGet("/api/teachers", async (StudentContext db) =>
    await db.Teachers.ToListAsync());

app.MapGet("/api/teachers/{id}", async (StudentContext db, string id) =>
    await db.Teachers.FindAsync(id)
        is Teacher teacher
            ? Results.Ok(teacher)
            : Results.NotFound());

app.MapPost("/api/teachers", async (StudentContext db, Teacher teacher) =>
{
    if (!IsValidId(teacher.TeacherId))
        return Results.BadRequest("El ID debe tener exactamente 10 dígitos numéricos.");

    if (string.IsNullOrEmpty(teacher.FirstName) || string.IsNullOrEmpty(teacher.LastName))
        return Results.BadRequest("El primer nombre y el primer apellido son obligatorios.");

    if (await db.Teachers.AnyAsync(t => t.TeacherId == teacher.TeacherId))
        return Results.BadRequest("El ID ya existe.");

    db.Teachers.Add(teacher);
    await db.SaveChangesAsync();
    return Results.Created($"/api/teachers/{teacher.TeacherId}", teacher);
});

app.MapPut("/api/teachers/{id}", async (StudentContext db, string id, Teacher updatedTeacher) =>
{
    if (!IsValidId(id) || id != updatedTeacher.TeacherId)
        return Results.BadRequest("ID inválido o no coincide.");

    if (string.IsNullOrEmpty(updatedTeacher.FirstName) || string.IsNullOrEmpty(updatedTeacher.LastName))
        return Results.BadRequest("El primer nombre y el primer apellido son obligatorios.");

    var teacher = await db.Teachers.FindAsync(id);
    if (teacher is null) return Results.NotFound();

    teacher.FirstName = updatedTeacher.FirstName;
    teacher.MiddleName = updatedTeacher.MiddleName;
    teacher.LastName = updatedTeacher.LastName;
    teacher.SecondLastName = updatedTeacher.SecondLastName;
    teacher.Email = updatedTeacher.Email;

    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.MapDelete("/api/teachers/{id}", async (StudentContext db, string id) =>
{
    var teacher = await db.Teachers.FindAsync(id);
    if (teacher is null) return Results.NotFound();

    db.Teachers.Remove(teacher);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// Cursos
app.MapGet("/api/courses", async (StudentContext db) =>
    await db.Courses.Include(c => c.Teacher).ToListAsync());

app.MapGet("/api/courses/{id}", async (StudentContext db, int id) =>
    await db.Courses.Include(c => c.Teacher).FirstOrDefaultAsync(c => c.CourseId == id)
        is Course course
            ? Results.Ok(course)
            : Results.NotFound());

app.MapPost("/api/courses", async (StudentContext db, Course course) =>
{
    if (!await db.Teachers.AnyAsync(t => t.TeacherId == course.TeacherId))
        return Results.BadRequest("Docente no encontrado.");

    db.Courses.Add(course);
    await db.SaveChangesAsync();
    return Results.Created($"/api/courses/{course.CourseId}", course);
});

app.MapPut("/api/courses/{id}", async (StudentContext db, int id, Course updatedCourse) =>
{
    if (id != updatedCourse.CourseId)
        return Results.BadRequest("ID no coincide.");

    var course = await db.Courses.FindAsync(id);
    if (course is null) return Results.NotFound();

    if (!await db.Teachers.AnyAsync(t => t.TeacherId == updatedCourse.TeacherId))
        return Results.BadRequest("Docente no encontrado.");

    course.Name = updatedCourse.Name;
    course.Credits = updatedCourse.Credits;
    course.TeacherId = updatedCourse.TeacherId;

    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.MapDelete("/api/courses/{id}", async (StudentContext db, int id) =>
{
    var course = await db.Courses.FindAsync(id);
    if (course is null) return Results.NotFound();

    db.Courses.Remove(course);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// Inscripciones
app.MapGet("/api/enrollments", async (StudentContext db) =>
    await db.Enrollments.Include(e => e.Student).Include(e => e.Course).ToListAsync());

app.MapGet("/api/enrollments/{id}", async (StudentContext db, int id) =>
    await db.Enrollments.Include(e => e.Student).Include(e => e.Course).FirstOrDefaultAsync(e => e.EnrollmentId == id)
        is Enrollment enrollment
            ? Results.Ok(enrollment)
            : Results.NotFound());

app.MapPost("/api/enrollments", async (StudentContext db, Enrollment enrollment) =>
{
    if (!await db.Students.AnyAsync(s => s.StudentId == enrollment.StudentId))
        return Results.BadRequest("Estudiante no encontrado.");

    if (!await db.Courses.AnyAsync(c => c.CourseId == enrollment.CourseId))
        return Results.BadRequest("Curso no encontrado.");

    db.Enrollments.Add(enrollment);
    await db.SaveChangesAsync();
    return Results.Created($"/api/enrollments/{enrollment.EnrollmentId}", enrollment);
});

app.MapPut("/api/enrollments/{id}", async (StudentContext db, int id, Enrollment updatedEnrollment) =>
{
    if (id != updatedEnrollment.EnrollmentId)
        return Results.BadRequest("ID no coincide.");

    var enrollment = await db.Enrollments.FindAsync(id);
    if (enrollment is null) return Results.NotFound();

    if (!await db.Students.AnyAsync(s => s.StudentId == updatedEnrollment.StudentId))
        return Results.BadRequest("Estudiante no encontrado.");

    if (!await db.Courses.AnyAsync(c => c.CourseId == updatedEnrollment.CourseId))
        return Results.BadRequest("Curso no encontrado.");

    enrollment.StudentId = updatedEnrollment.StudentId;
    enrollment.CourseId = updatedEnrollment.CourseId;
    enrollment.EnrollmentDate = updatedEnrollment.EnrollmentDate;

    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.MapDelete("/api/enrollments/{id}", async (StudentContext db, int id) =>
{
    var enrollment = await db.Enrollments.FindAsync(id);
    if (enrollment is null) return Results.NotFound();

    db.Enrollments.Remove(enrollment);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// Notas
app.MapGet("/api/grades", async (StudentContext db) =>
{
    // Materializar los datos con Include y ThenInclude
    var grades = await db.Grades
        .Include(g => g.Enrollment)
        .ThenInclude(e => e.Student)
        .Include(g => g.Enrollment)
        .ThenInclude(e => e.Course)
        .ToListAsync();

    // Aplicar la proyección después de materializar
    var result = grades
        .Select(g => new
        {
            gradeId = g.GradeId,
            enrollment = new
            {
                enrollmentId = g.Enrollment.EnrollmentId,
                student = new
                {
                    studentId = g.Enrollment.Student.StudentId,
                    firstName = g.Enrollment.Student.FirstName,
                    middleName = g.Enrollment.Student.MiddleName,
                    lastName = g.Enrollment.Student.LastName,
                    secondLastName = g.Enrollment.Student.SecondLastName
                },
                course = new
                {
                    courseId = g.Enrollment.Course.CourseId,
                    name = g.Enrollment.Course.Name
                }
            },
            score1 = g.Score1,
            score2 = g.Score2
        })
        .ToList();

    return result;
});

app.MapPost("/api/grades", async (StudentContext db, Grade grade) =>
{
    if (!await db.Enrollments.AnyAsync(e => e.EnrollmentId == grade.EnrollmentId))
        return Results.BadRequest("Inscripción no encontrada."); // Corregido: Results.Bad.REquest -> Results.BadRequest

    if (grade.Score1 < 0 || grade.Score1 > 10 || grade.Score2 < 0 || grade.Score2 > 10)
        return Results.BadRequest("Las notas deben estar entre 0 y 10."); // Corregido: Results.Bad.REquest -> Results.BadRequest

    if (await db.Grades.AnyAsync(g => g.EnrollmentId == grade.EnrollmentId))
        return Results.BadRequest("Ya existe una nota para esta inscripción."); // Corregido: Results.Bad.REquest -> Results.BadRequest

    db.Grades.Add(grade);
    await db.SaveChangesAsync();
    return Results.Created($"/api/grades/{grade.GradeId}", grade);
});

// Informe de Notas (Corrección: Materializar datos antes de aplicar Where y GroupBy)
app.MapGet("/api/reports/grades", async (StudentContext db, string? studentId) =>
{
    var query = db.Grades
        .Select(g => new
        {
            Enrollment = new
            {
                Student = new
                {
                    g.Enrollment.Student.StudentId,
                    g.Enrollment.Student.FirstName,
                    g.Enrollment.Student.MiddleName,
                    g.Enrollment.Student.LastName,
                    g.Enrollment.Student.SecondLastName
                },
                Course = new
                {
                    g.Enrollment.Course.Name
                }
            },
            g.Score1,
            g.Score2
        });

    if (!string.IsNullOrEmpty(studentId))
    {
        query = query.Where(g => g.Enrollment.Student.StudentId == studentId);
    }

    var report = await query
        .GroupBy(g => new { g.Enrollment.Student.StudentId, g.Enrollment.Student.FirstName, g.Enrollment.Student.MiddleName, g.Enrollment.Student.LastName, g.Enrollment.Student.SecondLastName })
        .Select(g => new
        {
            StudentId = g.Key.StudentId,
            StudentName = $"{g.Key.FirstName}{(g.Key.MiddleName != null ? " " + g.Key.MiddleName : "")} {g.Key.LastName}{(g.Key.SecondLastName != null ? " " + g.Key.SecondLastName : "")}",
            AverageGrade = g.Average(x => (x.Score1 + x.Score2) / 2),
            Courses = g.Select(x => new
            {
                CourseName = x.Enrollment.Course.Name,
                Grade = (x.Score1 + x.Score2) / 2,
                Passed = ((x.Score1 + x.Score2) / 2) >= 7
            }).ToList()
        })
        .ToListAsync();

    return Results.Ok(report);
});

// Informe por Curso
app.MapGet("/api/reports/gradesByCourse", async (StudentContext db, string? courseName) =>
{
    // Materializar los datos con Include y ThenInclude
    var grades = await db.Grades
        .Include(g => g.Enrollment)
        .ThenInclude(e => e.Course)
        .ToListAsync();

    // Aplicar el filtro y las operaciones LINQ después de materializar
    var filteredGrades = string.IsNullOrEmpty(courseName)
        ? grades
        : grades.Where(g => g.Enrollment.Course.Name.Contains(courseName));

    var report = filteredGrades
        .GroupBy(g => new { g.Enrollment.Course.CourseId, g.Enrollment.Course.Name })
        .Select(g => new
        {
            CourseId = g.Key.CourseId,
            CourseName = g.Key.Name,
            AverageGrade = g.Average(x => (x.Score1 + x.Score2) / 2),
            StudentCount = g.Select(x => x.Enrollment.StudentId).Distinct().Count(),
            PassingStudents = g.Count(x => ((x.Score1 + x.Score2) / 2) >= 7)
        })
        .ToList();

    return Results.Ok(report);
});

app.Run();