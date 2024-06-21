document.addEventListener("DOMContentLoaded", function () {
  const openReportModalBtn = document.getElementById("openReportModalBtn");
  const closeReportModalBtn = document.getElementById("closeReportModalBtn");
  const reportModal = document.getElementById("reportModal");
  const reportList = document.getElementById("reportList");

  // Pagination controls
  const prevPageBtn = document.getElementById("prevPageBtn");
  const nextPageBtn = document.getElementById("nextPageBtn");
  let currentPage = 1;
  let totalPages = 1;

  // Open the report modal
  openReportModalBtn.addEventListener("click", function () {
    reportModal.style.display = "block";
  });

  // Close the report modal
  closeReportModalBtn.addEventListener("click", function () {
    reportModal.style.display = "none";
  });

  // Close the report modal if the overlay is clicked
  window.addEventListener("click", function (event) {
    if (event.target === reportModal) {
      reportModal.style.display = "none";
    }
  });

  // Fetch and display doctor's reports
  function fetchAndDisplayReports(page) {
    fetch(`/reports/reports?page=${page}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        reportList.innerHTML = ""; // Clear existing content

        data.reports.forEach((report) => {
          const reportElement = document.createElement("div");
          reportElement.className = "reportCard";

          reportElement.innerHTML = `
            <!-- Display report information -->
            <p><strong>Patient Id:</strong> ${report.patientId}</p>
            <p><strong>Patient's Name:</strong> ${report.patientName}</p>
            <p><strong>Age:</strong> ${report.age}</p>
          <p><strong>Hospital Name:</strong> ${report.hospitalName}</p>
          <p><strong>Weight:</strong> ${report.weight}</p>
          <p><strong>Height:</strong> ${report.height}</p>
          <p><strong>Blood Group:</strong> ${report.bloodGroup}</p>
          <p><strong>Genotype:</strong> ${report.genotype}</p>
          <p><strong>Blood Pressure:</strong> ${report.bloodPressure}</p>
          <p><strong>HIV Status:</strong> ${report.HIV_status}</p>
          <p><strong>Hepatitis:</strong> ${report.hepatitis}</p>
            <!-- Add other report fields as needed -->

            <!-- Edit and Delete buttons with styles -->
            <button class="editButton" onclick="editDoctorReport('${report._id}')">Edit</button>
            <button class="deleteButton" onclick="deleteDoctorReport('${report._id}')">Delete</button>
          `;

          reportList.appendChild(reportElement);
        });

        currentPage = page;
        totalPages = data.totalPages;

        updatePaginationControls();
      })
      .catch((error) => console.error("Error fetching reports:", error));
  }

  // Pagination control listeners
  prevPageBtn.addEventListener("click", function () {
    if (currentPage > 1) {
      fetchAndDisplayReports(currentPage - 1);
    }
  });

  nextPageBtn.addEventListener("click", function () {
    if (currentPage < totalPages) {
      fetchAndDisplayReports(currentPage + 1);
    }
  });

  // Initial fetch and display on page load
  fetchAndDisplayReports(currentPage);

  // Existing code for editDoctorReport and deleteDoctorReport functions

  // Function to update pagination controls
  function updatePaginationControls() {
    document.getElementById("currentPage").innerText = currentPage;
    document.getElementById("totalPages").innerText = totalPages;

    // Disable/enable pagination buttons based on current page
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
  }
});

function editDoctorReport(reportId) {
  openEditModal(reportId);
}

// Edit doctor report modal functions
function openEditModal(reportId) {
  document.getElementById("editModal").style.display = "block";
  fetch(`/reports/reports/${reportId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((report) => {
      console.log(report);
      console.log(reportId);
      document.getElementById("editPatientId").value = report.patientId;
      document.getElementById("editPatientName").value = report.patientName;
      console.log(report.patientName);
      document.getElementById("editAge").value = report.age;
      console.log(report.age);
      document.getElementById("editHospitalName").value = report.hospitalName;
      document.getElementById("editWeight").value = report.weight;
      document.getElementById("editHeight").value = report.height;
      document.getElementById("editBloodGroup").value = report.bloodGroup;
      document.getElementById("editGenotype").value = report.genotype;
      document.getElementById("editBloodPressure").value = report.bloodPressure;
      document.getElementById("editHIV_status").value = report.HIV_status;
      document.getElementById("editHepatitis").value = report.hepatitis;

      document.getElementById("saveEditBtn").onclick = () => saveEdit(reportId);
      document.getElementById("closeEditModalBtn").onclick = closeEditModal;
    })
    .catch((error) => console.error("Error fetching report:", error));
}

function saveEdit(reportId) {
  const updatedData = {
    patientId: document.getElementById("editPatientId").value,
    patientName: document.getElementById("editPatientName").value,
    age: document.getElementById("editAge").value,
    hospitalName: document.getElementById("editHospitalName").value,
    weight: document.getElementById("editWeight").value,
    height: document.getElementById("editHeight").value,
    bloodGroup: document.getElementById("editBloodGroup").value,
    genotype: document.getElementById("editGenotype").value,
    bloodPressure: document.getElementById("editBloodPressure").value,
    HIV_status: document.getElementById("editHIV_status").value,
    hepatitis: document.getElementById("editHepatitis").value,
  };

  fetch(`/reports/reports/${reportId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message);
      closeEditModal();
      
      location.reload();
    })
    .catch((error) => console.error("Error updating report:", error));
}

function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
}






function deleteDoctorReport(reportId) {
  openDeleteModal(reportId);
}

// Delete doctor report modal functions
function openDeleteModal(reportId) {
  document.getElementById("confirmDeleteBtn").onclick = () => confirmDelete(reportId);

  document.getElementById("closeDeleteModalBtn").onclick = closeDeleteModal;

  document.getElementById("deleteModal").style.display = "block";
}

function confirmDelete(reportId) {
  fetch(`/reports/reports/${reportId}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message);
      closeDeleteModal();
      location.reload();
    })
    .catch((error) => console.error("Error deleting report:", error));
}

function closeDeleteModal() {
  document.getElementById("deleteModal").style.display = "none";
}