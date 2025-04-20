"use client"
import { useState, useRef, useEffect } from "react"
import type React from "react"

import { ChevronLeft, ChevronRight, Play, Info, Trophy, Star, Check, X } from "lucide-react"
import Navbar from "@/components/navbar"

// Interactive player component for drag and drop
function DraggablePlayer({
  color,
  initialPosition,
  label,
}: { color: string; initialPosition: { x: number; y: number }; label?: string }) {
  const playerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    if (playerRef.current) {
      const rect = playerRef.current.getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
      setIsDragging(true)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (playerRef.current && e.touches[0]) {
      const rect = playerRef.current.getBoundingClientRect()
      setDragOffset({
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      })
      setIsDragging(true)
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && playerRef.current) {
        const parentRect = playerRef.current.parentElement?.getBoundingClientRect()
        if (parentRect) {
          const newX = e.clientX - parentRect.left - dragOffset.x
          const newY = e.clientY - parentRect.top - dragOffset.y

          // Constrain to parent boundaries
          const constrainedX = Math.max(0, Math.min(newX, parentRect.width - 24))
          const constrainedY = Math.max(0, Math.min(newY, parentRect.height - 24))

          setPosition({ x: constrainedX, y: constrainedY })
        }
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && playerRef.current && e.touches[0]) {
        e.preventDefault() // Prevent scrolling while dragging
        const parentRect = playerRef.current.parentElement?.getBoundingClientRect()
        if (parentRect) {
          const newX = e.touches[0].clientX - parentRect.left - dragOffset.x
          const newY = e.touches[0].clientY - parentRect.top - dragOffset.y

          // Constrain to parent boundaries
          const constrainedX = Math.max(0, Math.min(newX, parentRect.width - 24))
          const constrainedY = Math.max(0, Math.min(newY, parentRect.height - 24))

          setPosition({ x: constrainedX, y: constrainedY })
        }
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    const handleTouchEnd = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
      window.addEventListener("touchmove", handleTouchMove, { passive: false })
      window.addEventListener("touchend", handleTouchEnd)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isDragging, dragOffset])

  return (
    <div
      ref={playerRef}
      className={`absolute w-8 h-8 ${color} border-2 border-black rounded-full cursor-move shadow-md flex items-center justify-center`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        touchAction: "none",
        zIndex: isDragging ? 10 : 1,
        transition: isDragging ? "none" : "box-shadow 0.2s",
        boxShadow: isDragging ? "0 0 0 4px rgba(193, 255, 0, 0.5)" : "",
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {label ? (
        <span className="font-bold text-xs">{label}</span>
      ) : (
        <div className="w-2 h-2 bg-black rounded-full"></div>
      )}
    </div>
  )
}

export default function BoxAndOnePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [challengeCompleted, setChallengeCompleted] = useState(false)
  const [streakCount, setStreakCount] = useState(0)
  const [points, setPoints] = useState(0)
  const [challengeAnswers, setChallengeAnswers] = useState<{
    decision?: string
    chaser?: string
    switch?: string
  }>({})

  const increasePoints = (value: number) => {
    setPoints(points + value)
    setStreakCount(streakCount + 1)

    if (points + value >= 75 && !challengeCompleted) {
      setChallengeCompleted(true)
    }
  }

  const slides = [
    {
      title: "BOX AND 1 DEFENSE BASICS",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <p className="text-lg">
              The Box-and-1 defense is a hybrid between zone and man-to-man. Four defenders form a box in a zone (usually
              2-2), while one player plays tight man-to-man on the opposing team's best scorer.
            </p>
            <p className="font-bold text-xl">
              Key Principle: Neutralize the opponent's star player while maintaining good overall court coverage.
            </p>

            <div className="relative h-72 neo-card bg-gray-100 my-8">
              <div className="absolute inset-0 flex items-center justify-center pt-10">
                <div className="text-center">
                  <div className="font-bold text-black mb-4 mt-2">INTERACTIVE BOX AND 1 DIAGRAM</div>
                  <div className="w-48 h-48 mx-auto bg-[#3366cc] border-4 border-black rounded-full flex items-center justify-center">
                    <div className="w-32 h-32 bg-white border-4 border-black rounded-full flex items-center justify-center relative">
                      {/* Box zone defenders - now draggable */}
                      <DraggablePlayer color="bg-[#ff5757]" initialPosition={{ x: 25, y: 25 }} label="D1" />
                      <DraggablePlayer color="bg-[#ff5757]" initialPosition={{ x: 90, y: 25 }} label="D2" />
                      <DraggablePlayer color="bg-[#ff5757]" initialPosition={{ x: 25, y: 90 }} label="D3" />
                      <DraggablePlayer color="bg-[#ff5757]" initialPosition={{ x: 90, y: 90 }} label="D4" />

                      {/* Chaser defender and star offensive player */}
                      <DraggablePlayer color="bg-[#c1ff00]" initialPosition={{ x: 60, y: 50 }} label="C" />
                      <DraggablePlayer color="bg-[#ff4444]" initialPosition={{ x: 65, y: 55 }} label="S" />
                    </div>
                  </div>
                  <div className="mt-4 font-bold text-black bg-white px-2 py-1 rounded-md inline-block border border-black">
                    DRAG DEFENDERS TO POSITION THEM
                  </div>
                </div>
              </div>

              <button
                className="absolute bottom-4 right-4 p-2 bg-white border-4 border-black rounded-full hover:bg-[#c1ff00] transition-colors"
                onClick={() => {
                  setShowHint(!showHint)
                  if (!showHint) increasePoints(5)
                }}
              >
                <Info size={24} />
              </button>

              {showHint && (
                <div className="absolute bottom-16 right-4 p-4 bg-white border-4 border-black rounded-xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] w-64">
                  The "chaser" defender (C) follows the star player (S) everywhere, while the "box" defenders (D1-D4)
                  shift to provide help when needed
                  <div className="absolute w-4 h-4 bg-white border-r-4 border-b-4 border-black transform rotate-45 -bottom-2 right-8"></div>
                </div>
              )}
            </div>

            <div className="flex justify-center gap-4">
              <button className="neo-button-outline flex items-center gap-2" onClick={() => increasePoints(10)}>
                <Play size={20} />
                <span>WATCH EXAMPLE</span>
              </button>

              <button className="neo-button-outline flex items-center gap-2" onClick={() => increasePoints(15)}>
                <span>TRY INTERACTIVE DEMO</span>
              </button>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="neo-card bg-gray-100 h-full">
              <h2 className="font-bold text-xl mb-4">KEY TERMINOLOGY:</h2>
              <dl className="space-y-4">
                <div className="border-4 border-black rounded-xl p-4 bg-white hover:bg-[#f0f0f0] transition-colors">
                  <dt className="font-bold text-lg">CHASER:</dt>
                  <dd>The defender assigned to follow the star player</dd>
                </div>
                <div className="border-4 border-black rounded-xl p-4 bg-white hover:bg-[#f0f0f0] transition-colors">
                  <dt className="font-bold text-lg">BOX DEFENDERS:</dt>
                  <dd>The four players in zone formation</dd>
                </div>
                <div className="border-4 border-black rounded-xl p-4 bg-white hover:bg-[#f0f0f0] transition-colors">
                  <dt className="font-bold text-lg">STAR DENIAL:</dt>
                  <dd>Preventing the star player from receiving the ball</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "WHEN TO USE BOX AND 1",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <p className="text-lg">The Box and 1 defense is particularly effective in specific situations:</p>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="neo-card">
                <h3 className="font-bold text-xl mb-4">IDEAL SCENARIOS:</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#c1ff00] border-4 border-black rounded-full flex-shrink-0 flex items-center justify-center font-bold">
                      ✓
                    </div>
                    <span className="pt-1">When one player is scoring most of the opponent's points</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#c1ff00] border-4 border-black rounded-full flex-shrink-0 flex items-center justify-center font-bold">
                      ✓
                    </div>
                    <span className="pt-1">When you have one excellent defender who can shadow the star</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#c1ff00] border-4 border-black rounded-full flex-shrink-0 flex items-center justify-center font-bold">
                      ✓
                    </div>
                    <span className="pt-1">When the opponent's other players are significantly less skilled</span>
                  </li>
                </ul>
              </div>

              <div className="neo-card">
                <h3 className="font-bold text-xl mb-4">AVOID USING WHEN:</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#ff5757] border-4 border-black rounded-full flex-shrink-0 flex items-center justify-center font-bold">
                      ✗
                    </div>
                    <span className="pt-1">The opponent has multiple scoring threats</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#ff5757] border-4 border-black rounded-full flex-shrink-0 flex items-center justify-center font-bold">
                      ✗
                    </div>
                    <span className="pt-1">Your team lacks a defender with good stamina</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#ff5757] border-4 border-black rounded-full flex-shrink-0 flex items-center justify-center font-bold">
                      ✗
                    </div>
                    <span className="pt-1">The opponent has excellent outside shooters</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="neo-card bg-[#c1ff00]">
              <h3 className="font-bold text-xl mb-4">DECISION CHALLENGE:</h3>
              <p className="mb-6">
                You're coaching against a team with one player averaging 30 points per game, but their second-best player
                only averages 8 points. What defense would you choose?
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  className={`neo-button-outline ${challengeAnswers.decision === "man" ? "bg-white" : ""}`}
                  onClick={() => {
                    setChallengeAnswers({ ...challengeAnswers, decision: "man" })
                  }}
                >
                  MAN-TO-MAN
                  {challengeAnswers.decision === "man" && (
                    <div className="flex justify-center mt-2">
                      <X size={24} className="text-black" strokeWidth={3} />
                    </div>
                  )}
                </button>
                <button
                  className={`neo-button-outline ${challengeAnswers.decision === "zone" ? "bg-white" : ""}`}
                  onClick={() => {
                    setChallengeAnswers({ ...challengeAnswers, decision: "zone" })
                  }}
                >
                  ZONE
                  {challengeAnswers.decision === "zone" && (
                    <div className="flex justify-center mt-2">
                      <X size={24} className="text-black" strokeWidth={3} />
                    </div>
                  )}
                </button>
                <button
                  className={`neo-button-outline ${challengeAnswers.decision === "box" ? "bg-white" : ""}`}
                  onClick={() => {
                    setChallengeAnswers({ ...challengeAnswers, decision: "box" })
                  }}
                >
                  BOX AND 1
                  {challengeAnswers.decision === "box" && (
                    <div className="flex justify-center mt-2">
                      <Check size={24} className="text-black" strokeWidth={3} />
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="neo-card bg-gray-100 h-full">
              <h2 className="font-bold text-xl mb-4">KEY TERMINOLOGY:</h2>
              <dl className="space-y-4">
                <div className="border-4 border-black rounded-xl p-4 bg-white hover:bg-[#f0f0f0] transition-colors">
                  <dt className="font-bold text-lg">DEFENSIVE ROTATION:</dt>
                  <dd>How box defenders shift positions to help the chaser</dd>
                </div>
                <div className="border-4 border-black rounded-xl p-4 bg-white hover:bg-[#f0f0f0] transition-colors">
                  <dt className="font-bold text-lg">HELP DEFENSE:</dt>
                  <dd>Supporting the chaser when the star player breaks free</dd>
                </div>
                <div className="border-4 border-black rounded-xl p-4 bg-white hover:bg-[#f0f0f0] transition-colors">
                  <dt className="font-bold text-lg">STAR PLAYER:</dt>
                  <dd>The primary offensive threat targeted by the chaser</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "PROS & CONS",
      content: (
        <div className="space-y-6">
          <p className="text-center font-bold text-xl bg-[#c1ff00] border-4 border-black rounded-xl p-3 mb-6">
            REVIEW THE PROS AND CONS OF BOX AND 1 DEFENSE
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="border-4 border-black rounded-xl p-6 min-h-[240px]">
              <h3 className="font-bold text-2xl mb-6 text-center">PROS</h3>
              <div className="space-y-3">
                <div className="p-3 bg-white border-4 border-black rounded-xl text-center font-bold">
                  Great at neutralizing a high-scoring player
                </div>
                <div className="p-3 bg-white border-4 border-black rounded-xl text-center font-bold">
                  Preserves interior paint protection
                </div>
                <div className="p-3 bg-white border-4 border-black rounded-xl text-center font-bold">
                  Creates confusion for offensive players
                </div>
              </div>
            </div>

            <div className="border-4 border-black rounded-xl p-6 min-h-[240px]">
              <h3 className="font-bold text-2xl mb-6 text-center">CONS</h3>
              <div className="space-y-3">
                <div className="p-3 bg-white border-4 border-black rounded-xl text-center font-bold">
                  Fatigue on the "chaser" guarding the star player
                </div>
                <div className="p-3 bg-white border-4 border-black rounded-xl text-center font-bold">
                  Can leave gaps if the box defenders don't communicate
                </div>
                <div className="p-3 bg-white border-4 border-black rounded-xl text-center font-bold">
                  Vulnerable if other players start hitting shots
                </div>
              </div>
            </div>
          </div>

          <div className="neo-card bg-[#3366cc] text-white">
            <h3 className="font-bold text-xl mb-4 text-center">BOX AND 1 QUIZ</h3>
            <div className="space-y-6">
              <div className="p-4 bg-white border-4 border-black rounded-xl text-black">
                <p className="font-bold mb-3">Which player should be assigned as the "chaser" in a Box and 1?</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    className={`neo-button-outline ${challengeAnswers.chaser === "tallest" ? "bg-white" : ""}`}
                    onClick={() => {
                      increasePoints(-5)
                      setChallengeAnswers({ ...challengeAnswers, chaser: "tallest" })
                    }}
                  >
                    YOUR TALLEST PLAYER
                    {challengeAnswers.chaser === "tallest" && (
                      <div className="flex justify-center mt-2">
                        <X size={24} className="text-black" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                  <button
                    className={`neo-button-outline ${challengeAnswers.chaser === "defender" ? "bg-white" : ""}`}
                    onClick={() => {
                      increasePoints(15)
                      setChallengeAnswers({ ...challengeAnswers, chaser: "defender" })
                    }}
                  >
                    YOUR BEST ON-BALL DEFENDER
                    {challengeAnswers.chaser === "defender" && (
                      <div className="flex justify-center mt-2">
                        <Check size={24} className="text-black" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                  <button
                    className={`neo-button-outline ${challengeAnswers.chaser === "shooter" ? "bg-white" : ""}`}
                    onClick={() => {
                      increasePoints(-5)
                      setChallengeAnswers({ ...challengeAnswers, chaser: "shooter" })
                    }}
                  >
                    YOUR BEST SHOOTER
                    {challengeAnswers.chaser === "shooter" && (
                      <div className="flex justify-center mt-2">
                        <X size={24} className="text-black" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                  <button
                    className={`neo-button-outline ${challengeAnswers.chaser === "pg" ? "bg-white" : ""}`}
                    onClick={() => {
                      increasePoints(-5)
                      setChallengeAnswers({ ...challengeAnswers, chaser: "pg" })
                    }}
                  >
                    YOUR POINT GUARD
                    {challengeAnswers.chaser === "pg" && (
                      <div className="flex justify-center mt-2">
                        <X size={24} className="text-black" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                </div>
              </div>

              <div className="p-4 bg-white border-4 border-black rounded-xl text-black">
                <p className="font-bold mb-3">When should you switch from Box and 1 to another defense?</p>
                <div className="grid grid-cols-1 gap-3">
                  <button
                    className={`neo-button-outline ${challengeAnswers.switch === "others" ? "bg-white" : ""}`}
                    onClick={() => {
                      increasePoints(15)
                      setChallengeAnswers({ ...challengeAnswers, switch: "others" })
                    }}
                  >
                    WHEN OTHER PLAYERS BESIDES THE STAR START SCORING CONSISTENTLY
                    {challengeAnswers.switch === "others" && (
                      <div className="flex justify-center mt-2">
                        <Check size={24} className="text-black" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                  <button
                    className={`neo-button-outline ${challengeAnswers.switch === "ahead" ? "bg-white" : ""}`}
                    onClick={() => {
                      increasePoints(-5)
                      setChallengeAnswers({ ...challengeAnswers, switch: "ahead" })
                    }}
                  >
                    WHEN YOUR TEAM IS AHEAD BY 10+ POINTS
                    {challengeAnswers.switch === "ahead" && (
                      <div className="flex justify-center mt-2">
                        <X size={24} className="text-black" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                  <button
                    className={`neo-button-outline ${challengeAnswers.switch === "quarter" ? "bg-white" : ""}`}
                    onClick={() => {
                      increasePoints(-5)
                      setChallengeAnswers({ ...challengeAnswers, switch: "quarter" })
                    }}
                  >
                    AFTER THE FIRST QUARTER
                    {challengeAnswers.switch === "quarter" && (
                      <div className="flex justify-center mt-2">
                        <X size={24} className="text-black" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ]

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
      increasePoints(10)
    } else {
      // Navigate to next section
      window.location.href = "/quiz"
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="neo-subheading">{slides[currentSlide].title}</h1>
          </div>

          <div className="neo-card mb-8">{slides[currentSlide].content}</div>

          <div className="flex justify-between items-center">
            <button
              className="neo-button-outline flex items-center gap-2"
              onClick={prevSlide}
              disabled={currentSlide === 0}
            >
              <ChevronLeft size={20} />
              <span>PREVIOUS</span>
            </button>

            <div className="flex items-center gap-2">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 rounded-full border-4 border-black ${
                    currentSlide === index ? "bg-[#c1ff00]" : "bg-white"
                  } hover:bg-[#d8ff66] transition-colors flex items-center justify-center`}
                  onClick={() => setCurrentSlide(index)}
                  style={{ cursor: "pointer" }}
                >
                  <span className="font-bold">{index + 1}</span>
                </div>
              ))}
            </div>

            <button 
              className="neo-button flex items-center gap-2 bg-[#c1ff00] hover:bg-[#d8ff66] transition-colors" 
              onClick={nextSlide}
            >
              <span>{currentSlide === slides.length - 1 ? "GO TO QUIZ" : "NEXT"}</span>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
