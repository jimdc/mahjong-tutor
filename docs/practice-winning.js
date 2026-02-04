const HANDS = [
  {
    label: "Standard Hand (4 melds + pair)",
    tiles: [
      "tiles/MJ2bing.svg", "tiles/MJ3bing.svg", "tiles/MJ4bing.svg",
      "tiles/MJ5tiao.svg", "tiles/MJ6tiao.svg", "tiles/MJ7tiao.svg",
      "tiles/MJ4wan.svg", "tiles/MJ5wan.svg", "tiles/MJ6wan.svg",
      "tiles/MJReddragon.svg", "tiles/MJReddragon.svg"
    ]
  },
  {
    label: "All Pungs",
    tiles: [
      "tiles/MJ2tiao.svg", "tiles/MJ2tiao.svg", "tiles/MJ2tiao.svg",
      "tiles/MJ6wan.svg", "tiles/MJ6wan.svg", "tiles/MJ6wan.svg",
      "tiles/MJGreendragon.svg", "tiles/MJGreendragon.svg"
    ]
  },
  {
    label: "Seven Pairs",
    tiles: [
      "tiles/MJ1bing.svg", "tiles/MJ1bing.svg",
      "tiles/MJ3wan.svg", "tiles/MJ3wan.svg",
      "tiles/MJ7tiao.svg", "tiles/MJ7tiao.svg",
      "tiles/MJReddragon.svg", "tiles/MJReddragon.svg"
    ]
  },
  {
    label: "Pure Suit",
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
  next: document.getElementById("winNext")
}

let current = null

const renderHand = () => {
  current = HANDS[Math.floor(Math.random() * HANDS.length)]
  elements.tiles.innerHTML = ""
  elements.feedback.textContent = ""
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
  elements.feedback.textContent = correct ? "Correct!" : `Not quite. This is ${current.label}.`
  elements.feedback.dataset.state = correct ? "correct" : "wrong"
  elements.next.disabled = false
  elements.options.querySelectorAll("button").forEach(button => {
    button.disabled = true
    if (button.textContent === current.label) {
      button.classList.add("correct")
    } else if (!correct && button.textContent === option) {
      button.classList.add("wrong")
    }
  })
}

if (elements.next) {
  elements.next.addEventListener("click", renderHand)
}

renderHand()
