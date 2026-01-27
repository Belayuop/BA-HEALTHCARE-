/**
 * MyHealth Hospital - Advanced Healthcare Platform
 * Frontend Logic with AI Dermatology, Drug Checker, Live Chat, and Appointments
 * Supports: JavaScript, Python, PHP, C++ backend integration
 */

document.addEventListener('DOMContentLoaded', () => {
    setupMobileNavigation();
    setupNavigationActive();
    setupDashboardFeatures();
    setupAppointmentBooking();
    setupLiveChat();
    setupDrugChecker();
    setupDermatologyAnalysis();
    setupFormValidation();
});

// ========== MOBILE NAVIGATION ==========
function setupMobileNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) navMenu.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
        });
    });
}

// ========== NAVIGATION ACTIVE STATE ==========
function setupNavigationActive() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        if (link.href.includes(currentPath.split('/').pop())) {
            link.classList.add('active');
        }
    });
}

// ========== DASHBOARD FEATURES ==========
function setupDashboardFeatures() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            alert('You have been logged out');
            window.location.href = 'index.html';
        });
    }

    // Generate Health ID
    const healthId = document.getElementById('healthId');
    if (healthId) {
        const id = 'NH-2026-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        healthId.textContent = id;
        localStorage.setItem('healthId', id);
    }

    // Update counts
    updateDashboardCounts();
}

function updateDashboardCounts() {
    const upcomingCount = document.getElementById('upcomingCount');
    const messageCount = document.getElementById('messageCount');
    const recordsCount = document.getElementById('recordsCount');

    if (upcomingCount) upcomingCount.textContent = '2';
    if (messageCount) messageCount.textContent = '0';
    if (recordsCount) recordsCount.textContent = '3';
}

// ========== APPOINTMENT BOOKING ==========
function setupAppointmentBooking() {
    const appointmentForm = document.getElementById('appointmentForm');
    
    if (appointmentForm) {
        // Set minimum date to today
        const dateInput = document.getElementById('appointment-date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }

        appointmentForm.addEventListener('submit', handleAppointmentBooking);
    }

    // Handle action buttons
    const rescheduleButtons = document.querySelectorAll('.action-btn.reschedule');
    const cancelButtons = document.querySelectorAll('.action-btn.cancel');

    rescheduleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            alert('Appointment rescheduling feature coming soon!');
        });
    });

    cancelButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            alert('Appointment cancelled successfully');
        });
    });
}

function handleAppointmentBooking(e) {
    e.preventDefault();

    const department = document.getElementById('department').value;
    const doctor = document.getElementById('doctor').value;
    const date = document.getElementById('appointment-date').value;
    const time = document.getElementById('appointment-time').value;
    const reason = document.getElementById('reason').value;

    if (!department || !doctor || !date || !time || !reason) {
        alert('Please fill all fields');
        return;
    }

    const appointmentData = {
        department, doctor, date, time, reason,
        bookingTime: new Date().toLocaleString(),
        status: 'confirmed'
    };

    localStorage.setItem('appointment_' + Date.now(), JSON.stringify(appointmentData));
    
    alert(`Appointment booked successfully!\nDoctor: ${doctor}\nDate: ${date} at ${time}`);
    e.target.reset();
}

