
const form = document.getElementById("attendanceForm");
const table = document.getElementById("attendanceTable");

let students = JSON.parse(localStorage.getItem("attendanceRecords")) || [];

function saveData() {
    localStorage.setItem("attendanceRecords", JSON.stringify(students));
}

function updateSummary() {
    document.getElementById("totalStudents").textContent = students.length;

    const average = students.length
        ? students.reduce((sum, student) => sum + student.percentage, 0) / students.length
        : 0;

    document.getElementById("averageAttendance").textContent =
        average.toFixed(1) + "%";

    const lowCount = students.filter(
        student => student.percentage < 75
    ).length;

    document.getElementById("lowAttendance").textContent = lowCount;
}

function displayStudents() {
    table.innerHTML = "";

    students.forEach((student, index) => {
        const row = document.createElement("tr");

        const values = [
            student.rollNo,
            student.name,
            student.present,
            student.total,
            student.absent,
            student.percentage.toFixed(1) + "%"
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const statusCell = document.createElement("td");
        statusCell.textContent =
            student.percentage >= 75 ? "Good" : "Low";

        statusCell.className =
            student.percentage >= 75 ? "status-good" : "status-low";

        row.appendChild(statusCell);

        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";

        deleteButton.addEventListener("click", () => {
            students.splice(index, 1);
            saveData();
            displayStudents();
        });

        actionCell.appendChild(deleteButton);
        row.appendChild(actionCell);

        table.appendChild(row);
    });

    updateSummary();
}

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("studentName").value.trim();
    const rollNo = document.getElementById("rollNo").value.trim();
    const present = Number(document.getElementById("presentDays").value);
    const total = Number(document.getElementById("totalDays").value);

    if (!name || !rollNo) {
        alert("Please enter student name and roll number.");
        return;
    }

    if (students.some(student => student.rollNo.toLowerCase() === rollNo.toLowerCase())) {
        alert("This roll number already exists!");
        return;
    }

    if (!Number.isInteger(present) || !Number.isInteger(total) ||
        total <= 0 || present < 0 || present > total) {
        alert("Please enter valid attendance days.");
        return;
    }

    const absent = total - present;
    const percentage = (present / total) * 100;

    students.push({
        name,
        rollNo,
        present,
        total,
        absent,
        percentage
    });

    saveData();
    displayStudents();
    form.reset();

    alert("Student attendance added successfully!");
});

document.getElementById("clearAll").addEventListener("click", function() {
    if (students.length === 0) {
        alert("There are no records to clear.");
        return;
    }

    if (confirm("Are you sure you want to delete all records?")) {
        students = [];
        saveData();
        displayStudents();
        alert("All records cleared successfully!");
    }
});

displayStudents();
