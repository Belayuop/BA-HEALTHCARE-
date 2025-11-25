
// Elements
const screens = document.querySelectorAll('.screen');
const loginForm = document.getElementById('loginForm');
const nav = document.getElementById('nav');

// Show specific screen
function showScreen(id) {
  screens.forEach(s => s.classList.add('hidden'));
  const screen = document.getElementById(id);
  if(screen) screen.classList.remove('hidden');
}

// Login
loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const role = document.getElementById('roleSelect').value;
  document.getElementById('mainHeader').style.display = 'block';

  if(role === 'patient'){
    showScreen('patientDashboard');
    nav.innerHTML = `
      <a href="#" onclick="showScreen('patientDashboard')">Home</a>
      <a href="#" onclick="showScreen('patientAppointment')">Book Appointment</a>
      <a href="#" onclick="showScreen('patientQueue')">Queue</a>
      <a href="#" onclick="showScreen('patientTriage')">Triage</a>
      <a href="#" onclick="logout()">Logout</a>
    `;
  } else if(role === 'doctor'){
    showScreen('doctorDashboard');
    nav.innerHTML = `
      <a href="#" onclick="showScreen('doctorDashboard')">Home</a>
      <a href="#" onclick="showScreen('doctorQueue')">Queue</a>
      <a href="#" onclick="showScreen('doctorTriage')">Triage</a>
      <a href="#" onclick="logout()">Logout</a>
    `;
  } else if(role === 'admin'){
    showScreen('adminDashboard');
    nav.innerHTML = `
      <a href="#" onclick="showScreen('adminDashboard')">Home</a>
      <a href="#" onclick="showScreen('adminUsers')">Users</a>
      <a href="#" onclick="showScreen('adminHospitals')">Hospitals</a>
      <a href="#" onclick="showScreen('adminAppointments')">Appointments</a>
      <a href="#" onclick="logout()">Logout</a>
    `;
  }
});

// Logout
function logout() {
  alert("Logged out successfully!");
  showScreen('loginScreen');
  document.getElementById('mainHeader').style.display = 'none';
}

// Countries & Hospitals
const countries = ["Ethiopia","United States","UK","India","China"];
const hospitals = {
  "Ethiopia":["Addis Ababa Hospital","Bahir Dar Hospital","Mekelle Hospital"],
  "United States":["Johns Hopkins","Mayo Clinic","Mass General"],
  "UK":["St Thomas Hospital","Royal London Hospital"],
  "India":["AIIMS Delhi","Apollo","Fortis Hospital"],
  "China":["Beijing Hospital","Shanghai Medical Center"]
};

const countrySelect = document.getElementById('countrySelect');
const hospitalList = document.getElementById('hospitalList');

countries.forEach(c => {
  countrySelect.innerHTML += `<option value="${c}">${c}</option>`;
});

countrySelect.addEventListener('change', () => {
  const country = countrySelect.value;
  hospitalList.innerHTML = "";
  if(hospitals[country]){
    hospitals[country].forEach(h => {
      hospitalList.innerHTML += `<option value="${h}">${h}</option>`;
    });
  }
});

// Appointment Form
document.getElementById('appointmentForm').addEventListener('submit', e=>{
  e.preventDefault();
  alert("Appointment confirmed!");
  showScreen('patientDashboard');
});

// Triage Form
document.getElementById('triageForm').addEventListener('submit', e=>{
  e.preventDefault();
  const symptoms = document.getElementById('symptoms').value;
  // For now, dummy AI result
  document.getElementById('triageResult').innerHTML = `<p>AI Triage Result: Urgent - Possible Condition: Flu</p>`;
});

