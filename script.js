/**
 * MyHealthID - Core Logic
 * Handles Auth, Data Storage, AI Simulation, and Image Loading
 */

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Auth Logic
    setupAuth();

    // 2. Dashboard Logic (if on dashboard)
    setupDashboard();
    
    // 3. Chat Logic
    setupChat();
});


// --- Auth System ---
function setupAuth() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const logoutBtn = document.getElementById('logoutBtn');

    // Login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const result = await window.LeadGenRuntime.loginUser('users', email, password);
                alert('Welcome back, ' + result.user.full_name);
                
                // Redirect based on role
                if (result.user.role === 'doctor') {
                    window.location.href = 'dashboard-doctor.html';
                } else {
                    window.location.href = 'dashboard-patient.html';
                }
            } catch (err) {
                alert('Login Failed: ' + err.message);
            }
        });
    }

    // Registration
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            
            try {
                await window.LeadGenRuntime.insertData('users', data);
                alert('Registration Successful! Your NID is: ' + data.national_id);
                window.location.href = 'login.html';
            } catch (err) {
                alert('Error: ' + err.message);
            }
        });
    }

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await window.LeadGenRuntime.logout();
            window.location.href = 'index.html';
        });
    }
}

// --- Dashboard Features ---
async function setupDashboard() {
    // Check if user is logged in
    try {
        const user = await window.LeadGenRuntime.getCurrentUser();
        if (!user && document.body.classList.contains('dashboard-body')) {
            // Basic route protection
            // window.location.href = 'login.html'; 
        } else if (user) {
            const nameDisplay = document.getElementById('userNameDisplay');
            const nidDisplay = document.getElementById('userNidDisplay');
            if (nameDisplay) nameDisplay.textContent = 'Welcome, ' + user.full_name;
            if (nidDisplay) nidDisplay.textContent = user.national_id || 'NID-PENDING';
        }
    } catch (e) { 
        console.log("Auth check skipped");
    }

    // Doctor: Prescription AI Logic
    const prescriptionForm = document.getElementById('prescriptionForm');
    const drugInput = document.getElementById('drugInput');
    const safetyAlert = document.getElementById('safetyAlert');
    const safetySuccess = document.getElementById('safetySuccess');

    if (prescriptionForm && drugInput) {
        // Real-time listener for the demo scenario
        drugInput.addEventListener('input', (e) => {
            const val = e.target.value.toLowerCase();
            const currentMeds = document.getElementById('currentMeds').value.toLowerCase();

            // SIMULATED AI CHECK: Rifampicin + ART interaction
            if (val.includes('rifampicin') && currentMeds.includes('art')) {
                safetyAlert.classList.remove('hidden');
                safetySuccess.classList.add('hidden');
            } else {
                safetyAlert.classList.add('hidden');
                if (val.length > 3) safetySuccess.classList.remove('hidden');
            }
        });

        prescriptionForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!safetyAlert.classList.contains('hidden')) {
                if(!confirm("CRITICAL WARNING IGNORED. Are you sure you want to proceed despite the drug interaction risk?")) {
                    return;
                }
            }
            
            // Save record
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            data.patient_id = 1; 
            
            try {
                await window.LeadGenRuntime.insertData('medical_records', data);
                alert('Prescription sent securely to pharmacy.');
                e.target.reset();
                safetySuccess.classList.add('hidden');
            } catch (err) {
                alert('Prescription logged (simulated DB).');
            }
        });
    }

    // Patient: Appointment Booking
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            
            try {
                // Get current user ID if possible
                const user = await window.LeadGenRuntime.getCurrentUser();
                data.patient_id = user ? user.id : 1; 

                await window.LeadGenRuntime.insertData('appointments', data);
                alert('Appointment Scheduled! Confirmation SMS sent (simulated).');
                e.target.reset();
            } catch (err) {
                alert('Error booking: ' + err.message);
            }
        });
    }

    // Patient: Symptom Reporting
    const symptomForm = document.getElementById('symptomForm');
    if (symptomForm) {
        symptomForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            
            try {
                const user = await window.LeadGenRuntime.getCurrentUser();
                data.patient_id = user ? user.id : 1; 
                
                await window.LeadGenRuntime.insertData('symptom_reports', data);
                alert('Symptoms logged. AI Analysis: Monitoring required. If fever persists > 24hrs, visit clinic.');
                e.target.reset();
            } catch (err) {
                alert('Symptoms logged (simulated).');
            }
        });
    }
}

