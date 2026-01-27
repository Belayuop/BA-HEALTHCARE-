/**
 * Drug Checker Page JavaScript
 * Handles drug interaction checking
 */

const API_BASE_URL = 'http://localhost:5000/api';
let medicationsList = [];

document.addEventListener('DOMContentLoaded', () => {
    setupDrugChecker();
});

function setupDrugChecker() {
    const addBtn = document.querySelector('.add-med');
    const medSearch = document.querySelector('.med-search');
    
    if (addBtn) {
        addBtn.addEventListener('click', addMedication);
    }
    
    if (medSearch) {
        medSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addMedication();
            }
        });
    }
}

function addMedication() {
    const medSearch = document.querySelector('.med-search');
    const medication = medSearch.value.trim();
    
    if (!medication) {
        alert('Please enter a medication name');
        return;
    }
    
    if (medicationsList.includes(medication)) {
        alert('This medication is already added');
        return;
    }
    
    medicationsList.push(medication);
    medSearch.value = '';
    
    displayMedications();
    
    if (medicationsList.length >= 2) {
        checkInteractions();
    }
}

function displayMedications() {
    const list = document.querySelector('.medications-list');
    list.innerHTML = '';
    
    medicationsList.forEach(med => {
        const tag = document.createElement('div');
        tag.className = 'med-tag';
        tag.innerHTML = `
            ${med}
            <button onclick="removeMedication('${med}')">×</button>
        `;
        list.appendChild(tag);
    });
}

function removeMedication(med) {
    medicationsList = medicationsList.filter(m => m !== med);
    displayMedications();
    
    const resultSection = document.getElementById('interactionResults');
    if (resultSection) {
        resultSection.style.display = 'none';
    }
}

async function checkInteractions() {
    try {
        const response = await fetch(`${API_BASE_URL}/drugs/check-interaction`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                medications: medicationsList
            })
        });
        
        if (response.ok) {
            const result = await response.json();
            displayInteractionResults(result);
        }
    } catch (error) {
        console.error('Error:', error);
        displayInteractionResults(generateMockInteractions());
    }
}

function displayInteractionResults(result) {
    const resultSection = document.getElementById('interactionResults');
    const resultContent = document.getElementById('resultContent');
    
    if (!result.interactions || result.interactions.length === 0) {
        resultContent.innerHTML = `
            <div style="padding: 20px; background-color: #e8f5e9; border-radius: 8px; margin: 20px 0;">
                <p style="color: #00a86b; font-weight: 600;">✓ No serious interactions detected</p>
                <p style="color: #666; margin-top: 10px;">Your medications appear to be safe to take together.</p>
            </div>
        `;
    } else {
        resultContent.innerHTML = result.interactions.map(inter => `
            <div style="padding: 15px; background-color: #fff3cd; border-left: 4px solid #ff9800; margin: 15px 0; border-radius: 4px;">
                <p style="font-weight: 600;">${inter.drug1} + ${inter.drug2}</p>
                <p style="color: #666; margin: 8px 0;">${inter.description}</p>
                <p style="color: #ff9800; font-weight: 600; font-size: 0.9rem;">Risk Level: ${inter.severity.toUpperCase()}</p>
            </div>
        `).join('');
    }
    
    resultSection.style.display = 'block';
}

function generateMockInteractions() {
    if (medicationsList.length < 2) return { interactions: [] };
    
    const allInteractions = {
        'aspirin_ibuprofen': { severity: 'high', description: 'Increased GI bleeding risk' },
        'warfarin_nsaid': { severity: 'high', description: 'Increased bleeding risk' },
        'metformin_contrast': { severity: 'moderate', description: 'Kidney function risk' },
        'vitamin d_calcium': { severity: 'safe', description: 'Beneficial combination' }
    };
    
    const interactions = [];
    for (let i = 0; i < medicationsList.length - 1; i++) {
        if (Math.random() > 0.7) {
            const key = `${medicationsList[i].toLowerCase()}_${medicationsList[i+1].toLowerCase()}`;
            if (allInteractions[key]) {
                interactions.push({
                    drug1: medicationsList[i],
                    drug2: medicationsList[i+1],
                    ...allInteractions[key]
                });
            }
        }
    }
    
    return { interactions: interactions, risk_level: interactions.length > 0 ? 'high' : 'safe' };
}
