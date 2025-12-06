// Collapsible Sections
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

