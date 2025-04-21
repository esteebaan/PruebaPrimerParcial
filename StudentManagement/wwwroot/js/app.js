const apiUrl = 'https://localhost:7133/api'; // Ajustar el puerto 

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = section.id === sectionId ? 'block' : 'none';
    });
    if (sectionId === 'students') loadStudents();
    if (sectionId === 'courses') loadCourses();
    if (sectionId === 'teachers') loadTeachers();
    if (sectionId === 'enrollments') loadEnrollments();
    if (sectionId === 'grades') loadGrades();
    if (sectionId === 'reports') loadReport('students');
}

// Estudiantes (Actualizado: Manejo de 2 nombres y 2 apellidos)
async function loadStudents() {
    const response = await fetch(`${apiUrl}/students`);
    const students = await response.json();
    const tbody = document.querySelector('#studentTable tbody');
    tbody.innerHTML = '';
    students.forEach(student => {
        const fullNames = `${student.firstName}${student.middleName ? ' ' + student.middleName : ''}`;
        const fullLastNames = `${student.lastName}${student.secondLastName ? ' ' + student.secondLastName : ''}`;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.studentId}</td>
            <td>${fullNames}</td>
            <td>${fullLastNames}</td>
            <td>${student.email}</td>
            <td>
                <button class="action" onclick="editStudent('${student.studentId}')"><i class="fas fa-edit"></i> Editar</button>
                <button class="action" onclick="deleteStudent('${student.studentId}')"><i class="fas fa-trash"></i> Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

document.getElementById('studentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const student = {
        studentId: document.getElementById('studentStudentId').value,
        firstName: document.getElementById('studentFirstName').value,
        middleName: document.getElementById('studentMiddleName').value || null,
        lastName: document.getElementById('studentLastName').value,
        secondLastName: document.getElementById('studentSecondLastName').value || null,
        email: document.getElementById('studentEmail').value,
        dateOfBirth: document.getElementById('studentDateOfBirth').value
    };
    const method = document.getElementById('studentId').value ? 'PUT' : 'POST';
    const url = method === 'PUT' ? `${apiUrl}/students/${student.studentId}` : `${apiUrl}/students`;
    const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student)
    });
    if (response.ok) {
        document.getElementById('studentForm').reset();
        document.getElementById('studentId').value = '';
        loadStudents();
    } else {
        alert('Error al guardar el estudiante. Verifica el ID o los datos.');
    }
});

async function editStudent(id) {
    const response = await fetch(`${apiUrl}/students/${id}`);
    const student = await response.json();
    document.getElementById('studentId').value = student.studentId;
    document.getElementById('studentStudentId').value = student.studentId;
    document.getElementById('studentFirstName').value = student.firstName;
    document.getElementById('studentMiddleName').value = student.middleName || '';
    document.getElementById('studentLastName').value = student.lastName;
    document.getElementById('studentSecondLastName').value = student.secondLastName || '';
    document.getElementById('studentEmail').value = student.email;
    document.getElementById('studentDateOfBirth').value = student.dateOfBirth.split('T')[0];
}

async function deleteStudent(id) {
    if (confirm('¿Seguro que quieres eliminar este estudiante?')) {
        await fetch(`${apiUrl}/students/${id}`, { method: 'DELETE' });
        loadStudents();
    }
}

// Docentes (Actualizado: Manejo de 2 nombres y 2 apellidos)
async function loadTeachers() {
    const response = await fetch(`${apiUrl}/teachers`);
    const teachers = await response.json();
    const tbody = document.querySelector('#teacherTable tbody');
    tbody.innerHTML = '';
    teachers.forEach(teacher => {
        const fullNames = `${teacher.firstName}${teacher.middleName ? ' ' + teacher.middleName : ''}`;
        const fullLastNames = `${teacher.lastName}${teacher.secondLastName ? ' ' + teacher.secondLastName : ''}`;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${teacher.teacherId}</td>
            <td>${fullNames}</td>
            <td>${fullLastNames}</td>
            <td>${teacher.email}</td>
            <td>
                <button class="action" onclick="editTeacher('${teacher.teacherId}')"><i class="fas fa-edit"></i> Editar</button>
                <button class="action" onclick="deleteTeacher('${teacher.teacherId}')"><i class="fas fa-trash"></i> Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

document.getElementById('teacherForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const teacher = {
        teacherId: document.getElementById('teacherTeacherId').value,
        firstName: document.getElementById('teacherFirstName').value,
        middleName: document.getElementById('teacherMiddleName').value || null,
        lastName: document.getElementById('teacherLastName').value,
        secondLastName: document.getElementById('teacherSecondLastName').value || null,
        email: document.getElementById('teacherEmail').value
    };
    const method = document.getElementById('teacherId').value ? 'PUT' : 'POST';
    const url = method === 'PUT' ? `${apiUrl}/teachers/${teacher.teacherId}` : `${apiUrl}/teachers`;
    const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teacher)
    });
    if (response.ok) {
        document.getElementById('teacherForm').reset();
        document.getElementById('teacherId').value = '';
        loadTeachers();
    } else {
        alert('Error al guardar el docente. Verifica el ID o los datos.');
    }
});

