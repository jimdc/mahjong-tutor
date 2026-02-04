const SETS = [
  {
    tiles: ["tiles/MJ3bing.svg", "tiles/MJ4bing.svg", "tiles/MJ5bing.svg"],
    answer: "Chow (吃 chī)",
    whySteps: [
      "Rule: a chow is three consecutive tiles in the same suit.",
      "3-4-5 Dots are consecutive in the Dot suit."
    ]
  },
  {
    tiles: ["tiles/MJ7tiao.svg", "tiles/MJ7tiao.svg", "tiles/MJ7tiao.svg"],
    answer: "Pung (碰 péng)",
    whySteps: [
      "Rule: a pung is three identical tiles.",
      "All three tiles are 7 Bamboo."
    ]
  },
  {
    tiles: ["tiles/MJ2wan.svg", "tiles/MJ2wan.svg", "tiles/MJ2wan.svg", "tiles/MJ2wan.svg"],
    answer: "Kong (杠 gàng)",
    whySteps: [
      "Rule: a kong is four identical tiles.",
      "All four tiles are 2 Character."
    ]
  },
  {
    tiles: ["tiles/MJGreendragon.svg", "tiles/MJGreendragon.svg"],
    answer: "Pair (将/对子 jiàng/duìzi)",
    whySteps: [
      "Rule: a pair is two identical tiles.",
      "Both tiles are Green Dragon."
    ]
  },
  {
    tiles: ["tiles/MJ1bing.svg", "tiles/MJ3bing.svg", "tiles/MJ5bing.svg"],
    answer: "None",
    whySteps: [
      "Rule: melds are identical or consecutive tiles in one suit.",
      "1-3-5 Dots are not consecutive and do not match."
    ]
  }
]

const OPTIONS = [
  "Chow (吃 chī)",
  "Pung (碰 péng)",
  "Kong (杠 gàng)",
  "Pair (将/对子 jiàng/duìzi)",
  "None"
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
  tiles: document.getElementById("meldTiles"),
  options: document.getElementById("meldOptions"),
  feedback: document.getElementById("meldFeedback"),
  why: document.getElementById("meldWhy"),
  whyList: document.getElementById("meldWhyList"),
  next: document.getElementById("meldNext"),
  statCorrect: document.getElementById("statCorrect"),
  statAttempts: document.getElementById("statAttempts"),
  statStreak: document.getElementById("statStreak")
}

const stats = createPracticeStats("practice-melds", {
  correct: elements.statCorrect,
  attempts: elements.statAttempts,
  streak: elements.statStreak
})

let current = null
let lastAnswer = null
let whyIndex = 0

const renderSet = () => {
  let next = SETS[Math.floor(Math.random() * SETS.length)]
  while (next.answer === lastAnswer && SETS.length > 1) {
    next = SETS[Math.floor(Math.random() * SETS.length)]
  }
  current = next
  lastAnswer = current.answer
  elements.tiles.innerHTML = ""
  elements.feedback.textContent = ""
  if (elements.whyList) elements.whyList.innerHTML = ""
  if (elements.why) elements.why.disabled = true
  whyIndex = 0
  elements.next.disabled = true

  current.tiles.forEach(src => {
    const img = document.createElement("img")
    img.src = src
    img.alt = "Meld tile"
    elements.tiles.appendChild(img)
  })

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
  elements.feedback.textContent = correct ? "Correct!" : `Not quite. This is ${current.answer}.`
  elements.feedback.dataset.state = correct ? "correct" : "wrong"
  stats.record(correct)
  elements.next.disabled = false
  if (elements.why) elements.why.disabled = false
  elements.options.querySelectorAll("button").forEach(button => {
    button.disabled = true
    if (button.textContent === current.answer) {
      button.classList.add("correct")
    } else if (!correct && button.textContent === option) {
      button.classList.add("wrong")
    }
  })
}

const revealWhy = () => {
  if (!current || !current.whySteps || !elements.whyList) return
  if (whyIndex >= current.whySteps.length) return
  const li = document.createElement("li")
  li.textContent = current.whySteps[whyIndex]
  elements.whyList.appendChild(li)
  whyIndex += 1
  if (elements.why && whyIndex >= current.whySteps.length) {
    elements.why.disabled = true
  }
}

if (elements.next) {
  elements.next.addEventListener("click", renderSet)
}

if (elements.why) {
  elements.why.addEventListener("click", revealWhy)
}

renderSet()
