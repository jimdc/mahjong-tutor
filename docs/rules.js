const FLOW_STEPS = [
  {
    caption: "Start your turn with a 13-tile hand.",
    turn: "Your turn",
    tiles: [
      "MJ2bing", "MJ3bing", "MJ4bing",
      "MJ5tiao", "MJ6tiao", "MJ7tiao",
      "MJ4wan", "MJ5wan", "MJ6wan",
      "MJEastwind", "MJEastwind",
      "MJReddragon", "MJ9tiao"
    ],
    pool: ["MJ1wan", "MJ7bing"],
    opponentPool: ["MJ3tiao"],
    opponentHandCount: 13,
    claim: null,
    claimNote: ""
  },
  {
    caption: "Draw a tile to make 14 tiles.",
    turn: "Your turn",
    tiles: [
      "MJ2bing", "MJ3bing", "MJ4bing",
      "MJ5tiao", "MJ6tiao", "MJ7tiao",
      "MJ4wan", "MJ5wan", "MJ6wan",
      "MJEastwind", "MJEastwind",
      "MJReddragon", "MJ9tiao", "MJ8tiao"
    ],
    pool: ["MJ1wan", "MJ7bing"],
    opponentPool: ["MJ3tiao"],
    opponentHandCount: 13,
    claim: null,
    claimNote: ""
  },
  {
    caption: "Discard one tile (here, the 9 Bamboo).",
    turn: "Your turn",
    tiles: [
      "MJ2bing", "MJ3bing", "MJ4bing",
      "MJ5tiao", "MJ6tiao", "MJ7tiao",
      "MJ4wan", "MJ5wan", "MJ6wan",
      "MJEastwind", "MJEastwind",
      "MJReddragon", "MJ8tiao"
    ],
    pool: ["MJ1wan", "MJ7bing", "MJ9tiao"],
    opponentPool: ["MJ3tiao"],
    opponentHandCount: 13,
    claim: null,
    claimNote: ""
  },
  {
    caption: "An opponent claims your discard to complete a pung.",
    turn: "Opponent turn",
    tiles: [
      "MJ2bing", "MJ3bing", "MJ4bing",
      "MJ5tiao", "MJ6tiao", "MJ7tiao",
      "MJ4wan", "MJ5wan", "MJ6wan",
      "MJEastwind", "MJEastwind",
      "MJReddragon", "MJ8tiao"
    ],
    pool: ["MJ1wan", "MJ7bing"],
    opponentPool: ["MJ3tiao"],
    opponentHandCount: 14,
    claim: "MJ9tiao",
    claimNote: "Claimed discard leaves your pool and forms a meld for the opponent."
  },
  {
    caption: "If you complete a winning hand, declare win immediately.",
    turn: "Your turn",
    tiles: [
      "MJ2bing", "MJ3bing", "MJ4bing",
      "MJ5tiao", "MJ6tiao", "MJ7tiao",
      "MJ4wan", "MJ5wan", "MJ6wan",
      "MJEastwind", "MJEastwind",
      "MJReddragon", "MJReddragon"
    ],
    pool: ["MJ1wan", "MJ7bing"],
    opponentPool: ["MJ3tiao", "MJ9tiao"],
    opponentHandCount: 13,
    claim: null,
    claimNote: ""
  }
]

const state = {
  index: 0
}

const elements = {
  card: document.querySelector(".flow-card"),
  hand: document.getElementById("flowHand"),
  pool: document.getElementById("flowPool"),
  opponentPool: document.getElementById("flowOpponentPool"),
  opponentHand: document.getElementById("flowOpponentHand"),
  claim: document.getElementById("flowClaim"),
  claimNote: document.getElementById("flowClaimNote"),
  caption: document.getElementById("flowCaption"),
  turn: document.getElementById("flowTurn"),
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

const renderFaceDown = (target, count) => {
  target.innerHTML = ""
  for (let i = 0; i < count; i += 1) {
    const back = document.createElement("div")
    back.className = "tile-back"
    target.appendChild(back)
  }
}

const render = () => {
  const step = FLOW_STEPS[state.index]
  if (elements.card) {
    elements.card.classList.remove("is-animating")
    // force reflow
    void elements.card.offsetWidth
    elements.card.classList.add("is-animating")
    setTimeout(() => elements.card && elements.card.classList.remove("is-animating"), 300)
  }
  renderTiles(elements.hand, step.tiles)
  renderTiles(elements.pool, step.pool)
  renderTiles(elements.opponentPool, step.opponentPool || [])
  renderFaceDown(elements.opponentHand, step.opponentHandCount || 13)

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
  elements.turn.textContent = step.turn || "Your turn"
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
