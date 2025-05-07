"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Info,
  Trophy,
  X,
  Check,
} from "lucide-react";
import Navbar from "@/components/navbar";

// Interactive player component for drag and drop with zone restrictions
function DraggablePlayer({
  color,
  position,
  label,
  zoneArea,
}: {
  color: string;
  position: { x: number; y: number };
  label?: string;
  zoneArea: // Main diagram zones
  | "topLeft"
    | "topRight"
    | "bottomLeft"
    | "bottomCenter"
    | "bottomRight"
    // 2-3 zone
    | "top2-3Left"
    | "top2-3Right"
    | "bottom2-3Left"
    | "bottom2-3Center"
    | "bottom2-3Right"
    // 3-2 zone
    | "top3-2Left"
    | "top3-2Center"
    | "top3-2Right"
    | "bottom3-2Left"
    | "bottom3-2Right"
    // 1-3-1 zone
    | "top"
    | "middleLeft"
    | "middleCenter"
    | "middleRight"
    | "bottom";
}) {
  const playerRef = useRef<HTMLDivElement>(null);
  const [playerPosition, setPlayerPosition] = useState(position);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Define zone boundaries (in percentages)
  const zoneBoundaries = {
    // Main diagram zones
    topLeft: { minX: 0, maxX: 45, minY: 0, maxY: 45 },
    topRight: { minX: 50, maxX: 95, minY: 0, maxY: 45 },
    bottomLeft: { minX: 0, maxX: 29, minY: 50, maxY: 100 },
    bottomCenter: { minX: 33, maxX: 67, minY: 50, maxY: 100 },
    bottomRight: { minX: 67, maxX: 90, minY: 50, maxY: 100 },

    // 2-3 zone specific
    "top2-3Left": { minX: 0, maxX: 45, minY: 0, maxY: 50 },
    "top2-3Right": { minX: 50, maxX: 90, minY: 0, maxY: 50 },
    "bottom2-3Left": { minX: 0, maxX: 29, minY: 55, maxY: 90 },
    "bottom2-3Center": { minX: 33, maxX: 67, minY: 55, maxY: 90 },
    "bottom2-3Right": { minX: 67, maxX: 90, minY: 55, maxY: 90 },

    // 3-2 zone specific
    "top3-2Left": { minX: 0, maxX: 29, minY: 0, maxY: 50 },
    "top3-2Center": { minX: 33, maxX: 60, minY: 0, maxY: 50 },
    "top3-2Right": { minX: 67, maxX: 90, minY: 0, maxY: 50 },
    "bottom3-2Left": { minX: 0, maxX: 45, minY: 55, maxY: 90 },
    "bottom3-2Right": { minX: 50, maxX: 90, minY: 55, maxY: 90 },

    // 1-3-1 zone specific
    top: { minX: 0, maxX: 90, minY: 0, maxY: 45 },
    middleLeft: { minX: 0, maxX: 33, minY: 50, maxY: 75 },
    middleCenter: { minX: 33, maxX: 60, minY: 50, maxY: 75 },
    middleRight: { minX: 67, maxX: 90, minY: 50, maxY: 75 },
    bottom: { minX: 0, maxX: 90, minY: 75, maxY: 90 },
  };

  const currentZone = zoneBoundaries[zoneArea];

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (playerRef.current) {
      const rect = playerRef.current.getBoundingClientRect();
      const parentRect =
        playerRef.current.parentElement?.getBoundingClientRect();

      if (parentRect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
        setIsDragging(true);
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (playerRef.current && e.touches[0]) {
      const rect = playerRef.current.getBoundingClientRect();
      const parentRect =
        playerRef.current.parentElement?.getBoundingClientRect();

      if (parentRect) {
        setDragOffset({
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top,
        });
        setIsDragging(true);
      }
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && playerRef.current) {
        const parentRect =
          playerRef.current.parentElement?.getBoundingClientRect();
        if (parentRect) {
          // Calculate position as percentage of parent container
          const newX =
            ((e.clientX - parentRect.left - dragOffset.x) / parentRect.width) *
            100;
          const newY =
            ((e.clientY - parentRect.top - dragOffset.y) / parentRect.height) *
            100;

          // Constrain to zone boundaries
          const constrainedX = Math.max(
            currentZone.minX,
            Math.min(newX, currentZone.maxX)
          );
          const constrainedY = Math.max(
            currentZone.minY,
            Math.min(newY, currentZone.maxY)
          );

          setPlayerPosition({ x: constrainedX, y: constrainedY });
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches[0] && playerRef.current) {
        e.preventDefault(); // Prevent scrolling while dragging
        const parentRect =
          playerRef.current.parentElement?.getBoundingClientRect();
        if (parentRect) {
          // Calculate position as percentage of parent container
          const newX =
            ((e.touches[0].clientX - parentRect.left - dragOffset.x) /
              parentRect.width) *
            100;
          const newY =
            ((e.touches[0].clientY - parentRect.top - dragOffset.y) /
              parentRect.height) *
            100;

          // Constrain to zone boundaries
          const constrainedX = Math.max(
            currentZone.minX,
            Math.min(newX, currentZone.maxX)
          );
          const constrainedY = Math.max(
            currentZone.minY,
            Math.min(newY, currentZone.maxY)
          );

          setPlayerPosition({ x: constrainedX, y: constrainedY });
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, dragOffset, currentZone]);

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
  );
}

export default function ZonePage() {
  const router = useRouter();
  const LESSON_ID = 2; // maps to Zone defense lesson
  const [currentSlide, setCurrentSlide] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [selectedConcern, setSelectedConcern] = useState<string | null>(null);
  const [showZoneAnswer, setShowZoneAnswer] = useState(false);
  const [showConcernAnswer, setShowConcernAnswer] = useState(false);
  const [activeZoneArea, setActiveZoneArea] = useState<string | null>(null);
  const [activeZoneType, setActiveZoneType] = useState<"2-3" | "3-2" | "1-3-1">(
    "2-3"
  );
  const courtRef = useRef<HTMLDivElement>(null);
  const handleConcernSelect = (concern: string) => {
    setSelectedConcern(concern);
    setShowConcernAnswer(true);
  };

  const handleAreaClick = (area: string) => {
    setActiveZoneArea(area === activeZoneArea ? null : area);
  };

  // Fetch persisted slide index on mount
  useEffect(() => {
    fetch(`http://127.0.0.1:5000/learn/${LESSON_ID}`)
      .then((res) => res.json())
      .then((data) => {
        setCurrentSlide(
          typeof data.current_slide === "number" ? data.current_slide : 0
        );
      })
      .catch((err) => {
        console.error("Failed to fetch lesson state:", err);
        setCurrentSlide(0);
      });
  }, []);

  // Helper to POST updated slide index and navigate or update locally
  const updateSlide = (newSlide: number) => {
    fetch(`http://127.0.0.1:5000/learn/${LESSON_ID}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selection: newSlide }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (newSlide >= slides.length) {
          // last slide: backend returns next path
          router.push(data.next);
        } else {
          setCurrentSlide(newSlide);
        }
      })
      .catch((err) => console.error("Failed to update lesson state:", err));
  };

  const nextSlide = () => {
    if (currentSlide === slides.length - 1) {
      // last slide → go to your zone defense page
      router.push("/box-and-1");
    } else {
      updateSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide !== null && currentSlide > 0)
      updateSlide(currentSlide - 1);
  };

  // Wait until we have a slide index
  if (currentSlide === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const slides = [
    {
      title: "ZONE DEFENSE BASICS",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <p className="text-lg">
              Zone Defense assigns each defender to guard an area of the court
              rather than a specific player. Defenders move within their
              designated zones in relation to where the ball moves.
            </p>
            <p className="font-bold text-xl">
              Key Principle: Protect spaces, not faces. Defenders guard areas
              and any offensive player who enters that area.
            </p>

            <div className="flex flex-col md:flex-row gap-4 my-8">
              {/* Court container - reduced width */}
              <div className="relative h-80 neo-card bg-gray-100 md:w-[370px]">
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center p-4"
                  style={{
                    backgroundImage: 'url("/court.jpg")',
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <div className="text-center mb-4">
                    <div className="font-bold text-black bg-white px-2 py-1 rounded-md border border-black inline-block">
                      INTERACTIVE ZONE DIAGRAM
                    </div>
                  </div>
                  <div className="w-full h-full relative">
                    {/* Zone dividers */}
                    <div className="absolute w-full h-1/2 top-0 border-b-2 border-dashed border-black"></div>
                    <div className="absolute w-1/3 h-1/2 bottom-0 left-0 border-r-2 border-dashed border-black"></div>
                    <div className="absolute w-1/3 h-1/2 bottom-0 right-0 border-l-2 border-dashed border-black"></div>
                    <div className="absolute w-1/2 h-1/2 top-0 right-0 border-l-2 border-dashed border-black"></div>

                    {/* Zone players */}
                    <DraggablePlayer
                      color="bg-[#ff5757]"
                      position={{ x: 25, y: 25 }}
                      label="1"
                      zoneArea="topLeft"
                    />
                    <DraggablePlayer
                      color="bg-[#ff5757]"
                      position={{ x: 75, y: 25 }}
                      label="2"
                      zoneArea="topRight"
                    />
                    <DraggablePlayer
                      color="bg-[#ff5757]"
                      position={{ x: 16, y: 75 }}
                      label="3"
                      zoneArea="bottomLeft"
                    />
                    <DraggablePlayer
                      color="bg-[#ff5757]"
                      position={{ x: 50, y: 75 }}
                      label="4"
                      zoneArea="bottomCenter"
                    />
                    <DraggablePlayer
                      color="bg-[#ff5757]"
                      position={{ x: 84, y: 75 }}
                      label="5"
                      zoneArea="bottomRight"
                    />
                  </div>
                  <button
                    className="absolute bottom-4 right-4 p-2 bg-white border-4 border-black rounded-full hover:bg-[#c1ff00] transition-colors"
                    onClick={() => {
                      setShowHint(!showHint);
                    }}
                  >
                    <Info size={24} />
                  </button>
                  {showHint && (
                    <div
                      className="absolute bottom-16 right-4 p-4 bg-white border-4 border-black rounded-xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] w-64"
                      style={{ zIndex: 9999 }}
                    >
                      Each defender is responsible for a specific zone on the
                      court. Drag defenders to position them optimally within
                      their zones.
                      <div className="absolute w-4 h-4 bg-white border-r-4 border-b-4 border-black transform rotate-45 -bottom-2 right-8"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Zone area controls - in a separate container */}
              <div className="neo-card bg-white h-80 flex-1 flex flex-col justify-center p-4">
                <h3 className="font-bold text-xl mb-4 text-center">
                  ZONE RESPONSIBILITIES
                </h3>
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
                        activeZoneArea === "middle"
                          ? "bg-[#c1ff00]"
                          : "bg-white"
                      }`}
                      onClick={() => handleAreaClick("middle")}
                    >
                      MIDDLE
                    </button>
                    <button
                      className={`px-2 py-1 border-2 border-black rounded-md text-sm font-bold ${
                        activeZoneArea === "bottom"
                          ? "bg-[#c1ff00]"
                          : "bg-white"
                      }`}
                      onClick={() => handleAreaClick("bottom")}
                    >
                      BOTTOM
                    </button>
                  </div>
                  {activeZoneArea && (
                    <div className="mt-4 p-3 bg-white border-4 border-black rounded-xl text-sm">
                      {activeZoneArea === "top" &&
                        "Top defenders guard perimeter shooters and prevent easy passes inside."}
                      {activeZoneArea === "middle" &&
                        "Middle defenders shift to help on drives and protect the free throw line."}
                      {activeZoneArea === "bottom" &&
                        "Bottom defenders protect the paint and rebound."}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* <div className="flex justify-center gap-4">
              <button className="neo-button-outline flex items-center gap-2">
                <Play size={20} />
                <span>WATCH EXAMPLE</span>
              </button>

              <button className="neo-button-outline flex items-center gap-2">
                <span>TRY INTERACTIVE DEMO</span>
              </button>
            </div> */}
          </div>

          <div className="md:col-span-1">
            <div className="neo-card bg-gray-100 h-full">
              <h2 className="font-bold text-xl mb-4">KEY TERMINOLOGY:</h2>
              <dl className="space-y-4">
                <div className="border-4 border-black rounded-xl p-4 bg-white hover:bg-[#f0f0f0] transition-colors">
                  <dt className="font-bold text-lg">ZONE ASSIGNMENT:</dt>
                  <dd>
                    The specific area of the court that a defender is responsible for covering and protecting.
                  </dd>
                </div>
                <div className="border-4 border-black rounded-xl p-4 bg-white hover:bg-[#f0f0f0] transition-colors">
                  <dt className="font-bold text-lg">ZONE COLLAPSE:</dt>
                  <dd>
                    When defenders temporarily shrink toward the basket to help stop drives or rebound, then reset.
                  </dd>
                </div>
                <div className="border-4 border-black rounded-xl p-4 bg-white hover:bg-[#f0f0f0] transition-colors">
                  <dt className="font-bold text-lg">GAPS:</dt>
                  <dd>
                    Spaces between defenders that offensive players try to
                    exploit
                  </dd>
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
              There are several common zone formations, each with specific
              strengths and weaknesses:
            </p>

            <div className="flex gap-4 mb-6">
              <button
                className={`neo-button-outline font-bold ${
                  activeZoneType === "2-3" ? "bg-[#c1ff00]" : ""
                }`}
                onClick={() => setActiveZoneType("2-3")}
              >
                2-3 ZONE
              </button>
              <button
                className={`neo-button-outline font-bold ${
                  activeZoneType === "3-2" ? "bg-[#c1ff00]" : ""
                }`}
                onClick={() => setActiveZoneType("3-2")}
              >
                3-2 ZONE
              </button>
              <button
                className={`neo-button-outline font-bold ${
                  activeZoneType === "1-3-1" ? "bg-[#c1ff00]" : ""
                }`}
                onClick={() => setActiveZoneType("1-3-1")}
              >
                1-3-1 ZONE
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="neo-card">
                <h3 className="font-bold text-xl mb-4">
                  {activeZoneType} ZONE
                </h3>
                <div className="border-4 border-black rounded-xl overflow-hidden flex items-center justify-center relative md:w-[300px] h-[280px]">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: 'url("/court.jpg")',
                      backgroundSize: "contain",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    {/* Conditionally render the zone dividers and players based on activeZoneType */}
                    {activeZoneType === "2-3" && (
                      <>
                        {/* Zone dividers for 2-3 zone */}
                        <div className="absolute w-full h-3/5 top-0 border-b-2 border-dashed border-black"></div>
                        <div className="absolute w-1/2 h-3/5 top-0 left-0 border-r-2 border-dashed border-black"></div>
                        <div className="absolute w-1/3 h-2/5 bottom-0 left-0 border-r-2 border-dashed border-black"></div>
                        <div className="absolute w-1/3 h-2/5 bottom-0 right-0 border-l-2 border-dashed border-black"></div>

                        {/* Top zone defenders */}
                        <DraggablePlayer
                          color="bg-[#ff5757]"
                          position={{ x: 25, y: 45 }}
                          label="1"
                          zoneArea="top2-3Left"
                        />
                        <DraggablePlayer
                          color="bg-[#ff5757]"
                          position={{ x: 70, y: 45 }}
                          label="2"
                          zoneArea="top2-3Right"
                        />

                        {/* Bottom zone defenders */}
                        <DraggablePlayer
                          color="bg-[#ff5757]"
                          position={{ x: 16, y: 75 }}
                          label="3"
                          zoneArea="bottom2-3Left"
                        />
                        <DraggablePlayer
                          color="bg-[#ff5757]"
                          position={{ x: 50, y: 75 }}
                          label="4"
                          zoneArea="bottom2-3Center"
                        />
                        <DraggablePlayer
                          color="bg-[#ff5757]"
                          position={{ x: 84, y: 75 }}
                          label="5"
                          zoneArea="bottom2-3Right"
                        />
                      </>
                    )}

                    {activeZoneType === "3-2" && (
                      <>
                        {/* Zone dividers for 3-2 zone */}
                        <div className="absolute w-full h-3/5 top-0 border-b-2 border-dashed border-black"></div>
                        <div className="absolute w-1/3 h-3/5 top-0 left-0 border-r-2 border-dashed border-black"></div>
                        <div className="absolute w-1/3 h-3/5 top-0 right-0 border-l-2 border-dashed border-black"></div>
                        <div className="absolute w-1/2 h-2/5 bottom-0 left-0 border-r-2 border-dashed border-black"></div>

                        {/* Top zone defenders */}
                        <DraggablePlayer
                          color="bg-[#ff5757]"
                          position={{ x: 16, y: 45 }}
                          label="1"
                          zoneArea="top3-2Left"
                        />
                        <DraggablePlayer
                          color="bg-[#ff5757]"
                          position={{ x: 50, y: 45 }}
                          label="2"
                          zoneArea="top3-2Center"
                        />
                        <DraggablePlayer
                          color="bg-[#ff5757]"
                          position={{ x: 84, y: 45 }}
                          label="3"
                          zoneArea="top3-2Right"
                        />

                        {/* Bottom zone defenders */}
                        <DraggablePlayer
                          color="bg-[#ff5757]"
                          position={{ x: 30, y: 75 }}
                          label="4"
                          zoneArea="bottom3-2Left"
                        />
                        <DraggablePlayer
                          color="bg-[#ff5757]"
                          position={{ x: 70, y: 75 }}
                          label="5"
                          zoneArea="bottom3-2Right"
                        />
                      </>
                    )}

                    {activeZoneType === "1-3-1" && (
                      <>
                        {/* Zone dividers for 1-3-1 zone */}
                        <div className="absolute w-full h-1/2 top-0 border-b-2 border-dashed border-black"></div>
                        <div className="absolute w-1/3 h-1/3 top-1/2 left-0 border-r-2 border-dashed border-black"></div>
                        <div className="absolute w-full h-4/5 top-0 border-b-2 border-dashed border-black"></div>
                        <div className="absolute w-1/3 h-1/3 top-1/2 right-0 border-l-2 border-dashed border-black"></div>

                        {/* Top zone defender */}
                        <DraggablePlayer
                          color="bg-[#ff5757]"
                          position={{ x: 50, y: 15 }}
                          label="1"
                          zoneArea="top"
                        />

                        {/* Middle zone defenders */}
                        <DraggablePlayer
                          color="bg-[#ff5757]"
                          position={{ x: 16, y: 50 }}
                          label="2"
                          zoneArea="middleLeft"
                        />
                        <DraggablePlayer
                          color="bg-[#ff5757]"
                          position={{ x: 50, y: 50 }}
                          label="3"
                          zoneArea="middleCenter"
                        />
                        <DraggablePlayer
                          color="bg-[#ff5757]"
                          position={{ x: 84, y: 50 }}
                          label="4"
                          zoneArea="middleRight"
                        />

                        {/* Bottom zone defender */}
                        <DraggablePlayer
                          color="bg-[#ff5757]"
                          position={{ x: 50, y: 85 }}
                          label="5"
                          zoneArea="bottom"
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Pros and cons for the selected zone */}
              <div className="flex-1 neo-card">
                <h3 className="font-bold text-xl mb-4">PROS & CONS</h3>

                {activeZoneType === "2-3" && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#c1ff00] flex items-center justify-center text-black font-bold text-xs">
                          +
                        </div>
                        PROS:
                      </h4>
                      <ul className="ml-8 list-disc space-y-1 mt-2">
                        <li>Strong protection in the paint</li>
                        <li>Excellent rebounding coverage</li>
                        <li>Great for defending inside players</li>
                        <li>Limits drives to the basket</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#ff5757] flex items-center justify-center text-black font-bold text-xs">
                          -
                        </div>
                        CONS:
                      </h4>
                      <ul className="ml-8 list-disc space-y-1 mt-2">
                        <li>Vulnerable to outside shooters</li>
                        <li>Weak coverage at the free throw line</li>
                        <li>Difficult to contest corner 3-pointers</li>
                        <li>Can be beaten by quick ball movement</li>
                      </ul>
                    </div>

                    <div className="border-2 border-black p-3 rounded-lg mt-4 bg-gray-50">
                      <p className="font-bold">BEST USED AGAINST:</p>
                      <p>
                        Teams with strong inside play but weak perimeter
                        shooting
                      </p>
                    </div>
                  </div>
                )}

                {activeZoneType === "3-2" && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#c1ff00] flex items-center justify-center text-black font-bold text-xs">
                          +
                        </div>
                        PROS:
                      </h4>
                      <ul className="ml-8 list-disc space-y-1 mt-2">
                        <li>Strong perimeter defense</li>
                        <li>Great for defending 3-point shooters</li>
                        <li>Allows quick transitions to offense</li>
                        <li>Defends against skip passes well</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#ff5757] flex items-center justify-center text-black font-bold text-xs">
                          -
                        </div>
                        CONS:
                      </h4>
                      <ul className="ml-8 list-disc space-y-1 mt-2">
                        <li>Weaker interior defense</li>
                        <li>Vulnerable to high post entry passes</li>
                        <li>Can struggle with rebounding</li>
                        <li>Susceptible to baseline drives</li>
                      </ul>
                    </div>

                    <div className="border-2 border-black p-3 rounded-lg mt-4 bg-gray-50">
                      <p className="font-bold">BEST USED AGAINST:</p>
                      <p>
                        Teams with multiple perimeter shooters but limited post
                        presence
                      </p>
                    </div>
                  </div>
                )}

                {activeZoneType === "1-3-1" && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#c1ff00] flex items-center justify-center text-black font-bold text-xs">
                          +
                        </div>
                        PROS:
                      </h4>
                      <ul className="ml-8 list-disc space-y-1 mt-2">
                        <li>Creates trapping opportunities</li>
                        <li>Great for forcing turnovers</li>
                        <li>Disrupts offensive rhythm</li>
                        <li>Good balance of inside/outside coverage</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#ff5757] flex items-center justify-center text-black font-bold text-xs">
                          -
                        </div>
                        CONS:
                      </h4>
                      <ul className="ml-8 list-disc space-y-1 mt-2">
                        <li>Requires high energy and conditioning</li>
                        <li>Vulnerable to corner shots</li>
                        <li>Can be beaten by good ball handlers</li>
                        <li>Challenging to implement effectively</li>
                      </ul>
                    </div>

                    <div className="border-2 border-black p-3 rounded-lg mt-4 bg-gray-50">
                      <p className="font-bold">BEST USED AGAINST:</p>
                      <p>
                        Teams with poor ball handling or teams that struggle
                        with pressure
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="neo-card bg-gray-100 h-full">
              <h2 className="font-bold text-xl mb-4">KEY TERMINOLOGY:</h2>
              <dl className="space-y-4">
                <div className="border-4 border-black rounded-xl p-4 bg-white hover:bg-[#f0f0f0] transition-colors">
                  <dt className="font-bold text-lg">ZONE FORMATION:</dt>
                  <dd>
                    The numerical arrangement of defenders (e.g., 2-3, 3-2,
                    1-3-1)
                  </dd>
                </div>
                <div className="border-4 border-black rounded-xl p-4 bg-white hover:bg-[#f0f0f0] transition-colors">
                  <dt className="font-bold text-lg">SKIP PASS:</dt>
                  <dd>
                    A pass that "skips" over a defender to attack zone
                    weaknesses
                  </dd>
                </div>
                <div className="border-4 border-black rounded-xl p-4 bg-white hover:bg-[#f0f0f0] transition-colors">
                  <dt className="font-bold text-lg">REBOUNDING COVERAGE:</dt>
                  <dd>
                    Area to assignment of responsibilities and positioning that players have to secure a rebound after a shot attempt
                  </dd>
                </div>
                <div className="border-4 border-black rounded-xl p-4 bg-white hover:bg-[#f0f0f0] transition-colors">
                  <dt className="font-bold text-lg">HIGH POST:</dt>
                  <dd>
                    The area near the free throw line, often a weak spot in zone
                    defenses
                  </dd>
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
                          <div
                            className="h-full bg-[#c1ff00]"
                            style={{ width: `${pro.score * 10}%` }}
                          ></div>
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
                    {
                      text: "Communication breakdowns hurt coverage",
                      score: 7,
                    },
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
                          <div
                            className="h-full bg-[#ff5757]"
                            style={{ width: `${con.score * 10}%` }}
                          ></div>
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
                Your team is facing an opponent with excellent 3-point shooters.
                What's your biggest concern with using a zone defense?
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
                  // disabled={showConcernAnswer}
                >
                  VULNERABLE TO OUTSIDE SHOOTING
                  {selectedConcern === "vulnerable" && showConcernAnswer && (
                    <div className="flex justify-center mt-2">
                      <Check
                        size={24}
                        className="text-[#3366cc]"
                        strokeWidth={3}
                      />
                    </div>
                  )}
                </button>
                <button
                  className={`neo-button-outline text-white border-white ${
                    selectedConcern === "rebound"
                      ? showConcernAnswer
                        ? "bg-[#ff5757]"
                        : "bg-[#3366cc]"
                      : ""
                  }`}
                  onClick={() => handleConcernSelect("rebound")}
                  // disabled={showConcernAnswer}
                >
                  DIFFICULT TO REBOUND
                  {selectedConcern === "rebound" && showConcernAnswer && (
                    <div className="flex justify-center mt-2">
                      <X size={24} className="text-black" strokeWidth={3} />
                    </div>
                  )}
                </button>
                <button
                  className={`neo-button-outline text-white border-white ${
                    selectedConcern === "demanding"
                      ? showConcernAnswer
                        ? "bg-[#ff5757]"
                        : "bg-[#3366cc]"
                      : ""
                  }`}
                  onClick={() => handleConcernSelect("demanding")}
                  // disabled={showConcernAnswer}
                >
                  TOO PHYSICALLY DEMANDING
                  {selectedConcern === "demanding" && showConcernAnswer && (
                    <div className="flex justify-center mt-2">
                      <X size={24} className="text-black" strokeWidth={3} />
                    </div>
                  )}
                </button>
                <button
                  className={`neo-button-outline text-white border-white ${
                    selectedConcern === "communicate"
                      ? showConcernAnswer
                        ? "bg-[#ff5757]"
                        : "bg-[#3366cc]"
                      : ""
                  }`}
                  onClick={() => handleConcernSelect("communicate")}
                  // disabled={showConcernAnswer}
                >
                  HARD TO COMMUNICATE
                  {selectedConcern === "communicate" && showConcernAnswer && (
                    <div className="flex justify-center mt-2">
                      <X size={24} className="text-black" strokeWidth={3} />
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
      ),
    },
  ];
  const slide = slides[currentSlide];

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f5f5]">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="neo-subheading">{slide.title}</h1>
          </div>

          <div className="neo-card mb-8">{slide.content}</div>

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
              {slides.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-8 h-8 rounded-full border-4 border-black ${
                    currentSlide === idx ? "bg-[#c1ff00]" : "bg-white"
                  } hover:bg-[#d8ff66] transition-colors flex items-center justify-center cursor-pointer`}
                  onClick={() => updateSlide(idx)}
                >
                  <span className="font-bold">{idx + 1}</span>
                </div>
              ))}
            </div>

            <button
              className="neo-button flex items-center gap-2 bg-[#c1ff00] hover:bg-[#d8ff66] transition-colors"
              onClick={nextSlide}
            >
              <span>
                {currentSlide === slides.length - 1 ? "NEXT DEFENSE" : "NEXT"}
              </span>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
