const createPracticeStats = (key, elements) => {
  const load = () => {
    try {
      return JSON.parse(localStorage.getItem(key)) || { correct: 0, attempts: 0, streak: 0 }
    } catch (error) {
      return { correct: 0, attempts: 0, streak: 0 }
    }
  }

  const save = stats => {
    localStorage.setItem(key, JSON.stringify(stats))
  }

  const render = stats => {
    if (!elements) return
    elements.correct.textContent = stats.correct
    elements.attempts.textContent = stats.attempts
    elements.streak.textContent = stats.streak
  }

  const stats = load()
  render(stats)

  return {
    record(correct) {
      stats.attempts += 1
      if (correct) {
        stats.correct += 1
        stats.streak += 1
      } else {
        stats.streak = 0
      }
      save(stats)
      render(stats)
    }
  }
}
