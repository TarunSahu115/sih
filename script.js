// script.js
let triageCondition = "";
let transportMode = "";
let patientMode = "self"; 
let bystanderData = {};

// Tab Switching Logic
function switchTab(tabId, btn) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.remove('active');
        el.classList.remove('active-sos');
    });
    
    document.getElementById(tabId).classList.add('active');
    btn.classList.add('active');
    if(tabId === 'tab-sos') btn.classList.add('active-sos');
}

// SOS Workflow Logic
function nextSosStep(stepId) {
    document.querySelectorAll('#tab-sos > .card').forEach(el => el.style.display = 'none');
    document.getElementById(stepId).style.display = 'block';
}

function setPatientMode(mode) {
    patientMode = mode;
    if (mode === 'self') {
        nextSosStep('sos-2');
    } else {
        nextSosStep('sos-bystander-form');
    }
}

function proceedToConditionSelect() {
    bystanderData = {
        age: document.getElementById('b-age').value || 'Unknown',
        blood: document.getElementById('b-blood').value
    };
    nextSosStep('sos-2');
}

function selectCondition(condition) {
    triageCondition = condition;
    nextSosStep('sos-3');
}

function startDispatch(mode) {
    transportMode = mode;
    nextSosStep('sos-4');
    
    const log = document.getElementById('scan-log');
    log.innerHTML = `<p style="color:var(--accent-blue)">> Mode: ${patientMode === 'self' ? 'Self-Emergency' : 'Bystander Assistance'}</p>`;
    log.innerHTML += `<p style="color:var(--accent-blue)">> Triaging: ${triageCondition}</p>`;
    
    setTimeout(() => {
        log.innerHTML += `<p>> City General: Rejected (No ICU)</p>`;
    }, 1000);

    setTimeout(() => {
        log.innerHTML += `<p style="color:var(--accent-green)">> Metro Care: Matched (2 ICU Beds)</p>`;
    }, 2000);

    setTimeout(() => { 
        if(patientMode === 'bystander') {
            log.innerHTML += `<p style="color:var(--accent-amber)">> Transmitting Bystander Packet (Age: ${bystanderData.age}, Blood: ${bystanderData.blood})...</p>`;
        } else {
            log.innerHTML += `<p style="color:var(--accent-amber)">> Transmitting User Med-ID Packet...</p>`;
        }
    }, 3000);
    
    setTimeout(() => { 
        document.getElementById('final-trans').innerText = `${transportMode} Routing • Green Corridor Active`;
        document.getElementById('vehicle-emoji').innerText = transportMode === 'Ambulance' ? '🚑' : '🚗';
        
        if(patientMode === 'bystander') {
            document.getElementById('packet-title').innerText = "📡 Bystander Assist Packet Transmitted";
            document.getElementById('packet-desc').innerText = `Victim details (${bystanderData.age}, Blood: ${bystanderData.blood}) and live location sent to receiving ER.`;
        }

        nextSosStep('sos-5'); 
        
        // Animate vehicle traveling smoothly along map coordinates
        setTimeout(() => {
            document.getElementById('gps-progress-path').style.strokeDashoffset = '0';
            document.getElementById('vehicle-marker').style.transform = 'translate(370, 35)';
            
            // Update guidance dynamically mid-route
            setTimeout(() => {
                document.getElementById('turn-icon').innerText = "↗️";
                document.getElementById('turn-instruction').innerText = "Merge onto Hospital Expressway";
                document.getElementById('turn-distance').innerText = "In 200 meters";
                document.getElementById('hud-eta').innerText = "2 min";
                document.getElementById('hud-dist').innerText = "0.8 km";
            }, 2000);

        }, 500);
    }, 4500);
}