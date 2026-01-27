/**
 * Chat Page JavaScript
 * Handles doctor-patient live chat functionality
 */

const API_BASE_URL = 'http://localhost:5000/api';
let currentUserId = null;
let currentDoctorId = null;

document.addEventListener('DOMContentLoaded', () => {
    setupChat();
    currentUserId = localStorage.getItem('user_id') || '1';
});

function setupChat() {
    const doctorCards = document.querySelectorAll('.doctor-card');
    
    doctorCards.forEach(card => {
        card.addEventListener('click', () => {
            selectDoctor(card);
        });
    });
}

function selectDoctor(cardElement) {
    // Remove previous selection
    document.querySelectorAll('.doctor-card').forEach(card => {
        card.style.backgroundColor = 'var(--bg-white)';
    });
    
    // Highlight selected doctor
    cardElement.style.backgroundColor = 'var(--light-blue)';
    
    const doctorName = cardElement.querySelector('h4').textContent;
    const status = cardElement.querySelector('.status').textContent;
    
    // Update chat header
    const chatHeader = document.querySelector('.chat-header');
    chatHeader.innerHTML = `
        <h3>${doctorName}</h3>
        <p>General Practitioner | ${status}</p>
    `;
    
    // Clear messages
    const messagesContainer = document.getElementById('messagesContainer');
    messagesContainer.innerHTML = `
        <div class="message doctor-message">
            <p>Hello! How can I help you today?</p>
            <span class="time">${new Date().toLocaleTimeString()}</span>
        </div>
    `;
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message) {
        alert('Please type a message');
        return;
    }
    
    // Add message to chat
    const messagesContainer = document.getElementById('messagesContainer');
    const messageElement = document.createElement('div');
    messageElement.className = 'message patient-message';
    messageElement.innerHTML = `
        <p>${message}</p>
        <span class="time">${new Date().toLocaleTimeString()}</span>
    `;
    messagesContainer.appendChild(messageElement);
    
    // Clear input
    messageInput.value = '';
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Simulate doctor response
    setTimeout(() => {
        const doctorResponse = document.createElement('div');
        doctorResponse.className = 'message doctor-message';
        doctorResponse.innerHTML = `
            <p>Thank you for your message. I'm reviewing your symptoms. Can you provide more details?</p>
            <span class="time">${new Date().toLocaleTimeString()}</span>
        `;
        messagesContainer.appendChild(doctorResponse);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1500);
}

// Enable sending message with Enter key
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.target.id === 'messageInput') {
        sendMessage();
    }
});
