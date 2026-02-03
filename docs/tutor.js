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
  streak: document.getElementById("streak"),
  next: document.getElementById("next"),
  explain: document.getElementById("explain"),
  detailsToggle: document.getElementById("detailsToggle"),
  detailsList: document.getElementById("detailsList")
}

let scoreValue = 0
let streakValue = 0
let currentTile = null
let choices = []

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
  currentTile = TILES[Math.floor(Math.random() * TILES.length)]
  const distractors = shuffle(TILES.filter(tile => tile.id !== currentTile.id)).slice(0, 3)
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
    scoreValue += 1
    streakValue += 1
    elements.feedback.textContent = `Correct! This is ${currentTile.label}.`
    elements.feedback.dataset.state = "correct"
  } else {
    streakValue = 0
    elements.feedback.textContent = `Not quite. This is ${currentTile.label}.`
    elements.feedback.dataset.state = "wrong"
  }

  elements.score.textContent = scoreValue
  elements.streak.textContent = streakValue
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

nextQuestion()
