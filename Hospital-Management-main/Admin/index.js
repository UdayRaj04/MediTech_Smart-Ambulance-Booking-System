// Initialize Firebase (replace with your Firebase config)
const firebaseConfig = {
  apiKey: "AIzaSyC_RCts7ILiP_wqiglfOFwADid2rYAC-Sk",
  authDomain: "ambul-driver.firebaseapp.com",
  databaseURL: "https://ambul-driver-default-rtdb.firebaseio.com",
  projectId: "ambul-driver",
  storageBucket: "ambul-driver.appspot.com",
  messagingSenderId: "1061302559097",
  appId: "1:1061302559097:web:1c70fda02553f5a7e20fa8",
  measurementId: "G-EYYE2KZKN3",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(); // Or use firebase.database() for Realtime DB

// Simple login function using Firebase Authentication
document
  .getElementById("login-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    firebase
      .auth()
      .signInWithEmailAndPassword(username, password)
      .then((userCredential) => {
        // Save session on successful login
        sessionStorage.setItem("isLoggedIn", "true");
        // Redirect to admin page
        window.location.href = "admin.html";
      })
      .catch((error) => {
        alert("Invalid username or password");
        console.error("Login failed: ", error);
      });
  });

// On admin panel page load
window.onload = function () {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn");
  if (!isLoggedIn) {
    window.location.href = "login.html"; // Redirect to login if not logged in
  }
};

// On logout
function logout() {
  sessionStorage.removeItem("isLoggedIn");
  firebase
    .auth()
    .signOut()
    .then(() => {
      window.location.href = "login.html"; // Redirect to login page
    });
}

// Show different sections
function showPage(pageId) {
  const sections = document.querySelectorAll(".content-section");
  sections.forEach((section) => section.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");

  if (pageId === "manage-hospitals") fetchHospitals();
}

// Fetch hospitals from Firebase Firestore
async function fetchHospitals() {
  try {
    const hospitalsRef = db.collection("hospitals");
    const snapshot = await hospitalsRef.get();
    const hospitals = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

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
            hospital.id
          }')">Edit</button>
          <button class="delete-btn" onclick="deleteHospital('${
            hospital.id
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

  fetchHospitals().then(() => {
    const tableBody = document.querySelector("#hospital-table tbody");
    const rows = tableBody.querySelectorAll("tr");

    rows.forEach((row) => {
      const hospitalName = row
        .querySelector("td:nth-child(2)")
        .textContent.toLowerCase();
      row.style.display = hospitalName.includes(searchTerm) ? "" : "none";
    });
  });
}

// Edit hospital and prefill form with existing data
async function editHospital(hospitalId) {
  try {
    const hospitalRef = db.collection("hospitals").doc(hospitalId);
    const doc = await hospitalRef.get();
    if (!doc.exists) {
      throw new Error("Hospital data not found.");
    }

    const hospitalData = doc.data();
    document.getElementById("form-title").textContent = "Edit Hospital";
    document.getElementById("hospital-id").value = hospitalId;
    document.getElementById("name").value = hospitalData.name || "";
    document.getElementById("address").value = hospitalData.address || "";
    document.getElementById("state").value = hospitalData.state || "";
    document.getElementById("pincode").value = hospitalData.pincode || "";
    document.getElementById("nonEmergencyBeds").value =
      hospitalData.nonEmergencyBeds || "";
    document.getElementById("emergencyBeds").value =
      hospitalData.emergencyBeds || "";
    document.getElementById("email").value = hospitalData.email || "";

    document.getElementById("submit-btn").textContent = "Update Hospital";
    showPage("add-hospital");
  } catch (error) {
    console.error("Error fetching hospital:", error);
  }
}

// Update or add a hospital in Firebase
document
  .getElementById("hospital-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const hospitalId = document.getElementById("hospital-id").value;
    const hospitalData = {
      name: document.getElementById("name").value,
      address: document.getElementById("address").value,
      state: document.getElementById("state").value,
      pincode: document.getElementById("pincode").value,
      nonEmergencyBeds: document.getElementById("nonEmergencyBeds").value,
      emergencyBeds: document.getElementById("emergencyBeds").value,
      email: document.getElementById("email").value,
    };

    try {
      if (hospitalId) {
        await db.collection("hospitals").doc(hospitalId).update(hospitalData);
        alert("Hospital updated successfully!");
      } else {
        await db.collection("hospitals").add(hospitalData);
        alert("Hospital added successfully!");
      }
      fetchHospitals();
      document.getElementById("hospital-form").reset();
      showPage("manage-hospitals");
    } catch (error) {
      console.error("Error updating hospital:", error);
      alert(
        "Failed to update hospital. Please check the console for more details."
      );
    }
  });

// Delete hospital from Firebase
async function deleteHospital(hospitalId) {
  if (
    confirm(`Are you sure you want to delete hospital with ID: ${hospitalId}?`)
  ) {
    try {
      await db.collection("hospitals").doc(hospitalId).delete();
      alert("Hospital deleted successfully!");
      fetchHospitals();
    } catch (error) {
      console.error("Error deleting hospital:", error);
      alert(
        "Failed to delete hospital. Please check the console for more details."
      );
    }
  }
}

// Clear form fields after submission or when resetting
function clearHospitalForm() {
  document.getElementById("hospital-form").reset();
}

// Logout functionality
function logout() {
  sessionStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userSession");
  window.location.href = "login.html";
  clearAllForms();
}

// Optional: Function to clear all forms if needed
function clearAllForms() {
  const hospitalForm = document.getElementById("hospital-form");
  if (hospitalForm) {
    const inputs = hospitalForm.getElementsByTagName("input");
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].value = "";
    }
  }
}
