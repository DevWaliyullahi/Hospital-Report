document.addEventListener("DOMContentLoaded", function () {
  const openModalBtn = document.getElementById("openModalBtn");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const modal = document.getElementById("doctorRegistrationModal");
  const doctorList = document.getElementById("doctorList");

  // Pagination controls
  const prevPageBtn = document.getElementById("prevPageBtn");
  const nextPageBtn = document.getElementById("nextPageBtn");
  let currentPage = 1;
  let totalPages = 1;

  function editDoctor(doctorId) {
    openEditModal(doctorId);
    // console.log("opening modal, doctorId: ", doctorId);
  }
  // Open the modal
  openModalBtn.addEventListener("click", function () {
    modal.style.display = "block";
  });

  // Close the modal
  closeModalBtn.addEventListener("click", function () {
    modal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

 

  // Fetch and display doctors
  function fetchAndDisplayDoctors(page) {
    fetch(`/admin/doctors?page=${page}&limit=5`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },})
      .then((response) => response.json())
      .then((data) => {
        doctorList.innerHTML = ""; // Clear existing content

        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get('error');

        if (error) {
          const errorElement = document.createElement("p");
          errorElement.className = "errorMessage";
          errorElement.innerText = error;
          doctorList.appendChild(errorElement);
        }

        data.doctors.forEach((doctor) => {
          console.log(doctor._id);
          const doctorElement = document.createElement("div");
          doctorElement.className = "doctorCard";

          doctorElement.innerHTML =
            `
            <p><strong>Name:</strong> ${doctor.doctorsName}</p>
            <p><strong>Email:</strong> ${doctor.email}</p>
            <p><strong>Specializations:</strong> ${doctor.specializations}</p>
            <p><strong>Gender:</strong> ${doctor.gender}</p>
            <p><strong>Phone Number:</strong> ${doctor.phoneNumber}</p>
            
            <!-- Edit and Delete buttons with styles -->
            <button class="editButton" data-doctor-id="${doctor._id}">Edit</button>
            <button class="deleteButton" data-doctor-id="${doctor._id}">Delete</button>
          `;
          console.log(doctor._id);
          doctorList.appendChild(doctorElement);
        });

        doctorList.querySelectorAll('.editButton').forEach(button => {
          button.addEventListener('click', function () {
              const doctorId = this.getAttribute('data-doctor-id');
              editDoctor(doctorId);
          });
      });
      
      doctorList.querySelectorAll('.deleteButton').forEach(button => {
          button.addEventListener('click', function () {
              const doctorId = this.getAttribute('data-doctor-id');
              deleteDoctor(doctorId);
          });
      });

        currentPage = page;
        totalPages = data.totalPages;
        updatePaginationControls();
      })
      .catch((error) => console.error("Error fetching doctors:", error));
  }



  // Pagination control listeners
  prevPageBtn.addEventListener("click", function () {
    if (currentPage > 1) {
      fetchAndDisplayDoctors(currentPage - 1);
    }
  });

  nextPageBtn.addEventListener("click", function () {
    if (currentPage < totalPages) {
      fetchAndDisplayDoctors(currentPage + 1);
    }
  });

  // Initial fetch and display on page load
  fetchAndDisplayDoctors(currentPage);

  // Existing code for deleteDoctor function
  function deleteDoctor(doctorId) {
    console.log("Deleting doctor with ID:", doctorId);
    openDeleteModal(doctorId);
  }

  // Delete doctor modal functions
  function openDeleteModal(doctorId) {
    document.getElementById("confirmDeleteBtn").onclick = () =>
      confirmDelete(doctorId);
    document.getElementById("closeDeleteModalBtn").onclick =
      closeDeleteModal;

    document.getElementById("deleteModal").style.display = "block";
  }

  function confirmDelete(doctorId) {
    fetch(`/admin/doctors/${doctorId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        closeDeleteModal();
        fetchAndDisplayDoctors(currentPage); // Refresh the doctor list after deletion
      })
      .catch((error) => console.error("Error deleting doctor:", error));
  }

  function closeDeleteModal() {
    document.getElementById("deleteModal").style.display = "none";
  }

  function openEditModal(doctorId) {
    document.getElementById("editModal").style.display = "block";
    fetch(`/admin/doctors/${doctorId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((doctor) => {
        console.log(doctorId);
        document.getElementById("editDoctorsName").value = doctor.doctorsName;
        document.getElementById("editPhoneNumber").value = doctor.phoneNumber;
        document.getElementById("editEmail").value = doctor.email;
        document.getElementById("editSpecialization").value = doctor.specializations;

        document.getElementById("saveEditBtn").onclick = () => saveEdit(doctorId);
        document.getElementById("closeEditModalBtn").onclick = closeEditModal;
      })
      .catch((error) => console.error("Error fetching doctor:", error));
  }

  function saveEdit(doctorId) {
    const updatedData = {
      doctorsName: document.getElementById("editDoctorsName").value,
      phoneNumber: document.getElementById("editPhoneNumber").value,
      email: document.getElementById("editEmail").value,
      specializations: document.getElementById("editSpecialization").value,
    };

    fetch(`/admin/doctors/${doctorId}`, {
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
        fetchAndDisplayDoctors(currentPage); // Refresh the doctor list after update
      })
      .catch((error) => console.error("Error updating doctor:", error));
  }

  function closeEditModal() {
    document.getElementById("editModal").style.display = "none";
  }



  // Function to update pagination controls
  function updatePaginationControls() {
    document.getElementById("currentPage").innerText = currentPage;
    document.getElementById("totalPages").innerText = totalPages;
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
  }
});
