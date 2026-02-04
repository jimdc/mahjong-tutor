const glyph = codePoint => String.fromCodePoint(codePoint)

const DOT_SVG = number => `tiles/MJ${number}bing.svg`
const BAMBOO_SVG = number => `tiles/MJ${number}tiao.svg`
const CHARACTER_SVG = number => `tiles/MJ${number}wan.svg`

const SUITS = [
  { id: "dot", label: "Dot", svg: DOT_SVG, glyphBase: 0x1f019 },
  { id: "bamboo", label: "Bamboo", svg: BAMBOO_SVG, glyphBase: 0x1f010 },
  { id: "character", label: "Character", svg: CHARACTER_SVG, glyphBase: 0x1f007 }
]

const buildScenarios = () => {
  const scenarios = []
  SUITS.forEach(suit => {
    for (let start = 1; start <= 7; start += 1) {
      const tiles = [start, start + 1, start + 2]
      for (let missingIndex = 0; missingIndex < 3; missingIndex += 1) {
        scenarios.push({
          id: `${suit.id}-${start}-${missingIndex}`,
          suit,
          tiles,
          missingIndex
        })
      }
    }
  })
  return scenarios
}

const SCENARIOS = buildScenarios()

const shuffle = values => {
  const array = values.slice()
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

const elements = {
  row: document.getElementById("sequenceRow"),
  options: document.getElementById("sequenceOptions"),
  feedback: document.getElementById("sequenceFeedback"),
  why: document.getElementById("sequenceWhy"),
  whyList: document.getElementById("sequenceWhyList"),
  next: document.getElementById("sequenceNext"),
  statCorrect: document.getElementById("statCorrect"),
  statAttempts: document.getElementById("statAttempts"),
  statStreak: document.getElementById("statStreak")
}

const stats = createPracticeStats("practice-sequence", {
  correct: elements.statCorrect,
  attempts: elements.statAttempts,
  streak: elements.statStreak
})

let current = null
let lastId = null
let whyIndex = 0
let whySteps = []

const tileMeta = (suit, number) => ({
  label: `${number} ${suit.label}`,
  svg: suit.svg(number),
  glyph: glyph(suit.glyphBase + (number - 1))
})

const renderSequence = () => {
  let next = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)]
  while (next.id === lastId && SCENARIOS.length > 1) {
    next = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)]
  }
  current = next
  lastId = current.id

  elements.feedback.textContent = ""
  if (elements.whyList) elements.whyList.innerHTML = ""
  if (elements.why) elements.why.disabled = true
  whyIndex = 0
  elements.next.disabled = true

  elements.row.innerHTML = ""
  current.tiles.forEach((number, index) => {
    const slot = document.createElement("div")
    slot.className = "sequence-slot"
    if (index === current.missingIndex) {
      slot.textContent = "?"
    } else {
      const meta = tileMeta(current.suit, number)
      const img = document.createElement("img")
      img.src = meta.svg
      img.alt = meta.label
      slot.appendChild(img)
    }
    elements.row.appendChild(slot)
  })

  const correctNumber = current.tiles[current.missingIndex]
  const meta = tileMeta(current.suit, correctNumber)
  whySteps = [
    "Rule: a chow is three consecutive tiles in the same suit.",
    `${meta.label} completes the sequence.`
  ]
  const options = shuffle(
    [correctNumber, ...shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9].filter(num => num !== correctNumber)).slice(0, 3)]
  )

  elements.options.innerHTML = ""
  options.forEach(number => {
    const meta = tileMeta(current.suit, number)
    const button = document.createElement("button")
    button.type = "button"
    button.className = "tutor-option coach-choice"

    const img = document.createElement("img")
    img.className = "coach-choice__img"
    img.src = meta.svg
    img.alt = meta.label

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
    button.addEventListener("click", () => handleChoice(number))
    elements.options.appendChild(button)
  })
}

const handleChoice = number => {
  const correctNumber = current.tiles[current.missingIndex]
  const correct = number === correctNumber
  const meta = tileMeta(current.suit, correctNumber)
  elements.feedback.textContent = correct
    ? `Correct! ${meta.label} completes the chow.`
    : `Not quite. ${meta.label} completes the sequence.`
  elements.feedback.dataset.state = correct ? "correct" : "wrong"
  stats.record(correct)
  elements.next.disabled = false
  if (elements.why) elements.why.disabled = false
  elements.options.querySelectorAll("button").forEach(button => {
    button.disabled = true
    if (button.querySelector("img") && button.querySelector("img").alt === meta.label) {
      button.classList.add("correct")
    } else if (!correct && button.querySelector("img").alt === tileMeta(current.suit, number).label) {
      button.classList.add("wrong")
    }
  })
}

const revealWhy = () => {
  if (!elements.whyList || !whySteps.length) return
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
  elements.next.addEventListener("click", renderSequence)
}

if (elements.why) {
  elements.why.addEventListener("click", revealWhy)
}

renderSequence()
