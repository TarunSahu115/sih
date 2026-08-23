

let triageCondition = "";
let transportMode = "";
let patientMode = "self";
let bystanderData = {};

/* =========================================
   TAB SWITCHING LOGIC
========================================= */

function switchTab(tabId, btn) {

    document
        .querySelectorAll('.tab-content')
        .forEach(el => el.classList.remove('active'));

    document
        .querySelectorAll('.nav-item')
        .forEach(el => {
            el.classList.remove('active');
            el.classList.remove('active-sos');
        });

    document
        .getElementById(tabId)
        .classList.add('active');

    btn.classList.add('active');

    if (tabId === 'tab-sos') {
        btn.classList.add('active-sos');
    }
}


/* =========================================
   SOS WORKFLOW LOGIC
========================================= */

function nextSosStep(stepId) {

    document
        .querySelectorAll('#tab-sos > .card')
        .forEach(el => {
            el.style.display = 'none';
        });

    document
        .getElementById(stepId)
        .style.display = 'block';
}


/* =========================================
   PATIENT MODE
========================================= */

function setPatientMode(mode) {

    patientMode = mode;

    if (mode === 'self') {

        nextSosStep('sos-2');

    } else {

        nextSosStep('sos-bystander-form');

    }
}


/* =========================================
   BYSTANDER DETAILS
========================================= */

function proceedToConditionSelect() {

    bystanderData = {

        age:
            document.getElementById('b-age').value ||
            'Unknown',

        blood:
            document.getElementById('b-blood').value

    };

    nextSosStep('sos-2');
}


/* =========================================
   EMERGENCY CONDITION
========================================= */

function selectCondition(condition) {

    triageCondition = condition;

    nextSosStep('sos-3');
}


/* =========================================
   START DISPATCH
========================================= */

function startDispatch(mode) {

    transportMode = mode;

    nextSosStep('sos-4');

    const log =
        document.getElementById('scan-log');

    log.innerHTML =
        `<p style="color:var(--accent-blue)">
            > Mode:
            ${
                patientMode === 'self'
                    ? 'Self-Emergency'
                    : 'Bystander Assistance'
            }
        </p>`;

    log.innerHTML +=
        `<p style="color:var(--accent-blue)">
            > Triaging: ${triageCondition}
        </p>`;


    /* City General */

    setTimeout(() => {

        log.innerHTML +=
            `<p>
                > City General: Rejected (No ICU)
            </p>`;

    }, 1000);


    /* Metro Care */

    setTimeout(() => {

        log.innerHTML +=
            `<p style="color:var(--accent-green)">
                > Metro Care: Matched (2 ICU Beds)
            </p>`;

    }, 2000);


    /* Patient Packet */

    setTimeout(() => {

        if (patientMode === 'bystander') {

            log.innerHTML +=
                `<p style="color:var(--accent-amber)">
                    > Transmitting Bystander Packet
                    (Age: ${bystanderData.age},
                    Blood: ${bystanderData.blood})...
                </p>`;

        } else {

            log.innerHTML +=
                `<p style="color:var(--accent-amber)">
                    > Transmitting User Med-ID Packet...
                </p>`;

        }

    }, 3000);


    /* Final Dispatch */

    setTimeout(() => {

        document
            .getElementById('final-trans')
            .innerText =
            `${transportMode} Routing • ETA: 6 Mins`;


        /* Vehicle */

        document
            .getElementById('vehicle-icon')
            .innerText =
            transportMode === 'Ambulance'
                ? '🚑'
                : '🚗';


        /* Bystander Packet */

        if (patientMode === 'bystander') {

            document
                .getElementById('packet-title')
                .innerText =
                "📡 Bystander Assist Packet Transmitted";

            document
                .getElementById('packet-desc')
                .innerText =
                `Victim details (${bystanderData.age},
                Blood: ${bystanderData.blood})
                and live location sent to receiving ER.`;

        }


        /* Show Final Screen */

        nextSosStep('sos-5');


        /* Animate Map */

        setTimeout(() => {

            document
                .getElementById('progress-bar')
                .style.width = '100%';

            document
                .getElementById('vehicle-icon')
                .style.left = '90%';

        }, 500);

    }, 4500);
}