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

const shuffle = values => {
  const array = values.slice()
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

const elements = {
  title: document.getElementById("coachTitle"),
  explain: document.getElementById("coachExplain"),
  hand: document.getElementById("coachHand"),
  choices: document.getElementById("coachChoices"),
  feedback: document.getElementById("coachFeedback"),
  tip: document.getElementById("coachTip"),
  next: document.getElementById("coachNext")
}

let scenarios = shuffle(SCENARIOS)
let index = 0
let current = null

const renderHand = () => {
  elements.hand.innerHTML = ""
  current.hand.forEach(tile => {
    const span = document.createElement("span")
    span.className = "coach-tile"
    span.textContent = tile
    elements.hand.appendChild(span)
  })
}

const renderChoices = () => {
  elements.choices.innerHTML = ""
  current.hand.forEach(tile => {
    const button = document.createElement("button")
    button.type = "button"
    button.className = "tutor-option"
    button.textContent = tile
    button.addEventListener("click", () => handleChoice(tile))
    elements.choices.appendChild(button)
  })
}

const loadScenario = () => {
  current = scenarios[index]
  elements.title.textContent = current.title
  elements.explain.textContent = "Choose the best discard from this 13-tile hand."
  elements.feedback.textContent = ""
  elements.tip.textContent = ""
  elements.next.disabled = true

  renderHand()
  renderChoices()
}

const handleChoice = tile => {
  const correct = tile === current.bestDiscard

  if (correct) {
    elements.feedback.textContent = `Good discard. ${current.reason}`
    elements.feedback.dataset.state = "correct"
    elements.tip.textContent = current.tip
  } else {
    elements.feedback.textContent = `Not the best discard. ${current.reason}`
    elements.feedback.dataset.state = "wrong"
    elements.tip.textContent = "Try to keep tiles that form sequences or pairs."
  }

  elements.next.disabled = false
  elements.choices.querySelectorAll("button").forEach(button => {
    button.disabled = true
    if (button.textContent === current.bestDiscard) {
      button.classList.add("correct")
    } else if (button.textContent === tile && !correct) {
      button.classList.add("wrong")
    }
  })
}

const nextScenario = () => {
  index = (index + 1) % scenarios.length
  loadScenario()
}

if (elements.next) {
  elements.next.addEventListener("click", nextScenario)
}

loadScenario()
