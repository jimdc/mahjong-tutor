const SETS = [
  {
    tiles: ["tiles/MJ3bing.svg", "tiles/MJ4bing.svg", "tiles/MJ5bing.svg"],
    answer: "Chow (吃 chī)"
  },
  {
    tiles: ["tiles/MJ7tiao.svg", "tiles/MJ7tiao.svg", "tiles/MJ7tiao.svg"],
    answer: "Pung (碰 péng)"
  },
  {
    tiles: ["tiles/MJ2wan.svg", "tiles/MJ2wan.svg", "tiles/MJ2wan.svg", "tiles/MJ2wan.svg"],
    answer: "Kong (杠 gàng)"
  },
  {
    tiles: ["tiles/MJGreendragon.svg", "tiles/MJGreendragon.svg"],
    answer: "Pair (将/对子 jiàng/duìzi)"
  },
  {
    tiles: ["tiles/MJ1bing.svg", "tiles/MJ3bing.svg", "tiles/MJ5bing.svg"],
    answer: "None"
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

const renderSet = () => {
  current = SETS[Math.floor(Math.random() * SETS.length)]
  elements.tiles.innerHTML = ""
  elements.feedback.textContent = ""
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
  elements.next.addEventListener("click", renderSet)
}

renderSet()
