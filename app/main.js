import { BarretenbergBackend, BarretenbergVerifier as Verifier } from '@noir-lang/backend_barretenberg';
import { Noir } from '@noir-lang/noir_js';
import check_age from './circuits/check_age/target/check_age.json';
import check_country from './circuits/check_country/target/check_country.json';
import check_salary from './circuits/check_salary/target/check_salary.json';


const setup = async () => {
    await Promise.all([
        import('@noir-lang/noirc_abi').then((module) =>
            module.default(new URL('@noir-lang/noirc_abi/web/noirc_abi_wasm_bg.wasm', import.meta.url).toString()),
        ),
        import('@noir-lang/acvm_js').then((module) =>
            module.default(new URL('@noir-lang/acvm_js/web/acvm_js_bg.wasm', import.meta.url).toString()),
        ),
    ]);
};
  
function display(container, msg) {
    const c = document.getElementById(container);
    const logArea = c.querySelector('.log-area');
    const p = document.createElement('p');
    p.textContent = msg;
    logArea.appendChild(p);
}

function clearLogs(containerId, clearInput=false) {
    const container = document.getElementById(containerId);
    if (container) {
        const logArea = container.querySelector('.log-area');
        if (logArea) {
            logArea.innerHTML = '';
        }
        if (clearInput) {
            const inputArea = container.querySelector('.input-area');
            if (inputArea) {
                inputArea.innerHTML = '';
            }
        }
    }
}

function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

const deserializeProof = (proofString) => {
    const parsedProof = JSON.parse(proofString);

    const proofArray = Object.values(parsedProof.proof).map(Number);
    const proofUint8Array = new Uint8Array(proofArray);

    return {
      proof: proofUint8Array,
      publicInputs: parsedProof.publicInputs.map(String),
    };
};

function createCopyButton(container, textToCopy) {
    const button = document.createElement('button');
    button.textContent = 'Copy Proof';
    button.addEventListener('click', () => {
        navigator.clipboard.writeText(JSON.stringify(textToCopy)).then(() => {
            alert('Proof copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy proof: ', err);
        });
    });
    const c = document.getElementById(container);
    const logArea = c.querySelector('.log-area');
    logArea.appendChild(button);
}

function getCircuit(key) {
    switch (key) {
        case "age":
            return check_age;
        case "country":
            return check_country;
        case "salary":
            return check_salary;
        default:
            throw new Error("Invalid key for circuit");
    }
}

function getInputData(key, value) {
    switch (key) {
        case "age":
            const ageValue = Number(value);
            if (isNaN(ageValue)) {
                throw new Error("Invalid input for age; please enter a valid number.");
            }
            return { age: ageValue, threshold: 18 };
        case "country":
            const countryValue = Number(value);
            if (isNaN(countryValue)) {
                throw new Error("Invalid input for country; please enter a valid number.");
            }
            return { country: value, restricted_countries: [1, 33, 34, 44, 49] };
        case "salary":
            // Expect value to be a string like "1000,2000,3000"
            const valuesArray = value.split(',').map(Number);
            if (valuesArray.length !== 3 || valuesArray.some(isNaN)) {
                throw new Error("Invalid input for salary; please enter three numbers separated by commas.");
            }
            return { salary: valuesArray, threshold: 100 };
        default:
            throw new Error("Invalid key for input data");
    }
}

function createInputArea(key) {
    const proverDivId = key + '-prover';
    const keyCapitalized = capitalize(key);

    const inputArea = document.createElement('div');
    inputArea.className = 'input-area';
    
    const input = document.createElement('input');
    const inputId = "guess" + keyCapitalized;
    const placeholder = key === 'salary' ? "Enter three salaries separated by commas" : "Enter your " + key;
    input.id = inputId;
    input.type = 'text';
    input.placeholder = placeholder;
    input.style = key === 'salary' ? "width: 260px;" : "width: 130px;"

    const button = document.createElement('button');
    const buttonId = "submit" + keyCapitalized;
    const buttonText = "Submit " + keyCapitalized
    button.id = buttonId;
    button.textContent = buttonText;
    
    inputArea.appendChild(input);
    inputArea.appendChild(button);
    
    const proverContainer = document.getElementById(proverDivId);

    // Create a separate log area within the prover container
    const logArea = document.createElement('div');
    logArea.className = 'log-area';

    proverContainer.appendChild(inputArea);
    proverContainer.appendChild(logArea);
    
    button.addEventListener('click', () => {
        clearLogs(proverDivId);
        proveKeyCheck(key);
    });
}

function createVerifierInput(key, backend) {
    const keyCapitalized = capitalize(key);
    const verifierContainer = document.getElementById(key + '-verifier');

    clearLogs(key + '-verifier', true);

    let inputArea = verifierContainer.querySelector('.input-area');
    if (!inputArea) {
        inputArea = document.createElement('div');
        inputArea.className = 'input-area';
        verifierContainer.appendChild(inputArea);
    }

    // Create input element for proof
    const proofInput = document.createElement('input');
    const inputId = "enter" + keyCapitalized + "Proof";
    proofInput.id = inputId;
    proofInput.type = 'text';
    proofInput.placeholder = 'Enter proof';
    inputArea.appendChild(proofInput);

    // Create submit button for proof verification
    const verifyButton = document.createElement('button');
    verifyButton.textContent = 'Submit Proof';
    inputArea.appendChild(verifyButton);

    let logArea = verifierContainer.querySelector('.log-area');
    if (!logArea) {
        logArea = document.createElement('div');
        logArea.className = 'log-area';
        verifierContainer.appendChild(logArea);
    }

    // Add event listener to verify the proof
    verifyButton.addEventListener('click', async () => {
        clearLogs(key + '-verifier');
        verifyKeyCheck(key, backend);
    });
}

async function verifyKeyCheck(key, backend) {
    const keyCapitalized = capitalize(key);
    const inputId = "enter" + keyCapitalized + "Proof";
    const verifierDivId = key + '-verifier';

    clearLogs(verifierDivId);
    display(verifierDivId, '⌛ Verifying proof...');
    const proofValue = document.getElementById(inputId).value;
    try {
        const inputProof = deserializeProof(proofValue);
        const verificationKey = await backend.getVerificationKey();
        const verifier = new Verifier();
        const isValid = await verifier.verifyProof(inputProof, verificationKey);
        if (isValid) {
            display(verifierDivId, '✅ Proof verified');
        } else {
            display(verifierDivId, '❌ Proof invalid');
        }
    } catch (err) {
        console.error('Verification error:', err);
        display(verifierDivId, '❌ Verification failed');
    }
}

async function proveKeyCheck(key) {
    const proverDivId = key + '-prover';
    clearLogs(proverDivId);
    try {
        const circuit = getCircuit(key);
        const backend = new BarretenbergBackend(circuit);
        const noir = new Noir(circuit);

        const keyCapitalized = capitalize(key);
        const inputId = "guess" + keyCapitalized;

        const value = document.getElementById(inputId).value;
        const input = getInputData(key, value);

        await setup();

        display(proverDivId, '⌛ Generating proof...');
        const { witness } = await noir.execute(input);
        const proof = await backend.generateProof(witness);
        display(proverDivId, '✅ Proof generated');

        createCopyButton(proverDivId, proof);

        createVerifierInput(key, backend);
    } catch (err) {
        console.log(err);
        display(proverDivId, 'Oh 💔 Wrong guess');
    }
}

window.addEventListener('DOMContentLoaded', () => {
    ["age", "country", "salary"].forEach(createInputArea);
});