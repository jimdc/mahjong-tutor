const glyph = codePoint => String.fromCodePoint(codePoint)

const DOT_SVG = number => `tiles/MJ${number}bing.svg`
const BAMBOO_SVG = number => `tiles/MJ${number}tiao.svg`
const CHARACTER_SVG = number => `tiles/MJ${number}wan.svg`

const TILE_MAP = {
  "East Wind": { svg: "tiles/MJEastwind.svg", glyph: glyph(0x1f000) },
  "South Wind": { svg: "tiles/MJSouthwind.svg", glyph: glyph(0x1f001) },
  "West Wind": { svg: "tiles/MJWestwind.svg", glyph: glyph(0x1f002) },
  "North Wind": { svg: "tiles/MJNorthwind.svg", glyph: glyph(0x1f003) },
  "Red Dragon": { svg: "tiles/MJReddragon.svg", glyph: glyph(0x1f004) },
  "Green Dragon": { svg: "tiles/MJGreendragon.svg", glyph: glyph(0x1f005) },
  "White Dragon": { svg: "tiles/MJbaida.svg", glyph: glyph(0x1f006) }
}

const tileMeta = label => {
  if (TILE_MAP[label]) return TILE_MAP[label]
  const match = label.match(/^(\d+)\s+(Dot|Bamboo|Character)$/)
  if (!match) return { svg: null, glyph: label }

  const number = Number(match[1])
  const suit = match[2]

  if (suit === "Dot") return { svg: DOT_SVG(number), glyph: glyph(0x1f019 + (number - 1)) }
  if (suit === "Bamboo") return { svg: BAMBOO_SVG(number), glyph: glyph(0x1f010 + (number - 1)) }
  return { svg: CHARACTER_SVG(number), glyph: glyph(0x1f007 + (number - 1)) }
}

const SCENARIOS = [
  {
    id: "chow-next",
    prompt: "You are the next player to the discarder.",
    discard: "5 Bamboo",
    hand: [
      "4 Bamboo", "6 Bamboo",
      "2 Dot", "3 Dot", "4 Dot",
      "7 Character", "8 Character", "9 Character",
      "East Wind", "East Wind",
      "1 Dot", "9 Bamboo", "2 Character"
    ],
    answer: "Chow",
    whySteps: [
      "Rule: only the next player may chow; you need two consecutive tiles to complete it.",
      "You hold 4 and 6 Bamboo, so the 5 Bamboo discard completes a chow."
    ]
  },
  {
    id: "pung-any",
    prompt: "Any player can claim a pung if they have a pair.",
    discard: "Red Dragon",
    hand: [
      "Red Dragon", "Red Dragon",
      "2 Bamboo", "3 Bamboo", "4 Bamboo",
      "6 Dot", "7 Dot", "8 Dot",
      "3 Character", "4 Character", "5 Character",
      "North Wind", "9 Dot"
    ],
    answer: "Pung",
    whySteps: [
      "Rule: any player can claim a pung with a matching pair.",
      "You already have two Red Dragons, so the discard makes a pung."
    ]
  },
  {
    id: "kong",
    prompt: "Kongs require three in hand plus the discard.",
    discard: "2 Dot",
    hand: [
      "2 Dot", "2 Dot", "2 Dot",
      "5 Bamboo", "6 Bamboo", "7 Bamboo",
      "4 Character", "5 Character", "6 Character",
      "South Wind", "South Wind", "9 Bamboo", "1 Dot"
    ],
    answer: "Kong",
    whySteps: [
      "Rule: a kong is four identical tiles.",
      "You already have three 2 Dots, so the discard completes the kong."
    ]
  },
  {
    id: "win",
    prompt: "Winning on a discard takes priority over other calls.",
    discard: "3 Character",
    hand: [
      "1 Dot", "2 Dot", "3 Dot",
      "4 Dot", "5 Dot", "6 Dot",
      "7 Bamboo", "8 Bamboo", "9 Bamboo",
      "East Wind", "East Wind",
      "1 Character", "2 Character"
    ],
    answer: "Win",
    whySteps: [
      "Rule: winning on a discard takes priority over other calls.",
      "The 3 Character completes your final chow, giving four melds plus a pair."
    ]
  },
  {
    id: "pass",
    prompt: "You are across the table (not next player).",
    discard: "6 Bamboo",
    hand: [
      "4 Bamboo", "5 Bamboo",
      "2 Dot", "3 Dot", "4 Dot",
      "7 Character", "8 Character", "9 Character",
      "North Wind", "North Wind",
      "1 Dot", "3 Bamboo", "5 Character"
    ],
    answer: "Pass",
    whySteps: [
      "Rule: only the next player can chow; pung/kong needs a pair or triplet.",
      "You are not next and lack a pair for a pung or kong, so you must pass."
    ]
  }
]

const CALL_OPTIONS = ["Chow", "Pung", "Kong", "Win", "Pass"]

const shuffle = values => {
  const array = values.slice()
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

const elements = {
  prompt: document.getElementById("callPrompt"),
  discard: document.getElementById("callDiscard"),
  hand: document.getElementById("callHand"),
  options: document.getElementById("callOptions"),
  feedback: document.getElementById("callFeedback"),
  why: document.getElementById("callWhy"),
  whyList: document.getElementById("callWhyList"),
  next: document.getElementById("callNext"),
  statCorrect: document.getElementById("statCorrect"),
  statAttempts: document.getElementById("statAttempts"),
  statStreak: document.getElementById("statStreak")
}

const stats = createPracticeStats("practice-calls", {
  correct: elements.statCorrect,
  attempts: elements.statAttempts,
  streak: elements.statStreak
})

let current = null
let lastId = null
let whyIndex = 0

const buildTileNode = label => {
  const meta = tileMeta(label)
  const tile = document.createElement("div")
  tile.className = "coach-tile"

  const img = document.createElement("img")
  img.className = "coach-tile__img"
  img.alt = label
  img.src = meta.svg

  const glyphSpan = document.createElement("span")
  glyphSpan.className = "coach-tile__glyph"
  glyphSpan.textContent = meta.glyph

  img.onerror = () => {
    img.hidden = true
    glyphSpan.style.opacity = "1"
  }

  img.onload = () => {
    glyphSpan.style.opacity = "0"
  }

  tile.appendChild(img)
  tile.appendChild(glyphSpan)

  return tile
}

const renderScenario = () => {
  let next = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)]
  while (next.id === lastId && SCENARIOS.length > 1) {
    next = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)]
  }
  current = next
  lastId = current.id

  elements.prompt.textContent = current.prompt
  elements.feedback.textContent = ""
  if (elements.whyList) elements.whyList.innerHTML = ""
  if (elements.why) elements.why.disabled = true
  whyIndex = 0
  elements.next.disabled = true

  elements.discard.innerHTML = ""
  elements.discard.appendChild(buildTileNode(current.discard))

  elements.hand.innerHTML = ""
  current.hand.forEach(tile => elements.hand.appendChild(buildTileNode(tile)))

  elements.options.innerHTML = ""
  shuffle(CALL_OPTIONS).forEach(option => {
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
  elements.feedback.textContent = correct ? "Correct!" : "Not quite."
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
  elements.next.addEventListener("click", renderScenario)
}

if (elements.why) {
  elements.why.addEventListener("click", revealWhy)
}

renderScenario()
