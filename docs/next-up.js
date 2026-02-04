const PRACTICE_DRILLS = [
  { key: "practice-winds", label: "Winds Drill", href: "practice-winds.html", focus: "wind recognition" },
  { key: "practice-honors", label: "Honor Tiles", href: "practice-honors.html", focus: "honor tile recognition" },
  { key: "practice-suits", label: "Suit Identification", href: "practice-suits.html", focus: "suit spotting" },
  { key: "practice-dragons", label: "Dragon Names", href: "practice-dragons.html", focus: "dragon names" },
  { key: "practice-seats", label: "Seat Winds", href: "practice-seats.html", focus: "table rotation" },
  { key: "practice-prevailing", label: "Prevailing Wind", href: "practice-prevailing.html", focus: "round wind" },
  { key: "practice-melds", label: "Meld Types", href: "practice-melds.html", focus: "meld recognition" },
  { key: "practice-sequence", label: "Complete the Chow", href: "practice-sequence.html", focus: "sequence building" },
  { key: "practice-pair", label: "Find the Pair", href: "practice-pair.html", focus: "pair building" },
  { key: "practice-winning", label: "Winning Hands", href: "practice-winning.html", focus: "winning hand shapes" },
  { key: "practice-calls", label: "Claiming Discards", href: "practice-calls.html", focus: "call priority" },
  { key: "practice-safety", label: "Discard Safety", href: "practice-safety.html", focus: "safe discards" }
]

const loadStats = key => {
  try {
    return JSON.parse(localStorage.getItem(key)) || { correct: 0, attempts: 0, streak: 0 }
  } catch (error) {
    return { correct: 0, attempts: 0, streak: 0 }
  }
}

const pickRecommendation = currentHref => {
  const drills = PRACTICE_DRILLS.filter(drill => drill.href !== currentHref)
  const withStats = drills.map(drill => {
    const stats = loadStats(drill.key)
    const accuracy = stats.attempts ? Math.round((stats.correct / stats.attempts) * 100) : 0
    return { ...drill, stats, accuracy }
  })

  let target = withStats.find(drill => drill.stats.attempts === 0)
  if (!target) {
    target = withStats.reduce((lowest, drill) => (drill.accuracy < lowest.accuracy ? drill : lowest), withStats[0])
  }
  return target
}

const renderNextUp = () => {
  if (document.getElementById("practiceRecommend")) return
  if (document.getElementById("nextUpCard")) return

  const mount = document.querySelector(".tutor")
  if (!mount) return

  const current = window.location.pathname.split("/").pop()
  const target = pickRecommendation(current)
  if (!target) return

  const accuracy = target.stats.attempts ? Math.round((target.stats.correct / target.stats.attempts) * 100) : 0
  const mentorLine = target.stats.attempts === 0
    ? `Mentor: Let’s start ${target.focus} with ${target.label}.`
    : `Mentor: Your lowest accuracy is ${accuracy}% in ${target.label}. Let’s sharpen ${target.focus}.`

  const section = document.createElement("section")
  section.className = "tutor-card tutor-card--mini next-up"
  section.id = "nextUpCard"
  section.innerHTML = `
    <h2>Next Up</h2>
    <p class="mentor-line">${mentorLine}</p>
    <a class="summary-card summary-card--overall" href="${target.href}">
      <h3>${target.label}</h3>
      <p class="summary-stat">${target.stats.correct} / ${target.stats.attempts} correct</p>
      <div class="summary-bar"><span style="width: ${accuracy}%"></span></div>
      <p class="summary-foot">Accuracy: ${accuracy}%</p>
    </a>
  `

  mount.appendChild(section)
}

renderNextUp()