async function editTeacher(id) {
    const response = await fetch(`${apiUrl}/teachers/${id}`);
    const teacher = await response.json();
    document.getElementById('teacherId').value = teacher.teacherId;
    document.getElementById('teacherTeacherId').value = teacher.teacherId;
    document.getElementById('teacherFirstName').value = teacher.firstName;
    document.getElementById('teacherMiddleName').value = teacher.middleName || '';
    document.getElementById('teacherLastName').value = teacher.lastName;
    document.getElementById('teacherSecondLastName').value = teacher.secondLastName || '';
    document.getElementById('teacherEmail').value = teacher.email;
}

async function deleteTeacher(id) {
    if (confirm('¿Seguro que quieres eliminar este docente?')) {
        await fetch(`${apiUrl}/teachers/${id}`, { method: 'DELETE' });
        loadTeachers();
    }
}

// Cursos (Actualizado: Mostrar nombres completos del docente)
async function loadCourses() {
    const response = await fetch(`${apiUrl}/courses`);
    const courses = await response.json();
    const tbody = document.querySelector('#courseTable tbody');
    tbody.innerHTML = '';
    courses.forEach(course => {
        const teacherFullName = `${course.teacher.firstName}${course.teacher.middleName ? ' ' + course.teacher.middleName : ''} ${course.teacher.lastName}${course.teacher.secondLastName ? ' ' + course.teacher.secondLastName : ''}`;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${course.courseId}</td>
            <td>${course.name}</td>
            <td>${course.credits}</td>
            <td>${course.teacherId}</td>
            <td>${teacherFullName}</td>
            <td>
                <button class="action" onclick="editCourse(${course.courseId})"><i class="fas fa-edit"></i> Editar</button>
                <button class="action" onclick="deleteCourse(${course.courseId})"><i class="fas fa-trash"></i> Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    // Cargar IDs de docentes en el datalist
    const teacherResponse = await fetch(`${apiUrl}/teachers`);
    const teachers = await teacherResponse.json();
    const datalist = document.getElementById('teacherSuggestions');
    datalist.innerHTML = '';
    teachers.forEach(teacher => {
        const fullName = `${teacher.firstName}${teacher.middleName ? ' ' + teacher.middleName : ''} ${teacher.lastName}${teacher.secondLastName ? ' ' + teacher.secondLastName : ''}`;
        const option = document.createElement('option');
        option.value = teacher.teacherId;
        option.text = `${teacher.teacherId} - ${fullName}`;
        datalist.appendChild(option);
    });
}

document.getElementById('courseForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const course = {
        courseId: parseInt(document.getElementById('courseId').value) || 0,
        name: document.getElementById('courseName').value,
        credits: parseInt(document.getElementById('courseCredits').value),
        teacherId: document.getElementById('courseTeacherId').value
    };
    const method = document.getElementById('courseId').value ? 'PUT' : 'POST';
    const url = method === 'PUT' ? `${apiUrl}/courses/${course.courseId}` : `${apiUrl}/courses`;
    const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course)
    });
    if (response.ok) {
        document.getElementById('courseForm').reset();
        loadCourses();
    } else {
        alert('Error al guardar el curso. Verifica el ID del docente.');
    }
});

async function editCourse(id) {
    const response = await fetch(`${apiUrl}/courses/${id}`);
    const course = await response.json();
    document.getElementById('courseId').value = course.courseId;
    document.getElementById('courseName').value = course.name;
    document.getElementById('courseCredits').value = course.credits;
    document.getElementById('courseTeacherId').value = course.teacherId;
}

async function deleteCourse(id) {
    if (confirm('¿Seguro que quieres eliminar este curso?')) {
        await fetch(`${apiUrl}/courses/${id}`, { method: 'DELETE' });
        loadCourses();
    }
}

