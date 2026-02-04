const SEATS = ["East", "South", "West", "North"]

const QUESTIONS = [
  {
    prompt: "Who sits to the left of East?",
    answer: "South"
  },
  {
    prompt: "Who sits to the right of East?",
    answer: "North"
  },
  {
    prompt: "Which seat is opposite East?",
    answer: "West"
  },
  {
    prompt: "Who is next after East in rotation?",
    answer: "South"
  },
  {
    prompt: "Who is next after South in rotation?",
    answer: "West"
  },
  {
    prompt: "Who is next after West in rotation?",
    answer: "North"
  },
  {
    prompt: "Who is next after North in rotation?",
    answer: "East"
  }
]

const shuffle = values => {
  const array = values.slice()
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

const elements = {
  prompt: document.getElementById("seatPrompt"),
  options: document.getElementById("seatOptions"),
  feedback: document.getElementById("seatFeedback"),
  next: document.getElementById("seatNext")
}

let current = null

const renderQuestion = () => {
  current = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)]
  elements.prompt.textContent = current.prompt
  elements.feedback.textContent = ""
  elements.next.disabled = true

  elements.options.innerHTML = ""
  shuffle(SEATS).forEach(option => {
    const button = document.createElement("button")
    button.type = "button"
    button.className = "tutor-option"
    button.textContent = option
    button.addEventListener("click", () => handleChoice(option))
    elements.options.appendChild(button)
  })
}

const handleChoice = option => {
  const correct = option === current.answer
  elements.feedback.textContent = correct ? "Correct!" : `Not quite. The answer is ${current.answer}.`
  elements.feedback.dataset.state = correct ? "correct" : "wrong"
  elements.next.disabled = false
  elements.options.querySelectorAll("button").forEach(button => {
    button.disabled = true
    if (button.textContent === current.answer) {
      button.classList.add("correct")
    } else if (!correct && button.textContent === option) {
      button.classList.add("wrong")
    }
  })
}

if (elements.next) {
  elements.next.addEventListener("click", renderQuestion)
}

renderQuestion()
