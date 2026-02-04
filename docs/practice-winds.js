const WINDS = [
  { id: "east", label: "East", svg: "tiles/MJEastwind.svg", glyph: "\u{1F000}" },
  { id: "south", label: "South", svg: "tiles/MJSouthwind.svg", glyph: "\u{1F001}" },
  { id: "west", label: "West", svg: "tiles/MJWestwind.svg", glyph: "\u{1F002}" },
  { id: "north", label: "North", svg: "tiles/MJNorthwind.svg", glyph: "\u{1F003}" }
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
  tile: document.getElementById("windTile"),
  image: document.getElementById("windImage"),
  glyph: document.getElementById("windGlyph"),
  options: document.getElementById("windOptions"),
  feedback: document.getElementById("windFeedback"),
  next: document.getElementById("windNext"),
  statCorrect: document.getElementById("statCorrect"),
  statAttempts: document.getElementById("statAttempts"),
  statStreak: document.getElementById("statStreak")
}

const stats = createPracticeStats("practice-winds", {
  correct: elements.statCorrect,
  attempts: elements.statAttempts,
  streak: elements.statStreak
})

let current = null
let choices = []

const setTile = () => {
  current = WINDS[Math.floor(Math.random() * WINDS.length)]
  choices = shuffle(WINDS)

  elements.glyph.textContent = current.glyph
  elements.tile.setAttribute("aria-label", current.label)
  elements.feedback.textContent = ""
  elements.next.disabled = true

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
  choices.forEach(choice => {
    const button = document.createElement("button")
    button.type = "button"
    button.className = "tutor-option"
    button.textContent = choice.label
    button.addEventListener("click", () => handleChoice(choice))
    elements.options.appendChild(button)
  })
}

const handleChoice = choice => {
  const correct = choice.id === current.id
  elements.feedback.textContent = correct ? "Correct!" : `Not quite. This is ${current.label}.`
  elements.feedback.dataset.state = correct ? "correct" : "wrong"
  stats.record(correct)
  elements.next.disabled = false
  elements.options.querySelectorAll("button").forEach(button => {
    button.disabled = true
    if (button.textContent === current.label) {
      button.classList.add("correct")
    } else if (!correct && button.textContent === choice.label) {
      button.classList.add("wrong")
    }
  })
}

if (elements.next) {
  elements.next.addEventListener("click", setTile)
}

setTile()
