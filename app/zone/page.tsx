"use client"
import { useState, useRef } from "react"
import { ChevronLeft, ChevronRight, Play, Info, Trophy, X, Check } from "lucide-react"
import Navbar from "@/components/navbar"

// Interactive player component for drag and drop
function DraggablePlayer({
  color,
  position,
  label,
}: {
  color: string
  position: { x: number; y: number }
  label?: string
}) {
  return (
    <div
      className={`absolute w-4 h-4 ${color} border-2 border-black rounded-full flex items-center justify-center`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
    >
      {label && <span className="font-bold text-[8px]">{label}</span>}
    </div>
  )
}

export default function ZonePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [selectedZone, setSelectedZone] = useState<string | null>(null)
  const [selectedConcern, setSelectedConcern] = useState<string | null>(null)
  const [showZoneAnswer, setShowZoneAnswer] = useState(false)
  const [showConcernAnswer, setShowConcernAnswer] = useState(false)
  const [activeZoneArea, setActiveZoneArea] = useState<string | null>(null)
  const courtRef = useRef<HTMLDivElement>(null)

  const handleZoneSelect = (zone: string) => {
    setSelectedZone(zone)
    setShowZoneAnswer(true)
  }

  const handleConcernSelect = (concern: string) => {
    setSelectedConcern(concern)
    setShowConcernAnswer(true)
  }

  const handleAreaClick = (area: string) => {
    setActiveZoneArea(area)
  }

  const slides = [
    {
      title: "ZONE DEFENSE BASICS",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <p className="text-lg">
              Zone Defense assigns each defender to guard an area of the court rather than a specific player. Defenders
              move within their designated zones in relation to where the ball moves.
            </p>
            <p className="font-bold text-xl">
              Key Principle: Protect spaces, not faces. Defenders guard areas and any offensive player who enters that
              area.
            </p>

            <div className="relative h-80 neo-card bg-gray-100 my-8">
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                <div className="text-center mb-4">
                  <div className="font-bold text-black">INTERACTIVE ZONE DIAGRAM</div>
                </div>
                <div className="w-48 h-48 mx-auto bg-[#3366cc] border-4 border-black rounded-full flex items-center justify-center relative">
                  <div className="w-32 h-32 bg-white border-4 border-black rounded-full flex items-center justify-center relative">
                    {/* Top zone defenders */}
                    <DraggablePlayer color="bg-[#ff5757]" position={{ x: 30, y: 15 }} />
                    <DraggablePlayer color="bg-[#ff5757]" position={{ x: 70, y: 15 }} />

                    {/* Bottom zone defenders */}
                    <DraggablePlayer color="bg-[#ff5757]" position={{ x: 15, y: 85 }} />
                    <DraggablePlayer color="bg-[#ff5757]" position={{ x: 50, y: 85 }} />
                    <DraggablePlayer color="bg-[#ff5757]" position={{ x: 85, y: 85 }} />

                    {/* Zone areas - semi-transparent */}
                    <div className="absolute w-full h-1/2 top-0 border-b-2 border-dashed border-black opacity-30"></div>
                    <div className="absolute w-1/3 h-1/2 bottom-0 left-0 border-r-2 border-dashed border-black opacity-30"></div>
                    <div className="absolute w-1/3 h-1/2 bottom-0 right-0 border-l-2 border-dashed border-black opacity-30"></div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                    <button
                      className={`px-2 py-1 border-2 border-black rounded-md text-sm font-bold ${
                        activeZoneArea === "top" ? "bg-[#c1ff00]" : "bg-white"
                      }`}
                      onClick={() => handleAreaClick("top")}
                    >
                      TOP
                    </button>
                    <button
                      className={`px-2 py-1 border-2 border-black rounded-md text-sm font-bold ${
                        activeZoneArea === "middle" ? "bg-[#c1ff00]" : "bg-white"
                      }`}
                      onClick={() => handleAreaClick("middle")}
                    >
                      MIDDLE
                    </button>
                    <button
                      className={`px-2 py-1 border-2 border-black rounded-md text-sm font-bold ${
                        activeZoneArea === "bottom" ? "bg-[#c1ff00]" : "bg-white"
                      }`}
                      onClick={() => handleAreaClick("bottom")}
                    >
                      BOTTOM
                    </button>
                  </div>
                  {activeZoneArea && (
                    <div className="mt-2 p-2 bg-white border-2 border-black rounded-md text-sm">
                      {activeZoneArea === "top" &&
                        "Top defenders guard perimeter shooters and prevent easy passes inside."}
                      {activeZoneArea === "middle" &&
                        "Middle defenders shift to help on drives and protect the free throw line."}
                      {activeZoneArea === "bottom" && "Bottom defenders protect the paint and rebound."}
                    </div>
                  )}
                </div>
              </div>

              <button
                className="absolute bottom-4 right-4 p-2 bg-white border-4 border-black rounded-full hover:bg-[#c1ff00] transition-colors"
                onClick={() => {
                  setShowHint(!showHint)
                }}
              >
                <Info size={24} />
              </button>

              {showHint && (
                <div className="absolute bottom-16 right-4 p-4 bg-white border-4 border-black rounded-xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] w-64">
                  Common zone formations include 2-3, 3-2, and 1-3-1, named for how defenders are positioned from front
                  to back
                  <div className="absolute w-4 h-4 bg-white border-r-4 border-b-4 border-black transform rotate-45 -bottom-2 right-8"></div>
                </div>
              )}
            </div>

            <div className="flex justify-center gap-4">
              <button className="neo-button-outline flex items-center gap-2">
                <Play size={20} />
                <span>WATCH EXAMPLE</span>
              </button>

              <button className="neo-button-outline flex items-center gap-2">
                <span>TRY INTERACTIVE DEMO</span>
              </button>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="neo-card bg-gray-100 h-full">
              <h2 className="font-bold text-xl mb-4">KEY TERMINOLOGY:</h2>
              <dl className="space-y-4">
                <div className="border-4 border-black rounded-xl p-4 bg-white hover:bg-[#f0f0f0] transition-colors">
                  <dt className="font-bold text-lg">ZONE ROTATION:</dt>
                  <dd>How defenders shift positions as the ball moves around the perimeter</dd>
                </div>
                <div className="border-4 border-black rounded-xl p-4 bg-white hover:bg-[#f0f0f0] transition-colors">
                  <dt className="font-bold text-lg">OVERLOAD:</dt>
                  <dd>An offensive strategy that puts multiple players on one side of the court to stress a zone</dd>
                </div>
                <div className="border-4 border-black rounded-xl p-4 bg-white hover:bg-[#f0f0f0] transition-colors">
                  <dt className="font-bold text-lg">GAPS:</dt>
                  <dd>Spaces between defenders that offensive players try to exploit</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "COMMON ZONE FORMATIONS",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <p className="text-lg">
              There are several common zone formations, each with specific strengths and weaknesses:
            </p>

            <div className="space-y-6">
              <div className="neo-card" id="2-3-zone">
                <h3 className="font-bold text-xl mb-4">2-3 ZONE</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="mb-2">
                      Two defenders at the top of the key, three across the baseline. Excellent for protecting the paint
                      and rebounding.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-[#c1ff00] flex-shrink-0 flex items-center justify-center text-sm mt-0.5">
                          ✓
                        </div>
                        <span>Strong interior defense</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-[#c1ff00] flex-shrink-0 flex items-center justify-center text-sm mt-0.5">
                          ✓
                        </div>
                        <span>Good rebounding position</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-[#ff5757] flex-shrink-0 flex items-center justify-center text-sm mt-0.5">
                          ✗
                        </div>
                        <span>Vulnerable to perimeter shooting</span>
                      </li>
                    </ul>
                  </div>
                  <div className="h-40 border-4 border-black rounded-xl bg-gray-100 flex items-center justify-center">
                    <div className="w-32 h-32 bg-[#3366cc] border-4 border-black rounded-full flex items-center justify-center relative">
                      {/* Top zone defenders */}
                      <DraggablePlayer color="bg-[#ff5757]" position={{ x: 30, y: 15 }} />
                      <DraggablePlayer color="bg-[#ff5757]" position={{ x: 70, y: 15 }} />

                      {/* Bottom zone defenders */}
                      <DraggablePlayer color="bg-[#ff5757]" position={{ x: 15, y: 85 }} />
                      <DraggablePlayer color="bg-[#ff5757]" position={{ x: 50, y: 85 }} />
                      <DraggablePlayer color="bg-[#ff5757]" position={{ x: 85, y: 85 }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="neo-card" id="3-2-zone">
                <h3 className="font-bold text-xl mb-4">3-2 ZONE</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="mb-2">
                      Three defenders across the top, two near the baseline. Better perimeter defense but weaker
                      rebounding.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-[#c1ff00] flex-shrink-0 flex items-center justify-center text-sm mt-0.5">
                          ✓
                        </div>
                        <span>Strong perimeter defense</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-[#c1ff00] flex-shrink-0 flex items-center justify-center text-sm mt-0.5">
                          ✓
                        </div>
                        <span>Good for defending 3-point shooters</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-[#ff5757] flex-shrink-0 flex items-center justify-center text-sm mt-0.5">
                          ✗
                        </div>
                        <span>Weaker interior defense</span>
                      </li>
                    </ul>
                  </div>
                  <div className="h-40 border-4 border-black rounded-xl bg-gray-100 flex items-center justify-center">
                    <div className="w-32 h-32 bg-[#3366cc] border-4 border-black rounded-full flex items-center justify-center relative">
                      {/* Top zone defenders */}
                      <DraggablePlayer color="bg-[#ff5757]" position={{ x: 15, y: 15 }} />
                      <DraggablePlayer color="bg-[#ff5757]" position={{ x: 50, y: 15 }} />
                      <DraggablePlayer color="bg-[#ff5757]" position={{ x: 85, y: 15 }} />

                      {/* Bottom zone defenders */}
                      <DraggablePlayer color="bg-[#ff5757]" position={{ x: 30, y: 85 }} />
                      <DraggablePlayer color="bg-[#ff5757]" position={{ x: 70, y: 85 }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="neo-card" id="1-3-1-zone">
                <h3 className="font-bold text-xl mb-4">1-3-1 ZONE</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="mb-2">
                      One defender at top, three across the middle, one at the bottom. Great for trapping and creating
                      turnovers.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-[#c1ff00] flex-shrink-0 flex items-center justify-center text-sm mt-0.5">
                          ✓
                        </div>
                        <span>Excellent for trapping</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-[#c1ff00] flex-shrink-0 flex items-center justify-center text-sm mt-0.5">
                          ✓
                        </div>
                        <span>Creates turnovers</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-[#ff5757] flex-shrink-0 flex items-center justify-center text-sm mt-0.5">
                          ✗
                        </div>
                        <span>Requires good conditioning</span>
                      </li>
                    </ul>
                  </div>
                  <div className="h-40 border-4 border-black rounded-xl bg-gray-100 flex items-center justify-center">
                    <div className="w-32 h-32 bg-[#3366cc] border-4 border-black rounded-full flex items-center justify-center relative">
                      {/* Top zone defender */}
                      <DraggablePlayer color="bg-[#ff5757]" position={{ x: 50, y: 15 }} />

                      {/* Middle zone defenders */}
                      <DraggablePlayer color="bg-[#ff5757]" position={{ x: 15, y: 50 }} />
                      <DraggablePlayer color="bg-[#ff5757]" position={{ x: 50, y: 50 }} />
                      <DraggablePlayer color="bg-[#ff5757]" position={{ x: 85, y: 50 }} />

                      {/* Bottom zone defender */}
                      <DraggablePlayer color="bg-[#ff5757]" position={{ x: 50, y: 85 }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="neo-card bg-[#c1ff00]">
              <p className="font-bold text-lg flex items-center gap-2">
                <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center">!</span>
                COACH'S CHALLENGE:
              </p>
              <p className="mt-2 mb-4">
                Identify which zone would work best against a team with strong outside shooters but weak inside
                presence.
              </p>
              <div className="flex gap-4">
                <button
                  className={`neo-button-outline ${selectedZone === "2-3" ? (showZoneAnswer ? "bg-[#ff5757] text-white" : "bg-white") : ""}`}
                  onClick={() => handleZoneSelect("2-3")}
                  disabled={showZoneAnswer}
                >
                  2-3 ZONE
                  {selectedZone === "2-3" && showZoneAnswer && (
                    <div className="flex justify-center mt-2">
                      <X size={24} className="text-white" strokeWidth={3} />
                    </div>
                  )}
                </button>
                <button
                  className={`neo-button-outline ${selectedZone === "3-2" ? (showZoneAnswer ? "bg-[#c1ff00]" : "bg-white") : ""}`}
                  onClick={() => handleZoneSelect("3-2")}
                  disabled={showZoneAnswer}
                >
                  3-2 ZONE
                  {selectedZone === "3-2" && showZoneAnswer && (
                    <div className="flex justify-center mt-2">
                      <Check size={24} className="text-black" strokeWidth={3} />
                    </div>
                  )}
                </button>
                <button
                  className={`neo-button-outline ${selectedZone === "1-3-1" ? (showZoneAnswer ? "bg-[#ff5757] text-white" : "bg-white") : ""}`}
                  onClick={() => handleZoneSelect("1-3-1")}
                  disabled={showZoneAnswer}
                >
                  1-3-1 ZONE
                  {selectedZone === "1-3-1" && showZoneAnswer && (
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
                  <dt className="font-bold text-lg">ZONE FORMATION:</dt>
                  <dd>The numerical arrangement of defenders (e.g., 2-3, 3-2, 1-3-1)</dd>
                </div>
                <div className="border-4 border-black rounded-xl p-4 bg-white hover:bg-[#f0f0f0] transition-colors">
                  <dt className="font-bold text-lg">SKIP PASS:</dt>
                  <dd>A pass that "skips" over a defender to attack zone weaknesses</dd>
                </div>
                <div className="border-4 border-black rounded-xl p-4 bg-white hover:bg-[#f0f0f0] transition-colors">
                  <dt className="font-bold text-lg">HIGH POST:</dt>
                  <dd>The area near the free throw line, often a weak spot in zone defenses</dd>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="neo-card">
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#c1ff00] flex-shrink-0 flex items-center justify-center text-black font-bold">
                    +
                  </div>
                  <span>PROS:</span>
                </h3>

                <div className="space-y-3">
                  {[
                    { text: "Great for teams with slow players", score: 8 },
                    { text: "Limits drives to the basket", score: 7 },
                    { text: "Reduces foul trouble", score: 6 },
                    { text: "Less physically demanding", score: 9 },
                  ].map((pro, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 border-4 border-black rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <span className="flex-1 font-medium">{pro.text}</span>
                      <div className="flex items-center gap-1">
                        <span className="font-bold">{pro.score}/10</span>
                        <div className="w-16 h-4 bg-gray-200 border-2 border-black rounded-full overflow-hidden">
                          <div className="h-full bg-[#c1ff00]" style={{ width: `${pro.score * 10}%` }}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="neo-card">
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#ff5757] flex-shrink-0 flex items-center justify-center text-black font-bold">
                    -
                  </div>
                  <span>CONS:</span>
                </h3>

                <div className="space-y-3">
                  {[
                    { text: "Vulnerable to outside shooters", score: 8 },
                    { text: "Communication breakdowns hurt coverage", score: 7 },
                    { text: "Difficult to match up in transition", score: 6 },
                    { text: "Can lead to rebounding challenges", score: 5 },
                  ].map((con, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 border-4 border-black rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <span className="flex-1 font-medium">{con.text}</span>
                      <div className="flex items-center gap-1">
                        <span className="font-bold">{con.score}/10</span>
                        <div className="w-16 h-4 bg-gray-200 border-2 border-black rounded-full overflow-hidden">
                          <div className="h-full bg-[#ff5757]" style={{ width: `${con.score * 10}%` }}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="neo-card bg-[#3366cc] text-white">
              <h3 className="font-bold text-xl mb-4">ZONE DEFENSE SCENARIO:</h3>
              <p className="mb-6">
                Your team is facing an opponent with excellent 3-point shooters. What's your biggest concern with using
                a zone defense?
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  className={`neo-button-outline text-white border-white ${
                    selectedConcern === "vulnerable"
                      ? showConcernAnswer
                        ? "bg-white text-[#3366cc]"
                        : "bg-[#3366cc]"
                      : ""
                  }`}
                  onClick={() => handleConcernSelect("vulnerable")}
                  disabled={showConcernAnswer}
                >
                  VULNERABLE TO OUTSIDE SHOOTING
                  {selectedConcern === "vulnerable" && showConcernAnswer && (
                    <div className="flex justify-center mt-2">
                      <Check size={24} className="text-[#3366cc]" strokeWidth={3} />
                    </div>
                  )}
                </button>
                <button
                  className={`neo-button-outline text-white border-white ${
                    selectedConcern === "rebound" ? (showConcernAnswer ? "bg-[#ff5757]" : "bg-[#3366cc]") : ""
                  }`}
                  onClick={() => handleConcernSelect("rebound")}
                  disabled={showConcernAnswer}
                >
                  DIFFICULT TO REBOUND
                  {selectedConcern === "rebound" && showConcernAnswer && (
                    <div className="flex justify-center mt-2">
                      <X size={24} className="text-white" strokeWidth={3} />
                    </div>
                  )}
                </button>
                <button
                  className={`neo-button-outline text-white border-white ${
                    selectedConcern === "demanding" ? (showConcernAnswer ? "bg-[#ff5757]" : "bg-[#3366cc]") : ""
                  }`}
                  onClick={() => handleConcernSelect("demanding")}
                  disabled={showConcernAnswer}
                >
                  TOO PHYSICALLY DEMANDING
                  {selectedConcern === "demanding" && showConcernAnswer && (
                    <div className="flex justify-center mt-2">
                      <X size={24} className="text-white" strokeWidth={3} />
                    </div>
                  )}
                </button>
                <button
                  className={`neo-button-outline text-white border-white ${
                    selectedConcern === "communicate" ? (showConcernAnswer ? "bg-[#ff5757]" : "bg-[#3366cc]") : ""
                  }`}
                  onClick={() => handleConcernSelect("communicate")}
                  disabled={showConcernAnswer}
                >
                  HARD TO COMMUNICATE
                  {selectedConcern === "communicate" && showConcernAnswer && (
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
                  <dt className="font-bold text-lg">ZONE TRAP:</dt>
                  <dd>When two zone defenders converge to trap a ball handler</dd>
                </div>
                <div className="border-4 border-black rounded-xl p-4 bg-white hover:bg-[#f0f0f0] transition-colors">
                  <dt className="font-bold text-lg">FLASH:</dt>
                  <dd>An offensive move where a player quickly cuts to an open spot in the zone</dd>
                </div>
                <div className="border-4 border-black rounded-xl p-4 bg-white hover:bg-[#f0f0f0] transition-colors">
                  <dt className="font-bold text-lg">MATCHUP ZONE:</dt>
                  <dd>A hybrid defense that combines zone principles with man-to-man concepts</dd>
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
      window.location.href = "/box-and-1"
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
              <span>{currentSlide === slides.length - 1 ? "NEXT DEFENSE" : "NEXT"}</span>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
