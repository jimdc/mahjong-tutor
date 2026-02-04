const QUESTIONS = [
  {
    prompt: "If the prevailing wind is East and your seat is South, which winds are value?",
    answer: "East and South"
  },
  {
    prompt: "If the prevailing wind is West and your seat is North, which winds are value?",
    answer: "West and North"
  },
  {
    prompt: "If the prevailing wind is South and your seat is South, which wind is value?",
    answer: "South (both)"
  },
  {
    prompt: "If the prevailing wind is North and your seat is East, which winds are value?",
    answer: "North and East"
  }
]

const OPTIONS = [
  "East and South",
  "West and North",
  "South (both)",
  "North and East"
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
  prompt: document.getElementById("prevPrompt"),
  options: document.getElementById("prevOptions"),
  feedback: document.getElementById("prevFeedback"),
  next: document.getElementById("prevNext")
}

let current = null

const renderQuestion = () => {
  current = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)]
  elements.prompt.textContent = current.prompt
  elements.feedback.textContent = ""
  elements.next.disabled = true

  elements.options.innerHTML = ""
  shuffle(OPTIONS).forEach(option => {
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
