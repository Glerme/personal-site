import { useState, useEffect, useCallback } from 'react'

interface UseTypewriterOptions {
  texts: string[]
  typingSpeed?: number
  deletingSpeed?: number
  pauseDuration?: number
}

export function useTypewriter({
  texts,
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseDuration = 2000,
}: UseTypewriterOptions) {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const tick = useCallback(() => {
    const currentText = texts[currentIndex]

    if (isPaused) return

    if (!isDeleting) {
      if (displayText.length < currentText.length) {
        setDisplayText(currentText.slice(0, displayText.length + 1))
      } else {
        setIsPaused(true)
        setTimeout(() => {
          setIsPaused(false)
          setIsDeleting(true)
        }, pauseDuration)
      }
    } else {
      if (displayText.length > 0) {
        setDisplayText(currentText.slice(0, displayText.length - 1))
      } else {
        setIsDeleting(false)
        setCurrentIndex((prev) => (prev + 1) % texts.length)
      }
    }
  }, [displayText, currentIndex, isDeleting, isPaused, texts, pauseDuration])

  useEffect(() => {
    const speed = isDeleting ? deletingSpeed : typingSpeed
    const timeout = setTimeout(tick, speed)
    return () => clearTimeout(timeout)
  }, [tick, isDeleting, typingSpeed, deletingSpeed])

  return { displayText, isTyping: !isPaused }
}
