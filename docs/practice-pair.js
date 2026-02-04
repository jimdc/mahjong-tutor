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

const PAIR_TILES = [
  "1 Dot", "5 Dot", "9 Dot",
  "1 Bamboo", "5 Bamboo", "9 Bamboo",
  "1 Character", "5 Character", "9 Character",
  "East Wind", "South Wind", "West Wind", "North Wind",
  "Red Dragon", "Green Dragon", "White Dragon"
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
  display: document.getElementById("pairDisplay"),
  options: document.getElementById("pairOptions"),
  feedback: document.getElementById("pairFeedback"),
  why: document.getElementById("pairWhy"),
  whyList: document.getElementById("pairWhyList"),
  next: document.getElementById("pairNext"),
  statCorrect: document.getElementById("statCorrect"),
  statAttempts: document.getElementById("statAttempts"),
  statStreak: document.getElementById("statStreak")
}

const stats = createPracticeStats("practice-pair", {
  correct: elements.statCorrect,
  attempts: elements.statAttempts,
  streak: elements.statStreak
})

let current = null
let lastLabel = null
let whyIndex = 0
let whySteps = []

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

const renderPair = () => {
  let next = PAIR_TILES[Math.floor(Math.random() * PAIR_TILES.length)]
  while (next === lastLabel && PAIR_TILES.length > 1) {
    next = PAIR_TILES[Math.floor(Math.random() * PAIR_TILES.length)]
  }
  current = next
  lastLabel = current

  elements.display.innerHTML = ""
  elements.display.appendChild(buildTileNode(current))
  elements.feedback.textContent = ""
  if (elements.whyList) elements.whyList.innerHTML = ""
  if (elements.why) elements.why.disabled = true
  whyIndex = 0
  whySteps = []
  elements.next.disabled = true

  const distractors = shuffle(PAIR_TILES.filter(tile => tile !== current)).slice(0, 3)
  const options = shuffle([current, ...distractors])

  elements.options.innerHTML = ""
  options.forEach(option => {
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
  const correct = option === current
  elements.feedback.textContent = correct ? `Correct! ${current} makes a pair.` : `Not quite. ${current} completes the pair.`
  elements.feedback.dataset.state = correct ? "correct" : "wrong"
  stats.record(correct)
  elements.next.disabled = false
  if (elements.why) elements.why.disabled = false
  elements.options.querySelectorAll("button").forEach(button => {
    button.disabled = true
    if (button.dataset.label === current) {
      button.classList.add("correct")
    } else if (!correct && button.dataset.label === option) {
      button.classList.add("wrong")
    }
  })
}

const revealWhy = () => {
  if (!elements.whyList) return
  if (!whySteps.length) {
    whySteps = [
      "Rule: a pair is two identical tiles.",
      `${current} matches the tile shown.`
    ]
  }
  if (whyIndex >= whySteps.length) return
  const li = document.createElement("li")
  li.textContent = whySteps[whyIndex]
  elements.whyList.appendChild(li)
  whyIndex += 1
  if (elements.why && whyIndex >= whySteps.length) {
    elements.why.disabled = true
  }
}

if (elements.next) {
  elements.next.addEventListener("click", renderPair)
}

if (elements.why) {
  elements.why.addEventListener("click", revealWhy)
}

renderPair()
