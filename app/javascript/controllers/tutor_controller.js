import { Controller } from "@hotwired/stimulus"

const glyph = codePoint => String.fromCodePoint(codePoint)

const DOT_SVG = number => `/tiles/MJ${number}bing.svg`
const BAMBOO_SVG = number => `/tiles/MJ${number}tiao.svg`
const CHARACTER_SVG = number => `/tiles/MJ${number}wan.svg`

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
    svg: "/tiles/MJEastwind.svg",
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
    svg: "/tiles/MJSouthwind.svg",
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
    svg: "/tiles/MJWestwind.svg",
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
    svg: "/tiles/MJNorthwind.svg",
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
    svg: "/tiles/MJReddragon.svg",
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
    svg: "/tiles/MJGreendragon.svg",
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
    svg: "/tiles/MJbaida.svg",
    explain: "Dragons are honor tiles: red, green, and white (often shown as a blank/board).",
    details: [
      "Also called White Dragon or Bai (white board).",
      "Often drawn as a frame or blank tile.",
      "Not part of the three suits."
    ]
  }
]

function shuffle(values) {
  const array = values.slice()
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export default class extends Controller {
  static targets = [
    "tile",
    "tileImage",
    "tileGlyph",
    "options",
    "feedback",
    "score",
    "streak",
    "next",
    "explain",
    "detailsToggle",
    "detailsList"
  ]

  connect() {
    this.scoreValue = 0
    this.streakValue = 0
    this.nextQuestion()
  }

  nextQuestion() {
    this.currentTile = TILES[Math.floor(Math.random() * TILES.length)]
    const distractors = shuffle(TILES.filter(tile => tile.id !== this.currentTile.id)).slice(0, 3)
    this.choices = shuffle([this.currentTile, ...distractors])

    this.tileGlyphTarget.textContent = this.currentTile.display
    this.tileTarget.setAttribute("aria-label", this.currentTile.label)
    this.explainTarget.textContent = this.currentTile.explain
    this.setTileImage()
    this.renderDetails()
    this.collapseDetails()
    this.feedbackTarget.textContent = ""
    this.nextTarget.disabled = true

    this.renderChoices()
  }

  renderChoices() {
    this.optionsTarget.innerHTML = ""
    this.choices.forEach(choice => {
      const button = document.createElement("button")
      button.type = "button"
      button.className = "tutor-option"
      button.textContent = choice.label
      button.dataset.tileId = choice.id
      button.addEventListener("click", () => this.handleGuess(choice))
      this.optionsTarget.appendChild(button)
    })
  }

  handleGuess(choice) {
    const correct = choice.id === this.currentTile.id

    if (correct) {
      this.scoreValue += 1
      this.streakValue += 1
      this.feedbackTarget.textContent = `Correct! This is ${this.currentTile.label}.`
      this.feedbackTarget.dataset.state = "correct"
    } else {
      this.streakValue = 0
      this.feedbackTarget.textContent = `Not quite. This is ${this.currentTile.label}.`
      this.feedbackTarget.dataset.state = "wrong"
    }

    this.scoreTarget.textContent = this.scoreValue
    this.streakTarget.textContent = this.streakValue
    this.nextTarget.disabled = false

    this.optionsTarget.querySelectorAll("button").forEach(button => {
      button.disabled = true
      if (button.dataset.tileId === this.currentTile.id) {
        button.classList.add("correct")
      } else if (button.dataset.tileId === choice.id && !correct) {
        button.classList.add("wrong")
      }
    })
  }

  setTileImage() {
    if (!this.tileImageTarget) {
      return
    }

    const svgPath = this.currentTile.svg
    if (!svgPath) {
      this.tileImageTarget.hidden = true
      this.tileGlyphTarget.style.opacity = "1"
      return
    }

    this.tileImageTarget.hidden = false
    this.tileImageTarget.src = svgPath
    this.tileImageTarget.alt = this.currentTile.label

    this.tileImageTarget.onload = () => {
      this.tileGlyphTarget.style.opacity = "0"
    }

    this.tileImageTarget.onerror = () => {
      this.tileImageTarget.hidden = true
      this.tileGlyphTarget.style.opacity = "1"
    }
  }

  renderDetails() {
    this.detailsListTarget.innerHTML = ""
    const items = this.currentTile.details || []
    items.forEach(detail => {
      const li = document.createElement("li")
      li.textContent = detail
      this.detailsListTarget.appendChild(li)
    })
  }

  toggleDetails() {
    const isOpen = this.detailsListTarget.classList.toggle("is-open")
    this.detailsToggleTarget.setAttribute(
      "aria-expanded",
      isOpen ? "true" : "false"
    )
  }

  collapseDetails() {
    this.detailsListTarget.classList.remove("is-open")
    this.detailsToggleTarget.setAttribute("aria-expanded", "false")
  }

  next() {
    this.nextQuestion()
  }
}
