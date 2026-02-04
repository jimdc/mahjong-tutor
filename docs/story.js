const STORY_KEY = "story-step"

const STORY_STEPS = [
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
    id: "practice",
    title: "Lesson 3: Practice with Feedback",
    mentor: "You learn faster when you hear why, not just that you’re right.",
    text: "Use the drills to lock in recognition, then move to decision drills like calls and discard safety.",
    actionLabel: "Open Practice",
    actionHref: "practice.html"
  },
  {
    id: "coach",
    title: "Lesson 4: Make Real Decisions",
    mentor: "This is where intuition is born.",
    text: "The Hand Coach will group tiles into melds and teach you how to discard with purpose.",
    actionLabel: "Open Hand Coach",
    actionHref: "coach.html"
  }
]

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
  return Math.min(Math.max(raw, 0), STORY_STEPS.length - 1)
}

let stepIndex = loadStepIndex()

const renderStep = () => {
  const step = STORY_STEPS[stepIndex]
  if (!step) return

  if (elements.progress) {
    elements.progress.textContent = `Step ${stepIndex + 1} of ${STORY_STEPS.length}`
  }
  if (elements.title) elements.title.textContent = step.title
  if (elements.mentor) elements.mentor.textContent = `Mentor: ${step.mentor}`
  if (elements.text) elements.text.textContent = step.text
  if (elements.action) {
    elements.action.textContent = step.actionLabel
    elements.action.href = step.actionHref
  }
  if (elements.next) {
    elements.next.textContent = stepIndex === STORY_STEPS.length - 1 ? "Restart" : "Continue"
  }
}

if (elements.next) {
  elements.next.addEventListener("click", () => {
    if (stepIndex === STORY_STEPS.length - 1) {
      stepIndex = 0
    } else {
      stepIndex += 1
    }
    localStorage.setItem(STORY_KEY, String(stepIndex))
    renderStep()
  })
}

renderStep()