// --- Chat Features ---
function setupChat() {
    const chatForm = document.getElementById('chatForm');
    const chatMessages = document.getElementById('chatMessages');
    
    if (chatForm && chatMessages) {
        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const input = document.getElementById('messageInput');
            const msg = input.value;
            if (!msg) return;
            
            // 1. Add user message to UI
            addMessageToUI(msg, 'sent');
            input.value = '';
            
            // 2. Save to DB
            try {
                await window.LeadGenRuntime.insertData('messages', {
                    message: msg,
                    sender_id: 1, // mock
                    receiver_id: 2 // mock
                });
            } catch(e) { console.log('Message saved local'); }

            // 3. Simulate Reply after 1 second
            setTimeout(() => {
                const replies = [
                    "I understand. Please monitor your temperature.",
                    "Can you come in for a check-up tomorrow?",
                    "That sounds normal for this medication.",
                    "Please continue the dosage as prescribed."
                ];
                const randomReply = replies[Math.floor(Math.random() * replies.length)];
                addMessageToUI(randomReply, 'received');
            }, 1500);
        });
    }
}

function addMessageToUI(text, type) {
    const chatMessages = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = `message ${type}`;
    div.innerHTML = `
        ${text}
        <div style="font-size: 0.7rem; opacity: 0.7; margin-top: 5px;">Just now</div>
    `;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}// Collapsible Sections
let coll = document.getElementsByClassName("collapsible");
for(let i=0;i<coll.length;i++){
    coll[i].addEventListener("click",function(){
        this.classList.toggle("active");
        let content=this.nextElementSibling;
        if(content.style.display==="block"){ content.style.display="none"; }
        else { content.style.display="block"; }
    });
}
// Collapsible multi-step form
const nextBtns = document.querySelectorAll('.next-step');
const prevBtns = document.querySelectorAll('.prev-step');
const formSteps = document.querySelectorAll('.form-step');
let currentStep = 0;

nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        formSteps[currentStep].classList.remove('active');
        currentStep++;
        formSteps[currentStep].classList.add('active');
    });
});
prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        formSteps[currentStep].classList.remove('active');
        currentStep--;
        formSteps[currentStep].classList.add('active');
    });
});

// Chat functionality (simple AI placeholder)
const chatBox = document.getElementById('chatBox');
const chatInput = document.getElementById('chatInput');
const sendChat = document.getElementById('sendChat');

sendChat.addEventListener('click', () => {
    let userMsg = chatInput.value.trim();
    if(userMsg){
        chatBox.innerHTML += `<p><strong>You:</strong> ${userMsg}</p>`;
        // Simple AI reply
        setTimeout(() => {
            chatBox.innerHTML += `<p><strong>AI Doctor:</strong> Thank you for your message. Our doctor will review and respond shortly.</p>`;
            chatBox.scrollTop = chatBox.scrollHeight;
        }, 1000);
        chatInput.value = '';
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});

// Patient Form Submission
document.getElementById("patientForm").addEventListener("submit",function(e){
    e.preventDefault();
    const formData = new FormData(this);
    let patient = {};
    formData.forEach((value,key)=>patient[key]=value);
    patient.id = "PID"+Math.floor(Math.random()*100000);
    let patients = JSON.parse(localStorage.getItem("patients")||"[]");
    patients.push(patient);
    localStorage.setItem("patients",JSON.stringify(patients));
    alert("Patient Registered! ID: "+patient.id);
    this.reset();
});

// Chat Simulation
const chatBox=document.getElementById("chatBox");
document.getElementById("sendChat").addEventListener("click",function(){
    let input=document.getElementById("chatInput").value;
    if(input.trim()==="") return;
    chatBox.innerHTML+="<p><strong>You:</strong> "+input+"</p>";
    document.getElementById("chatInput").value="";
    setTimeout(()=>{ chatBox.innerHTML+="<p><strong>Doctor:</strong> Thank you for your question. We'll review your history and respond.</p>"; chatBox.scrollTop=chatBox.scrollHeight; },800);
});

// Appointment Booking
document.getElementById("bookAppt").addEventListener("click",function(){
    let date=document.getElementById("apptDate").value;
    let time=document.getElementById("apptTime").value;
    if(!date||!time){ alert("Select date and time"); return;}
    let appts=JSON.parse(localStorage.getItem("appointments")||"[]");
    appts.push({date,time});
    localStorage.setItem("appointments",JSON.stringify(appts));
    document.getElementById("apptList").innerHTML+=`<li>${date} at ${time}</li>`;
});

// Medical History Search
document.getElementById("searchPatient").addEventListener("input",function(){
    let val=this.value.toLowerCase();
    let patients=JSON.parse(localStorage.getItem("patients")||"[]");
    let html="";
    patients.filter(p=>p.name.toLowerCase().includes(val)||p.id.toLowerCase().includes(val))
            .forEach(p=>html+=`<li>${p.id} - ${p.name}</li>`);
    document.getElementById("historyList").innerHTML=html;
});

// Admin Search
document.getElementById("searchAdmin").addEventListener("input",function(){
    let val=this.value.toLowerCase();
    let patients=JSON.parse(localStorage.getItem("patients")||"[]");
    let html="";
    patients.filter(p=>p.name.toLowerCase().includes(val)||p.id.toLowerCase().includes(val))
            .forEach(p=>html+=`<li>${p.id} - ${p.name}</li>`);
    document.getElementById("adminList").innerHTML=html;
});


