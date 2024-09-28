// Mock credentials for the admin
// const ADMIN_USER = 'admin';
// const ADMIN_PASS = '1';

// Simple login function
// document
//   .getElementById("login-form")
//   .addEventListener("submit", function (event) {
//     event.preventDefault();

//     const username = document.getElementById("username").value;
//     const password = document.getElementById("password").value;

//     if (username === "admin" && password === "1") {
//       // Hide login page and show admin panel
//       document.getElementById("login-page").classList.add("hidden");
//       document.getElementById("admin-container").classList.remove("hidden");
//     } else {
//       alert("Invalid username or password");
//     }
//   });
// On admin panel page3
window.onload = function () {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn");
  if (!isLoggedIn) {
    window.location.href = "login.html"; // Redirect to login if not logged in
  }
};
// During login
sessionStorage.setItem("isLoggedIn", "true");

// On logout
// sessionStorage.removeItem("isLoggedIn");

// Show different sections
function showPage(pageId) {
  const sections = document.querySelectorAll(".content-section");
  sections.forEach((section) => section.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");

  if (pageId === "manage-hospitals") fetchHospitals();
}

// Fetch and display hospitals
async function fetchHospitals() {
  try {
    const response = await fetch(
      "https://hospital-server-8u34.vercel.app/api/v1/hospital"
    );
    const data = await response.json();
    const hospitals = data.data.hospitals; // Assuming the API returns hospitals inside `data.hospitals`

    displayHospitals(hospitals);
  } catch (error) {
    console.error("Error fetching hospitals:", error);
    alert(
      "Failed to fetch hospitals. Please check the console for more details."
    );
  }
}

// Display hospitals in the table with serial numbers
function displayHospitals(hospitals) {
  const tableBody = document.querySelector("#hospital-table tbody");
  tableBody.innerHTML = "";

  hospitals.forEach((hospital, index) => {
    const row = `
      <tr>
        <td>${index + 1}</td> <!-- Serial Number -->
        <td>${hospital.name}</td>
        <td>${hospital.address}</td>
        <td>${hospital.state}</td>
        <td>${hospital.pincode}</td>
        <td>${hospital.nonEmergencyBeds}</td>
        <td>${hospital.emergencyBeds}</td>
        <td>
          <button class="edit-btn" onclick="editHospital('${
            hospital._id
          }')">Edit</button>
          <button class="delete-btn" onclick="deleteHospital('${
            hospital._id
          }')">Delete</button>
        </td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}

// Search hospitals by name
function searchHospitals() {
  const searchTerm = document
    .getElementById("search-hospital")
    .value.toLowerCase();

  // Fetch the hospitals again to apply filtering
  fetchHospitals().then(() => {
    const tableBody = document.querySelector("#hospital-table tbody");
    const rows = tableBody.querySelectorAll("tr");

    rows.forEach((row) => {
      const hospitalName = row
        .querySelector("td:nth-child(2)")
        .textContent.toLowerCase(); // Second column is hospital name

      // Show or hide row based on search term
      if (hospitalName.includes(searchTerm)) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  });
}

// Edit hospital and prefill form with existing data
async function editHospital(hospitalId) {
  try {
    const response = await fetch(
      `https://hospital-server-8u34.vercel.app/api/v1/hospital/${hospitalId}`
    );

    // Check for failed API response
    if (!response.ok) {
      throw new Error(`Failed to fetch hospital. Status: ${response.status}`);
    }

    const hospital = await response.json();
    console.log(hospital); // Check the fetched hospital data

    // Ensure the data structure is as expected
    const hospitalData = hospital.data.hospital;
    if (!hospitalData) {
      throw new Error("Hospital data not found.");
    }

    // Populate form fields with the hospital's data
    document.getElementById("form-title").textContent = "Edit Hospital";
    document.getElementById("hospital-id").value = hospitalData._id || ""; // Consistent ID
    document.getElementById("name").value = hospitalData.name || "";
    document.getElementById("address").value = hospitalData.address || "";
    document.getElementById("state").value = hospitalData.state || "";
    document.getElementById("pincode").value = hospitalData.pincode || "";
    document.getElementById("nonEmergencyBeds").value =
      hospitalData.nonEmergencyBeds || "";
    document.getElementById("emergencyBeds").value =
      hospitalData.emergencyBeds || "";
    document.getElementById("email").value = hospitalData.email || "";
    document.getElementById("password").value = hospitalData.password || "";

    // Change the button text to "Update Hospital"
    document.getElementById("submit-btn").textContent = "Update Hospital";

    console.log("Form fields populated, showing form...");

    // Show the form for editing
    showPage("add-hospital"); // You can replace this with modal display if required
  } catch (error) {
    console.error("Error fetching hospital:", error);
  }
}

// Update hospital (when form is submitted)
document
  .getElementById("hospital-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const hospitalId = document.getElementById("hospital-id").value; // Get the hospital ID
    const hospitalData = {
      name: document.getElementById("name").value,
      address: document.getElementById("address").value,
      state: document.getElementById("state").value,
      pincode: document.getElementById("pincode").value,
      nonEmergencyBeds: document.getElementById("nonEmergencyBeds").value,
      emergencyBeds: document.getElementById("emergencyBeds").value,
      email: document.getElementById("email").value, // Include email
      password: document.getElementById("password").value, // Include password
    };

    try {
      const method = hospitalId ? "PATCH" : "POST"; // Use PATCH for updating, POST for creating
      const url = hospitalId
        ? `https://hospital-server-8u34.vercel.app/api/v1/hospital/${hospitalId}`
        : `https://hospital-server-8u34.vercel.app/api/v1/hospital`;

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hospitalData),
      });

      if (response.ok) {
        alert("Hospital updated successfully!");
        fetchHospitals(); // Refresh the hospitals list after updating
        document.getElementById("hospital-form").reset();
        showPage("manage-hospitals"); // Go back to the hospitals list
      } else {
        const errorData = await response.json();
        alert("Error updating hospital: " + errorData.message);
      }
    } catch (error) {
      console.error("Error updating hospital:", error);
      alert(
        "Failed to update hospital. Please check the console for more details."
      );
    }
  });

