const HONORS = [
  { id: "east", label: "East Wind", svg: "tiles/MJEastwind.svg", glyph: "\u{1F000}" },
  { id: "south", label: "South Wind", svg: "tiles/MJSouthwind.svg", glyph: "\u{1F001}" },
  { id: "west", label: "West Wind", svg: "tiles/MJWestwind.svg", glyph: "\u{1F002}" },
  { id: "north", label: "North Wind", svg: "tiles/MJNorthwind.svg", glyph: "\u{1F003}" },
  { id: "red", label: "Red Dragon", svg: "tiles/MJReddragon.svg", glyph: "\u{1F004}" },
  { id: "green", label: "Green Dragon", svg: "tiles/MJGreendragon.svg", glyph: "\u{1F005}" },
  { id: "white", label: "White Dragon", svg: "tiles/MJbaida.svg", glyph: "\u{1F006}" }
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
  tile: document.getElementById("honorTile"),
  image: document.getElementById("honorImage"),
  glyph: document.getElementById("honorGlyph"),
  options: document.getElementById("honorOptions"),
  feedback: document.getElementById("honorFeedback"),
  next: document.getElementById("honorNext"),
  statCorrect: document.getElementById("statCorrect"),
  statAttempts: document.getElementById("statAttempts"),
  statStreak: document.getElementById("statStreak")
}

const stats = createPracticeStats("practice-honors", {
  correct: elements.statCorrect,
  attempts: elements.statAttempts,
  streak: elements.statStreak
})

let current = null
let choices = []

const setTile = () => {
  current = HONORS[Math.floor(Math.random() * HONORS.length)]
  choices = shuffle(HONORS).slice(0, 4)
  if (!choices.find(c => c.id === current.id)) {
    choices[Math.floor(Math.random() * choices.length)] = current
  }

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
