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
    id: "safe-7-dot",
    pool: ["7 Dot", "7 Dot", "7 Dot", "7 Dot", "1 Bamboo", "Red Dragon"],
    options: ["7 Dot", "3 Bamboo", "White Dragon", "2 Character"],
    answer: "7 Dot",
    why: "All four 7 Dots are visible, so no one can win off another 7 Dot."
  },
  {
    id: "safe-white",
    pool: ["White Dragon", "White Dragon", "White Dragon", "White Dragon", "6 Bamboo", "3 Dot"],
    options: ["White Dragon", "6 Bamboo", "9 Dot", "South Wind"],
    answer: "White Dragon",
    why: "Every White Dragon is out already, making the last copy safe."
  },
  {
    id: "safe-3-bamboo",
    pool: ["3 Bamboo", "3 Bamboo", "3 Bamboo", "3 Bamboo", "9 Character", "East Wind"],
    options: ["3 Bamboo", "5 Dot", "9 Character", "Green Dragon"],
    answer: "3 Bamboo",
    why: "All four 3 Bamboos are visible, so discarding one cannot complete a hand."
  },
  {
    id: "safe-9-character",
    pool: ["9 Character", "9 Character", "9 Character", "9 Character", "2 Dot", "8 Bamboo"],
    options: ["9 Character", "2 Dot", "8 Bamboo", "North Wind"],
    answer: "9 Character",
    why: "The 9 Characters are exhausted, so they are the safest choice."
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
  pool: document.getElementById("safetyPool"),
  options: document.getElementById("safetyOptions"),
  feedback: document.getElementById("safetyFeedback"),
  next: document.getElementById("safetyNext"),
  statCorrect: document.getElementById("statCorrect"),
  statAttempts: document.getElementById("statAttempts"),
  statStreak: document.getElementById("statStreak")
}

const stats = createPracticeStats("practice-safety", {
  correct: elements.statCorrect,
  attempts: elements.statAttempts,
  streak: elements.statStreak
})

let current = null
let lastId = null

const buildTileNode = label => {
  const meta = tileMeta(label)
  const tile = document.createElement("img")
  tile.src = meta.svg
  tile.alt = label
  return tile
}

const renderScenario = () => {
  let next = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)]
  while (next.id === lastId && SCENARIOS.length > 1) {
    next = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)]
  }
  current = next
  lastId = current.id

  elements.feedback.textContent = ""
  elements.next.disabled = true

  elements.pool.innerHTML = ""
  current.pool.forEach(tile => elements.pool.appendChild(buildTileNode(tile)))

  elements.options.innerHTML = ""
  shuffle(current.options).forEach(option => {
    const button = document.createElement("button")
    button.type = "button"
    button.className = "tutor-option coach-choice"
    button.dataset.label = option

    const meta = tileMeta(option)
    const img = document.createElement("img")
    img.className = "coach-choice__img"
    img.src = meta.svg
    img.alt = option

    const glyphSpan = document.createElement("span")
    glyphSpan.className = "coach-choice__glyph"
    glyphSpan.textContent = meta.glyph

    img.onerror = () => {
      img.hidden = true
      glyphSpan.style.opacity = "1"
    }

    img.onload = () => {
      glyphSpan.style.opacity = "0"
    }

    button.appendChild(img)
    button.appendChild(glyphSpan)
    button.addEventListener("click", () => handleChoice(option))
    elements.options.appendChild(button)
  })
}

const handleChoice = option => {
  const correct = option === current.answer
  elements.feedback.textContent = correct ? `Correct! ${current.why}` : `Not quite. ${current.why}`
  elements.feedback.dataset.state = correct ? "correct" : "wrong"
  stats.record(correct)
  elements.next.disabled = false
  elements.options.querySelectorAll("button").forEach(button => {
    button.disabled = true
    if (button.dataset.label === current.answer) {
      button.classList.add("correct")
    } else if (!correct && button.dataset.label === option) {
      button.classList.add("wrong")
    }
  })
}

if (elements.next) {
  elements.next.addEventListener("click", renderScenario)
}

renderScenario()