// Function to handle form submission for adding a new hospital
document
  .getElementById("hospital-form")
  .addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent the default form submission

    const hospitalData = {
      name: document.getElementById("name").value,
      address: document.getElementById("address").value,
      state: document.getElementById("state").value,
      pincode: document.getElementById("pincode").value,
      nonEmergencyBeds: document.getElementById("nonEmergencyBeds").value,
      emergencyBeds: document.getElementById("emergencyBeds").value,
      email: document.getElementById("email").value, // New email field
      //password: document.getElementById("password").value, // New password field
    };

    console.log("Adding hospital:", hospitalData);

    // Perform any further processing or save to backend

    // Clear the form after submission
    clearHospitalForm();
  });

// Function to handle form submission for editing a hospital
document
  .getElementById("edit-hospital-form")
  .addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent the default form submission

    const hospitalData = {
      id: document.getElementById("edit-hospital-id").value,
      name: document.getElementById("edit-name").value,
      address: document.getElementById("edit-address").value,
      state: document.getElementById("edit-state").value,
      pincode: document.getElementById("edit-pincode").value,
      nonEmergencyBeds: document.getElementById("edit-nonEmergencyBeds").value,
      emergencyBeds: document.getElementById("edit-emergencyBeds").value,
      email: document.getElementById("edit-email").value, // New email field
      //password: document.getElementById("edit-password").value, // New password field
    };

    console.log("Editing hospital:", hospitalData);

    // Perform any further processing or save to backend

    // Close the modal after submission
    closeModal();
  });

// Delete hospital
async function deleteHospital(hospitalId) {
  if (
    confirm(`Are you sure you want to delete hospital with ID: ${hospitalId}?`)
  ) {
    try {
      const response = await fetch(
        `https://hospital-server-8u34.vercel.app/api/v1/hospital/${hospitalId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        alert("Hospital deleted successfully!");
        fetchHospitals(); // Refresh the hospitals list after deleting
      } else {
        const errorData = await response.json();
        alert("Error deleting hospital: " + errorData.message);
      }
    } catch (error) {
      console.error("Error deleting hospital:", error);
      alert(
        "Failed to delete hospital. Please check the console for more details."
      );
    }
  }
}

// Open edit modal
function openEditModal(
  id,
  name,
  address,
  state,
  pincode,
  nonEmergencyBeds,
  emergencyBeds
) {
  document.getElementById("edit-hospital-id").value = id;
  document.getElementById("edit-name").value = name;
  document.getElementById("edit-address").value = address;
  document.getElementById("edit-state").value = state;
  document.getElementById("edit-pincode").value = pincode;
  document.getElementById("edit-nonEmergencyBeds").value = nonEmergencyBeds;
  document.getElementById("edit-emergencyBeds").value = emergencyBeds;

  document.getElementById("edit-modal").style.display = "block";
}

// Close modal
function closeModal() {
  document.getElementById("edit-modal").style.display = "none";
  document.getElementById("edit-hospital-form").reset(); // Clear the edit form
}

// Function to logout
function logout() {
  // Hide admin panel
  //   const adminContainer = document.getElementById("admin-container");
  //   if (adminContainer) {
  //     adminContainer.classList.add("hidden");
  //   }
  sessionStorage.removeItem("isLoggedIn");

  // Clear user session data
  localStorage.removeItem("userSession"); // Example for local storage
  // Optionally, you can also clear cookies if you're using them
  // document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";

  // Redirect to login page
  window.location.href = "login.html";

  // Clear the input fields for the login form
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";

  // Optionally, clear other forms if needed
  clearAllForms();
}

// Optional: Function to clear all other forms (like hospital form)
function clearAllForms() {
  const hospitalForm = document.getElementById("hospital-form");
  if (hospitalForm) {
    // Clear all input fields within the hospital form
    const inputs = hospitalForm.getElementsByTagName("input");
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].value = "";
    }
  }

  // If you have other forms to clear, repeat similar logic here
}

// Function to clear the add hospital form
function clearHospitalForm() {
  document.getElementById("hospital-form").reset();
}
