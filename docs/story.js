const STORY_KEY = "story-step"
const TILE_STATS_KEY = "tile-quiz-stats"

const PRACTICE_DRILLS = [
  { key: "practice-winds", label: "Winds Drill", href: "practice-winds.html", focus: "wind recognition" },
  { key: "practice-honors", label: "Honor Tiles", href: "practice-honors.html", focus: "honor recognition" },
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

const accuracyOf = stats => (stats.attempts ? Math.round((stats.correct / stats.attempts) * 100) : 0)

const tileStats = () => {
  const stats = loadStats(TILE_STATS_KEY)
  return { ...stats, accuracy: accuracyOf(stats) }
}

const weakestDrill = () => {
  const withStats = PRACTICE_DRILLS.map(drill => {
    const stats = loadStats(drill.key)
    return { ...drill, stats, accuracy: accuracyOf(stats) }
  })
  let target = withStats.find(drill => drill.stats.attempts === 0)
  if (!target) {
    target = withStats.reduce((lowest, drill) => (drill.accuracy < lowest.accuracy ? drill : lowest), withStats[0])
  }
  return target
}

const buildStorySteps = () => {
  const tiles = tileStats()
  const weak = weakestDrill()
  const readyForPractice = tiles.attempts >= 10 && tiles.accuracy >= 70
  const readyForCoach = weak.stats.attempts >= 8 && weak.accuracy >= 80

  const steps = [
    {
      id: "tiles",
      title: "Lesson 1: Learn the Tiles",
      mentor: "Start with names and motifs. Recognition is your foundation.",
      text: "We begin with the three suits and the honor tiles. Identify them quickly; speed builds confidence.",
      actionLabel: "Start Tile Quiz",
      actionHref: "index.html"
    },
    {
      id: "concepts",
      title: "Lesson 2: Learn the Concepts",
      mentor: "Patterns win games. Words give you handles for patterns.",
      text: "Melds, pairs, and discard strategy will make sense once you can name them. Read the glossary with the chess/checkers analogies in mind.",
      actionLabel: "Open Glossary",
      actionHref: "glossary.html"
    },
    {
      id: "target",
      title: `Lesson 3: Focus on ${weak.label}`,
      mentor: `Mentor: Your lowest accuracy is ${weak.accuracy}% on ${weak.focus}. Let's level it up.`,
      text: "Repeating the weakest drill sharpens the overall hand.",
      actionLabel: `Practice ${weak.label}`,
      actionHref: weak.href
    },
    {
      id: "coach",
      title: "Lesson 4: Make Real Decisions",
      mentor: "This is where intuition is born.",
      text: "The Hand Coach will group tiles into melds and teach you how to discard with purpose.",
      actionLabel: "Open Hand Coach",
      actionHref: "coach.html"
    },
    {
      id: "round",
      title: "Lesson 5: Play a Round",
      mentor: "See the flow: draw, claim, discard, and win.",
      text: "Step through the animated turn flow to connect drills to the table.",
      actionLabel: "Open Rules Flow",
      actionHref: "rules.html"
    }
  ]

  // Gatekeeping: if tiles not ready, stay on tiles/concepts before practice/coach.
  if (!readyForPractice) return steps.slice(0, 2).concat(steps[2], steps[3], steps[4])
  if (!readyForCoach) return steps.slice(0, 3).concat(steps[3], steps[4])
  return steps
}

const elements = {
  progress: document.getElementById("storyProgress"),
  title: document.getElementById("storyTitle"),
  mentor: document.getElementById("storyMentor"),
  text: document.getElementById("storyText"),
  action: document.getElementById("storyAction"),
  next: document.getElementById("storyNext")
}

const loadStepIndex = () => {
  const raw = Number(localStorage.getItem(STORY_KEY))
  if (Number.isNaN(raw)) return 0
  return raw
}

let stepIndex = loadStepIndex()

const renderStep = () => {
  const steps = buildStorySteps()
  if (!steps.length) return
  if (stepIndex >= steps.length) stepIndex = 0
  const step = steps[stepIndex]
  if (!step) return

  if (elements.progress) {
    elements.progress.textContent = `Step ${stepIndex + 1} of ${steps.length}`
  }
  if (elements.title) elements.title.textContent = step.title
  if (elements.mentor) elements.mentor.textContent = `Mentor: ${step.mentor}`
  if (elements.text) elements.text.textContent = step.text
  if (elements.action) {
    elements.action.textContent = step.actionLabel
    elements.action.href = step.actionHref
  }
  if (elements.next) {
    elements.next.textContent = stepIndex === steps.length - 1 ? "Restart" : "Continue"
  }
}

if (elements.next) {
  elements.next.addEventListener("click", () => {
    const steps = buildStorySteps()
    const lastIndex = steps.length - 1
    if (stepIndex >= lastIndex) {
      stepIndex = 0
    } else {
      stepIndex += 1
    }
    localStorage.setItem(STORY_KEY, String(stepIndex))
    renderStep()
  })
}

renderStep()
