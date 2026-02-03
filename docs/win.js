const WIN_STEPS = [
  {
    caption: "You are one tile away from winning (waiting).",
    tiles: [
      "MJ2bing", "MJ3bing", "MJ4bing",
      "MJ5tiao", "MJ6tiao", "MJ7tiao",
      "MJ4wan", "MJ5wan", "MJ6wan",
      "MJEastwind", "MJEastwind",
      "MJReddragon"
    ]
  },
  {
    caption: "You draw the final tile to complete your hand.",
    tiles: [
      "MJ2bing", "MJ3bing", "MJ4bing",
      "MJ5tiao", "MJ6tiao", "MJ7tiao",
      "MJ4wan", "MJ5wan", "MJ6wan",
      "MJEastwind", "MJEastwind",
      "MJReddragon", "MJReddragon"
    ]
  },
  {
    caption: "Declare win and reveal your completed hand.",
    tiles: [
      "MJ2bing", "MJ3bing", "MJ4bing",
      "MJ5tiao", "MJ6tiao", "MJ7tiao",
      "MJ4wan", "MJ5wan", "MJ6wan",
      "MJEastwind", "MJEastwind",
      "MJReddragon", "MJReddragon"
    ]
  }
]

const elements = {
  hand: document.getElementById("winHand"),
  caption: document.getElementById("winCaption"),
  next: document.getElementById("winNext"),
  prev: document.getElementById("winPrev")
}

let index = 0

const render = () => {
  const step = WIN_STEPS[index]
  elements.hand.innerHTML = ""
  step.tiles.forEach(tile => {
    const img = document.createElement("img")
    img.src = `tiles/${tile}.svg`
    img.alt = tile
    elements.hand.appendChild(img)
  })
  elements.caption.textContent = step.caption
  elements.prev.disabled = index === 0
  elements.next.disabled = index === WIN_STEPS.length - 1
}

if (elements.next) {
  elements.next.addEventListener("click", () => {
    index = Math.min(index + 1, WIN_STEPS.length - 1)
    render()
  })
}

if (elements.prev) {
  elements.prev.addEventListener("click", () => {
    index = Math.max(index - 1, 0)
    render()
  })
}

render()
