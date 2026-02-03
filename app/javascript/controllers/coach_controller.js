import { Controller } from "@hotwired/stimulus"

const SCENARIOS = [
  {
    id: "basic-chow",
    title: "Build toward a chow",
    hand: [
      "1 Dot", "2 Dot", "3 Dot", "4 Dot",
      "7 Bamboo", "8 Bamboo",
      "2 Character", "3 Character", "4 Character",
      "East Wind", "East Wind",
      "Red Dragon", "9 Bamboo"
    ],
    bestDiscard: "9 Bamboo",
    reason: "It is isolated. Keeping 7-8 Bamboo creates a potential 6-7-8 or 7-8-9 chow, but only if you see 6 or 9 Bamboo later.",
    tip: "Look for tiles that do not connect to a sequence or pair."
  },
  {
    id: "pair-up",
    title: "Secure a pair",
    hand: [
      "2 Dot", "3 Dot", "4 Dot",
      "5 Bamboo", "6 Bamboo", "7 Bamboo",
      "3 Character", "4 Character", "5 Character",
      "White Dragon", "White Dragon",
      "9 Dot", "1 Character"
    ],
    bestDiscard: "1 Character",
    reason: "It does not extend any existing run and does not make a pair. You already have a pair in White Dragons.",
    tip: "Once you have a pair, focus on clean melds."
  },
  {
    id: "honor-keep",
    title: "Honor tile value",
    hand: [
      "2 Dot", "3 Dot", "4 Dot",
      "6 Bamboo", "7 Bamboo", "8 Bamboo",
      "4 Character", "5 Character", "6 Character",
      "Green Dragon", "Green Dragon",
      "9 Bamboo", "1 Dot"
    ],
    bestDiscard: "1 Dot",
    reason: "The 1 Dot is isolated. The Green Dragon pair is valuable and can become a scoring pung.",
    tip: "Pairs of dragons or winds are often worth keeping."
  }
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
  static targets = [
    "hand",
    "choices",
    "feedback",
    "tip",
    "title",
    "next",
    "explain"
  ]

  connect() {
    this.scenarios = shuffle(SCENARIOS)
    this.index = 0
    this.loadScenario()
  }

  loadScenario() {
    this.current = this.scenarios[this.index]
    this.titleTarget.textContent = this.current.title
    this.explainTarget.textContent = "Choose the best discard from this 13-tile hand."
    this.feedbackTarget.textContent = ""
    this.tipTarget.textContent = ""
    this.nextTarget.disabled = true

    this.renderHand()
    this.renderChoices()
  }

  renderHand() {
    this.handTarget.innerHTML = ""
    this.current.hand.forEach(tile => {
      const span = document.createElement("span")
      span.className = "coach-tile"
      span.textContent = tile
      this.handTarget.appendChild(span)
    })
  }

  renderChoices() {
    this.choicesTarget.innerHTML = ""
    this.current.hand.forEach(tile => {
      const button = document.createElement("button")
      button.type = "button"
      button.className = "tutor-option"
      button.textContent = tile
      button.addEventListener("click", () => this.handleChoice(tile))
      this.choicesTarget.appendChild(button)
    })
  }

  handleChoice(tile) {
    const correct = tile === this.current.bestDiscard

    if (correct) {
      this.feedbackTarget.textContent = `Good discard. ${this.current.reason}`
      this.feedbackTarget.dataset.state = "correct"
      this.tipTarget.textContent = this.current.tip
    } else {
      this.feedbackTarget.textContent = `Not the best discard. ${this.current.reason}`
      this.feedbackTarget.dataset.state = "wrong"
      this.tipTarget.textContent = "Try to keep tiles that form sequences or pairs."
    }

    this.nextTarget.disabled = false
    this.choicesTarget.querySelectorAll("button").forEach(button => {
      button.disabled = true
      if (button.textContent === this.current.bestDiscard) {
        button.classList.add("correct")
      } else if (button.textContent === tile && !correct) {
        button.classList.add("wrong")
      }
    })
  }

  nextScenario() {
    this.index = (this.index + 1) % this.scenarios.length
    this.loadScenario()
  }
}
