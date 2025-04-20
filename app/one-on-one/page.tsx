"use client"
import { useState, useRef, useEffect } from "react"
import type React from "react"
import { ChevronLeft, ChevronRight, Play, Info, Check, X } from "lucide-react"
import Navbar from "@/components/navbar"

function FlipCard({ text, type }: { text: string; type: "pro" | "con" }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div className="h-32 cursor-pointer perspective-500" onClick={() => setFlipped(!flipped)}>
      <div
        className={`relative w-full h-full transition-transform duration-500 preserve-3d ${flipped ? "rotate-y-180" : ""}`}
      >
        <div className="absolute inset-0 backface-hidden border-4 border-black rounded-xl p-4 flex items-center justify-center text-center bg-white">
          <span className="font-bold">{text}</span>
        </div>
        <div
          className={`absolute inset-0 backface-hidden rotate-y-180 border-4 border-black rounded-xl p-4 flex items-center justify-center ${
            type === "pro" ? "bg-[#c1ff00]" : "bg-[#ff5757]"
          }`}
        >
          <div className="text-center">
            <div className="flex justify-center mb-2">
              {type === "pro" ? <Check size={32} className="text-black" /> : <X size={32} className="text-black" />}
            </div>
            <div className="text-xl font-bold text-black">{type === "pro" ? "ADVANTAGE" : "DISADVANTAGE"}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

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

// Fix the interactive court diagram text contrast issue
// Update the court diagram to make text more visible and ensure interaction works
function InteractiveCourt() {
  const courtRef = useRef<HTMLDivElement>(null)
  const [showHint, setShowHint] = useState(false)
  const [courtSize, setCourtSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (courtRef.current) {
      const updateSize = () => {
        if (courtRef.current) {
          setCourtSize({
            width: courtRef.current.offsetWidth,
            height: courtRef.current.offsetHeight,
          })
        }
      }

      updateSize()
      window.addEventListener("resize", updateSize)

      return () => {
        window.removeEventListener("resize", updateSize)
      }
    }
  }, [])

  return (
    <div className="relative h-64 neo-card bg-gray-100 my-8" ref={courtRef}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center w-full h-full">
          <div className="mb-4 font-bold text-black">INTERACTIVE COURT DIAGRAM</div>
          <div className="w-48 h-48 mx-auto bg-[#3366cc] border-4 border-black rounded-full flex items-center justify-center relative">
            <div className="w-32 h-32 bg-white border-4 border-black rounded-full flex items-center justify-center relative">
              {/* Court markings */}
              <div className="absolute w-full h-0.5 bg-black top-1/2 transform -translate-y-1/2"></div>
              <div className="absolute h-full w-0.5 bg-black left-1/2 transform -translate-x-1/2"></div>

              {/* Draggable players - positioned relative to the court */}
              <DraggablePlayer color="bg-[#ff5757]" initialPosition={{ x: 30, y: 30 }} label="D1" />
              <DraggablePlayer color="bg-[#ff5757]" initialPosition={{ x: 90, y: 30 }} label="D2" />
              <DraggablePlayer color="bg-[#ff5757]" initialPosition={{ x: 30, y: 90 }} label="D3" />
              <DraggablePlayer color="bg-[#ff5757]" initialPosition={{ x: 90, y: 90 }} label="D4" />
              <DraggablePlayer color="bg-[#c1ff00]" initialPosition={{ x: 60, y: 60 }} label="O" />
            </div>
          </div>
          <div className="mt-4 font-bold text-black bg-white px-2 py-1 rounded-md inline-block border border-black">
            DRAG PLAYERS TO POSITION THEM DEFENSIVELY
          </div>
        </div>
      </div>

      <button
        className="absolute bottom-4 right-4 p-2 bg-white border-4 border-black rounded-full hover:bg-[#c1ff00] transition-colors"
        onClick={() => setShowHint(!showHint)}
      >
        <Info size={24} />
      </button>

      {showHint && (
        <div className="absolute bottom-16 right-4 p-4 bg-white border-4 border-black rounded-xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] w-64">
          Try dragging defenders (D1-D4) to position them correctly for man-to-man defense. Each defender should guard
          an offensive player (O).
          <div className="absolute w-4 h-4 bg-white border-r-4 border-b-4 border-black transform rotate-45 -bottom-2 right-8"></div>
        </div>
      )}
    </div>
  )
}

