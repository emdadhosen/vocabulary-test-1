// Firebase SDKs are removed, using localStorage for persistence.
debugger;
// your code here

        // --- Global Variables ---
        // No Firebase variables needed anymore.
        let quizSets = []; // This will hold all quiz sets loaded from localStorage

        // --- DOM Elements ---
        const loadingSpinner = document.getElementById('loadingSpinner');
        const quizApp = document.getElementById('quizApp'); // For MCQ
        const spellingQuizModal = document.getElementById('spellingQuizModal'); // For Spelling Quiz Modal
        const startScreen = document.getElementById('startScreen');
        const manageSetsScreen = document.getElementById('manageSetsScreen');
        const createEditSetScreen = document.getElementById('createEditSetScreen');
        const quizContent = document.getElementById('quizContent');
        const resultsContent = document.getElementById('resultsContent');
        const questionElement = document.getElementById('question');
        const optionsElement = document.getElementById('options');
        const prevButton = document.getElementById('prevButton');
        const nextButton = document.getElementById('nextButton');
        const submitButton = document.getElementById('submitButton');
        const manageSetsButton = document.getElementById('manageSetsButton');
        const createNewSetButton = document.getElementById('createNewSetButton');
        const restartButton = document.getElementById('restartButton');
        const scoreDisplay = document.getElementById('scoreDisplay');
        const totalQuestionsDisplay = document.getElementById('totalQuestionsDisplay');
        const timerDisplay = document.getElementById('timerDisplay'); // For MCQ timer
        const backToStartFromManage = document.getElementById('backToStartFromManage');
        const backToManageFromCreateEdit = document.getElementById('backToManageFromCreateEdit');

        // Elements for Create/Edit Set Screen
        const createEditSetTitle = document.getElementById('createEditSetTitle');
        const setNameInput = document.getElementById('setNameInput');
        const englishWordInput = document.getElementById('englishWordInput');
        const banglaWordInput = document.getElementById('banglaWordInput');
        const addWordPairButton = document.getElementById('addWordPairButton');
        const copyPasteInputButton = document.getElementById('copyPasteInputButton');
        const saveSetButton = document.getElementById('saveSetButton');
        const saveButtonHint = document.getElementById('saveButtonHint');
        const wordPairsListUl = document.getElementById('wordPairsListUl');
        const noWordPairsMessage = document.getElementById('noWordPairsMessage');

        // Elements for Manage Sets Screen
        const setsListUl = document.getElementById('setsListUl');
        const noSetsMessage = document.getElementById('noSetsMessage');

        // Custom Modal Elements
        const customModal = document.getElementById('customModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalMessage = document.getElementById('modalMessage');
        const modalInput = document.getElementById('modalInput');
        const modalConfirmBtn = document.getElementById('modalConfirmBtn');
        const modalCancelBtn = document.getElementById('modalCancelBtn');
        const modalCloseBtn = document.getElementById('modalCloseBtn');

        // Copy-Paste Modal Elements
        const copyPasteModal = document.getElementById('copyPasteModal');
        const englishPasteInput = document.getElementById('englishPasteInput');
        const banglaPasteInput = document = document.getElementById('banglaPasteInput');
        const processWordsButton = document.getElementById('processWordsButton');
        const closeCopyPasteModal = document.getElementById('closeCopyPasteModal');

        // Quiz Type Selection and Start Modal Elements (New)
        const quizTypeSelectionModal = document.getElementById('quizTypeSelectionModal');
        const quizTypeSelectDurationInput = document.getElementById('quizTypeSelectDurationInput');
        const startMCQQuizButton = document.getElementById('startMCQQuizButton');
        const startSpellingQuizButton = document.getElementById('startSpellingQuizButton');
        const cancelQuizTypeSelection = document.getElementById('cancelQuizTypeSelection');

        let quizSetToStartId = null; // To store the ID of the quiz set selected to start

        // Settings Modal Elements
        const settingsButton = document.getElementById('settingsButton');
        const settingsModal = document.getElementById('settingsModal');
        const correctAudioInput = document.getElementById('correctAudioInput');
        const incorrectAudioInput = document.getElementById('incorrectAudioInput');
        const correctAudioFileName = document.getElementById('correctAudioFileName');
        const incorrectAudioFileName = document.getElementById('incorrectAudioFileName');
        const saveSettingsButton = document.getElementById('saveSettingsButton');
        const closeSettingsModal = document.getElementById('closeSettingsModal');
        const themeToggleButton = document.getElementById('themeToggleButton');

        // Spelling Quiz Elements (now inside spellingQuizModal)
        const spellingTimerDisplay = document.getElementById('spellingTimerDisplay');
        const banglaMeaning = document.getElementById('banglaMeaning');
        const spellingInput = document.getElementById('spellingInput');
        const spellingPreview = document.getElementById('spellingPreview');
        const spellingQuitButton = document.getElementById('spellingQuitButton');
        const spellingResultsContent = document.getElementById('spellingResultsContent'); // This is still a full-screen element
        const spellingScoreDisplay = document.getElementById('spellingScoreDisplay');
        const spellingTotalQuestionsDisplay = document.getElementById('spellingTotalQuestionsDisplay');
        const spellingRestartButton = document.getElementById('spellingRestartButton');

        // New Spelling Review Elements
        const spellingReviewContent = document.getElementById('spellingReviewContent');
        const spellingMistakesListUl = document.getElementById('spellingMistakesListUl');
        const noSpellingMistakesMessage = document.getElementById('noSpellingMistakesMessage');
        const spellingReviewRestartButton = document.getElementById('spellingReviewRestartButton');

        // New Font Size Control Elements
        const mcqFontSizeSlider = document.getElementById('mcqFontSizeSlider');
        const mcqFontSizeValue = document.getElementById('mcqFontSizeValue');


        // Audio objects
        let correctAudio = new Audio();
        let incorrectAudio = new Audio();

        // Speech Synthesis for TTS
        const synth = window.speechSynthesis;
        let speechUtterance = new SpeechSynthesisUtterance();
        speechUtterance.lang = 'en-US'; // Default English language for pronunciation

        // --- Quiz State Variables ---
        let currentQuestionIndex = 0;
        let score = 0;
        let userAnswers = []; // To store user's selected answers for each question
        let timer;
        let timeLeft = 0;
        let activeQuizQuestions = []; // This will hold the generated quiz questions (English or Bangla questions)
        let currentQuizSetWords = []; // Temporary array for words when creating/editing a set
        let editingSetId = null; // Stores the ID of the set being edited (null for new set)
        let editingWordPairIndex = null; // New: To track which word pair is being edited

        // Spelling Quiz Specific State
        let spellingQuizWords = []; // All English words for the quiz (initial set)
        let currentRoundWords = []; // Words for the current spelling round
        let mistakesInCurrentRound = []; // Words misspelled in the current round (for iterative review)
        let spelledCorrectlyOverall = new Set(); // Unique words spelled correctly across all rounds (for final score)
        let currentSpellingQuestionIndex = 0; // Index for currentRoundWords
        let currentSpellingWord = ''; // Declared globally
        let currentSpellingBanglaMeaning = ''; // Declared globally
        let tempIncorrectPreviewChar = ''; // Holds the single incorrect character for preview
        let tempIncorrectPreviewTimeout = null; // Timeout for clearing tempIncorrectPreviewChar

        // MCQ Quiz Specific State
        let mcqQuizQuestions = []; // All questions for the MCQ quiz (initial set)
        let mcqCurrentRoundQuestions = []; // Questions for the current MCQ round
        let mcqMistakesInCurrentRound = []; // Questions answered incorrectly in the current MCQ round
        let mcqSpelledCorrectlyOverall = new Set(); // Unique questions answered correctly across all rounds (using question.question as identifier)
        let mcqCurrentQuestionIndex = 0; // Index for mcqCurrentRoundQuestions

        // Font size state
        let mcqQuestionFontSizePercentage = 10; // Default to 10% as per user request


        // --- Utility Functions ---

        // Show/Hide Loading Spinner
        function showLoadingSpinner() {
            loadingSpinner.classList.remove('hidden');
            quizApp.classList.add('hidden');
            spellingQuizModal.classList.add('hidden'); // Hide spelling quiz modal
            startScreen.classList.add('hidden');
            manageSetsScreen.classList.add('hidden');
            createEditSetScreen.classList.add('hidden');
            customModal.classList.add('hidden'); // Hide any open modals
            copyPasteModal.classList.add('hidden'); // Hide copy-paste modal
            quizTypeSelectionModal.classList.add('hidden'); // Hide quiz type selection modal
            settingsModal.classList.add('hidden'); // Hide settings modal
            spellingResultsContent.classList.add('hidden'); // Ensure spelling results are hidden
            spellingReviewContent.classList.add('hidden'); // Ensure spelling review content is hidden
        }

        function hideLoadingSpinner() {
            loadingSpinner.classList.add('hidden');
        }

        // Function to switch between screens
        function showScreen(screenId) {
            console.log("Showing screen:", screenId); // Log screen transitions
            // Hide all main screens first
            quizApp.classList.add('hidden');
            spellingQuizModal.classList.add('hidden');
            spellingResultsContent.classList.add('hidden'); // Ensure spelling results are hidden
            spellingReviewContent.classList.add('hidden'); // Ensure spelling review content is hidden
            startScreen.classList.add('hidden');
            manageSetsScreen.classList.add('hidden');
            createEditSetScreen.classList.add('hidden');
            resultsContent.classList.add('hidden'); // Ensure MCQ results are hidden

            // Hide all modals
            customModal.classList.add('hidden');
            copyPasteModal.classList.add('hidden');
            quizTypeSelectionModal.classList.add('hidden');
            settingsModal.classList.add('hidden');

            // Show the requested screen
            document.getElementById(screenId).classList.remove('hidden');
        }

        // Custom Modal Function (replaces alert/confirm)
        function showModal(title, message, type, inputPlaceholder = '', callback = null) {
            modalTitle.textContent = title;
            modalMessage.textContent = message;
            modalInput.classList.add('hidden'); // Hide input by default
            modalConfirmBtn.classList.add('hidden');
            modalCancelBtn.classList.add('hidden');
            modalCloseBtn.classList.add('hidden');

            if (type === 'alert') {
                modalCloseBtn.classList.remove('hidden');
            } else if (type === 'confirm') {
                modalConfirmBtn.classList.remove('hidden');
                modalCancelBtn.classList.remove('hidden');
            } else if (type === 'prompt') {
                modalInput.classList.remove('hidden');
                modalInput.value = ''; // Clear previous input
                modalInput.placeholder = inputPlaceholder;
                modalConfirmBtn.classList.remove('hidden');
                modalCancelBtn.classList.remove('hidden');
            }

            customModal.classList.remove('hidden');

            return new Promise((resolve) => {
                const confirmHandler = () => {
                    customModal.classList.add('hidden');
                    modalConfirmBtn.removeEventListener('click', confirmHandler);
                    modalCancelBtn.removeEventListener('click', cancelHandler);
                    modalCloseBtn.removeEventListener('click', closeHandler);
                    resolve(type === 'prompt' ? modalInput.value : true);
                    if (callback) callback(type === 'prompt' ? modalInput.value : true);
                };
                const cancelHandler = () => {
                    customModal.classList.add('hidden');
                    modalConfirmBtn.removeEventListener('click', confirmHandler);
                    modalCancelBtn.removeEventListener('click', cancelHandler);
                    modalCloseBtn.removeEventListener('click', closeHandler);
                    resolve(false);
                    if (callback) callback(false);
                };
                const closeHandler = () => {
                    customModal.classList.add('hidden');
                    modalConfirmBtn.removeEventListener('click', confirmHandler);
                    modalCancelBtn.removeEventListener('click', cancelHandler);
                    modalCloseBtn.removeEventListener('click', closeHandler);
                    resolve(true); // For alert, just resolve true on close
                    if (callback) callback(true);
                };

                modalConfirmBtn.addEventListener('click', confirmHandler);
                modalCancelBtn.addEventListener('click', cancelHandler);
                modalCloseBtn.addEventListener('click', closeHandler);
            });
        }

        // --- Local Storage Operations ---

        // Save quiz sets to localStorage
        function saveQuizSetsToLocalStorage() {
            try {
                localStorage.setItem('quizSets', JSON.stringify(quizSets));
                console.log("Quiz sets saved to localStorage.");
            } catch (e) {
                console.error("Error saving quiz sets to localStorage:", e);
                showModal("Error", "Could not save quiz sets to your browser's local storage. Please check browser settings.", "alert");
            }
        }

        // Load quiz sets from localStorage
        function loadQuizSetsFromLocalStorage() {
            try {
                const storedSets = localStorage.getItem('quizSets');
                if (storedSets) {
                    quizSets = JSON.parse(storedSets);
                    console.log("Quiz sets loaded from localStorage:", quizSets);
                } else {
                    quizSets = [];
                    console.log("No quiz sets found in localStorage. Starting with empty array.");
                }
                // Update the UI after loading
                updateQuizSetsListUI();
            } catch (e) {
                console.error("Error loading quiz sets from localStorage:", e);
                showModal("Error", "Could not load quiz sets from your browser's local storage. Data might be corrupted.", "alert");
                quizSets = []; // Reset to empty to prevent further errors
            }
        }

        // --- Create/Edit Set Screen Logic ---

        // Clear input fields and word pairs list
        function clearCreateEditForm() {
            setNameInput.value = '';
            englishWordInput.value = '';
            banglaWordInput.value = '';
            currentQuizSetWords = [];
            editingSetId = null;
            editingWordPairIndex = null; // Reset editing index
            addWordPairButton.textContent = "Add Word Pair"; // Reset button text
            updateWordPairsList();
            checkSaveSetButtonState();
            createEditSetTitle.textContent = "Create New Quiz Set";
        }

        // Add or Update a word pair to the temporary list
        function addWordPair() {
            const english = englishWordInput.value.trim();
            const bangla = banglaWordInput.value.trim();

            if (!english || !bangla) {
                showModal("Validation", "Both English and Bangla fields must be filled.", "alert");
                return;
            }

            if (editingWordPairIndex !== null) {
                // Update existing word pair
                currentQuizSetWords[editingWordPairIndex] = { english, bangla };
            } else {
                // Add new word pair
                currentQuizSetWords.push({ english, bangla });
            }

            englishWordInput.value = '';
            banglaWordInput.value = '';
            editingWordPairIndex = null; // Reset editing index
            addWordPairButton.textContent = "Add Word Pair"; // Reset button text
            updateWordPairsList();
            checkSaveSetButtonState();
            englishWordInput.focus(); // Focus back to English input after adding/updating
        }

        // Update the displayed list of word pairs
        function updateWordPairsList() {
            wordPairsListUl.innerHTML = '';
            if (currentQuizSetWords.length === 0) {
                noWordPairsMessage.classList.remove('hidden');
            } else {
                noWordPairsMessage.classList.add('hidden');
                currentQuizSetWords.forEach((pair, index) => {
                    const li = document.createElement('li');
                    li.className = 'flex flex-col sm:flex-row sm:items-center sm:justify-between';
                    li.innerHTML = `
                        <span class="flex-grow mr-4 cursor-pointer" data-index="${index}">
                            ${index + 1}. English: "${pair.english}" | Bangla: "${pair.bangla}"
                        </span>
                        <button class="remove-btn" data-index="${index}">Remove</button>
                    `;
                    wordPairsListUl.appendChild(li);
                });
                // Add event listeners for editing and removing
                document.querySelectorAll('.word-pairs-list li span').forEach(span => {
                    span.addEventListener('click', editWordPair);
                });
                document.querySelectorAll('.remove-btn').forEach(btn => {
                    btn.addEventListener('click', removeWordPair);
                });
            }
        }

        // Function to handle editing a word pair when its span is clicked
        function editWordPair(event) {
            const indexToEdit = parseInt(event.target.dataset.index);
            const pairToEdit = currentQuizSetWords[indexToEdit];

            englishWordInput.value = pairToEdit.english;
            banglaWordInput.value = pairToEdit.bangla;
            editingWordPairIndex = indexToEdit;
            addWordPairButton.textContent = "Update Word Pair";
            englishWordInput.focus();
        }


        // Remove a word pair from the temporary list
        function removeWordPair(event) {
            const indexToRemove = parseInt(event.target.dataset.index);
            currentQuizSetWords.splice(indexToRemove, 1);
            updateWordPairsList();
            checkSaveSetButtonState();
            // If the removed item was the one being edited, clear inputs and reset editing state
            if (editingWordPairIndex === indexToRemove) {
                englishWordInput.value = '';
                banglaWordInput.value = '';
                editingWordPairIndex = null;
                addWordPairButton.textContent = "Add Word Pair";
            }
            // Adjust editingWordPairIndex if items before it were removed
            if (editingWordPairIndex !== null && indexToRemove < editingWordPairIndex) {
                editingWordPairIndex--;
            }
        }

        // Check if the save button should be enabled
        function checkSaveSetButtonState() {
            const isNameEmpty = !setNameInput.value.trim();
            const isWordsEmpty = currentQuizSetWords.length === 0;

            if (isNameEmpty && isWordsEmpty) {
                saveSetButton.disabled = true;
                saveButtonHint.textContent = "Enter a set name and add words to save.";
                saveButtonHint.classList.remove('hidden');
            } else if (isNameEmpty) {
                saveSetButton.disabled = true;
                saveButtonHint.textContent = "Enter a set name.";
                saveButtonHint.classList.remove('hidden');
            } else if (isWordsEmpty) {
                saveSetButton.disabled = true;
                saveButtonHint.textContent = "Add at least one word pair.";
                saveButtonHint.classList.remove('hidden');
            } else {
                saveSetButton.disabled = false;
                saveButtonHint.textContent = ""; // Clear hint
                saveButtonHint.classList.add('hidden');
            }
        }

        // Save a quiz set to the global array and localStorage
        function saveQuizSet() {
            const setName = setNameInput.value.trim();

            if (!setName) {
                showModal("Validation", "Please enter a name for your quiz set.", "alert");
                return;
            }
            if (currentQuizSetWords.length === 0) {
                showModal("Validation", "Please add at least one word pair to the set.", "alert");
                return;
            }

            if (editingSetId) {
                // Update existing set
                const setIndex = quizSets.findIndex(set => set.id === editingSetId);
                if (setIndex !== -1) {
                    quizSets[setIndex] = { id: editingSetId, name: setName, words: currentQuizSetWords };
                    showModal("Success", `Quiz set "${setName}" updated successfully!`, "alert");
                }
            } else {
                // Add new set
                const newId = Date.now().toString(); // Simple unique ID
                quizSets.push({ id: newId, name: setName, words: currentQuizSetWords });
                showModal("Success", `Quiz set "${setName}" created successfully!`, "alert");
            }
            saveQuizSetsToLocalStorage(); // Save to localStorage
            updateQuizSetsListUI(); // <--- এই লাইনটি যোগ করা হয়েছে
            clearCreateEditForm();
            showScreen('manageSetsScreen'); // Go back to manage sets
        }

        // Update the displayed list of quiz sets (UI only)
        function updateQuizSetsListUI() {
            setsListUl.innerHTML = ''; // Clear current list
            if (quizSets.length === 0) {
                noSetsMessage.classList.remove('hidden');
            } else {
                noSetsMessage.classList.add('hidden');
                quizSets.forEach(set => {
                    const li = document.createElement('li');
                    li.className = 'flex flex-col sm:flex-row sm:items-center sm:justify-between';
                    li.innerHTML = `
                        <span class="text-lg font-medium text-gray-700 mb-2 sm:mb-0">${set.name} (${set.words.length} words)</span>
                        <div class="action-btns flex flex-wrap justify-center sm:justify-end gap-2">
                            <button class="start-btn" data-id="${set.id}">Start Quiz</button>
                            <button class="edit-btn" data-id="${set.id}">Edit</button>
                            <button class="rename-btn" data-id="${set.id}">Rename</button>
                            <button class="delete-btn" data-id="${set.id}">Delete</button>
                        </div>
                    `;
                    setsListUl.appendChild(li);
                });
            }
        }

        // Delete a quiz set
        async function deleteQuizSet(setId) {
            const confirmDelete = await showModal("Confirm Delete", "Are you sure you want to delete this quiz set? This action cannot be undone.", "confirm");
            if (!confirmDelete) return;

            quizSets = quizSets.filter(set => set.id !== setId);
            saveQuizSetsToLocalStorage(); // Save changes
            updateQuizSetsListUI(); // Update UI
            showModal("Success", "Quiz set deleted successfully!", "alert");
        }

        // Rename a quiz set
        async function renameQuizSet(setId, currentName) {
            const newName = await showModal("Rename Set", "Enter new name for the quiz set:", "prompt", currentName);
            if (newName === null || newName.trim() === '' || newName === currentName) {
                if (newName !== null && newName.trim() === '') {
                    showModal("Validation", "Set name cannot be empty.", "alert");
                }
                return;
            }

            const setIndex = quizSets.findIndex(set => set.id === setId);
            if (setIndex !== -1) {
                quizSets[setIndex].name = newName;
                saveQuizSetsToLocalStorage(); // Save changes
                updateQuizSetsListUI(); // Update UI
                showModal("Success", `Quiz set renamed to "${newName}"!`, "alert");
            }
        }

        // Handler for editing a quiz set
        function handleEditQuizSet(setId) {
            const set = quizSets.find(s => s.id === setId);
            if (set) {
                editingSetId = setId;
                setNameInput.value = set.name;
                currentQuizSetWords = JSON.parse(JSON.stringify(set.words)); // Deep copy to avoid direct modification
                createEditSetTitle.textContent = `Edit Quiz Set: ${set.name}`;
                updateWordPairsList();
                checkSaveSetButtonState();
                showScreen('createEditSetScreen');
            } else {
                showModal("Error", "Quiz set not found.", "alert");
            }
        }

        // --- Copy-Paste Input Logic ---
        function showCopyPasteModal() {
            englishPasteInput.value = ''; // Clear previous content
            banglaPasteInput.value = ''; // Clear previous content
            copyPasteModal.classList.remove('hidden');
        }

        async function processCopiedWords() {
            const englishLines = englishPasteInput.value.split('\n').map(line => line.trim()).filter(line => line !== '');
            const banglaLines = banglaPasteInput.value.split('\n').map(line => line.trim()).filter(line => line !== '');

            if (englishLines.length === 0 && banglaLines.length === 0) {
                showModal("No Words", "Please paste words into at least one of the boxes.", "alert");
                return;
            }

            if (englishLines.length !== banglaLines.length) {
                const confirmProceed = await showModal(
                    "Line Count Mismatch",
                    `English words count (${englishLines.length}) does not match Bangla words count (${banglaLines.length}). Proceeding will only add pairs up to the shorter list. Do you want to continue?`,
                    "confirm"
                );
                if (!confirmProceed) {
                    return;
                }
            }

            const numPairs = Math.min(englishLines.length, banglaLines.length);
            for (let i = 0; i < numPairs; i++) {
                currentQuizSetWords.push({ english: englishLines[i], bangla: banglaLines[i] });
            }

            updateWordPairsList();
            checkSaveSetButtonState();
            copyPasteModal.classList.add('hidden');
            showModal("Success", `${numPairs} word pairs added from copy-paste!`, "alert");
        }


        // --- Quiz Starting Logic (Common for MCQ and Spelling) ---
        async function handleQuizStartRequest(setId) {
            quizSetToStartId = setId;
            quizTypeSelectionModal.classList.remove('hidden');
            quizTypeSelectDurationInput.value = '2'; // Default to 2 minutes
            quizTypeSelectDurationInput.focus();
        }

        async function confirmAndStartQuiz(selectedQuizType) {
            const durationMinutes = parseInt(quizTypeSelectDurationInput.value, 10);
            if (isNaN(durationMinutes) || durationMinutes < 0) {
                showModal("Invalid Duration", "Please enter a valid number for the quiz duration (0 or greater).", "alert");
                return;
            }
            const durationSeconds = durationMinutes * 60; // Convert minutes to seconds

            quizTypeSelectionModal.classList.add('hidden'); // Hide the quiz type selection modal
            showLoadingSpinner();
            
            const selectedSet = quizSets.find(set => set.id === quizSetToStartId);

            if (!selectedSet || !selectedSet.words || selectedSet.words.length === 0) {
                showModal("Cannot Start", "This quiz set has no word pairs. Please add some first.", "alert");
                hideLoadingSpinner();
                return;
            }
            
            // Prepare questions for both types, then start the selected one
            prepareAllQuizQuestions(selectedSet.words);

            if (selectedQuizType === 'mcq') {
                startMCQQuiz(durationSeconds);
            } else if (selectedQuizType === 'spelling') {
                startSpellingQuiz(durationSeconds, selectedSet.words);
            }
            hideLoadingSpinner(); // Hide spinner after quiz starts
        }

        // Prepare all possible quiz questions (MCQ and Spelling) from word pairs
        function prepareAllQuizQuestions(wordPairs) {
            activeQuizQuestions = []; // Used for MCQ
            spellingQuizWords = []; // Used for Spelling

            wordPairs.forEach(pair => {
                // For MCQ: Create both English and Bangla questions
                activeQuizQuestions.push({
                    type: 'english',
                    question: pair.english,
                    correctAnswer: pair.bangla,
                    allWordsInSet: wordPairs // Pass the full set for option generation
                });
                activeQuizQuestions.push({
                    type: 'bangla',
                    question: pair.bangla,
                    correctAnswer: pair.english,
                    allWordsInSet: wordPairs // Pass the full set for option generation
                });

                // For Spelling: Only English words are needed
                spellingQuizWords.push({
                    english: pair.english,
                    bangla: pair.bangla
                });
            });
            // Shuffle the MCQ questions
            activeQuizQuestions.sort(() => Math.random() - 0.5);
            // Spelling words are shuffled at the start of each round
        }

        // --- MCQ Quiz Logic ---
        function startMCQQuiz(duration) {
            if (activeQuizQuestions.length === 0) {
                showModal("Error", "No questions available to start the MCQ quiz.", "alert");
                showScreen('manageSetsScreen');
                return;
            }
            showScreen('quizApp'); // Show MCQ app
            mcqQuizQuestions = activeQuizQuestions.slice(); // Store original set of MCQ questions
            mcqCurrentRoundQuestions = mcqQuizQuestions.slice().sort(() => Math.random() - 0.5); // Shuffle for first round
            mcqMistakesInCurrentRound = [];
            mcqSpelledCorrectlyOverall = new Set(); // Reset for new quiz session
            mcqCurrentQuestionIndex = 0;
            timeLeft = duration; // Use provided duration
            loadMCQQuestion();
            startMCQTimer();
        }

        function startMCQTimer() {
            if (timer) clearInterval(timer);
            updateMCQTimerDisplay();
            if (timeLeft > 0) {
                timer = setInterval(() => {
                    timeLeft--;
                    updateMCQTimerDisplay();
                    if (timeLeft <= 0) {
                        clearInterval(timer);
                        handleEndOfMCQRound(); // End round if time runs out
                    }
                }, 1000);
            } else {
                timerDisplay.textContent = "Time: No Limit";
            }
        }

        function updateMCQTimerDisplay() {
            if (timeLeft <= 0 && timer) {
                timerDisplay.textContent = "Time: 00:00";
                return;
            }
            if (timeLeft <= 0 && !timer) {
                 timerDisplay.textContent = "Time: No Limit";
                 return;
            }
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerDisplay.textContent = `Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }

        function loadMCQQuestion() {
            quizContent.classList.remove('hidden');
            resultsContent.classList.add('hidden');
            optionsElement.classList.remove('disabled');

            Array.from(optionsElement.children).forEach(button => {
                button.classList.remove('selected', 'correct', 'incorrect', 'glow-green', 'glow-red'); // Clear glow classes
            });

            if (mcqCurrentQuestionIndex >= mcqCurrentRoundQuestions.length) {
                handleEndOfMCQRound();
                return;
            }

            const questionData = mcqCurrentRoundQuestions[mcqCurrentQuestionIndex];
            questionElement.textContent = `${mcqCurrentQuestionIndex + 1}. ${questionData.question}`;
            optionsElement.innerHTML = '';

            const allPossibleOptions = mcqQuizQuestions.filter(q => q.type === questionData.type).map(q => q.correctAnswer);
            const incorrectOptions = allPossibleOptions.filter(opt => opt !== questionData.correctAnswer);

            const shuffledIncorrect = incorrectOptions.sort(() => Math.random() - 0.5);
            const selectedIncorrectOptions = shuffledIncorrect.slice(0, 3);

            let optionsToDisplay = [...selectedIncorrectOptions, questionData.correctAnswer];
            optionsToDisplay.sort(() => Math.random() - 0.5);

            optionsToDisplay.forEach((option) => {
                const button = document.createElement('button');
                button.textContent = option;
                button.classList.add('option-button', 'w-full');
                button.setAttribute('data-option', option);
                button.addEventListener('click', selectMCQOption);

                optionsElement.appendChild(button);
            });

            prevButton.classList.add('hidden');
            nextButton.classList.add('hidden');
            submitButton.classList.add('hidden');
        }

        function selectMCQOption(event) {
            const selectedButton = event.target;
            const selectedAnswer = selectedButton.getAttribute('data-option');
            const questionData = mcqCurrentRoundQuestions[mcqCurrentQuestionIndex];
            const correctAnswer = questionData.correctAnswer;

            optionsElement.classList.add('disabled'); // Disable options after selection

            if (selectedAnswer === correctAnswer) {
                if (correctAudio.src) correctAudio.play().catch(e => console.error("Error playing correct audio:", e));
                selectedButton.classList.add('correct', 'glow-green'); // Add glow
                mcqSpelledCorrectlyOverall.add(questionData.question); // Mark original question as correct
            } else {
                if (incorrectAudio.src) incorrectAudio.play().catch(e => console.error("Error playing incorrect audio:", e));
                selectedButton.classList.add('incorrect', 'glow-red'); // Add glow
                // Add to mistakes for review in next round, but only if not already added
                if (!mcqMistakesInCurrentRound.some(q => q.question === questionData.question && q.type === questionData.type)) {
                    mcqMistakesInCurrentRound.push(questionData);
                }
                // Also highlight the correct answer
                Array.from(optionsElement.children).forEach(button => {
                    if (button.getAttribute('data-option') === correctAnswer) {
                        button.classList.add('correct');
                    }
                });
            }

            setTimeout(() => {
                mcqCurrentQuestionIndex++;
                loadMCQQuestion();
            }, 1000); // 1 second delay before next question
        }

        function handleEndOfMCQRound() {
            clearInterval(timer); // Stop timer for the current round

            if (mcqMistakesInCurrentRound.length === 0) {
                // All words are correctly spelled (or no mistakes were made)
                showMCQResults();
            } else {
                // There are mistakes, prepare for a new review round
                mcqCurrentRoundQuestions = mcqMistakesInCurrentRound.slice().sort(() => Math.random() - 0.5); // Shuffle mistakes for next round
                mcqMistakesInCurrentRound = []; // Reset mistakes for the new round
                mcqCurrentQuestionIndex = 0; // Reset index for the new round

                showModal("Review Round", `You made mistakes on ${mcqCurrentRoundQuestions.length} questions. Let's review them!`, "alert", '', () => {
                    timeLeft = parseInt(quizTypeSelectDurationInput.value, 10) * 60; // Reset timer for review round
                    loadMCQQuestion();
                    startMCQTimer();
                });
            }
        }

        function showMCQResults() {
            clearInterval(timer);
            quizContent.classList.add('hidden');
            resultsContent.classList.remove('hidden');
            scoreDisplay.textContent = mcqSpelledCorrectlyOverall.size; // Total unique words correct
            totalQuestionsDisplay.textContent = mcqQuizQuestions.length / 2; // Each word pair creates 2 questions, so divide by 2 for unique word pairs
        }


        // --- Spelling Quiz Logic ---

        function startSpellingQuiz(duration, words) {
            console.log("Starting Spelling Quiz with words:", words.map(w => w.english)); // Log start
            spellingQuizWords = words.slice(); // Copy original words
            currentRoundWords = words.slice().sort(() => Math.random() - 0.5); // Shuffle for first round
            mistakesInCurrentRound = []; // Reset for new quiz session
            spelledCorrectlyOverall = new Set(); // Reset for new quiz session
            currentSpellingQuestionIndex = 0;

            showScreen('spellingQuizModal'); // Show spelling quiz modal
            spellingInput.value = '';
            spellingPreview.textContent = '';
            spellingInput.focus();
            timeLeft = duration; // Use provided duration
            loadNextSpellingQuestion();
            startSpellingTimer();
        }

        function startSpellingTimer() {
            if (timer) clearInterval(timer);
            updateSpellingTimerDisplay();
            if (timeLeft > 0) {
                timer = setInterval(() => {
                    timeLeft--;
                    updateSpellingTimerDisplay();
                    if (timeLeft <= 0) {
                        clearInterval(timer);
                        handleEndOfSpellingRound(); // End round if time runs out
                    }
                }, 1000);
            } else {
                spellingTimerDisplay.textContent = "Time: No Limit";
            }
        }

        function updateSpellingTimerDisplay() {
            if (timeLeft <= 0 && timer) {
                spellingTimerDisplay.textContent = "Time: 00:00";
                return;
            }
            if (timeLeft <= 0 && !timer) {
                spellingTimerDisplay.textContent = "Time: No Limit";
                return;
            }
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            spellingTimerDisplay.textContent = `Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }

        function loadNextSpellingQuestion() {
            spellingInput.classList.remove('glow-green', 'glow-red'); // Clear glow
            spellingInput.value = '';
            tempIncorrectPreviewChar = ''; // Clear temporary incorrect char
            if (tempIncorrectPreviewTimeout) {
                clearTimeout(tempIncorrectPreviewTimeout);
                tempIncorrectPreviewTimeout = null;
            }
            updateSpellingPreviewDisplay(); // Ensure preview is clear and updated

            if (currentSpellingQuestionIndex >= currentRoundWords.length) {
                console.log("End of current spelling round, calling handleEndOfSpellingRound."); // Log end of round
                handleEndOfSpellingRound();
                return;
            }

            const currentPair = currentRoundWords[currentSpellingQuestionIndex];
            currentSpellingWord = currentPair.english;
            currentSpellingBanglaMeaning = currentPair.bangla;

            banglaMeaning.textContent = currentSpellingBanglaMeaning;
            speakWord(currentSpellingWord); // Utter the English word
            console.log("Loading spelling question:", currentSpellingQuestionIndex + 1, "of", currentRoundWords.length, "Word:", currentSpellingWord); // Log current word

            spellingInput.focus();
        }

        function speakWord(word) {
            if (synth.speaking) {
                synth.cancel(); // Stop any ongoing speech
            }
            speechUtterance.text = word;
            synth.speak(speechUtterance);
        }

        // New function to handle spellingPreview updates
        function updateSpellingPreviewDisplay() {
            const currentInputValue = spellingInput.value;
            
            let displayContent = '';
            
            // Build the preview string with correct characters
            for (let i = 0; i < currentInputValue.length; i++) {
                displayContent += `<span class="preview-correct">${currentInputValue[i]}</span>`;
            }

            // Append the temporary incorrect character if it's there
            if (tempIncorrectPreviewChar) {
                displayContent += `<span class="preview-incorrect">${tempIncorrectPreviewChar}</span>`;
            }

            spellingPreview.innerHTML = displayContent;
        }


        // Listener for live preview as user types
        spellingInput.addEventListener('input', () => {
            // This event fires when spellingInput.value changes (i.e., a correct character was typed)
            updateSpellingPreviewDisplay();
            // Remove glow from input box here, as it's only for full word correct or single char incorrect
            spellingInput.classList.remove('glow-green', 'glow-red');

            // Check if the entire word has been correctly typed
            if (spellingInput.value.toLowerCase() === currentSpellingWord.toLowerCase()) {
                handleSpellingSubmission(); // Automatically submit if word is complete and correct
            }
        });


        // Listener for submitting the spelling word and preventing wrong input
        spellingInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevent new line in input
                // If Enter is pressed, submit the current state of the input
                handleSpellingSubmission(); 
            } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) { // Only process single character inputs, not control keys
                const typedChar = event.key; // Keep original case for display
                const currentTypedValue = spellingInput.value; // Get current value before prevention
                
                // Ensure we don't go out of bounds for currentSpellingWord
                if (currentTypedValue.length >= currentSpellingWord.length) {
                    event.preventDefault(); // Prevent typing beyond the correct word length
                    if (incorrectAudio.src) incorrectAudio.play().catch(e => console.error("Error playing incorrect audio:", e));
                    spellingInput.classList.add('glow-red');
                    setTimeout(() => spellingInput.classList.remove('glow-red'), 500);
                    return; // Stop processing further for this keydown
                }

                const expectedChar = currentSpellingWord[currentTypedValue.length]; // Get expected char

                if (typedChar.toLowerCase() !== expectedChar.toLowerCase()) {
                    event.preventDefault(); // Prevent the incorrect character from appearing in the input box
                    if (incorrectAudio.src) incorrectAudio.play().catch(e => console.error("Error playing incorrect audio:", e));
                    spellingInput.classList.add('glow-red');
                    spellingInput.classList.remove('glow-green'); // Ensure green is removed if it was there
                    setTimeout(() => spellingInput.classList.remove('glow-red'), 500);

                    // Show the incorrect character in the preview temporarily
                    tempIncorrectPreviewChar = typedChar;
                    updateSpellingPreviewDisplay(); // Call new function to update preview

                    // Clear previous timeout if any
                    if (tempIncorrectPreviewTimeout) {
                        clearTimeout(tempIncorrectPreviewTimeout);
                    }
                    tempIncorrectPreviewTimeout = setTimeout(() => {
                        tempIncorrectPreviewChar = ''; // Clear the temporary char
                        updateSpellingPreviewDisplay(); // Update preview to remove it
                    }, 500); // Disappear after 0.5 seconds
                } else {
                    // Correct character typed - no audio here, audio only on full word correct
                    // The 'input' event will handle updating spellingInput.value and spellingPreview.textContent
                    // and setting the 'preview-correct' class.
                }
            }
        });


        function handleSpellingSubmission() {
            const userAnswer = spellingInput.value.trim();
            const correctEnglishWord = currentSpellingWord;
            const currentPair = currentRoundWords[currentSpellingQuestionIndex];

            // Disable input temporarily to prevent further typing during feedback
            spellingInput.disabled = true;

            let delay = 1500; // Default delay for incorrect answers

            if (userAnswer.toLowerCase() === correctEnglishWord.toLowerCase()) {
                // Whole word is correctly spelled
                if (correctAudio.src) correctAudio.play().catch(e => console.error("Error playing correct audio:", e)); // Play correct audio once
                spelledCorrectlyOverall.add(currentPair.english); // Mark as correctly spelled
                spellingInput.classList.add('glow-green'); // Apply green glow to input box
                delay = 500; // Short delay for correct answers
            } else {
                // User submitted an incomplete or incorrect word (e.g., by pressing Enter early)
                console.log("Mistake made:", currentPair.english, "User typed:", userAnswer); // Log mistake
                if (incorrectAudio.src) incorrectAudio.play().catch(e => console.error("Error playing incorrect audio:", e));
                spellingInput.classList.add('glow-red'); // Apply red glow to input box
                // Add to mistakes for review in next round, but only if not already added
                if (!mistakesInCurrentRound.some(pair => pair.english === currentPair.english)) {
                    mistakesInCurrentRound.push(currentPair);
                }
                // Show correct answer briefly in preview
                spellingPreview.innerHTML = `<span class="preview-incorrect">Correct: "${currentSpellingWord}"</span>`;
                spellingPreview.classList.remove('preview-correct'); // Ensure it's not green
                spellingPreview.classList.add('preview-incorrect'); // Ensure it's red
            }

            // Advance to next word after a delay
            setTimeout(() => {
                spellingInput.disabled = false; // Re-enable input
                spellingInput.classList.remove('glow-green', 'glow-red'); // Remove glow after delay
                spellingPreview.classList.remove('preview-correct', 'preview-incorrect'); // Clear preview styles
                spellingPreview.innerHTML = ''; // Clear preview content
                spellingInput.value = ''; // Clear input field for next word

                currentSpellingQuestionIndex++;
                loadNextSpellingQuestion();
            }, delay); // Use dynamic delay
        }


        function handleEndOfSpellingRound() {
            clearInterval(timer); // Stop timer for the current round
            console.log("End of spelling round. Mistakes count:", mistakesInCurrentRound.length); // Log end of round

            if (mistakesInCurrentRound.length === 0) {
                // All words in the current round (including review rounds) were correct
                console.log("No mistakes in current round, checking overall correctness.");
                showSpellingResults(); // This will decide whether to show final score or mistake summary
            } else {
                // There are mistakes in the current round, prepare for a new review round
                currentRoundWords = mistakesInCurrentRound.slice().sort(() => Math.random() - 0.5); // Shuffle mistakes for next round
                mistakesInCurrentRound = []; // Reset mistakes for the new round
                currentSpellingQuestionIndex = 0; // Reset index for the new round
                console.log("Starting review round with words:", currentRoundWords.map(p => p.english)); // Log review words

                showModal("Review Round", `You made mistakes on ${currentRoundWords.length} words. Let's review them!`, "alert", '', () => {
                    timeLeft = parseInt(quizTypeSelectDurationInput.value, 10) * 60; // Reset timer for review round
                    loadNextSpellingQuestion();
                    startSpellingTimer();
                });
            }
        }

        function showSpellingResults() {
            clearInterval(timer);
            spellingQuizModal.classList.add('hidden');
            // Check if there are any words that were NOT spelled correctly overall
            if (spelledCorrectlyOverall.size < spellingQuizWords.length) {
                showSpellingMistakesSummary(); // Show the summary of all missed words
            } else {
                showScreen('spellingResultsContent'); // Show final score if all correct
                spellingScoreDisplay.textContent = spelledCorrectlyOverall.size;
                spellingTotalQuestionsDisplay.textContent = spellingQuizWords.length;
            }
            console.log("Showing spelling results. Correct words:", spelledCorrectlyOverall.size, "Total words:", spellingQuizWords.length);
        }

        function showSpellingMistakesSummary() {
            showScreen('spellingReviewContent'); // Show the dedicated review screen
            spellingMistakesListUl.innerHTML = ''; // Clear previous list
            noSpellingMistakesMessage.classList.add('hidden'); // Hide "no mistakes" message by default

            const missedWords = spellingQuizWords.filter(pair => !spelledCorrectlyOverall.has(pair.english));
            console.log("Missed words for summary:", missedWords.map(w => w.english));

            if (missedWords.length === 0) {
                noSpellingMistakesMessage.classList.remove('hidden');
            } else {
                missedWords.forEach(pair => {
                    const li = document.createElement('li');
                    li.className = 'bg-red-100 dark:bg-red-800 border border-red-300 dark:border-red-700 rounded-lg p-3 mb-2 flex flex-col sm:flex-row sm:justify-between sm:items-center';
                    li.innerHTML = `
                        <span class="text-red-800 dark:text-red-200 font-semibold">${pair.bangla}</span>
                        <span class="text-red-600 dark:text-red-400 mt-1 sm:mt-0 sm:ml-4">Correct: "${pair.english}"</span>
                    `;
                    spellingMistakesListUl.appendChild(li);
                });
            }
        }


        // --- Settings Logic ---
        function showSettingsModal() {
            settingsModal.classList.remove('hidden');
            // Update file names in UI if audio is loaded
            correctAudioFileName.textContent = correctAudio.src && correctAudio.src !== 'null' ? "Loaded" : "None";
            incorrectAudioFileName.textContent = incorrectAudio.src && incorrectAudio.src !== 'null' ? "Loaded" : "None";
            
            // Update font size slider and value display
            mcqFontSizeSlider.value = mcqQuestionFontSizePercentage;
            mcqFontSizeValue.textContent = `${mcqQuestionFontSizePercentage}%`;
        }

        function saveSettings() {
            // Save audio data URLs to localStorage
            localStorage.setItem('correctAudio', correctAudio.src);
            localStorage.setItem('incorrectAudio', incorrectAudio.src);
            // Save font size percentage
            localStorage.setItem('mcqQuestionFontSizePercentage', mcqQuestionFontSizePercentage.toString());
            // Save theme preference
            localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');


            showModal("Settings Saved", "Your settings have been saved!", "alert");
            settingsModal.classList.add('hidden');
        }

        function loadSettings() {
            const savedCorrectAudio = localStorage.getItem('correctAudio');
            const savedIncorrectAudio = localStorage.getItem('incorrectAudio');
            const savedFontSize = localStorage.getItem('mcqQuestionFontSizePercentage');
            const savedTheme = localStorage.getItem('theme');

            if (savedCorrectAudio && savedCorrectAudio !== 'null') {
                correctAudio.src = savedCorrectAudio;
                correctAudioFileName.textContent = "Loaded";
            } else {
                correctAudio.src = ''; // Ensure it's empty if not set
                correctAudioFileName.textContent = "None";
            }

            if (savedIncorrectAudio && savedIncorrectAudio !== 'null') {
                incorrectAudio.src = savedIncorrectAudio;
                incorrectAudioFileName.textContent = "Loaded";
            } else {
                incorrectAudio.src = ''; // Ensure it's empty if not set
                incorrectAudioFileName.textContent = "None";
            }

            if (savedFontSize) {
                mcqQuestionFontSizePercentage = parseInt(savedFontSize, 10);
            } else {
                mcqQuestionFontSizePercentage = 10; // Default if not saved
            }
            applyMCQFontSize(); // Apply loaded or default font size

            // Load theme preference
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
        }

        function handleAudioFileInput(event, audioObject, fileNameElement) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    audioObject.src = e.target.result;
                    fileNameElement.textContent = file.name;
                };
                reader.onerror = (e) => {
                    console.error("Error reading file:", e);
                    showModal("File Error", "Could not read audio file.", "alert");
                    fileNameElement.textContent = "Error loading file";
                };
                reader.readAsDataURL(file);
            } else {
                audioObject.src = ''; // Clear source if no file selected
                fileNameElement.textContent = "None";
            }
        }

        function toggleTheme() {
            document.body.classList.toggle('dark-mode');
            const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
            localStorage.setItem('theme', currentTheme);
        }

        // Function to map slider percentage to rem value for MCQ question font size
        function getRemFromPercentage(percentage) {
            // Map 1% to 0.8rem, 100% to 3.0rem
            const minRem = 0.8;
            const maxRem = 3.0;
            const minSlider = 1;
            const maxSlider = 100;
            return minRem + ((percentage - minSlider) / (maxSlider - minSlider)) * (maxRem - minRem);
        }

        // Function to apply MCQ font size
        function applyMCQFontSize() {
            const remValue = getRemFromPercentage(mcqQuestionFontSizePercentage);
            document.documentElement.style.setProperty('--mcq-question-font-size', `${remValue}rem`);
            mcqFontSizeValue.textContent = `${mcqQuestionFontSizePercentage}%`;
        }


        // --- Event Listeners ---
        manageSetsButton.addEventListener('click', () => showScreen('manageSetsScreen'));
        createNewSetButton.addEventListener('click', () => {
            clearCreateEditForm();
            showScreen('createEditSetScreen');
        });
        backToStartFromManage.addEventListener('click', () => showScreen('startScreen'));
        backToManageFromCreateEdit.addEventListener('click', () => {
            updateQuizSetsListUI(); // Refresh list when returning to manage screen
            showScreen('manageSetsScreen');
        });

        setNameInput.addEventListener('input', checkSaveSetButtonState);
        addWordPairButton.addEventListener('click', addWordPair);
        copyPasteInputButton.addEventListener('click', showCopyPasteModal);
        saveSetButton.addEventListener('click', saveQuizSet);

        // Quiz Type Selection Modal Buttons
        startMCQQuizButton.addEventListener('click', () => confirmAndStartQuiz('mcq'));
        startSpellingQuizButton.addEventListener('click', () => confirmAndStartQuiz('spelling'));
        cancelQuizTypeSelection.addEventListener('click', () => quizTypeSelectionModal.classList.add('hidden'));

        // Settings Buttons
        settingsButton.addEventListener('click', showSettingsModal);
        saveSettingsButton.addEventListener('click', saveSettings);
        closeSettingsModal.addEventListener('click', () => settingsModal.classList.add('hidden'));
        correctAudioInput.addEventListener('change', (event) => handleAudioFileInput(event, correctAudio, correctAudioFileName));
        incorrectAudioInput.addEventListener('change', (event) => handleAudioFileInput(event, incorrectAudio, incorrectAudioFileName));
        themeToggleButton.addEventListener('click', toggleTheme);
        mcqFontSizeSlider.addEventListener('input', (event) => {
            mcqQuestionFontSizePercentage = parseInt(event.target.value, 10);
            applyMCQFontSize();
        });


        // MCQ Navigation buttons (still present but hidden by default due to auto-advance)
        submitButton.addEventListener('click', showMCQResults);
        restartButton.addEventListener('click', () => showScreen('startScreen'));

        // Spelling Quiz Buttons
        spellingQuitButton.addEventListener('click', () => {
            clearInterval(timer);
            spellingQuizModal.classList.add('hidden'); // Hide the spelling quiz modal
            showScreen('startScreen'); // Go back to start screen
        });
        spellingRestartButton.addEventListener('click', () => showScreen('startScreen'));
        spellingReviewRestartButton.addEventListener('click', () => showScreen('startScreen')); // New button for review screen


        // Global keydown listener for Spelling Quiz repeat word
        document.addEventListener('keydown', (event) => {
            // Check if spelling quiz modal is visible and a word is loaded
            if ((event.ctrlKey || event.metaKey) && !spellingQuizModal.classList.contains('hidden') && currentSpellingWord) {
                event.preventDefault(); // Prevent browser default for Ctrl key
                speakWord(currentSpellingWord);
            }
        });


        // Event delegation for quiz set action buttons on setsListUl
        setsListUl.addEventListener('click', (event) => {
            const target = event.target;
            const setId = target.dataset.id;

            if (!setId) return;

            if (target.classList.contains('start-btn')) { // This button now triggers the selection modal
                handleQuizStartRequest(setId);
            } else if (target.classList.contains('edit-btn')) {
                handleEditQuizSet(setId);
            } else if (target.classList.contains('rename-btn')) {
                const set = quizSets.find(s => s.id === setId);
                if (set) {
                    renameQuizSet(setId, set.name);
                }
            } else if (target.classList.contains('delete-btn')) {
                deleteQuizSet(setId);
            }
        });

        // --- Input Automation Event Listeners ---
        englishWordInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                banglaWordInput.focus();
            }
        });

        banglaWordInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                addWordPair();
            }
        });

        // --- Copy-Paste Modal Event Listeners ---
        processWordsButton.addEventListener('click', processCopiedWords);
        closeCopyPasteModal.addEventListener('click', () => copyPasteModal.classList.add('hidden'));


        // Initial setup on window load
        window.onload = () => {
            hideLoadingSpinner(); // Hide spinner once everything is loaded
            loadSettings(); // Load user settings (theme, audio, font size)
            loadQuizSetsFromLocalStorage(); // Load quiz sets from local storage
            showScreen('startScreen'); // Show the start screen
        };
