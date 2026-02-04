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
    id: "basic-chow",
    title: "Build toward a chow",
    hand: [
      "1 Dot", "2 Dot", "3 Dot", "4 Dot",
      "7 Bamboo", "8 Bamboo",
      "2 Character", "3 Character", "4 Character",
      "East Wind", "East Wind",
      "Red Dragon", "9 Bamboo"
    ],
    groups: [
      { label: "Meld (Chow / 吃 chī)", tiles: ["1 Dot", "2 Dot", "3 Dot"] },
      { label: "Partial (Run)", tiles: ["2 Character", "3 Character", "4 Character"] },
      { label: "Partial (Run)", tiles: ["7 Bamboo", "8 Bamboo"] },
      { label: "Pair (将/对子 jiàng/duìzi)", tiles: ["East Wind", "East Wind"] },
      { label: "Singles", tiles: ["4 Dot", "Red Dragon", "9 Bamboo"] }
    ],
    bestDiscard: "9 Bamboo",
    reason: "It is isolated. Keeping 7-8 Bamboo creates a potential 6-7-8 or 7-8-9 chow, but only if you see 6 or 9 Bamboo later.",
    tip: "Look for tiles that do not connect to a sequence or pair."
  },
  {
    id: "pair-up",
    title: "Secure a pair",
    hand: [
      "2 Dot", "3 Dot", "4 Dot",
      "5 Bamboo", "6 Bamboo", "7 Bamboo",
      "3 Character", "4 Character", "5 Character",
      "White Dragon", "White Dragon",
      "9 Dot", "1 Character"
    ],
    groups: [
      { label: "Meld (Chow / 吃 chī)", tiles: ["2 Dot", "3 Dot", "4 Dot"] },
      { label: "Meld (Chow / 吃 chī)", tiles: ["5 Bamboo", "6 Bamboo", "7 Bamboo"] },
      { label: "Partial (Run)", tiles: ["3 Character", "4 Character", "5 Character"] },
      { label: "Pair (将/对子 jiàng/duìzi)", tiles: ["White Dragon", "White Dragon"] },
      { label: "Singles", tiles: ["9 Dot", "1 Character"] }
    ],
    bestDiscard: "1 Character",
    reason: "It does not extend any existing run and does not make a pair. You already have a pair in White Dragons.",
    tip: "Once you have a pair, focus on clean melds."
  },
  {
    id: "honor-keep",
    title: "Honor tile value",
    hand: [
      "2 Dot", "3 Dot", "4 Dot",
      "6 Bamboo", "7 Bamboo", "8 Bamboo",
      "4 Character", "5 Character", "6 Character",
      "Green Dragon", "Green Dragon",
      "9 Bamboo", "1 Dot"
    ],
    groups: [
      { label: "Meld (Chow / 吃 chī)", tiles: ["2 Dot", "3 Dot", "4 Dot"] },
      { label: "Meld (Chow / 吃 chī)", tiles: ["6 Bamboo", "7 Bamboo", "8 Bamboo"] },
      { label: "Partial (Run)", tiles: ["4 Character", "5 Character", "6 Character"] },
      { label: "Pair (将/对子 jiàng/duìzi)", tiles: ["Green Dragon", "Green Dragon"] },
      { label: "Singles", tiles: ["9 Bamboo", "1 Dot"] }
    ],
    bestDiscard: "1 Dot",
    reason: "The 1 Dot is isolated. The Green Dragon pair is valuable and can become a scoring pung.",
    tip: "Pairs of dragons or winds are often worth keeping."
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
  title: document.getElementById("coachTitle"),
  explain: document.getElementById("coachExplain"),
  hand: document.getElementById("coachHand"),
  choices: document.getElementById("coachChoices"),
  feedback: document.getElementById("coachFeedback"),
  tip: document.getElementById("coachTip"),
  next: document.getElementById("coachNext"),
  viewGrouped: document.getElementById("coachViewGrouped"),
  viewRaw: document.getElementById("coachViewRaw")
}

let scenarios = shuffle(SCENARIOS)
let index = 0
let current = null
let groupedView = true

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

const renderGroups = () => {
  elements.hand.innerHTML = ""
  current.groups.forEach(group => {
    const groupEl = document.createElement("div")
    groupEl.className = "coach-group"

    const label = document.createElement("span")
    label.className = "coach-group__label"
    label.textContent = group.label

    const tiles = document.createElement("div")
    tiles.className = "coach-group__tiles"
    group.tiles.forEach(tile => tiles.appendChild(buildTileNode(tile)))

    groupEl.appendChild(label)
    groupEl.appendChild(tiles)
    elements.hand.appendChild(groupEl)
  })
}

const renderRaw = () => {
  elements.hand.innerHTML = ""
  const raw = document.createElement("div")
  raw.className = "coach-raw"
  current.hand.forEach(tile => raw.appendChild(buildTileNode(tile)))
  elements.hand.appendChild(raw)
}

const renderHand = () => {
  if (groupedView) {
    renderGroups()
  } else {
    renderRaw()
  }
  elements.viewGrouped.classList.toggle("is-active", groupedView)
  elements.viewRaw.classList.toggle("is-active", !groupedView)
}

const renderChoices = () => {
  elements.choices.innerHTML = ""
  current.hand.forEach(tile => {
    const button = document.createElement("button")
    button.type = "button"
    button.className = "tutor-option coach-choice"

    const meta = tileMeta(tile)
    const img = document.createElement("img")
    img.className = "coach-choice__img"
    img.alt = tile
    img.src = meta.svg

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
    button.addEventListener("click", () => handleChoice(tile))
    elements.choices.appendChild(button)
  })
}

const loadScenario = () => {
  current = scenarios[index]
  elements.title.textContent = current.title
  elements.explain.textContent = "Choose the best discard from this 13-tile hand."
  elements.feedback.textContent = ""
  elements.tip.textContent = ""
  elements.next.disabled = true

  renderHand()
  renderChoices()
}

const handleChoice = tile => {
  const correct = tile === current.bestDiscard

  if (correct) {
    elements.feedback.textContent = `Good discard. ${current.reason}`
    elements.feedback.dataset.state = "correct"
    elements.tip.textContent = current.tip
  } else {
    elements.feedback.textContent = `Not the best discard. ${current.reason}`
    elements.feedback.dataset.state = "wrong"
    elements.tip.textContent = "Try to keep tiles that form sequences or pairs."
  }

  if (correct) {
    elements.next.disabled = false
    elements.choices.querySelectorAll("button").forEach(button => {
      button.disabled = true
    })
  } else {
    // keep other options available so the player can try again
    elements.choices.querySelectorAll("button").forEach(button => {
      if (button.textContent === tile) {
        button.disabled = true
        button.classList.add("wrong")
      }
    })
  }
}

const nextScenario = () => {
  index = (index + 1) % scenarios.length
  loadScenario()
}

if (elements.next) {
  elements.next.addEventListener("click", nextScenario)
}

if (elements.viewGrouped) {
  elements.viewGrouped.addEventListener("click", () => {
    groupedView = true
    renderHand()
  })
}

if (elements.viewRaw) {
  elements.viewRaw.addEventListener("click", () => {
    groupedView = false
    renderHand()
  })
}

loadScenario()
