document.addEventListener('DOMContentLoaded', function () {
  // Get the username from local storage
  const username = localStorage.getItem('username');

  // Display the username on the quiz page
  const usernameElement = document.getElementById('username');
  if (usernameElement) {
    usernameElement.textContent = username;
  }

  // Get the current time and display a greeting based on the time
  const greetingElement = document.getElementById('greeting');
  if (greetingElement) {
    const hour = new Date().getHours();
    let greeting = '';
    if (hour < 12) {
      greeting = 'Good morning';
    } else if (hour < 18) {
      greeting = 'Good afternoon';
    } else {
      greeting = 'Good evening';
    }
    greetingElement.textContent = greeting + ', ';
  }

  const quiz = document.getElementById('quiz');
  const question = document.getElementById('question');
  const options = document.getElementById('options');
  const submitBtn = document.getElementById('submit');
  const result = document.getElementById('result');
  const historyList = document.getElementById('history-list');
  const timerElement = document.getElementById('timer');

  // Quiz questions and answers
  const questions = [
    {
      question: 'What is the capital of France?',
      options: ['Paris', 'London', 'Berlin', 'Madrid'],
      answer: 'Paris'
    },
    {
      question: 'What is the largest planet in our solar system?',
      options: ['Earth', 'Mars', 'Jupiter', 'Venus'],
      answer: 'Jupiter'
    },
    {
      question: 'Who wrote "Romeo and Juliet"?',
      options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'],
      answer: 'William Shakespeare'
    }
  ];

  let currentQuestion = 0;
  let userAnswers = [];
  let correctAnswers = 0;
  let quizStartTime = null;
  let quizEndTime = null;
  let timerInterval = null;

  // Function to display current question and options
  function displayQuestion() {
    // Start the timer for the entire quiz
    startTimer(20);

    const currentQ = questions[currentQuestion];
    question.textContent = currentQ.question;

    options.innerHTML = '';
    currentQ.options.forEach(option => {
      const optionBtn = document.createElement('button');
      optionBtn.textContent = option;
      optionBtn.addEventListener('click', () => selectOption(option));
      options.appendChild(optionBtn);
    });
  }

  // Function to start the timer
  function startTimer(duration) {
    let timer = duration;
    updateTimer(timer);
    timerInterval = setInterval(() => {
      timer--;
      updateTimer(timer);
      if (timer <= 0) {
        clearInterval(timerInterval);
        endQuiz();
      }
    }, 1000);
  }

  // Function to update the timer on the page
  function updateTimer(time) {
    timerElement.textContent = `Time Left: ${time} seconds`;
  }

  // Function to select an option
  function selectOption(option) {
    userAnswers[currentQuestion] = option;

    // Disable all option buttons after selection
    const optionBtns = options.querySelectorAll('button');
    optionBtns.forEach(btn => {
      btn.disabled = true;
    });
  }

  // Function to end the quiz
  function endQuiz() {
    // Record the end time
    quizEndTime = new Date();

    // Display result
    displayResult();

    // Disable submit button after all questions answered
    submitBtn.disabled = true;

    // Save quiz history to local storage
    saveQuizHistory();

    // Display quiz history
    displayQuizHistory();
  }

  // Function to display result
  function displayResult() {
    questions.forEach((q, index) => {
      if (q.answer === userAnswers[index]) {
        correctAnswers++;
      }
    });

    // Display congratulations or sad message based on score
    if (correctAnswers === questions.length) {
      result.textContent = 'Congratulations! You got all answers correct 🎉';
    } else {
      result.textContent = `You got ${correctAnswers} out of ${questions.length} correct. Better luck next time! 😔`;
    }
  }

  // Function to save quiz history to local storage
  function saveQuizHistory() {
    const quizHistory = JSON.parse(localStorage.getItem('quizHistory')) || [];
    const date = new Date().toLocaleString();
    const quizData = {
      date: date,
      score: calculateScore(),
      totalQuestions: questions.length
    };
    quizHistory.push(quizData);
    localStorage.setItem('quizHistory', JSON.stringify(quizHistory));
  }

  // Function to display quiz history
  function displayQuizHistory() {
    historyList.innerHTML = '';
    const quizHistory = JSON.parse(localStorage.getItem('quizHistory')) || [];
    quizHistory.forEach(quiz => {
      const listItem = document.createElement('li');
      listItem.textContent = `${quiz.date} - Score: ${quiz.score} / ${quiz.totalQuestions}`;
      historyList.appendChild(listItem);
    });
  }

  // Function to calculate score
  function calculateScore() {
    let score = 0;
    questions.forEach((q, index) => {
      if (q.answer === userAnswers[index]) {
        score++;
      }
      });
    return score;
  }

  // Event listener for submit button
  submitBtn.addEventListener('click', () => {
    if (currentQuestion < questions.length - 1) {
      currentQuestion++;
      displayQuestion();
    } else {
      // If all questions answered, end the quiz
      endQuiz();
    }
  });

  // Display first question when the quiz starts
  displayQuestion();
});