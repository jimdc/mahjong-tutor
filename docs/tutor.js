const glyph = codePoint => String.fromCodePoint(codePoint)

const DOT_SVG = number => `tiles/MJ${number}bing.svg`
const BAMBOO_SVG = number => `tiles/MJ${number}tiao.svg`
const CHARACTER_SVG = number => `tiles/MJ${number}wan.svg`

const TILES = [
  ...Array.from({ length: 9 }, (_, i) => ({
    id: `dot-${i + 1}`,
    label: `${i + 1} Dot`,
    display: glyph(0x1f019 + i),
    svg: DOT_SVG(i + 1),
    explain: "Dots (circles) resemble coins. The number is the count of circles.",
    group: "suit",
    details: [
      "Also called Circles or Coins.",
      "Most rule sets treat dots as a simple suit.",
      "The 1 Dot is often a bird design in tile art."
    ]
  })),
  ...Array.from({ length: 9 }, (_, i) => ({
    id: `bamboo-${i + 1}`,
    label: `${i + 1} Bamboo`,
    display: glyph(0x1f010 + i),
    svg: BAMBOO_SVG(i + 1),
    explain: "Bamboo (sticks) are a suit; the number shows how many bamboos.",
    group: "suit",
    details: [
      "Also called Sticks.",
      "The 1 Bamboo is often a bird (peacock) in tile art.",
      "Higher numbers show stacked bamboo stalks."
    ]
  })),
  ...Array.from({ length: 9 }, (_, i) => ({
    id: `character-${i + 1}`,
    label: `${i + 1} Character`,
    display: glyph(0x1f007 + i),
    svg: CHARACTER_SVG(i + 1),
    explain: "Characters are the “wan” (myriad) suit: a number plus the 10,000 character.",
    group: "suit",
    details: [
      "Also called Myriads.",
      "Each tile shows a number and the character 萬.",
      "It historically references 10,000 coins."
    ]
  })),
  {
    id: "wind-east",
    label: "East Wind",
    display: glyph(0x1f000),
    svg: "tiles/MJEastwind.svg",
    explain: "Winds are honor tiles named for the four directions.",
    group: "honor",
    details: [
      "Honor tiles can score bonus points in many rule sets.",
      "The prevailing wind can change during a game.",
      "Winds are not part of the three suits."
    ]
  },
  {
    id: "wind-south",
    label: "South Wind",
    display: glyph(0x1f001),
    svg: "tiles/MJSouthwind.svg",
    explain: "Winds are honor tiles named for the four directions.",
    group: "honor",
    details: [
      "Honor tiles can score bonus points in many rule sets.",
      "The prevailing wind can change during a game.",
      "Winds are not part of the three suits."
    ]
  },
  {
    id: "wind-west",
    label: "West Wind",
    display: glyph(0x1f002),
    svg: "tiles/MJWestwind.svg",
    explain: "Winds are honor tiles named for the four directions.",
    group: "honor",
    details: [
      "Honor tiles can score bonus points in many rule sets.",
      "The prevailing wind can change during a game.",
      "Winds are not part of the three suits."
    ]
  },
  {
    id: "wind-north",
    label: "North Wind",
    display: glyph(0x1f003),
    svg: "tiles/MJNorthwind.svg",
    explain: "Winds are honor tiles named for the four directions.",
    group: "honor",
    details: [
      "Honor tiles can score bonus points in many rule sets.",
      "The prevailing wind can change during a game.",
      "Winds are not part of the three suits."
    ]
  },
  {
    id: "dragon-red",
    label: "Red Dragon",
    display: glyph(0x1f004),
    svg: "tiles/MJReddragon.svg",
    explain: "Dragons are honor tiles: red, green, and white.",
    group: "honor",
    details: [
      "Also called the three dragons (chun, fa, bai).",
      "Often used for value pungs/kongs.",
      "Not part of the three suits."
    ]
  },
  {
    id: "dragon-green",
    label: "Green Dragon",
    display: glyph(0x1f005),
    svg: "tiles/MJGreendragon.svg",
    explain: "Dragons are honor tiles: red, green, and white.",
    group: "honor",
    details: [
      "Also called the three dragons (chun, fa, bai).",
      "Often used for value pungs/kongs.",
      "Not part of the three suits."
    ]
  },
  {
    id: "dragon-white",
    label: "White Dragon",
    display: glyph(0x1f006),
    svg: "tiles/MJbaida.svg",
    explain: "Dragons are honor tiles: red, green, and white (often shown as a blank/board).",
    group: "honor",
    details: [
      "Also called White Dragon or Bai (white board).",
      "Often drawn as a frame or blank tile.",
      "Not part of the three suits."
    ]
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
  tile: document.getElementById("tile"),
  tileImage: document.getElementById("tileImage"),
  tileGlyph: document.getElementById("tileGlyph"),
  options: document.getElementById("options"),
  feedback: document.getElementById("feedback"),
  score: document.getElementById("score"),
  attempts: document.getElementById("attempts"),
  accuracy: document.getElementById("accuracy"),
  streak: document.getElementById("streak"),
  next: document.getElementById("next"),
  explain: document.getElementById("explain"),
  detailsToggle: document.getElementById("detailsToggle"),
  detailsList: document.getElementById("detailsList"),
  filter: document.getElementById("quizFilter"),
  missedList: document.getElementById("missedList")
}

const STATS_KEY = "tile-quiz-stats"

const loadStats = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(STATS_KEY)) || {}
    return {
      correct: stored.correct || 0,
      attempts: stored.attempts || 0,
      streak: stored.streak || 0,
      missed: Array.isArray(stored.missed) ? stored.missed : []
    }
  } catch (error) {
    return { correct: 0, attempts: 0, streak: 0, missed: [] }
  }
}