// Fix the defensive stance diagram to improve visibility
function ManToManPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [quickChallengeAnswer, setQuickChallengeAnswer] = useState<string | null>(null)

  const slides = [
    {
      title: "MAN-TO-MAN DEFENSE BASICS",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <p className="text-lg">
              Man-to-Man Defense has each defender assigned to a designated offensive player rather than an area on the
              court.
            </p>
            <p className="font-bold text-xl">
              Key Principle: Each defender is responsible for an opponent, no matter where they move.
            </p>

            <InteractiveCourt />

            <div className="flex justify-center">
              <button className="neo-button flex items-center gap-2 bg-[#c1ff00] hover:bg-[#d8ff66] transition-colors">
                <Play size={20} />
                <span>WATCH EXAMPLE</span>
              </button>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="neo-card bg-gray-100 h-full">
              <h2 className="font-bold text-xl mb-4">KEY TERMINOLOGY:</h2>
              <dl className="space-y-4">
                <div className="border-4 border-black rounded-xl p-4 bg-white hover:bg-[#f0f0f0] transition-colors">
                  <dt className="font-bold text-lg">HELP-SIDE DEFENSE:</dt>
                  <dd>Positioning yourself to help teammates while still guarding your player</dd>
                </div>
                <div className="border-4 border-black rounded-xl p-4 bg-white hover:bg-[#f0f0f0] transition-colors">
                  <dt className="font-bold text-lg">CLOSEOUT:</dt>
                  <dd>Quickly moving from help position to guard your player when they receive the ball</dd>
                </div>
                <div className="border-4 border-black rounded-xl p-4 bg-white hover:bg-[#f0f0f0] transition-colors">
                  <dt className="font-bold text-lg">DENIAL:</dt>
                  <dd>Positioning to prevent your player from receiving a pass</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      ),
    },
    // Fix the defensive stance diagram to improve visibility
    {
      title: "DEFENSIVE STANCE & POSITIONING",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <p className="text-lg">Proper defensive stance is the foundation of good man-to-man defense:</p>

            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#c1ff00] border-4 border-black rounded-full flex items-center justify-center text-black font-bold">
                  1
                </div>
                <span className="font-bold">Knees bent, back straight</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#c1ff00] border-4 border-black rounded-full flex items-center justify-center text-black font-bold">
                  2
                </div>
                <span className="font-bold">Feet wider than shoulder width</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#c1ff00] border-4 border-black rounded-full flex items-center justify-center text-black font-bold">
                  3
                </div>
                <span className="font-bold">Arms out to disrupt passing lanes</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#c1ff00] border-4 border-black rounded-full flex items-center justify-center text-black font-bold">
                  4
                </div>
                <span className="font-bold">Stay between your man and the basket</span>
              </li>
            </ul>

            <div className="h-64 neo-card bg-white my-8 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-64 mx-auto relative">
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-40 bg-[#ff5757] border-4 border-black rounded-t-3xl"></div>
                  <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-[#ff5757] border-4 border-black rounded-full"></div>
                  <div className="absolute bottom-16 left-0 w-32 h-4 bg-black"></div>
                  <div className="absolute bottom-24 left-0 w-6 h-20 bg-black transform -rotate-45"></div>
                  <div className="absolute bottom-24 right-0 w-6 h-20 bg-black transform rotate-45"></div>
                </div>
                <div className="mt-4 font-bold bg-white px-2 py-1 rounded-md inline-block border-2 border-black">
                  PROPER DEFENSIVE STANCE
                </div>
              </div>
            </div>

            <div className="neo-card bg-[#c1ff00]">
              <p className="font-bold text-lg flex items-center gap-2">
                <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center">!</span>
                COACH'S TIP:
              </p>
              <p className="mt-2">
                The lower your stance, the quicker you can react to offensive moves. Stay on the balls of your feet!
              </p>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="neo-card bg-gray-100 h-full">
              <h2 className="font-bold text-xl mb-4">KEY TERMINOLOGY:</h2>
              <dl className="space-y-4">
                <div className="border-4 border-black rounded-xl p-4 bg-white hover:bg-[#f0f0f0] transition-colors">
                  <dt className="font-bold text-lg">BALL PRESSURE:</dt>
                  <dd>Applying defensive pressure on the ball handler to limit their options</dd>
                </div>
                <div className="border-4 border-black rounded-xl p-4 bg-white hover:bg-[#f0f0f0] transition-colors">
                  <dt className="font-bold text-lg">DEFENSIVE SLIDE:</dt>
                  <dd>Moving laterally without crossing your feet to maintain defensive position</dd>
                </div>
                <div className="border-4 border-black rounded-xl p-4 bg-white hover:bg-[#f0f0f0] transition-colors">
                  <dt className="font-bold text-lg">RECOVERY:</dt>
                  <dd>Quickly getting back into defensive position after being beaten</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      ),
    },
    // Fix the quick challenge to make incorrect answers more visible
    {
      title: "PROS & CONS",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-8">
            <p className="text-center font-bold text-xl bg-[#c1ff00] border-4 border-black rounded-xl p-3">
              TAP EACH CARD TO REVEAL IF IT'S A PRO OR CON OF MAN-TO-MAN DEFENSE
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { text: "HIGH PRESSURE ON BALL-HANDLER", type: "pro" },
                { text: "PHYSICALLY EXHAUSTING", type: "con" },
                { text: "CLEAR DEFENSIVE ASSIGNMENTS", type: "pro" },
                { text: "VULNERABLE TO SCREENS", type: "con" },
                { text: "BUILDS ACCOUNTABILITY", type: "pro" },
                { text: "EASY TO EXPLOIT MISMATCHES", type: "con" },
                { text: "GOOD FOR LAST-MINUTE SITUATIONS", type: "pro" },
                { text: "REQUIRES CONSTANT COMMUNICATION", type: "con" },
              ].map((item, index) => (
                <FlipCard key={index} text={item.text} type={item.type} />
              ))}
            </div>

            <div className="neo-card bg-[#3366cc] text-white">
              <h3 className="font-bold text-xl mb-4">QUICK CHALLENGE:</h3>
              <p className="mb-6">
                Which defensive strategy would you choose if your team has excellent individual defenders but limited
                stamina?
              </p>
              <div className="grid grid-cols-3 gap-4">
                <button
                  className={`neo-button-outline ${
                    quickChallengeAnswer === "man" ? "bg-[#ff5757] text-white border-white" : ""
                  }`}
                  onClick={() => setQuickChallengeAnswer("man")}
                >
                  MAN-TO-MAN
                  {quickChallengeAnswer === "man" && (
                    <div className="flex justify-center mt-2">
                      <X size={24} className="text-white" strokeWidth={3} />
                    </div>
                  )}
                </button>
                <button
                  className={`neo-button-outline ${
                    quickChallengeAnswer === "zone" ? "bg-[#c1ff00] text-black border-black" : ""
                  }`}
                  onClick={() => setQuickChallengeAnswer("zone")}
                >
                  ZONE
                  {quickChallengeAnswer === "zone" && (
                    <div className="flex justify-center mt-2">
                      <Check size={24} className="text-black" strokeWidth={3} />
                    </div>
                  )}
                </button>
                <button
                  className={`neo-button-outline ${
                    quickChallengeAnswer === "box" ? "bg-[#ff5757] text-white border-white" : ""
                  }`}
                  onClick={() => setQuickChallengeAnswer("box")}
                >
                  BOX AND 1
                  {quickChallengeAnswer === "box" && (
                    <div className="flex justify-center mt-2">
                      <X size={24} className="text-white" strokeWidth={3} />
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
                  <dt className="font-bold text-lg">SWITCHING:</dt>
                  <dd>Defenders exchanging assignments when offensive players cross or set screens</dd>
                </div>
                <div className="border-4 border-black rounded-xl p-4 bg-white hover:bg-[#f0f0f0] transition-colors">
                  <dt className="font-bold text-lg">HEDGING:</dt>
                  <dd>Temporarily helping a teammate defend against a screen before returning to your assignment</dd>
                </div>
                <div className="border-4 border-black rounded-xl p-4 bg-white hover:bg-[#f0f0f0] transition-colors">
                  <dt className="font-bold text-lg">OVERPLAY:</dt>
                  <dd>Positioning yourself on one side of an offensive player to deny them the ball</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      ),
    },
  ]

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      // Navigate to next section
      window.location.href = "/zone"
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
          <h1 className="neo-subheading mb-8">{slides[currentSlide].title}</h1>

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
              <span>{currentSlide === slides.length - 1 ? "NEXT DEFENSE" : "NEXT"}</span>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ManToManPage
