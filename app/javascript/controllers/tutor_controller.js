import { Controller } from "@hotwired/stimulus"

const TILES = [
  ...Array.from({ length: 9 }, (_, i) => ({
    id: `dot-${i + 1}`,
    label: `${i + 1} Dot`,
    display: `${i + 1} DOT`
  })),
  ...Array.from({ length: 9 }, (_, i) => ({
    id: `bamboo-${i + 1}`,
    label: `${i + 1} Bamboo`,
    display: `${i + 1} BAMBOO`
  })),
  ...Array.from({ length: 9 }, (_, i) => ({
    id: `character-${i + 1}`,
    label: `${i + 1} Character`,
    display: `${i + 1} CHARACTER`
  })),
  { id: "wind-east", label: "East Wind", display: "EAST WIND" },
  { id: "wind-south", label: "South Wind", display: "SOUTH WIND" },
  { id: "wind-west", label: "West Wind", display: "WEST WIND" },
  { id: "wind-north", label: "North Wind", display: "NORTH WIND" },
  { id: "dragon-red", label: "Red Dragon", display: "RED DRAGON" },
  { id: "dragon-green", label: "Green Dragon", display: "GREEN DRAGON" },
  { id: "dragon-white", label: "White Dragon", display: "WHITE DRAGON" }
]

function shuffle(values) {
  const array = values.slice()
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export default class extends Controller {
  static targets = ["tile", "options", "feedback", "score", "streak", "next"]

  connect() {
    this.scoreValue = 0
    this.streakValue = 0
    this.nextQuestion()
  }

  nextQuestion() {
    this.currentTile = TILES[Math.floor(Math.random() * TILES.length)]
    const distractors = shuffle(TILES.filter(tile => tile.id !== this.currentTile.id)).slice(0, 3)
    this.choices = shuffle([this.currentTile, ...distractors])

    this.tileTarget.textContent = this.currentTile.display
    this.feedbackTarget.textContent = ""
    this.nextTarget.disabled = true

    this.renderChoices()
  }

  renderChoices() {
    this.optionsTarget.innerHTML = ""
    this.choices.forEach(choice => {
      const button = document.createElement("button")
      button.type = "button"
      button.className = "tutor-option"
      button.textContent = choice.label
      button.dataset.tileId = choice.id
      button.addEventListener("click", () => this.handleGuess(choice))
      this.optionsTarget.appendChild(button)
    })
  }

  handleGuess(choice) {
    const correct = choice.id === this.currentTile.id

    if (correct) {
      this.scoreValue += 1
      this.streakValue += 1
      this.feedbackTarget.textContent = `Correct! This is ${this.currentTile.label}.`
      this.feedbackTarget.dataset.state = "correct"
    } else {
      this.streakValue = 0
      this.feedbackTarget.textContent = `Not quite. This is ${this.currentTile.label}.`
      this.feedbackTarget.dataset.state = "wrong"
    }

    this.scoreTarget.textContent = this.scoreValue
    this.streakTarget.textContent = this.streakValue
    this.nextTarget.disabled = false

    this.optionsTarget.querySelectorAll("button").forEach(button => {
      button.disabled = true
      if (button.dataset.tileId === this.currentTile.id) {
        button.classList.add("correct")
      } else if (button.dataset.tileId === choice.id && !correct) {
        button.classList.add("wrong")
      }
    })
  }

  next() {
    this.nextQuestion()
  }
}