// Inscripciones (Actualizado: Mostrar nombres completos del estudiante)
async function loadEnrollments() {
    const response = await fetch(`${apiUrl}/enrollments`);
    const enrollments = await response.json();
    const tbody = document.querySelector('#enrollmentTable tbody');
    tbody.innerHTML = '';
    enrollments.forEach(enrollment => {
        const studentFullName = `${enrollment.student.firstName}${enrollment.student.middleName ? ' ' + enrollment.student.middleName : ''} ${enrollment.student.lastName}${enrollment.student.secondLastName ? ' ' + enrollment.student.secondLastName : ''}`;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${enrollment.enrollmentId}</td>
            <td>${enrollment.studentId}</td>
            <td>${studentFullName}</td>
            <td>${enrollment.course.name}</td>
            <td>${new Date(enrollment.enrollmentDate).toLocaleDateString()}</td>
            <td>
                <button class="action" onclick="editEnrollment(${enrollment.enrollmentId})"><i class="fas fa-edit"></i> Editar</button>
                <button class="action" onclick="deleteEnrollment(${enrollment.enrollmentId})"><i class="fas fa-trash"></i> Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    // Cargar cursos en el select
    const courseResponse = await fetch(`${apiUrl}/courses`);
    const courses = await courseResponse.json();
    const courseSelect = document.getElementById('enrollmentCourseId');
    courseSelect.innerHTML = '<option value="">Seleccione un curso</option>';
    courses.forEach(course => {
        courseSelect.innerHTML += `<option value="${course.courseId}">${course.name}</option>`;
    });

    // Cargar IDs de estudiantes en el datalist
    const studentResponse = await fetch(`${apiUrl}/students`);
    const students = await studentResponse.json();
    const datalist = document.getElementById('studentSuggestions');
    datalist.innerHTML = '';
    students.forEach(student => {
        const fullName = `${student.firstName}${student.middleName ? ' ' + student.middleName : ''} ${student.lastName}${student.secondLastName ? ' ' + student.secondLastName : ''}`;
        const option = document.createElement('option');
        option.value = student.studentId;
        option.text = `${student.studentId} - ${fullName}`;
        datalist.appendChild(option);
    });
}

document.getElementById('enrollmentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const enrollment = {
        enrollmentId: parseInt(document.getElementById('enrollmentId').value) || 0,
        studentId: document.getElementById('enrollmentStudentId').value,
        courseId: parseInt(document.getElementById('enrollmentCourseId').value),
        enrollmentDate: document.getElementById('enrollmentDate').value
    };
    const method = document.getElementById('enrollmentId').value ? 'PUT' : 'POST';
    const url = method === 'PUT' ? `${apiUrl}/enrollments/${enrollment.enrollmentId}` : `${apiUrl}/enrollments`;
    const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enrollment)
    });
    if (response.ok) {
        document.getElementById('enrollmentForm').reset();
        loadEnrollments();
    } else {
        alert('Error al guardar la inscripción. Verifica el ID del estudiante.');
    }
});

async function editEnrollment(id) {
    const response = await fetch(`${apiUrl}/enrollments/${id}`);
    const enrollment = await response.json();
    document.getElementById('enrollmentId').value = enrollment.enrollmentId;
    document.getElementById('enrollmentStudentId').value = enrollment.studentId;
    document.getElementById('enrollmentCourseId').value = enrollment.courseId;
    document.getElementById('enrollmentDate').value = enrollment.enrollmentDate.split('T')[0];
}

async function deleteEnrollment(id) {
    if (confirm('¿Seguro que quieres eliminar esta inscripción?')) {
        await fetch(`${apiUrl}/enrollments/${id}`, { method: 'DELETE' });
        loadEnrollments();
    }
}

