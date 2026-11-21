
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import StudentsPage from './pages/StudentsPage';
import StudentFormPage from './pages/StudentFormPage';
import './App.css';

// Name used to save student data in browser
const STORAGE_KEY = 'student-management-students';

function App() {

  // Load saved students when app starts
  const [students, setStudents] = useState(() => {
    const savedStudents = localStorage.getItem(STORAGE_KEY);

    return savedStudents ? JSON.parse(savedStudents) : [];
  });

  // Save student list whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  }, [students]);

  // Get current URL path
  const path = window.location.pathname;

  const editMatch = path.match(/^\/edit\/([^/]+)$/);

  const studentToEdit = editMatch
    ? students.find((student) => student.id === editMatch[1])
    : null;

  // Add new student
  function addStudent(studentDetails) {
    const updatedStudents = [
      ...students,
      { ...studentDetails, id: Date.now().toString() },
    ];

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedStudents)
    );

    setStudents(updatedStudents);

    window.location.href = '/students';

  }

  // Update existing student
  function updateStudent(updatedStudent) {
    const updatedStudents = students.map((student) =>
      student.id === updatedStudent.id
        ? updatedStudent
        : student
    );

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedStudents)
    );

    setStudents(updatedStudents);

    window.location.href = '/students';
  }

  // Delete student
  function deleteStudent(id) {
    if (window.confirm('Delete this student?')) {
      setStudents(
        students.filter((student) => student.id !== id)
      );
    }
  }

  // Display pages based on URL
  let page;

  if (path === '/students') {
    page = (
      <StudentsPage
        students={students}
        onDelete={deleteStudent}
      />
    );

  } else if (path === '/add-student') {
    page = <StudentFormPage onSave={addStudent} />;

  } else if (editMatch && studentToEdit) {
    page = (
      <StudentFormPage
        student={studentToEdit}
        onSave={updateStudent}
      />
    );

  } else {
    page = <HomePage studentCount={students.length} />;
  }
  

  // Display navbar and selected page
  return (
    <>
      <Navbar />
      {page}
    </>
  );
}

export default App;