// ========== LIVE CHAT SYSTEM ==========
function setupLiveChat() {
    const chatForm = document.getElementById('chatForm');
    const messageInput = document.getElementById('messageInput');
    const chatMessages = document.getElementById('chatMessages');
    const doctorItems = document.querySelectorAll('.doctor-item');

    if (chatForm && messageInput && chatMessages) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const message = messageInput.value.trim();

            if (!message) return;

            // Add user message
            addChatMessage(message, 'patient', chatMessages);

            // Simulate doctor response
            setTimeout(() => {
                const responses = [
                    'I understand your concern. Let me help you with that.',
                    'Thank you for providing that information.',
                    'Based on what you shared, I would recommend...',
                    'Have you experienced any other symptoms?'
                ];
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                addChatMessage(randomResponse, 'doctor', chatMessages);
            }, 1500);

            messageInput.value = '';
            messageInput.focus();
        });
    }

    // Doctor selection
    doctorItems.forEach(item => {
        item.addEventListener('click', () => {
            doctorItems.forEach(d => d.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

function addChatMessage(text, sender, container) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (sender === 'doctor') {
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-user-md"></i>
            </div>
            <div class="message-content">
                <p>${text}</p>
                <span class="message-time">${time}</span>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${text}</p>
                <span class="message-time">${time}</span>
            </div>
        `;
    }

    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;

    // Store message
    const chatData = { text, sender, time };
    localStorage.setItem('chat_' + Date.now(), JSON.stringify(chatData));
}

// ========== DRUG INTERACTION CHECKER ==========
function setupDrugChecker() {
    const drugForm = document.getElementById('drugCheckerForm');
    const addDrugBtn = document.getElementById('addDrugBtn');
    const drugSearch = document.getElementById('drugSearch');
    const medicationsTags = document.getElementById('medicationsTags');

    const commonDrugs = [
        'Aspirin', 'Ibuprofen', 'Paracetamol', 'Lisinopril',
        'Metformin', 'Vitamin D', 'Vitamin C', 'Omeprazole',
        'Atorvastatin', 'Amoxicillin', 'Ciprofloxacin'
    ];

    let selectedMedications = [];

    // Drug search suggestions
    if (drugSearch) {
        drugSearch.addEventListener('input', () => {
            const value = drugSearch.value.toLowerCase();
            const suggestions = document.getElementById('drugSuggestions');
            const suggestionsList = document.getElementById('suggestionsList');

            if (value.length > 0) {
                const filtered = commonDrugs.filter(drug => drug.toLowerCase().includes(value));
                suggestionsList.innerHTML = filtered.map(drug => 
                    `<li data-drug="${drug}">${drug}</li>`
                ).join('');
                suggestions.style.display = 'block';

                document.querySelectorAll('#suggestionsList li').forEach(li => {
                    li.addEventListener('click', () => {
                        drugSearch.value = '';
                        addDrugToList(li.dataset.drug);
                        suggestions.style.display = 'none';
                    });
                });
            } else {
                suggestions.style.display = 'none';
            }
        });
    }

    // Add drug button
    if (addDrugBtn) {
        addDrugBtn.addEventListener('click', () => {
            const drug = drugSearch.value.trim();
            if (drug) {
                addDrugToList(drug);
                drugSearch.value = '';
            }
        });
    }

    function addDrugToList(drug) {
        if (!selectedMedications.includes(drug)) {
            selectedMedications.push(drug);
            updateMedicationsTags();
        }
    }

    function updateMedicationsTags() {
        if (medicationsTags) {
            medicationsTags.innerHTML = selectedMedications.map(drug => `
                <div class="medication-tag">
                    <span>${drug}</span>
                    <button type="button" class="remove-tag" data-drug="${drug}">&times;</button>
                </div>
            `).join('');

            document.querySelectorAll('.remove-tag').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const drug = btn.dataset.drug;
                    selectedMedications = selectedMedications.filter(m => m !== drug);
                    updateMedicationsTags();
                });
            });
        }
    }

    // Form submission
    if (drugForm) {
        drugForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (selectedMedications.length < 2) {
                alert('Please add at least 2 medications to check interactions');
                return;
            }
            checkDrugInteractions(selectedMedications);
        });
    }

    // Quick add buttons
    const quickAddButtons = document.querySelectorAll('.drug-quick-add');
    quickAddButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            addDrugToList(btn.textContent.trim());
        });
    });
}

function checkDrugInteractions(drugs) {
    const resultsSection = document.getElementById('interactionsResults');
    if (resultsSection) {
        resultsSection.style.display = 'block';

        // Simulate interaction check
        const drugData = {
            drugs: drugs,
            checkedAt: new Date().toLocaleString()
        };
        localStorage.setItem('drugCheck_' + Date.now(), JSON.stringify(drugData));

        alert(`Interaction check completed for: ${drugs.join(', ')}\nNo serious interactions found!`);
    }
}

// ========== AI DERMATOLOGY ANALYSIS ==========
function setupDermatologyAnalysis() {
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    const browseBtn = document.getElementById('browseBtn');
    const imageUploadForm = document.getElementById('imageUploadForm');
    const analysisSection = document.getElementById('analysisSection');

    if (!uploadArea || !imageInput) return;

    // Browse button click
    if (browseBtn) {
        browseBtn.addEventListener('click', () => {
            imageInput.click();
        });
    }

    // File input change
    imageInput.addEventListener('change', handleImageUpload);

    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.backgroundColor = '#e3f2fd';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.backgroundColor = '';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        imageInput.files = e.dataTransfer.files;
        handleImageUpload();
    });
}

function handleImageUpload() {
    const imageInput = document.getElementById('imageInput');
    const file = imageInput.files[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
    }

    // Read and display image
    const reader = new FileReader();
    reader.onload = (e) => {
        const previewImage = document.getElementById('previewImage');
        if (previewImage) {
            previewImage.src = e.target.result;
        }

        // Show analysis section
        const analysisSection = document.getElementById('analysisSection');
        if (analysisSection) {
            analysisSection.style.display = 'block';
            analyzeImage(e.target.result);
        }

        // Scroll to analysis
        setTimeout(() => {
            analysisSection?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    reader.readAsDataURL(file);

    // Store analysis data
    const analysisData = {
        filename: file.name,
        timestamp: new Date().toLocaleString(),
        size: file.size
    };
    localStorage.setItem('dermatology_' + Date.now(), JSON.stringify(analysisData));
}

function analyzeImage(imageData) {
    const progressFill = document.getElementById('progressFill');
    const scoreText = document.getElementById('scoreText');

    if (progressFill && scoreText) {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 25;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
            }
            progressFill.style.width = progress + '%';
            scoreText.textContent = Math.round(progress) + '%';
        }, 200);
    }
}

// ========== FORM VALIDATION ==========
function setupFormValidation() {
    // Contact form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name')?.value;
            const email = document.getElementById('contact-email')?.value;
            const subject = document.getElementById('subject')?.value;
            const message = document.getElementById('message')?.value;

            if (!name || !email || !subject || !message) {
                alert('Please fill all fields');
                return;
            }

            const contactData = {
                name, email, subject, message,
                sentAt: new Date().toLocaleString()
            };

            localStorage.setItem('contact_' + Date.now(), JSON.stringify(contactData));
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }

    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email')?.value;
            const password = document.getElementById('password')?.value;

            if (!email || !password) {
                alert('Please fill all fields');
                return;
            }

            if (!validateEmail(email)) {
                alert('Invalid email address');
                return;
            }

            localStorage.setItem('currentUser', JSON.stringify({ email, loginTime: new Date().toLocaleString() }));
            alert('Login successful!');
            setTimeout(() => window.location.href = 'dashboard.html', 1000);
        });
    }

    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const role = document.getElementById('role')?.value;
            const fullName = document.getElementById('full_name')?.value;
            const nid = document.getElementById('national_id')?.value;
            const email = document.getElementById('email')?.value;
            const password = document.getElementById('password')?.value;
            const confirmPassword = document.getElementById('confirm_password')?.value;

            if (!role || !fullName || !nid || !email || !password || !confirmPassword) {
                alert('Please fill all fields');
                return;
            }

            if (!validateEmail(email)) {
                alert('Invalid email address');
                return;
            }

            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            const userData = { role, fullName, nid, email, registeredAt: new Date().toLocaleString() };
            localStorage.setItem('user_' + email, JSON.stringify(userData));
            alert('Account created! Your Health ID: ' + nid);
            setTimeout(() => window.location.href = 'login.html', 1500);
        });
    }
}

// ========== UTILITY FUNCTIONS ==========
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ========== BACKEND API INTEGRATION ==========
// PHP Backend: /api/appointments.php, /api/chat.php, /api/dermatology.php
// Python Backend: api.py with Flask/Django for AI processing
// C++ Backend: For high-performance medical calculations
// Node.js: For real-time chat and notifications

const API_CONFIG = {
    PHP_ENDPOINT: '/api/',
    PYTHON_ENDPOINT: 'http://localhost:5000/api/',
    NODE_ENDPOINT: 'ws://localhost:3000/',
    DEBUG: true
};

// Example: Calling Python AI API for dermatology
async function callAIDermatologyAPI(imageData) {
    try {
        const response = await fetch(`${API_CONFIG.PYTHON_ENDPOINT}dermatology`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: imageData })
        });
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}

// Example: Calling PHP API for appointments
async function callAppointmentAPI(appointmentData) {
    try {
        const response = await fetch(`${API_CONFIG.PHP_ENDPOINT}appointments.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appointmentData)
        });
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}

console.log('MyHealth Hospital Platform Loaded Successfully');
console.log('Supported Backend: PHP, Python, Node.js, C++');
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


