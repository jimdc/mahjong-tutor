const PRACTICE_DRILLS = [
  { key: "practice-winds", label: "Winds Drill", href: "practice-winds.html" },
  { key: "practice-honors", label: "Honor Tiles", href: "practice-honors.html" },
  { key: "practice-suits", label: "Suit Identification", href: "practice-suits.html" },
  { key: "practice-dragons", label: "Dragon Names", href: "practice-dragons.html" },
  { key: "practice-seats", label: "Seat Winds", href: "practice-seats.html" },
  { key: "practice-prevailing", label: "Prevailing Wind", href: "practice-prevailing.html" },
  { key: "practice-melds", label: "Meld Types", href: "practice-melds.html" },
  { key: "practice-sequence", label: "Complete the Chow", href: "practice-sequence.html" },
  { key: "practice-pair", label: "Find the Pair", href: "practice-pair.html" },
  { key: "practice-winning", label: "Winning Hands", href: "practice-winning.html" },
  { key: "practice-calls", label: "Claiming Discards", href: "practice-calls.html" },
  { key: "practice-safety", label: "Discard Safety", href: "practice-safety.html" }
]

const PATH_STEPS = [
  { id: "tile-quiz", label: "Tile Quiz: get 10 correct", href: "index.html" },
  { id: "glossary", label: "Read the Glossary basics", href: "glossary.html" },
  { id: "winds", label: "Winds Drill: 8 correct in a row", href: "practice-winds.html" },
  { id: "chow", label: "Complete the Chow drill", href: "practice-sequence.html" },
  { id: "hand-coach", label: "Hand Coach: 3 correct discards", href: "coach.html" },
  { id: "winning", label: "Winning Hand Types drill", href: "practice-winning.html" },
  { id: "safety", label: "Discard Safety drill", href: "practice-safety.html" }
]

const loadStats = key => {
  try {
    return JSON.parse(localStorage.getItem(key)) || { correct: 0, attempts: 0, streak: 0 }
  } catch (error) {
    return { correct: 0, attempts: 0, streak: 0 }
  }
}

const renderSummary = () => {
  const summaryEl = document.getElementById("practiceSummary")
  if (!summaryEl) return

  const totals = PRACTICE_DRILLS.reduce(
    (acc, drill) => {
      const stats = loadStats(drill.key)
      acc.correct += stats.correct
      acc.attempts += stats.attempts
      return acc
    },
    { correct: 0, attempts: 0 }
  )

  const overallAccuracy = totals.attempts ? Math.round((totals.correct / totals.attempts) * 100) : 0

  summaryEl.innerHTML = ""

  const overallCard = document.createElement("div")
  overallCard.className = "summary-card summary-card--overall"
  overallCard.innerHTML = `
    <h3>Overall progress</h3>
    <p class="summary-stat">${totals.correct} correct / ${totals.attempts} attempts</p>
    <div class="summary-bar"><span style="width: ${overallAccuracy}%"></span></div>
    <p class="summary-foot">Accuracy: ${overallAccuracy}%</p>
  `
  summaryEl.appendChild(overallCard)

  PRACTICE_DRILLS.forEach(drill => {
    const stats = loadStats(drill.key)
    const accuracy = stats.attempts ? Math.round((stats.correct / stats.attempts) * 100) : 0
    const card = document.createElement("a")
    card.className = "summary-card"
    card.href = drill.href
    card.innerHTML = `
      <h3>${drill.label}</h3>
      <p class="summary-stat">${stats.correct} / ${stats.attempts} correct</p>
      <div class="summary-bar"><span style="width: ${accuracy}%"></span></div>
      <p class="summary-foot">Accuracy: ${accuracy}%</p>
    `
    summaryEl.appendChild(card)
  })
}

const renderRecommendation = () => {
  const recommendEl = document.getElementById("practiceRecommend")
  if (!recommendEl) return

  const withStats = PRACTICE_DRILLS.map(drill => {
    const stats = loadStats(drill.key)
    const accuracy = stats.attempts ? Math.round((stats.correct / stats.attempts) * 100) : 0
    return { ...drill, stats, accuracy }
  })

  let target = withStats.find(drill => drill.stats.attempts === 0)
  if (!target) {
    target = withStats.reduce((lowest, drill) => (drill.accuracy < lowest.accuracy ? drill : lowest), withStats[0])
  }

  recommendEl.innerHTML = ""
  const card = document.createElement("a")
  card.className = "summary-card summary-card--overall"
  card.href = target.href
  card.innerHTML = `\n    <h3>${target.label}</h3>\n    <p class=\"summary-stat\">${target.stats.correct} / ${target.stats.attempts} correct</p>\n    <div class=\"summary-bar\"><span style=\"width: ${target.accuracy}%\"></span></div>\n    <p class=\"summary-foot\">Accuracy: ${target.accuracy}%</p>\n  `
  recommendEl.appendChild(card)
}

const renderDataTable = () => {
  const tableEl = document.getElementById("practiceDataTable")
  if (!tableEl) return

  tableEl.innerHTML = ""

  const header = document.createElement("tr")
  header.innerHTML = "<th>Drill</th><th>Attempts</th><th>Correct</th><th>Accuracy</th><th>Streak</th>"
  tableEl.appendChild(header)

  PRACTICE_DRILLS.forEach(drill => {
    const stats = loadStats(drill.key)
    const accuracy = stats.attempts ? Math.round((stats.correct / stats.attempts) * 100) : 0
    const row = document.createElement("tr")
    row.innerHTML = `
      <td><a href="${drill.href}">${drill.label}</a></td>
      <td>${stats.attempts}</td>
      <td>${stats.correct}</td>
      <td>${accuracy}%</td>
      <td>${stats.streak}</td>
    `
    tableEl.appendChild(row)
  })
}

const renderPath = () => {
  const pathEl = document.getElementById("practicePath")
  if (!pathEl) return

  const stored = (() => {
    try {
      return JSON.parse(localStorage.getItem("practice-path")) || {}
    } catch (error) {
      return {}
    }
  })()

  pathEl.innerHTML = ""

  PATH_STEPS.forEach(step => {
    const item = document.createElement("label")
    item.className = "path-item"

    const checkbox = document.createElement("input")
    checkbox.type = "checkbox"
    checkbox.checked = Boolean(stored[step.id])
    checkbox.addEventListener("change", event => {
      stored[step.id] = event.target.checked
      localStorage.setItem("practice-path", JSON.stringify(stored))
    })

    const link = document.createElement("a")
    link.href = step.href
    link.textContent = step.label

    item.appendChild(checkbox)
    item.appendChild(link)
    pathEl.appendChild(item)
  })
}

renderSummary()
renderRecommendation()
renderDataTable()
renderPath()
