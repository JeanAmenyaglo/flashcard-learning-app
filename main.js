// Sample flashcards data
let flashcards = JSON.parse(localStorage.getItem('flashcards')) || [
    {
        term: "Jean Amenyaglo",
        description: "My name is Jean Amenyaglo. I am a student at NAIT studying software development and also doing a dual master's degree at the University of Ottawa. It has been a great experience so far!"
    },
    {
        term: "K'Yanna Rye Selinam Amenyaglo",
        description: "This is my beloved daughter; I affectionately call her 'Kiki'."
    }
];

// DOM elements
const termInput = document.getElementById('term');
const descriptionInput = document.getElementById('description');
const submitBtn = document.getElementById('submitBtn');
const clearBtn = document.getElementById('clearBtn');
const flashcardsContainer = document.getElementById('flashcardsContainer');
const studyCard = document.getElementById('studyCard');
const studyTerm = document.getElementById('studyTerm');
const studyDescription = document.getElementById('studyDescription');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const shuffleBtn = document.getElementById('shuffleBtn');

// Current card index for study mode
let currentCardIndex = 0;
let isFlipped = false;

// Save flashcards to localStorage
function saveFlashcards() {
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
}

// Initialize the app
function init() {
    renderFlashcards();
    updateStudyCard();
    
    // Event listeners
    submitBtn.addEventListener('click', addFlashcard);
    clearBtn.addEventListener('click', clearAllFlashcards);
    studyCard.addEventListener('click', flipCard);
    prevBtn.addEventListener('click', showPreviousCard);
    nextBtn.addEventListener('click', showNextCard);
    shuffleBtn.addEventListener('click', shuffleFlashcards);
    
    // Allow adding with Enter key
    termInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addFlashcard();
    });
    
    descriptionInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addFlashcard();
    });
}

// Render all flashcards
function renderFlashcards() {
    flashcardsContainer.innerHTML = '';
    
    if (flashcards.length === 0) {
        flashcardsContainer.innerHTML = `
            <div class="empty-state">
                <i>📝</i>
                <p>No flashcards yet. Create your first one!</p>
            </div>
        `;
        return;
    }
    
    flashcards.forEach((card, index) => {
        const flashcardElement = document.createElement('div');
        flashcardElement.className = 'flashcard';
        flashcardElement.innerHTML = `
            <div class="flashcard-term">${card.term}</div>
            <div class="flashcard-description">${card.description}</div>
            <div class="flashcard-actions">
                <button class="btn btn-small btn-danger" onclick="removeFlashcard(${index})">Remove</button>
            </div>
        `;
        flashcardsContainer.appendChild(flashcardElement);
    });
}

// Add a new flashcard
function addFlashcard() {
    const term = termInput.value.trim();
    const description = descriptionInput.value.trim();
    
    if (term === '' || description === '') {
        alert('Please enter both a term and a description');
        return;
    }
    
    flashcards.push({ term, description });
    saveFlashcards();
    renderFlashcards();
    updateStudyCard();
    
    // Clear inputs
    termInput.value = '';
    descriptionInput.value = '';
    termInput.focus();
}

// Remove a flashcard
function removeFlashcard(index) {
    if (confirm('Are you sure you want to remove this flashcard?')) {
        flashcards.splice(index, 1);
        saveFlashcards();
        renderFlashcards();
        
        // Adjust current card index if needed
        if (currentCardIndex >= flashcards.length) {
            currentCardIndex = Math.max(0, flashcards.length - 1);
        }
        
        updateStudyCard();
    }
}

// Clear all flashcards
function clearAllFlashcards() {
    if (flashcards.length === 0) return;
    
    if (confirm('Are you sure you want to remove all flashcards?')) {
        flashcards = [];
        saveFlashcards();
        currentCardIndex = 0;
        renderFlashcards();
        updateStudyCard();
    }
}

// Update study card with current flashcard
function updateStudyCard() {
    if (flashcards.length === 0) {
        studyTerm.textContent = 'No flashcards available';
        studyDescription.textContent = 'Add some flashcards to start studying';
        studyCard.classList.remove('flipped');
        return;
    }
    
    const currentCard = flashcards[currentCardIndex];
    studyTerm.textContent = currentCard.term;
    studyDescription.textContent = currentCard.description;
    
    // Reset to front side
    if (isFlipped) {
        studyCard.classList.remove('flipped');
        isFlipped = false;
    }
}

// Flip the study card
function flipCard() {
    if (flashcards.length === 0) return;
    
    studyCard.classList.toggle('flipped');
    isFlipped = !isFlipped;
}

// Show previous card
function showPreviousCard() {
    if (flashcards.length === 0) return;
    
    currentCardIndex = (currentCardIndex - 1 + flashcards.length) % flashcards.length;
    updateStudyCard();
}

// Show next card
function showNextCard() {
    if (flashcards.length === 0) return;
    
    currentCardIndex = (currentCardIndex + 1) % flashcards.length;
    updateStudyCard();
}

// Shuffle flashcards
function shuffleFlashcards() {
    if (flashcards.length === 0) return;
    
    // Fisher-Yates shuffle algorithm
    for (let i = flashcards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [flashcards[i], flashcards[j]] = [flashcards[j], flashcards[i]];
    }
    
    saveFlashcards();
    currentCardIndex = 0;
    renderFlashcards();
    updateStudyCard();
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);