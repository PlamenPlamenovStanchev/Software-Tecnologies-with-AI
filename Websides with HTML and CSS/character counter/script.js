// Get DOM elements
const messageInput = document.getElementById('messageInput');
const charsUsedSpan = document.getElementById('charsUsed');
const charsLeftSpan = document.getElementById('charsLeft');
const charsLeftContainer = charsLeftSpan.parentElement;
const sendBtn = document.getElementById('sendBtn');
const messageForm = document.getElementById('messageForm');
const successMessage = document.getElementById('successMessage');

const MAX_CHARS = 200;

// Function to count characters excluding spaces
function countCharsWithoutSpaces(text) {
    return text.replace(/\s/g, '').length;
}

// Function to update the character counter
function updateCounter() {
    const inputText = messageInput.value;
    const charsWithoutSpaces = countCharsWithoutSpaces(inputText);
    const charsLeft = MAX_CHARS - charsWithoutSpaces;
    
    // Update character counts
    charsUsedSpan.textContent = charsWithoutSpaces;
    charsLeftSpan.textContent = charsLeft;
    
    // Update button state - enable only if there's text and characters left
    if (charsWithoutSpaces > 0 && charsLeft >= 0) {
        sendBtn.disabled = false;
    } else {
        sendBtn.disabled = true;
    }
    
    // Update counter color based on characters left
    charsLeftContainer.classList.remove('warning', 'danger');
    if (charsLeft <= 20 && charsLeft > 0) {
        charsLeftContainer.classList.add('warning');
    } else if (charsLeft <= 0) {
        charsLeftContainer.classList.add('danger');
    }
    
    // Limit input - prevent typing if limit reached
    if (charsWithoutSpaces > MAX_CHARS) {
        messageInput.value = removeExtraCharacters(inputText, MAX_CHARS);
        updateCounter(); // Recursively update to ensure correct display
    }
}

// Function to remove extra characters and preserve spaces
function removeExtraCharacters(text, limit) {
    let charCount = 0;
    let result = '';
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === ' ') {
            result += char;
        } else {
            if (charCount < limit) {
                result += char;
                charCount++;
            }
        }
    }
    
    return result;
}

// Function to handle form submission
function handleSubmit(e) {
    e.preventDefault();
    
    const inputText = messageInput.value;
    const charsWithoutSpaces = countCharsWithoutSpaces(inputText);
    
    if (charsWithoutSpaces > 0 && charsWithoutSpaces <= MAX_CHARS) {
        // Show success message
        successMessage.style.display = 'block';
        
        // Log the message (for demonstration)
        console.log('Message sent:', inputText);
        console.log('Characters (without spaces):', charsWithoutSpaces);
        
        // Reset form after 2 seconds
        setTimeout(() => {
            messageForm.reset();
            successMessage.style.display = 'none';
            updateCounter();
        }, 2000);
    }
}

// Event listeners
messageInput.addEventListener('input', updateCounter);
messageInput.addEventListener('keyup', updateCounter);
messageForm.addEventListener('submit', handleSubmit);

// Initialize counter on page load
updateCounter();
