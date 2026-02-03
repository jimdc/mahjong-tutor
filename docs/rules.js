const FLOW_STEPS = [
  {
    caption: "Start your turn with a 13-tile hand.",
    tiles: [
      "MJ2bing", "MJ3bing", "MJ4bing",
      "MJ5tiao", "MJ6tiao", "MJ7tiao",
      "MJ4wan", "MJ5wan", "MJ6wan",
      "MJEastwind", "MJEastwind",
      "MJReddragon", "MJ9tiao"
    ]
  },
  {
    caption: "Draw a tile to make 14 tiles.",
    tiles: [
      "MJ2bing", "MJ3bing", "MJ4bing",
      "MJ5tiao", "MJ6tiao", "MJ7tiao",
      "MJ4wan", "MJ5wan", "MJ6wan",
      "MJEastwind", "MJEastwind",
      "MJReddragon", "MJ9tiao", "MJ8tiao"
    ]
  },
  {
    caption: "Now discard one tile (here, the 9 Bamboo).",
    tiles: [
      "MJ2bing", "MJ3bing", "MJ4bing",
      "MJ5tiao", "MJ6tiao", "MJ7tiao",
      "MJ4wan", "MJ5wan", "MJ6wan",
      "MJEastwind", "MJEastwind",
      "MJReddragon", "MJ8tiao"
    ]
  },
  {
    caption: "If you complete a winning hand, declare win immediately.",
    tiles: [
      "MJ2bing", "MJ3bing", "MJ4bing",
      "MJ5tiao", "MJ6tiao", "MJ7tiao",
      "MJ4wan", "MJ5wan", "MJ6wan",
      "MJEastwind", "MJEastwind",
      "MJReddragon", "MJReddragon"
    ]
  }
]

const state = {
  index: 0
}

const elements = {
  hand: document.getElementById("flowHand"),
  caption: document.getElementById("flowCaption"),
  next: document.getElementById("flowNext"),
  prev: document.getElementById("flowPrev")
}

const render = () => {
  const step = FLOW_STEPS[state.index]
  elements.hand.innerHTML = ""
  step.tiles.forEach(tile => {
    const img = document.createElement("img")
    img.src = `tiles/${tile}.svg`
    img.alt = tile
    elements.hand.appendChild(img)
  })
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
