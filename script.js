document.addEventListener('DOMContentLoaded', () => {
    const startPage = document.getElementById('start-page');
    const quizPage = document.getElementById('quiz-page');
    const resultPage = document.getElementById('result-page');

    const startQuizBtn = document.getElementById('start-quiz-btn');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const nextBtn = document.getElementById('next-btn');
    const timerDisplay = document.getElementById('time');
    const currentScoreDisplay = document.getElementById('current-score');

    const correctAnswersSpan = document.getElementById('correct-answers');
    const totalQuestionsResultSpan = document.getElementById('total-questions-result');
    const finalScoreSpan = document.getElementById('final-score');
    const timeTakenSpan = document.getElementById('time-taken');
    const tryAgainBtn = document.getElementById('try-again-btn');

    let currentQuestionIndex = 0;
    let score = 0;
    let timer;
    let timeLeft;
    let quizStartTime;
    const QUIZ_DURATION = 90;

  
    const questions = [
        {
            question: "What is the capital city of Canada?",
            options: ["Toronto", "Vancouver", "Ottawa", "Montreal"],
            answer: "Ottawa"
        },
        {
            question: "Which of the following is NOT a primary color of light?",
            options: ["Red", "Green", "Blue", "Yellow"],
            answer: "Yellow"
        },
        {
            question: "How many continents are there on Earth?",
            options: ["5", "6", "7", "8"],
            answer: "7"
        },
        {
            question: "What is the longest river in the world?",
            options: ["Amazon River", "Nile River", "Yangtze River", "Mississippi River"],
            answer: "Nile River"
        },
        {
            question: "Who painted the Mona Lisa?",
            options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Claude Monet"],
            answer: "Leonardo da Vinci"
        },
        {
            question: "Which gas do humans breathe out?",
            options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
            answer: "Carbon Dioxide"
        },
        {
            question: "What is the largest desert in the world?",
            options: ["Sahara Desert", "Arabian Desert", "Gobi Desert", "Antarctic Polar Desert"],
            answer: "Antarctic Polar Desert"
        },
        {
            question: "Which year did the first human land on the Moon?",
            options: ["1965", "1969", "1972", "1975"],
            answer: "1969"
        },
        {
            question: "What is the chemical symbol for gold?",
            options: ["Au", "Ag", "Fe", "Cu"],
            answer: "Au"
        },
        {
            question: "Which country is famous for the Eiffel Tower?",
            options: ["Italy", "Germany", "France", "Spain"],
            answer: "France"
        }
    ];

    let shuffledQuestions = [];

    // --- Utility Functions ---

    function showPage(pageId) {
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => page.classList.remove('active'));
        document.getElementById(pageId).classList.add('active');
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // --- Quiz Logic ---

    function startQuiz() {
        showPage('quiz-page');
        currentQuestionIndex = 0;
        score = 0;
        currentScoreDisplay.textContent = score;
        shuffledQuestions = shuffleArray([...questions]); // Shuffle questions
        quizStartTime = Date.now();
        startTimer();
        loadQuestion();
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function startTimer() {
        timeLeft = QUIZ_DURATION;
        timerDisplay.textContent = formatTime(timeLeft);

        timer = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = formatTime(timeLeft);

            if (timeLeft <= 0) {
                clearInterval(timer);
                endQuiz();
            }
        }, 1000);
    }

    function loadQuestion() {
        document.getElementById('progress-indicator').textContent = `Question ${currentQuestionIndex + 1} of ${shuffledQuestions.length}`;
        if (currentQuestionIndex >= shuffledQuestions.length) {
            endQuiz();
            return;
        }

        const questionData = shuffledQuestions[currentQuestionIndex];
        questionText.textContent = questionData.question;
        optionsContainer.innerHTML = ''; // Clear previous options
        nextBtn.classList.add('hidden'); // Hide next button

        const shuffledOptions = shuffleArray([...questionData.options]); // Shuffle options

        shuffledOptions.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.classList.add('option-btn');
            button.addEventListener('click', () => selectOption(button, option, questionData.answer));
            optionsContainer.appendChild(button);
        });
    }

    function selectOption(selectedButton, chosenAnswer, correctAnswer) {
        // Disable all options once one is selected
        Array.from(optionsContainer.children).forEach(button => {
            button.classList.add('selected');
            button.removeEventListener('click', () => {}); // Remove event listener
        });

        if (chosenAnswer === correctAnswer) {
            selectedButton.classList.add('correct');
            score++;
        } else {
            selectedButton.classList.add('wrong');
            // Highlight the correct answer
            Array.from(optionsContainer.children).forEach(button => {
                if (button.textContent === correctAnswer) {
                    button.classList.add('correct-after-wrong');
                }
            });
        }
        currentScoreDisplay.textContent = score;
        nextBtn.classList.remove('hidden'); // Show next button
    }

    function endQuiz() {
        clearInterval(timer);
        showPage('result-page');

        const quizEndTime = Date.now();
        const timeElapsed = Math.floor((quizEndTime - quizStartTime) / 1000); // in seconds

        correctAnswersSpan.textContent = score;
        totalQuestionsResultSpan.textContent = questions.length;
        finalScoreSpan.textContent = ((score / questions.length) * 100).toFixed(0);
        timeTakenSpan.textContent = formatTime(timeElapsed);
    }

    // --- Event Listeners ---

    startQuizBtn.addEventListener('click', startQuiz);

    nextBtn.addEventListener('click', () => {
        currentQuestionIndex++;
        loadQuestion();
    });

    tryAgainBtn.addEventListener('click', () => {
        startQuiz(); // Restart the quiz
    });

    // Initial load: show the start page and update question count
    showPage('start-page');
    // Update the start page message for 10 fixed questions
    document.querySelector('#start-page p:nth-of-type(2)').textContent = `You'll answer ${questions.length} general knowledge questions.`;
    // Remove the "Loading questions..." and the dynamic span, as questions are now hardcoded
    document.querySelector('#start-page p:nth-of-type(3)').remove();
    // This part is not needed if questions are hardcoded:
    // document.getElementById('num-questions-display').textContent = questions.length;
});