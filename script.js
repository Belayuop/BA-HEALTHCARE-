
// Scroll fade-in animation
const sections = document.querySelectorAll('section');
window.addEventListener('scroll',()=>{
  sections.forEach(section=>{
    if(window.scrollY + window.innerHeight - 100 > section.offsetTop){
      section.classList.add('visible');
    }
  });
});

// Registration form
document.getElementById('fullPatientForm').addEventListener('submit', function(e){
  e.preventDefault();
  let formData = new FormData(this);
  let uniqueID = 'MH' + Date.now();
  formData.append('patientID', uniqueID);
  let patients = JSON.parse(localStorage.getItem('patients') || '[]');
  patients.push(Object.fromEntries(formData));
  patients.sort((a,b)=>a.name.localeCompare(b.name));
  localStorage.setItem('patients', JSON.stringify(patients));
  alert('Registration submitted! Your Patient ID: ' + uniqueID);
  this.reset();
});

// Chat simulation
function sendMessage(){
  let msg = document.getElementById('userMsg').value;
  if(!msg) return;
  let chatBox = document.getElementById('chatBox');
  chatBox.innerHTML += `<p><b>You:</b> ${msg}</p>`;
  chatBox.innerHTML += `<p><b>AI Doctor:</b> Simulated advice for your query. Doctor will follow up.</p>`;
  chatBox.scrollTop = chatBox.scrollHeight;
  document.getElementById('userMsg').value='';
}

// Admin search
function searchPatient(){
  let query = document.getElementById('searchPatient').value.toLowerCase();
  let patients = JSON.parse(localStorage.getItem('patients') || '[]');
  let results = patients.filter(p=>p.name.toLowerCase().includes(query) || p.patientID.toLowerCase().includes(query));
  let html = '';
  results.forEach(p=>{
    html += `<div style="border:1px solid #ccc;padding:10px;margin:10px;border-radius:10px;">
      <p><b>ID:</b> ${p.patientID}</p>
      <p><b>Name:</b> ${p.name}</p>
      <p><b>Age:</b> ${p.age}</p>
      <p><b>Sex:</b> ${p.sex}</p>
      <p><b>Chief Complaint:</b> ${p.chiefComplaint || 'N/A'}</p>
    </div>`;
  });
  document.getElementById('adminResults').innerHTML = html || 'No results found.';
}

