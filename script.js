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

    function createAnswerOptions(correctAnswer, incorrectAnswers, questionIndex) {
        const allAnswers = [correctAnswer, ...incorrectAnswers].sort(() => Math.random() - 0.5);
        return allAnswers.map(answer => `
            <label>
                <input type="radio" name="answer${questionIndex}" value="${answer}" ${answer === correctAnswer ? 'data-correct="true"' : ''}>
                ${answer}
            </label>
        `).join("");
    }

    function handleFormSubmit(event) {
        event.preventDefault();
        const username = usernameInput.value.trim();
        if (!username) return alert("Please enter your name");

        setCookie("username", username, 7);
        const score = calculateScore();
        saveScore(username, score);
        displayScores();
    }

    function calculateScore() {
        let score = 0;
        document.querySelectorAll("input[type='radio']:checked").forEach(input => {
            if (input.dataset.correct) score++;
        });
        return score;
    }

    function saveScore(username, score) {
        let scores = JSON.parse(localStorage.getItem("scores")) || [];
        scores.push({ username, score });
        localStorage.setItem("scores", JSON.stringify(scores));
    }

    function displayScores() {
        const scores = JSON.parse(localStorage.getItem("scores")) || [];
        scoreTableBody.innerHTML = scores.map(s => `<tr><td>${s.username}</td><td>${s.score}</td></tr>`).join("");
    }

    function setCookie(name, value, days) {
        const d = new Date();
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
    }

    function getCookie(name) {
        const cookies = document.cookie.split("; ");
        for (let c of cookies) {
            const [key, val] = c.split("=");
            if (key === name) return val;
        }
        return "";
    }

    function checkUsername() {
        const username = getCookie("username");
        if (username) usernameInput.value = username;
    }

    function newPlayer() {
        document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        location.reload();
    }

    form.addEventListener("submit", handleFormSubmit);
    newPlayerButton.addEventListener("click", newPlayer);
});

