/**
 * Dermatology AI Page JavaScript
 * Handles skin image analysis
 */

const API_BASE_URL = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {
    setupImageUpload();
});

// ========== IMAGE UPLOAD HANDLING ==========
function setupImageUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    
    if (!uploadArea) return;
    
    uploadArea.addEventListener('click', () => imageInput.click());
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#ff3333';
        uploadArea.style.backgroundColor = '#fff3f3';
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '#0066cc';
        uploadArea.style.backgroundColor = 'transparent';
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#0066cc';
        uploadArea.style.backgroundColor = 'transparent';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            processImage(files[0]);
        }
    });
    
    imageInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            processImage(e.target.files[0]);
        }
    });
}

function processImage(file) {
    if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const imageData = e.target.result;
        analyzeImage(imageData);
    };
    reader.readAsDataURL(file);
}

async function analyzeImage(imageData) {
    try {
        const userId = localStorage.getItem('user_id') || '1';
        
        const response = await fetch(`${API_BASE_URL}/ai/analyze-skin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image: imageData,
                user_id: userId
            })
        });
        
        if (response.ok) {
            const result = await response.json();
            displayAnalysisResults(result);
        } else {
            alert('Analysis failed. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        // Fallback for demonstration
        displayAnalysisResults(generateMockAnalysis());
    }
}

function displayAnalysisResults(result) {
    const uploadArea = document.getElementById('uploadArea');
    const resultSection = document.getElementById('resultSection');
    
    uploadArea.style.display = 'none';
    resultSection.style.display = 'block';
    
    document.getElementById('conditionType').textContent = result.condition;
    document.getElementById('severityLevel').textContent = result.severity;
    document.getElementById('recommendation').innerHTML = 
        result.recommendations.map(r => `• ${r}`).join('<br>');
}

function generateMockAnalysis() {
    const conditions = ['Acne', 'Eczema', 'Normal', 'Psoriasis', 'Moles', 'Rashes'];
    const severities = ['Low', 'Moderate', 'High'];
    
    return {
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        confidence: (Math.random() * 0.3 + 0.7).toFixed(2),
        severity: severities[Math.floor(Math.random() * severities.length)],
        recommendations: [
            'Consult with a dermatologist for detailed assessment',
            'Apply recommended skincare products',
            'Avoid potential irritants',
            'Maintain proper skin hygiene routine'
        ]
    };
}
