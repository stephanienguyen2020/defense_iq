"use client"
import { useState, useRef, useEffect } from "react"
import type React from "react"

import { ChevronLeft, ChevronRight, Play, Info, Trophy, Star, Check, X } from "lucide-react"
import Navbar from "@/components/navbar"

function ZonePlayer({
  color,
  position,
  label,
  zoneArea,
}: {
  color: string
  position: { x: number; y: number }
  label?: string
  zoneArea: 
    // Main diagram zones
    | "topLeft" | "topRight" | "bottomLeft"| "bottomRight"
}) {
  const playerRef = useRef<HTMLDivElement>(null)
  const [playerPosition, setPlayerPosition] = useState(position)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  // Define zone boundaries (in percentages)
  const zoneBoundaries = {
    // Main diagram zones
    topLeft: { minX: 0, maxX: 45, minY: 35, maxY: 60 },
    topRight: { minX: 50, maxX: 100, minY: 35, maxY: 60 },
    bottomLeft: { minX: 0, maxX: 45, minY: 65, maxY:100 },
    bottomRight: { minX: 50, maxX: 100, minY: 65, maxY: 100 },
  };

  const currentZone = zoneBoundaries[zoneArea];

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    if (playerRef.current) {
      const rect = playerRef.current.getBoundingClientRect()
      const parentRect = playerRef.current.parentElement?.getBoundingClientRect()
      
      if (parentRect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        })
        setIsDragging(true)
      }
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (playerRef.current && e.touches[0]) {
      const rect = playerRef.current.getBoundingClientRect()
      const parentRect = playerRef.current.parentElement?.getBoundingClientRect()
      
      if (parentRect) {
        setDragOffset({
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top
        })
        setIsDragging(true)
      }
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && playerRef.current) {
        const parentRect = playerRef.current.parentElement?.getBoundingClientRect()
        if (parentRect) {
          // Calculate position as percentage of parent container
          const newX = ((e.clientX - parentRect.left - dragOffset.x) / parentRect.width) * 100
          const newY = ((e.clientY - parentRect.top - dragOffset.y) / parentRect.height) * 100

          // Constrain to zone boundaries
          const constrainedX = Math.max(currentZone.minX, Math.min(newX, currentZone.maxX))
          const constrainedY = Math.max(currentZone.minY, Math.min(newY, currentZone.maxY))

          setPlayerPosition({ x: constrainedX, y: constrainedY })
        }
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches[0] && playerRef.current) {
        e.preventDefault() // Prevent scrolling while dragging
        const parentRect = playerRef.current.parentElement?.getBoundingClientRect()
        if (parentRect) {
          // Calculate position as percentage of parent container
          const newX = ((e.touches[0].clientX - parentRect.left - dragOffset.x) / parentRect.width) * 100
          const newY = ((e.touches[0].clientY - parentRect.top - dragOffset.y) / parentRect.height) * 100

          // Constrain to zone boundaries
          const constrainedX = Math.max(currentZone.minX, Math.min(newX, currentZone.maxX))
          const constrainedY = Math.max(currentZone.minY, Math.min(newY, currentZone.maxY))

          setPlayerPosition({ x: constrainedX, y: constrainedY })
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
  }, [isDragging, dragOffset, currentZone])

  return (
    <div
      ref={playerRef}
      className={`absolute w-6 h-6 ${color} border-2 border-black rounded-full cursor-move shadow-md flex items-center justify-center`}
      style={{
        left: `${playerPosition.x}%`,
        top: `${playerPosition.y}%`,
        touchAction: "none",
        zIndex: isDragging ? 10 : 1,
        transition: isDragging ? "none" : "box-shadow 0.2s",
        boxShadow: isDragging ? "0 0 0 4px rgba(255, 87, 87, 0.5)" : "",
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {label && <span className="font-bold text-xs text-white">{label}</span>}
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

// Update the interactive diagram in the Box and 1 defense page
function BoxAndOneInteractiveCourt() {
  const courtRef = useRef<HTMLDivElement>(null)
  const [courtSize, setCourtSize] = useState({ width: 0, height: 0 })
  const [starPosition, setStarPosition] = useState({ x: 160, y: 60 })
  const [isDraggingStar, setIsDraggingStar] = useState(false)
  const [starDragOffset, setStarDragOffset] = useState({ x: 0, y: 0 })
  
  

  // Calculate chaser defender position based on star position
  const calculateChaserPosition = () => {
    // Offset slightly from the star player
    const offsetX = 10
    const offsetY = 10
    let chaserX = starPosition.x + offsetX
    let chaserY = starPosition.y + offsetY
    
    // Constrain to court boundaries
    if (courtSize.width > 0 && courtSize.height > 0) {
      chaserX = Math.max(0, Math.min(chaserX, courtSize.width - 24))
      chaserY = Math.max(0, Math.min(chaserY, courtSize.height - 24))
    }
    
    return { x: chaserX, y: chaserY }
  }
  
  const chaserPosition = calculateChaserPosition()
  
  // Event handlers for star player dragging
  const handleStarMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    if (courtRef.current) {
      const rect = courtRef.current.getBoundingClientRect()
      setStarDragOffset({
        x: e.clientX - rect.left - starPosition.x,
        y: e.clientY - rect.top - starPosition.y,
      })
      setIsDraggingStar(true)
    }
  }
  
  const handleStarTouchStart = (e: React.TouchEvent) => {
    if (courtRef.current && e.touches[0]) {
      const rect = courtRef.current.getBoundingClientRect()
      setStarDragOffset({
        x: e.touches[0].clientX - rect.left - starPosition.x,
        y: e.touches[0].clientY - rect.top - starPosition.y,
      })
      setIsDraggingStar(true)
    }
  }
  
  useEffect(() => {
    const updateSize = () => {
      if (courtRef.current) {
        const width = courtRef.current.clientWidth
        const height = courtRef.current.clientHeight
        setCourtSize({ width, height })
      }
    }
    
    // Handle star player drag movements
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingStar && courtRef.current) {
        const rect = courtRef.current.getBoundingClientRect()
        const newX = e.clientX - rect.left - starDragOffset.x
        const newY = e.clientY - rect.top - starDragOffset.y
        
        // Constrain to court boundaries
        const constrainedX = Math.max(0, Math.min(newX, courtSize.width - 24))
        const constrainedY = Math.max(0, Math.min(newY, courtSize.height - 24))
        
        setStarPosition({ x: constrainedX, y: constrainedY })
      }
    }
    
    const handleTouchMove = (e: TouchEvent) => {
      if (isDraggingStar && e.touches[0] && courtRef.current) {
        e.preventDefault()
        const rect = courtRef.current.getBoundingClientRect()
        const newX = e.touches[0].clientX - rect.left - starDragOffset.x
        const newY = e.touches[0].clientY - rect.top - starDragOffset.y
        
        // Constrain to court boundaries
        const constrainedX = Math.max(0, Math.min(newX, courtSize.width - 24))
        const constrainedY = Math.max(0, Math.min(newY, courtSize.height - 24))
        
        setStarPosition({ x: constrainedX, y: constrainedY })
      }
    }
    
    const handleMouseUp = () => {
      setIsDraggingStar(false)
    }
    
    const handleTouchEnd = () => {
      setIsDraggingStar(false)
    }
    
    // Initial size calculation
    updateSize()
    
    // Update size on resize
    window.addEventListener("resize", updateSize)
    
    // Add drag event listeners
    if (isDraggingStar) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
      window.addEventListener("touchmove", handleTouchMove, { passive: false })
      window.addEventListener("touchend", handleTouchEnd)
    }
    
    return () => {
      window.removeEventListener("resize", updateSize)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isDraggingStar, starDragOffset])

  
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div
        ref={courtRef}
        className="relative h-80 neo-card bg-orange-200 overflow-hidden"
        style={{
          backgroundImage: 'url("/court.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: "370px",
        }}
      >
        
        <div className="w-full h-full relative">
          {/* Zone dividers */}
          <div className="absolute w-full h-2/3 top-0 border-b-2 border-dashed border-black"></div>
          <div className="absolute w-1/2 h-full top-0 right-0 border-l-2 border-dashed border-black"></div>
          
          {/* Zone players */}
          <ZonePlayer color="bg-[#ff5757]" position={{ x: 25, y: 50 }} label="1" zoneArea="topLeft" />
          <ZonePlayer color="bg-[#ff5757]" position={{ x: 75, y: 50 }} label="2" zoneArea="topRight" />
          <ZonePlayer color="bg-[#ff5757]" position={{ x: 25, y: 75 }} label="3" zoneArea="bottomLeft" />
          <ZonePlayer color="bg-[#ff5757]" position={{ x: 75, y: 75 }} label="5" zoneArea="bottomRight" />
        </div>
        
        {/* Star player (draggable) */}
        <div
          className="absolute w-6 h-6 bg-[#ff4444] border-2 border-black rounded-full cursor-move shadow-md flex items-center justify-center"
          style={{
            left: `${starPosition.x}px`,
            top: `${starPosition.y}px`,
            touchAction: "none",
            zIndex: isDraggingStar ? 10 : 1,
            transition: isDraggingStar ? "none" : "box-shadow 0.2s",
            boxShadow: isDraggingStar ? "0 0 0 4px rgba(255, 87, 87, 0.5)" : "",
          }}
          onMouseDown={handleStarMouseDown}
          onTouchStart={handleStarTouchStart}
        >
          <span className="font-bold text-xs text-white">S</span>
        </div>
        
        {/* Chaser defender (follows star) */}
        <div
          className="absolute w-6 h-6 bg-[#c1ff00] border-2 border-black rounded-full shadow-md flex items-center justify-center pointer-events-none"
          style={{
            left: `${chaserPosition.x}px`,
            top: `${chaserPosition.y}px`,
            zIndex: 0,
            transition: "left 0.05s linear, top 0.05s linear",
          }}
        >
          <span className="font-bold text-xs text-black">C</span>
        </div>
      
      </div>
      
      <div className="neo-card bg-white p-4 text-black flex-1">
        <h3 className="font-bold text-lg mb-2">BOX AND 1 DEFENSE</h3>
        <p className="mb-4">
          <span className="font-bold">4 defenders:</span> Positioned in a box zone formation.
          <br /><br />
          <span className="font-bold">1 defender (C):</span> "Chaser" who tightly follows the star player (S).
        </p>
        <div className="flex gap-2 mb-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-1"></div>
            <span>Box Defenders</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-[#c1ff00] rounded-full mr-1"></div>
            <span>Chaser</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-[#ff4444] rounded-full mr-1"></div>
            <span>Star</span>
          </div>
        </div>
        <div className="p-3 bg-gray-100 border-2 border-black rounded-lg">
          <p className="font-bold">INSTRUCTIONS:</p>
          <ul className="list-disc ml-5 text-sm">
            <li>Drag the star player (S) to move around the court</li>
            <li>The chaser defender (C) will follow the star</li>
            <li>Box defenders can be moved within their zones</li>
          </ul>
        </div>
      </div>
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

            <BoxAndOneInteractiveCourt />

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