// Notas (Actualizado: Mostrar nombres completos del estudiante)
async function loadGrades() {
    const response = await fetch(`${apiUrl}/grades`);
    const grades = await response.json();
    const tbody = document.querySelector('#gradeTable tbody');
    tbody.innerHTML = '';
    grades.forEach(grade => {
        const studentFullName = `${grade.enrollment.student.firstName}${grade.enrollment.student.middleName ? ' ' + grade.enrollment.student.middleName : ''} ${grade.enrollment.student.lastName}${grade.enrollment.student.secondLastName ? ' ' + grade.enrollment.student.secondLastName : ''}`;
        const average = (grade.score1 + grade.score2) / 2;
        const passed = average >= 7 ? 'Aprobado' : 'Reprobado';
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${grade.gradeId}</td>
            <td>${grade.enrollment.student.studentId}</td>
            <td>${studentFullName}</td>
            <td>${grade.enrollment.course.name}</td>
            <td>${grade.score1.toFixed(2)}</td>
            <td>${grade.score2.toFixed(2)}</td>
            <td>${average.toFixed(2)}</td>
            <td>${passed}</td>
        `;
        tbody.appendChild(row);
    });

    // Cargar IDs de estudiantes en el datalist
    const studentResponse = await fetch(`${apiUrl}/students`);
    const students = await studentResponse.json();
    const datalist = document.getElementById('gradeStudentSuggestions');
    datalist.innerHTML = '';
    students.forEach(student => {
        const fullName = `${student.firstName}${student.middleName ? ' ' + student.middleName : ''} ${student.lastName}${student.secondLastName ? ' ' + student.secondLastName : ''}`;
        const option = document.createElement('option');
        option.value = student.studentId;
        option.text = `${student.studentId} - ${fullName}`;
        datalist.appendChild(option);
    });

    const gradeStudentId = document.getElementById('gradeStudentId').value;
    const enrollmentResponse = await fetch(`${apiUrl}/enrollments`);
    const enrollments = await enrollmentResponse.json();
    const select = document.getElementById('gradeEnrollmentId');
    select.innerHTML = '<option value="">Seleccione una inscripción</option>';
    const filteredEnrollments = gradeStudentId
        ? enrollments.filter(enrollment => enrollment.studentId === gradeStudentId)
        : enrollments;
    filteredEnrollments.forEach(enrollment => {
        const studentFullName = `${enrollment.student.firstName}${enrollment.student.middleName ? ' ' + enrollment.student.middleName : ''} ${enrollment.student.lastName}${enrollment.student.secondLastName ? ' ' + enrollment.student.secondLastName : ''}`;
        select.innerHTML += `<option value="${enrollment.enrollmentId}">${studentFullName} - ${enrollment.course.name}</option>`;
    });
}

document.getElementById('gradeStudentId').addEventListener('input', loadGrades);

document.getElementById('gradeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const grade = {
        gradeId: parseInt(document.getElementById('gradeId').value) || 0,
        enrollmentId: parseInt(document.getElementById('gradeEnrollmentId').value),
        score1: parseFloat(document.getElementById('gradeScore1').value),
        score2: parseFloat(document.getElementById('gradeScore2').value)
    };
    const response = await fetch(`${apiUrl}/grades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(grade)
    });
    if (response.ok) {
        document.getElementById('gradeForm').reset();
        loadGrades();
    } else {
        const errorText = await response.text();
        alert(`Error al guardar la nota: ${errorText}`);
    }
});

// Informes (Actualizado: Mostrar nombres completos del estudiante)
async function loadReport(type) {
    // Mostrar u ocultar filtros según la pestaña
    document.getElementById('studentFilter').style.display = type === 'students' ? 'block' : 'none';
    document.getElementById('courseFilter').style.display = type === 'courses' ? 'block' : 'none';

    const table = document.getElementById('reportTable');
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    document.querySelectorAll('.report-tabs button').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.report-tabs button[onclick="loadReport('${type}')"]`).classList.add('active');

    // Cargar IDs de estudiantes en el datalist para el filtro "Por Estudiante"
    if (type === 'students') {
        const studentResponse = await fetch(`${apiUrl}/students`);
        const students = await studentResponse.json();
        const datalist = document.getElementById('filterStudentSuggestions');
        datalist.innerHTML = '';
        students.forEach(student => {
            const fullName = `${student.firstName}${student.middleName ? ' ' + student.middleName : ''} ${student.lastName}${student.secondLastName ? ' ' + student.secondLastName : ''}`;
            const option = document.createElement('option');
            option.value = student.studentId;
            option.text = `${student.studentId} - ${fullName}`;
            datalist.appendChild(option);
        });
    }

    if (type === 'students') {
        const studentIdFilter = document.getElementById('filterStudentId').value;
        const url = studentIdFilter ? `${apiUrl}/reports/grades?studentId=${studentIdFilter}` : `${apiUrl}/reports/grades`;
        const response = await fetch(url);
        const report = await response.json();
        thead.innerHTML = `
            <tr>
                <th>Estudiante</th>
                <th>Promedio</th>
                <th>Detalles</th>
            </tr>
        `;
        tbody.innerHTML = '';
        report.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.studentName}</td>
                <td>${item.averageGrade.toFixed(2)}</td>
                <td>${item.courses.map(c => `${c.courseName}: ${c.grade.toFixed(2)} (${c.passed ? 'Aprobado' : 'Reprobado'})`).join('<br>')}</td>
            `;
            tbody.appendChild(row);
        });
    } else if (type === 'courses') {
        const courseNameFilter = document.getElementById('filterCourseName').value;
        const url = courseNameFilter ? `${apiUrl}/reports/gradesByCourse?courseName=${encodeURIComponent(courseNameFilter)}` : `${apiUrl}/reports/gradesByCourse`;
        const response = await fetch(url);
        const report = await response.json();
        thead.innerHTML = `
            <tr>
                <th>Curso</th>
                <th>Promedio</th>
                <th>Estudiantes</th>
                <th>Aprobados</th>
            </tr>
        `;
        tbody.innerHTML = '';
        report.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.courseName}</td>
                <td>${item.averageGrade.toFixed(2)}</td>
                <td>${item.studentCount}</td>
                <td>${item.passingStudents}</td>
            `;
            tbody.appendChild(row);
        });
    }
}

// Cargar estudiantes al iniciar
showSection('students');