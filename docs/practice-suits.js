const glyph = codePoint => String.fromCodePoint(codePoint)

const DOT_SVG = number => `tiles/MJ${number}bing.svg`
const BAMBOO_SVG = number => `tiles/MJ${number}tiao.svg`
const CHARACTER_SVG = number => `tiles/MJ${number}wan.svg`

const SUIT_TILES = [
  ...Array.from({ length: 9 }, (_, i) => ({
    id: `dot-${i + 1}`,
    label: `${i + 1} Dot`,
    suit: "dot",
    svg: DOT_SVG(i + 1),
    glyph: glyph(0x1f019 + i)
  })),
  ...Array.from({ length: 9 }, (_, i) => ({
    id: `bamboo-${i + 1}`,
    label: `${i + 1} Bamboo`,
    suit: "bamboo",
    svg: BAMBOO_SVG(i + 1),
    glyph: glyph(0x1f010 + i)
  })),
  ...Array.from({ length: 9 }, (_, i) => ({
    id: `character-${i + 1}`,
    label: `${i + 1} Character`,
    suit: "character",
    svg: CHARACTER_SVG(i + 1),
    glyph: glyph(0x1f007 + i)
  }))
]

const SUIT_OPTIONS = [
  { id: "dot", label: "Dots (coins)" },
  { id: "bamboo", label: "Bamboo (sticks)" },
  { id: "character", label: "Characters (myriads)" }
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
  tile: document.getElementById("suitTile"),
  image: document.getElementById("suitImage"),
  glyph: document.getElementById("suitGlyph"),
  options: document.getElementById("suitOptions"),
  feedback: document.getElementById("suitFeedback"),
  next: document.getElementById("suitNext"),
  statCorrect: document.getElementById("statCorrect"),
  statAttempts: document.getElementById("statAttempts"),
  statStreak: document.getElementById("statStreak")
}

const stats = createPracticeStats("practice-suits", {
  correct: elements.statCorrect,
  attempts: elements.statAttempts,
  streak: elements.statStreak
})

let current = null
let lastId = null

const setTile = () => {
  let next = SUIT_TILES[Math.floor(Math.random() * SUIT_TILES.length)]
  while (next.id === lastId && SUIT_TILES.length > 1) {
    next = SUIT_TILES[Math.floor(Math.random() * SUIT_TILES.length)]
  }
  current = next
  lastId = current.id

  elements.glyph.textContent = current.glyph
  elements.tile.setAttribute("aria-label", current.label)
  elements.feedback.textContent = ""
  elements.next.disabled = true

  elements.image.hidden = false
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
  shuffle(SUIT_OPTIONS).forEach(option => {
    const button = document.createElement("button")
    button.type = "button"
    button.className = "tutor-option"
    button.textContent = option.label
    button.addEventListener("click", () => handleChoice(option))
    elements.options.appendChild(button)
  })
}

const handleChoice = option => {
  const correct = option.id === current.suit
  const correctLabel = SUIT_OPTIONS.find(opt => opt.id === current.suit).label
  elements.feedback.textContent = correct ? "Correct!" : `Not quite. This tile is ${current.label}, part of ${correctLabel}.`
  elements.feedback.dataset.state = correct ? "correct" : "wrong"
  stats.record(correct)
  elements.next.disabled = false
  elements.options.querySelectorAll("button").forEach(button => {
    button.disabled = true
    if (button.textContent === correctLabel) {
      button.classList.add("correct")
    } else if (!correct && button.textContent === option.label) {
      button.classList.add("wrong")
    }
  })
}

if (elements.next) {
  elements.next.addEventListener("click", setTile)
}

setTile()
