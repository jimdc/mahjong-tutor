const FLOW_STEPS = [
  {
    caption: "Start your turn with a 13-tile hand.",
    tiles: [
      "MJ2bing", "MJ3bing", "MJ4bing",
      "MJ5tiao", "MJ6tiao", "MJ7tiao",
      "MJ4wan", "MJ5wan", "MJ6wan",
      "MJEastwind", "MJEastwind",
      "MJReddragon", "MJ9tiao"
    ],
    pool: ["MJ1wan", "MJ7bing"],
    claim: null,
    claimNote: ""
  },
  {
    caption: "Draw a tile to make 14 tiles.",
    tiles: [
      "MJ2bing", "MJ3bing", "MJ4bing",
      "MJ5tiao", "MJ6tiao", "MJ7tiao",
      "MJ4wan", "MJ5wan", "MJ6wan",
      "MJEastwind", "MJEastwind",
      "MJReddragon", "MJ9tiao", "MJ8tiao"
    ],
    pool: ["MJ1wan", "MJ7bing"],
    claim: null,
    claimNote: ""
  },
  {
    caption: "Discard one tile (here, the 9 Bamboo).",
    tiles: [
      "MJ2bing", "MJ3bing", "MJ4bing",
      "MJ5tiao", "MJ6tiao", "MJ7tiao",
      "MJ4wan", "MJ5wan", "MJ6wan",
      "MJEastwind", "MJEastwind",
      "MJReddragon", "MJ8tiao"
    ],
    pool: ["MJ1wan", "MJ7bing", "MJ9tiao"],
    claim: null,
    claimNote: ""
  },
  {
    caption: "An opponent claims your discard to complete a pung.",
    tiles: [
      "MJ2bing", "MJ3bing", "MJ4bing",
      "MJ5tiao", "MJ6tiao", "MJ7tiao",
      "MJ4wan", "MJ5wan", "MJ6wan",
      "MJEastwind", "MJEastwind",
      "MJReddragon", "MJ8tiao"
    ],
    pool: ["MJ1wan", "MJ7bing"],
    claim: "MJ9tiao",
    claimNote: "Claimed discard leaves your pool and forms a meld for the opponent."
  },
  {
    caption: "If you complete a winning hand, declare win immediately.",
    tiles: [
      "MJ2bing", "MJ3bing", "MJ4bing",
      "MJ5tiao", "MJ6tiao", "MJ7tiao",
      "MJ4wan", "MJ5wan", "MJ6wan",
      "MJEastwind", "MJEastwind",
      "MJReddragon", "MJReddragon"
    ],
    pool: ["MJ1wan", "MJ7bing"],
    claim: null,
    claimNote: ""
  }
]

const state = {
  index: 0
}

const elements = {
  hand: document.getElementById("flowHand"),
  pool: document.getElementById("flowPool"),
  claim: document.getElementById("flowClaim"),
  claimNote: document.getElementById("flowClaimNote"),
  caption: document.getElementById("flowCaption"),
  next: document.getElementById("flowNext"),
  prev: document.getElementById("flowPrev")
}

const renderTiles = (target, tiles, className) => {
  target.innerHTML = ""
  tiles.forEach(tile => {
    const img = document.createElement("img")
    img.src = `tiles/${tile}.svg`
    img.alt = tile
    if (className) img.className = className
    target.appendChild(img)
  })
}

const render = () => {
  const step = FLOW_STEPS[state.index]
  renderTiles(elements.hand, step.tiles)
  renderTiles(elements.pool, step.pool)

  elements.claim.innerHTML = ""
  if (step.claim) {
    const img = document.createElement("img")
    img.src = `tiles/${step.claim}.svg`
    img.alt = step.claim
    img.className = "flow-claim"
    elements.claim.appendChild(img)
    elements.claim.classList.add("is-claim")
    elements.claimNote.textContent = step.claimNote
  } else {
    elements.claim.classList.remove("is-claim")
    elements.claimNote.textContent = ""
  }

  elements.caption.textContent = step.caption
  elements.prev.disabled = state.index === 0
  elements.next.disabled = state.index === FLOW_STEPS.length - 1
}

if (elements.next) {
  elements.next.addEventListener("click", () => {
    state.index = Math.min(state.index + 1, FLOW_STEPS.length - 1)
    render()
  })
}

if (elements.prev) {
  elements.prev.addEventListener("click", () => {
    state.index = Math.max(state.index - 1, 0)
    render()
  })
}

render()
