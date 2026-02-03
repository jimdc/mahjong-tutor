const TILE_LABELS = {
  MJ1bing: "1 Dot (coins)",
  MJ2bing: "2 Dot (coins)",
  MJ3bing: "3 Dot (coins)",
  MJ4bing: "4 Dot (coins)",
  MJ5bing: "5 Dot (coins)",
  MJ6bing: "6 Dot (coins)",
  MJ7bing: "7 Dot (coins)",
  MJ8bing: "8 Dot (coins)",
  MJ9bing: "9 Dot (coins)",
  MJ1tiao: "1 Bamboo (sticks)",
  MJ2tiao: "2 Bamboo (sticks)",
  MJ3tiao: "3 Bamboo (sticks)",
  MJ4tiao: "4 Bamboo (sticks)",
  MJ5tiao: "5 Bamboo (sticks)",
  MJ6tiao: "6 Bamboo (sticks)",
  MJ7tiao: "7 Bamboo (sticks)",
  MJ8tiao: "8 Bamboo (sticks)",
  MJ9tiao: "9 Bamboo (sticks)",
  MJ1wan: "1 Character (myriad)",
  MJ2wan: "2 Character (myriad)",
  MJ3wan: "3 Character (myriad)",
  MJ4wan: "4 Character (myriad)",
  MJ5wan: "5 Character (myriad)",
  MJ6wan: "6 Character (myriad)",
  MJ7wan: "7 Character (myriad)",
  MJ8wan: "8 Character (myriad)",
  MJ9wan: "9 Character (myriad)",
  MJEastwind: "East Wind (honor)",
  MJSouthwind: "South Wind (honor)",
  MJWestwind: "West Wind (honor)",
  MJNorthwind: "North Wind (honor)",
  MJReddragon: "Red Dragon (honor)",
  MJGreendragon: "Green Dragon (honor)",
  MJbaida: "White Dragon (honor)"
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
