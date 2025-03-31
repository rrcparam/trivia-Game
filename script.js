document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("trivia-form");
    const questionContainer = document.getElementById("question-container");
    const newPlayerButton = document.getElementById("new-player");
    const usernameInput = document.getElementById("username");
    const scoreTableBody = document.querySelector("#score-table tbody");

    initGame();

    function initGame() {
        checkUsername();
        fetchQuestions();
        displayScores();
    }

    function fetchQuestions() {
        showLoading(true);
        fetch("https://opentdb.com/api.php?amount=10&type=multiple")
            .then((response) => response.json())
            .then((data) => {
                displayQuestions(data.results);
                showLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching questions:", error);
                showLoading(false);
            });
    }

    function showLoading(isLoading) {
        document.getElementById("loading-container").classList.toggle("hidden", !isLoading);
        questionContainer.classList.toggle("hidden", isLoading);
    }

    function displayQuestions(questions) {
        questionContainer.innerHTML = "";
        questions.forEach((question, index) => {
            const questionDiv = document.createElement("div");
            questionDiv.innerHTML = `
                <p>${question.question}</p>
                ${createAnswerOptions(question.correct_answer, question.incorrect_answers, index)}
            `;
            questionContainer.appendChild(questionDiv);
        });
    }
