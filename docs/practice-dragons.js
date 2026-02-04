const DRAGONS = [
  {
    id: "red",
    label: "Red Dragon",
    zh: "Zhōng 中",
    svg: "tiles/MJReddragon.svg",
    glyph: "\u{1F004}"
  },
  {
    id: "green",
    label: "Green Dragon",
    zh: "Fā 發",
    svg: "tiles/MJGreendragon.svg",
    glyph: "\u{1F005}"
  },
  {
    id: "white",
    label: "White Dragon",
    zh: "Bái 白",
    svg: "tiles/MJbaida.svg",
    glyph: "\u{1F006}"
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
  tile: document.getElementById("dragonTile"),
  image: document.getElementById("dragonImage"),
  glyph: document.getElementById("dragonGlyph"),
  options: document.getElementById("dragonOptions"),
  feedback: document.getElementById("dragonFeedback"),
  next: document.getElementById("dragonNext"),
  statCorrect: document.getElementById("statCorrect"),
  statAttempts: document.getElementById("statAttempts"),
  statStreak: document.getElementById("statStreak")
}

const stats = createPracticeStats("practice-dragons", {
  correct: elements.statCorrect,
  attempts: elements.statAttempts,
  streak: elements.statStreak
})

let current = null
let lastId = null

const setDragon = () => {
  let next = DRAGONS[Math.floor(Math.random() * DRAGONS.length)]
  while (next.id === lastId && DRAGONS.length > 1) {
    next = DRAGONS[Math.floor(Math.random() * DRAGONS.length)]
  }
  current = next
  lastId = current.id

  elements.glyph.textContent = current.glyph
  elements.tile.setAttribute("aria-label", current.label)
  elements.feedback.textContent = ""
  elements.next.disabled = true

  elements.image.hidden = false
  elements.image.src = current.svg
  elements.image.alt = current.label
  elements.image.onload = () => {
    elements.glyph.style.opacity = "0"
  }
  elements.image.onerror = () => {
    elements.image.hidden = true
    elements.glyph.style.opacity = "1"
  }

  elements.options.innerHTML = ""
  shuffle(DRAGONS).forEach(option => {
    const button = document.createElement("button")
    button.type = "button"
    button.className = "tutor-option"
    button.innerHTML = `${option.zh} <span class="dragon-label">(${option.label})</span>`
    button.addEventListener("click", () => handleChoice(option))
    elements.options.appendChild(button)
  })
}

const handleChoice = option => {
  const correct = option.id === current.id
  elements.feedback.textContent = correct
    ? `Correct! ${current.label} is ${current.zh}.`
    : `Not quite. ${current.label} is ${current.zh}.`
  elements.feedback.dataset.state = correct ? "correct" : "wrong"
  stats.record(correct)
  elements.next.disabled = false
  elements.options.querySelectorAll("button").forEach(button => {
    button.disabled = true
    if (button.textContent.includes(current.zh)) {
      button.classList.add("correct")
    } else if (!correct && button.textContent.includes(option.zh)) {
      button.classList.add("wrong")
    }
  })
}

if (elements.next) {
  elements.next.addEventListener("click", setDragon)
}

setDragon()
