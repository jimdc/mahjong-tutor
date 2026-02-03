const TILE_LABELS = {
  MJ1bing: "1 Dot",
  MJ2bing: "2 Dot",
  MJ3bing: "3 Dot",
  MJ4bing: "4 Dot",
  MJ5bing: "5 Dot",
  MJ6bing: "6 Dot",
  MJ7bing: "7 Dot",
  MJ8bing: "8 Dot",
  MJ9bing: "9 Dot",
  MJ1tiao: "1 Bamboo",
  MJ2tiao: "2 Bamboo",
  MJ3tiao: "3 Bamboo",
  MJ4tiao: "4 Bamboo",
  MJ5tiao: "5 Bamboo",
  MJ6tiao: "6 Bamboo",
  MJ7tiao: "7 Bamboo",
  MJ8tiao: "8 Bamboo",
  MJ9tiao: "9 Bamboo",
  MJ1wan: "1 Character",
  MJ2wan: "2 Character",
  MJ3wan: "3 Character",
  MJ4wan: "4 Character",
  MJ5wan: "5 Character",
  MJ6wan: "6 Character",
  MJ7wan: "7 Character",
  MJ8wan: "8 Character",
  MJ9wan: "9 Character",
  MJEastwind: "East Wind",
  MJSouthwind: "South Wind",
  MJWestwind: "West Wind",
  MJNorthwind: "North Wind",
  MJReddragon: "Red Dragon",
  MJGreendragon: "Green Dragon",
  MJbaida: "White Dragon"
}

const labelFromSrc = src => {
  if (!src) return null
  const match = src.match(/MJ[^/]+(?=\.svg)/)
  if (!match) return null
  return TILE_LABELS[match[0]] || null
}

const applyTileLabels = () => {
  document.querySelectorAll("img[src*='tiles/MJ']").forEach(img => {
    const label = labelFromSrc(img.getAttribute("src"))
    if (!label) return
    img.alt = label
    img.title = label
  })
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", applyTileLabels)
} else {
  applyTileLabels()
}