let stats = loadStats()
let currentTile = null
let choices = []
let filterValue = "all"
let lastTileId = null

const saveStats = () => {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats))
}

const renderStats = () => {
  if (elements.score) elements.score.textContent = stats.correct
  if (elements.attempts) elements.attempts.textContent = stats.attempts
  if (elements.accuracy) {
    const accuracy = stats.attempts ? Math.round((stats.correct / stats.attempts) * 100) : 0
    elements.accuracy.textContent = `${accuracy}%`
  }
  if (elements.streak) elements.streak.textContent = stats.streak
}

const renderMissed = () => {
  if (!elements.missedList) return
  elements.missedList.innerHTML = ""
  if (!stats.missed.length) {
    const li = document.createElement("li")
    li.textContent = "No misses yet. Nice work!"
    elements.missedList.appendChild(li)
    return
  }
  stats.missed.forEach(label => {
    const li = document.createElement("li")
    li.textContent = label
    elements.missedList.appendChild(li)
  })
}

const renderChoices = () => {
  elements.options.innerHTML = ""
  choices.forEach(choice => {
    const button = document.createElement("button")
    button.type = "button"
    button.className = "tutor-option"
    button.textContent = choice.label
    button.dataset.tileId = choice.id
    button.addEventListener("click", () => handleGuess(choice))
    elements.options.appendChild(button)
  })
}

const renderDetails = () => {
  elements.detailsList.innerHTML = ""
  const items = currentTile.details || []
  items.forEach(detail => {
    const li = document.createElement("li")
    li.textContent = detail
    elements.detailsList.appendChild(li)
  })
}

const collapseDetails = () => {
  elements.detailsList.classList.remove("is-open")
  elements.detailsToggle.setAttribute("aria-expanded", "false")
}

const setTileImage = () => {
  if (!currentTile.svg) {
    elements.tileImage.hidden = true
    elements.tileGlyph.style.opacity = "1"
    return
  }

  elements.tileImage.hidden = false
  elements.tileImage.src = currentTile.svg
  elements.tileImage.alt = currentTile.label

  elements.tileImage.onload = () => {
    elements.tileGlyph.style.opacity = "0"
  }

  elements.tileImage.onerror = () => {
    elements.tileImage.hidden = true
    elements.tileGlyph.style.opacity = "1"
  }
}

const nextQuestion = () => {
  const pool = filterValue === "all" ? TILES : TILES.filter(tile => tile.group === filterValue)
  let next = pool[Math.floor(Math.random() * pool.length)]
  while (next.id === lastTileId && pool.length > 1) {
    next = pool[Math.floor(Math.random() * pool.length)]
  }
  currentTile = next
  lastTileId = currentTile.id
  const distractors = shuffle(pool.filter(tile => tile.id !== currentTile.id)).slice(0, 3)
  choices = shuffle([currentTile, ...distractors])

  elements.tileGlyph.textContent = currentTile.display
  elements.tile.setAttribute("aria-label", currentTile.label)
  elements.explain.textContent = currentTile.explain
  elements.feedback.textContent = ""
  elements.next.disabled = true

  renderChoices()
  renderDetails()
  collapseDetails()
  setTileImage()
}

const handleGuess = choice => {
  const correct = choice.id === currentTile.id

  if (correct) {
    stats.correct += 1
    stats.attempts += 1
    stats.streak += 1
    stats.missed = stats.missed.filter(label => label !== currentTile.label)
    elements.feedback.textContent = `Correct! This is ${currentTile.label}.`
    elements.feedback.dataset.state = "correct"
  } else {
    stats.attempts += 1
    stats.streak = 0
    stats.missed = stats.missed.filter(label => label !== currentTile.label)
    stats.missed.unshift(currentTile.label)
    stats.missed = stats.missed.slice(0, 6)
    elements.feedback.textContent = `Not quite. This is ${currentTile.label}.`
    elements.feedback.dataset.state = "wrong"
  }

  saveStats()
  renderStats()
  renderMissed()
  elements.next.disabled = false

  elements.options.querySelectorAll("button").forEach(button => {
    button.disabled = true
    if (button.dataset.tileId === currentTile.id) {
      button.classList.add("correct")
    } else if (button.dataset.tileId === choice.id && !correct) {
      button.classList.add("wrong")
    }
  })
}

const toggleDetails = () => {
  const isOpen = elements.detailsList.classList.toggle("is-open")
  elements.detailsToggle.setAttribute("aria-expanded", isOpen ? "true" : "false")
}

if (elements.next) {
  elements.next.addEventListener("click", nextQuestion)
}

if (elements.detailsToggle) {
  elements.detailsToggle.addEventListener("click", toggleDetails)
}

if (elements.filter) {
  elements.filter.addEventListener("change", event => {
    filterValue = event.target.value
    nextQuestion()
  })
}

renderStats()
renderMissed()
nextQuestion()
