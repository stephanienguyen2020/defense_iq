"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Play, Info, Check, X } from "lucide-react";
import Navbar from "@/components/navbar";

// FlipCard, PairedPlayer, InteractiveCourt remain unchanged...
// (Include their implementations here as before)
function FlipCard({ text, type }: { text: string; type: "pro" | "con" }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="h-32 cursor-pointer perspective-500"
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 preserve-3d ${
          flipped ? "rotate-y-180" : ""
        }`}
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
              {type === "pro" ? (
                <Check size={32} className="text-black" />
              ) : (
                <X size={32} className="text-black" />
              )}
            </div>
            <div className="text-xl font-bold text-black">
              {type === "pro" ? "ADVANTAGE" : "DISADVANTAGE"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Renamed and modified DraggablePlayer to handle paired attacker/defender
function PairedPlayer({
  initialAttackerPosition,
  courtSize,
}: {
  initialAttackerPosition: { x: number; y: number };
  courtSize: { width: number; height: number };
}) {
  const attackerRef = useRef<HTMLDivElement>(null);
  const [attackerPosition, setAttackerPosition] = useState(
    initialAttackerPosition
  );
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const circleSize = 24; // Define circle size for calculations

  // Calculate defender position: Offset from the attacker
  const calculateDefenderPosition = () => {
    if (courtSize.width <= 0 || courtSize.height <= 0) {
      return { x: 0, y: 0 }; // Return zero if court size is invalid
    }
    const offsetX = 0; // Horizontal offset
    const offsetY = 20; // Vertical offset

    let defenderX = attackerPosition.x + offsetX;
    let defenderY = attackerPosition.y + offsetY;

    // Constrain defender to court boundaries
    defenderX = Math.max(0, Math.min(defenderX, courtSize.width - circleSize));
    defenderY = Math.max(0, Math.min(defenderY, courtSize.height - circleSize));

    // Prevent defender from going over the attacker if attacker is near the bottom-right edge
    if (attackerPosition.x > courtSize.width - circleSize - offsetX) {
      defenderX = attackerPosition.x - offsetX - circleSize / 2; // Place to the left instead
    }
    if (attackerPosition.y > courtSize.height - circleSize - offsetY) {
      defenderY = attackerPosition.y - offsetY - circleSize / 2; // Place above instead
    }

    // Ensure defender position is still within bounds after adjustments
    defenderX = Math.max(0, Math.min(defenderX, courtSize.width - circleSize));
    defenderY = Math.max(0, Math.min(defenderY, courtSize.height - circleSize));

    return { x: defenderX, y: defenderY };
  };

  const defenderPosition = calculateDefenderPosition();

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (attackerRef.current) {
      const rect = attackerRef.current.getBoundingClientRect();
      const parentRect =
        attackerRef.current.offsetParent?.getBoundingClientRect(); // Use offsetParent
      const offsetX = parentRect ? parentRect.left : 0;
      const offsetY = parentRect ? parentRect.top : 0;

      setDragOffset({
        // Calculate offset relative to the parent container's origin
        x: e.clientX - offsetX - attackerPosition.x,
        y: e.clientY - offsetY - attackerPosition.y,
      });
      setIsDragging(true);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (attackerRef.current && e.touches[0]) {
      const rect = attackerRef.current.getBoundingClientRect();
      const parentRect =
        attackerRef.current.offsetParent?.getBoundingClientRect(); // Use offsetParent
      const offsetX = parentRect ? parentRect.left : 0;
      const offsetY = parentRect ? parentRect.top : 0;

      setDragOffset({
        // Calculate offset relative to the parent container's origin
        x: e.touches[0].clientX - offsetX - attackerPosition.x,
        y: e.touches[0].clientY - offsetY - attackerPosition.y,
      });
      setIsDragging(true);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (
        isDragging &&
        courtSize.width > 0 &&
        courtSize.height > 0 &&
        attackerRef.current
      ) {
        const parentRect =
          attackerRef.current.offsetParent?.getBoundingClientRect();
        if (!parentRect) return; // Exit if parent isn't available

        // Calculate position relative to the court container's origin
        const newX = e.clientX - parentRect.left - dragOffset.x;
        const newY = e.clientY - parentRect.top - dragOffset.y;

        // Constrain to parent boundaries (courtSize)
        const constrainedX = Math.max(
          0,
          Math.min(newX, courtSize.width - circleSize)
        );
        const constrainedY = Math.max(
          0,
          Math.min(newY, courtSize.height - circleSize)
        );

        setAttackerPosition({ x: constrainedX, y: constrainedY });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (
        isDragging &&
        e.touches[0] &&
        courtSize.width > 0 &&
        courtSize.height > 0 &&
        attackerRef.current
      ) {
        e.preventDefault(); // Prevent scrolling while dragging
        const parentRect =
          attackerRef.current.offsetParent?.getBoundingClientRect();
        if (!parentRect) return;

        // Calculate position relative to the court container
        const newX = e.touches[0].clientX - parentRect.left - dragOffset.x;
        const newY = e.touches[0].clientY - parentRect.top - dragOffset.y;

        // Constrain to parent boundaries (courtSize)
        const constrainedX = Math.max(
          0,
          Math.min(newX, courtSize.width - circleSize)
        );
        const constrainedY = Math.max(
          0,
          Math.min(newY, courtSize.height - circleSize)
        );

        setAttackerPosition({ x: constrainedX, y: constrainedY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      // Attach listeners to window to capture movement outside the element
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
  }, [isDragging, dragOffset, courtSize]); // Removed attackerPosition from dependency array to avoid potential loops

  // Ensure positions are valid numbers before rendering
  const isValidPosition = (pos: { x: number; y: number }) =>
    !isNaN(pos.x) && !isNaN(pos.y) && isFinite(pos.x) && isFinite(pos.y);

  return (
    <>
      {/* Attacker (Red) - Draggable */}
      {isValidPosition(attackerPosition) && (
        <div
          ref={attackerRef}
          className={`absolute w-6 h-6 bg-red-500 border-2 border-black rounded-full cursor-move shadow-md flex items-center justify-center`}
          style={{
            left: `${attackerPosition.x}px`,
            top: `${attackerPosition.y}px`,
            width: `${circleSize}px`,
            height: `${circleSize}px`,
            touchAction: "none",
            zIndex: isDragging ? 10 : 1,
            transition: isDragging ? "none" : "box-shadow 0.2s",
            boxShadow: isDragging ? "0 0 0 4px rgba(255, 87, 87, 0.5)" : "", // Red glow
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <span className="font-bold text-xs text-white">A</span>
        </div>
      )}

      {/* Defender (Green) - Follower, Not Draggable */}
      {isValidPosition(defenderPosition) &&
        courtSize.width > 0 &&
        courtSize.height > 0 && (
          <div
            className={`absolute w-6 h-6 bg-green-500 border-2 border-black rounded-full shadow-md flex items-center justify-center pointer-events-none`} // Added pointer-events-none
            style={{
              left: `${defenderPosition.x}px`,
              top: `${defenderPosition.y}px`,
              width: `${circleSize}px`,
              height: `${circleSize}px`,
              zIndex: 0, // Ensure defender is behind attacker if they overlap
              transition: "left 0.05s linear, top 0.05s linear", // Faster, linear transition for tighter following
            }}
          >
            <span className="font-bold text-xs text-white">D</span>
          </div>
        )}
    </>
  );
}

// Update the InteractiveCourt component
function InteractiveCourt() {
  const courtRef = useRef<HTMLDivElement>(null);
  const [courtSize, setCourtSize] = useState({ width: 0, height: 0 });

  // Initial positions for the 5 pairs (relative to top-left of the court)
  // Ensure these are within the expected bounds initially
  const initialPositions = [
    { x: 150, y: 80 },
    { x: 20, y: 150 },
    { x: 300, y: 150 },
    { x: 100, y: 250 },
    { x: 220, y: 250 },
  ];

  useEffect(() => {
    const updateSize = () => {
      if (courtRef.current) {
        const width = courtRef.current.offsetWidth;
        const height = courtRef.current.offsetHeight;
        // Ensure initial positions are valid after size calculation
        if (width > 0 && height > 0) {
          setCourtSize({ width, height });
          // Optionally, adjust initial positions if they fall outside new bounds
          // For simplicity, we assume initial positions are reasonable for most sizes
        }
      }
    };

    // Initial size calculation
    updateSize();

    // Update size on window resize
    window.addEventListener("resize", updateSize);

    // Check size periodically in case initial render dimensions are zero
    const intervalId = setInterval(() => {
      if (
        courtRef.current &&
        (courtSize.width === 0 || courtSize.height === 0)
      ) {
        updateSize();
      } else {
        clearInterval(intervalId); // Clear interval once size is determined
      }
    }, 100);

    return () => {
      window.removeEventListener("resize", updateSize);
      clearInterval(intervalId);
    };
    // Re-run effect if courtSize changes from 0
  }, [courtSize.width, courtSize.height]);

  return (
    // Create a flex container to hold both the court and the instruction div
    <div className="flex flex-row items-start gap-4">
      {/* The court container */}
      <div
        ref={courtRef}
        className="relative h-80 neo-card bg-orange-200 overflow-hidden"
        style={{
          backgroundImage: 'url("/court.jpg")',
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          width: "370px",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center w-full h-full relative">
            {/* Players */}
            {courtSize.width > 0 &&
              courtSize.height > 0 &&
              initialPositions.map((pos, index) => (
                <PairedPlayer
                  key={index}
                  initialAttackerPosition={pos}
                  courtSize={courtSize}
                />
              ))}
          </div>
        </div>
      </div>

      {/* Instruction div - now outside and to the right of the court */}
      <div className="neo-card bg-white p-3 border-4 border-black font-bold text-black text-center max-w-[300px]">
        DRAG ATTACKERS (RED) - DEFENDERS (GREEN) WILL FOLLOW
      </div>
    </div>
  );
}
// Slide definitions for One-on-One pages

export default function ManToManPage() {
  const router = useRouter();
  const LESSON_ID = 1; // maps to One-on-One defense
  const [currentSlide, setCurrentSlide] = useState<number | null>(null);
  const [quickChallengeAnswer, setQuickChallengeAnswer] = useState<
    string | null
  >(null);

  const slidesDefinition = [
    {
      title: "MAN-TO-MAN DEFENSE BASICS",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <p className="text-lg">
              Man-to-Man Defense has each defender assigned to a designated
              offensive player rather than an area on the court.
            </p>
            <p className="font-bold text-xl">
              Key Principle: Each defender is responsible for an opponent, no
              matter where they move.
            </p>

            {/* Updated Interactive Court */}
            <InteractiveCourt />

            {/* <div className="flex justify-center">
              <button className="neo-button flex items-center gap-2 bg-[#c1ff00] hover:bg-[#d8ff66] transition-colors">
                <Play size={20} />
                <span>WATCH EXAMPLE</span>
              </button>
            </div> */}
          </div>

          <div className="md:col-span-1">
            <div className="neo-card bg-gray-100 h-full">
              <h2 className="font-bold text-xl mb-4">KEY TERMINOLOGY:</h2>
              <dl className="space-y-4">
                <div className="border-4 border-black rounded-xl p-4 bg-white hover:bg-[#f0f0f0] transition-colors">
                  <dt className="font-bold text-lg">HELP-SIDE DEFENSE:</dt>
                  <dd>
                    Positioning yourself to help teammates while still guarding
                    your player
                  </dd>
                </div>
                <div className="border-4 border-black rounded-xl p-4 bg-white hover:bg-[#f0f0f0] transition-colors">
                  <dt className="font-bold text-lg">CLOSEOUT:</dt>
                  <dd>
                    Quickly moving from help position to guard your player when
                    they receive the ball
                  </dd>
                </div>
                <div className="border-4 border-black rounded-xl p-4 bg-white hover:bg-[#f0f0f0] transition-colors">
                  <dt className="font-bold text-lg">DENIAL:</dt>
                  <dd>
                    Positioning to prevent your player from receiving a pass
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "DEFENSIVE STANCE & POSITIONING",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <p className="text-lg">
              Proper defensive stance is the foundation of good man-to-man
              defense:
            </p>

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
                <span className="font-bold">
                  Feet wider than shoulder width
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#c1ff00] border-4 border-black rounded-full flex items-center justify-center text-black font-bold">
                  3
                </div>
                <span className="font-bold">
                  Arms out to disrupt passing lanes
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#c1ff00] border-4 border-black rounded-full flex items-center justify-center text-black font-bold">
                  4
                </div>
                <span className="font-bold">
                  Stay between your man and the basket
                </span>
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
                <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center">
                  !
                </span>
                COACH'S TIP:
              </p>
              <p className="mt-2">
                The lower your stance, the quicker you can react to offensive
                moves. Stay on the balls of your feet!
              </p>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="neo-card bg-gray-100 h-full">
              <h2 className="font-bold text-xl mb-4">KEY TERMINOLOGY:</h2>
              <dl className="space-y-4">
                <div className="border-4 border-black rounded-xl p-4 bg-white hover:bg-[#f0f0f0] transition-colors">
                  <dt className="font-bold text-lg">BALL PRESSURE:</dt>
                  <dd>
                    Applying defensive pressure on the ball handler to limit
                    their options
                  </dd>
                </div>
                <div className="border-4 border-black rounded-xl p-4 bg-white hover:bg-[#f0f0f0] transition-colors">
                  <dt className="font-bold text-lg">DEFENSIVE SLIDE:</dt>
                  <dd>
                    Moving laterally without crossing your feet to maintain
                    defensive position
                  </dd>
                </div>
                <div className="border-4 border-black rounded-xl p-4 bg-white hover:bg-[#f0f0f0] transition-colors">
                  <dt className="font-bold text-lg">RECOVERY:</dt>
                  <dd>
                    Quickly getting back into defensive position after being
                    beaten
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
                Which defensive strategy would you choose if your team has
                excellent individual defenders but limited stamina?
              </p>
              <div className="grid grid-cols-3 gap-4">
                <button
                  className={`neo-button-outline ${
                    quickChallengeAnswer === "man"
                      ? "bg-red-500 text-white border-white"
                      : ""
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
                    quickChallengeAnswer === "zone"
                      ? "bg-green-500 text-white border-white"
                      : ""
                  }`}
                  onClick={() => setQuickChallengeAnswer("zone")}
                >
                  ZONE
                  {quickChallengeAnswer === "zone" && (
                    <div className="flex justify-center mt-2">
                      <Check size={24} className="text-white" strokeWidth={3} />
                    </div>
                  )}
                </button>
                <button
                  className={`neo-button-outline ${
                    quickChallengeAnswer === "box"
                      ? "bg-red-500 text-white border-white"
                      : ""
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
                  <dd>
                    Defenders exchanging assignments when offensive players
                    cross or set screens
                  </dd>
                </div>
                <div className="border-4 border-black rounded-xl p-4 bg-white hover:bg-[#f0f0f0] transition-colors">
                  <dt className="font-bold text-lg">HEDGING:</dt>
                  <dd>
                    Temporarily helping a teammate defend against a screen
                    before returning to your assignment
                  </dd>
                </div>
                <div className="border-4 border-black rounded-xl p-4 bg-white hover:bg-[#f0f0f0] transition-colors">
                  <dt className="font-bold text-lg">OVERPLAY:</dt>
                  <dd>
                    Positioning yourself on one side of an offensive player to
                    deny them the ball
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      ),
    },
  ];
  // Fetch the persisted slide index from the backend on mount
  useEffect(() => {
    fetch(`http://127.0.0.1:5000/learn/${LESSON_ID}`)
      .then((res) => res.json())
      .then((data) => {
        // expects backend to return { lesson_id, content, current_slide }
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
        if (newSlide >= slidesDefinition.length) {
          // last slide: backend returns next lesson path
          router.push(data.next);
        } else {
          setCurrentSlide(newSlide);
        }
      })
      .catch((err) => console.error("Failed to update lesson state:", err));
  };

  const nextSlide = () => {
    if (currentSlide === slidesDefinition.length - 1) {
      // last slide → go to your zone defense page
      router.push("/zone");
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

  const slide = slidesDefinition[currentSlide];

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f5f5]">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="neo-subheading mb-8">{slide.title}</h1>
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
              {slidesDefinition.map((_, idx) => (
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
                {currentSlide === slidesDefinition.length - 1
                  ? "NEXT DEFENSE"
                  : "NEXT"}
              </span>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
