const HANDS = [
  {
    label: "Standard Hand (4 melds + pair)",
    whySteps: [
      "Rule: a standard win is four melds plus one pair.",
      "This hand shows completed sets and a pair."
    ],
    tiles: [
      "tiles/MJ2bing.svg", "tiles/MJ3bing.svg", "tiles/MJ4bing.svg",
      "tiles/MJ5tiao.svg", "tiles/MJ6tiao.svg", "tiles/MJ7tiao.svg",
      "tiles/MJ4wan.svg", "tiles/MJ5wan.svg", "tiles/MJ6wan.svg",
      "tiles/MJReddragon.svg", "tiles/MJReddragon.svg"
    ]
  },
  {
    label: "All Pungs",
    whySteps: [
      "Rule: an All Pungs hand uses only triplets plus a pair.",
      "Every set here is a matching triplet."
    ],
    tiles: [
      "tiles/MJ2tiao.svg", "tiles/MJ2tiao.svg", "tiles/MJ2tiao.svg",
      "tiles/MJ6wan.svg", "tiles/MJ6wan.svg", "tiles/MJ6wan.svg",
      "tiles/MJGreendragon.svg", "tiles/MJGreendragon.svg"
    ]
  },
  {
    label: "Seven Pairs",
    whySteps: [
      "Rule: Seven Pairs uses only pairs.",
      "All tiles are arranged as pairs."
    ],
    tiles: [
      "tiles/MJ1bing.svg", "tiles/MJ1bing.svg",
      "tiles/MJ3wan.svg", "tiles/MJ3wan.svg",
      "tiles/MJ7tiao.svg", "tiles/MJ7tiao.svg",
      "tiles/MJReddragon.svg", "tiles/MJReddragon.svg"
    ]
  },
  {
    label: "Pure Suit",
    whySteps: [
      "Rule: a Pure Suit hand uses one suit only.",
      "Every tile shown is a Dot tile."
    ],
    tiles: [
      "tiles/MJ2bing.svg", "tiles/MJ3bing.svg", "tiles/MJ4bing.svg",
      "tiles/MJ5bing.svg", "tiles/MJ6bing.svg", "tiles/MJ7bing.svg"
    ]
  }
]

const OPTIONS = [
  "Standard Hand (4 melds + pair)",
  "All Pungs",
  "Seven Pairs",
  "Pure Suit"
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
  tiles: document.getElementById("winTiles"),
  options: document.getElementById("winOptions"),
  feedback: document.getElementById("winFeedback"),
  why: document.getElementById("winWhy"),
  whyList: document.getElementById("winWhyList"),
  next: document.getElementById("winNext"),
  statCorrect: document.getElementById("statCorrect"),
  statAttempts: document.getElementById("statAttempts"),
  statStreak: document.getElementById("statStreak")
}

const stats = createPracticeStats("practice-winning", {
  correct: elements.statCorrect,
  attempts: elements.statAttempts,
  streak: elements.statStreak
})

let current = null
let lastLabel = null
let whyIndex = 0

const renderHand = () => {
  let next = HANDS[Math.floor(Math.random() * HANDS.length)]
  while (next.label === lastLabel && HANDS.length > 1) {
    next = HANDS[Math.floor(Math.random() * HANDS.length)]
  }
  current = next
  lastLabel = current.label
  elements.tiles.innerHTML = ""
  elements.feedback.textContent = ""
  if (elements.whyList) elements.whyList.innerHTML = ""
  if (elements.why) elements.why.disabled = true
  whyIndex = 0
  elements.next.disabled = true

  current.tiles.forEach(src => {
    const img = document.createElement("img")
    img.src = src
    img.alt = "Winning hand tile"
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
  const correct = option === current.label
  elements.feedback.textContent = correct ? `Correct! This is ${current.label}.` : `Not quite. This is ${current.label}.`
  elements.feedback.dataset.state = correct ? "correct" : "wrong"
  stats.record(correct)
  elements.next.disabled = false
  if (elements.why) elements.why.disabled = false
  elements.options.querySelectorAll("button").forEach(button => {
    button.disabled = true
    if (button.textContent === current.label) {
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
  elements.next.addEventListener("click", renderHand)
}

if (elements.why) {
  elements.why.addEventListener("click", revealWhy)
}

renderHand()
