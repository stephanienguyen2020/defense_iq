"use client"

import Link from "next/link"
import { useState } from "react"
import { CheckCircle, Circle, ArrowRight, Trophy, Star, Clock } from "lucide-react"
import Navbar from "@/components/navbar"

export default function LearningPathPage() {
  const [showReward, setShowReward] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="neo-subheading font-archivo">YOUR LEARNING PATH</h1>
            <Link href="/leaderboard" className="neo-button-outline flex items-center gap-2">
              <Trophy size={20} />
              <span>LEADERBOARD</span>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="neo-card">
              <div className="flex items-center gap-2 mb-4">
                <Star size={24} className="text-primary" />
                <h2 className="font-bold text-xl">YOUR STATS</h2>
              </div>
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold">350</div>
                  <div className="text-sm font-medium">TOTAL POINTS</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">2</div>
                  <div className="text-sm font-medium">BADGES EARNED</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">25%</div>
                  <div className="text-sm font-medium">COURSE PROGRESS</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">3</div>
                  <div className="text-sm font-medium">DAY STREAK</div>
                </div>
              </div>
            </div>

            <div className="neo-card md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={24} />
                <h2 className="font-bold text-xl">DAILY CHALLENGES</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border-4 border-black rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-bold">ZONE DEFENSE QUIZ</div>
                    <div className="neo-badge">+50 PTS</div>
                  </div>
                  <p className="text-sm mb-4">Complete a 3-minute zone defense challenge</p>
                  <button className="neo-button w-full" onClick={() => setShowReward(true)}>
                    START
                  </button>
                </div>
                <div className="border-4 border-black rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-bold">DEFENSIVE ROTATION</div>
                    <div className="neo-badge">+75 PTS</div>
                  </div>
                  <p className="text-sm mb-4">Practice proper help-side defensive rotations</p>
                  <button className="neo-button-outline w-full">START</button>
                </div>
              </div>
            </div>
          </div>

          {showReward && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="neo-card max-w-md w-full bg-white">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto bg-primary border-4 border-black rounded-full flex items-center justify-center mb-6">
                    <Trophy size={48} className="text-white" />
                  </div>
                  <h2 className="neo-subheading mb-4">CHALLENGE COMPLETE!</h2>
                  <p className="mb-6">You've earned 50 points and unlocked a new badge!</p>
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <div className="neo-badge flex items-center gap-1 py-2 px-4">
                      <Star size={16} />
                      <span>ZONE EXPERT</span>
                    </div>
                  </div>
                  <button className="neo-button" onClick={() => setShowReward(false)}>
                    CONTINUE LEARNING
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="relative mb-12">
            <div className="absolute left-6 top-10 bottom-10 w-1 bg-black"></div>

            <div className="space-y-8">
              <LearningPathItem
                title="ONE-ON-ONE DEFENSE FUNDAMENTALS"
                description="Learn the basics of man-to-man defense, proper stance, and positioning"
                status="completed"
                href="/one-on-one"
                estimatedTime="5 MIN"
                points={100}
              />

              <LearningPathItem
                title="ZONE DEFENSE CONCEPTS"
                description="Understand how to protect areas of the court as a team"
                status="current"
                href="/zone"
                estimatedTime="5 MIN"
                points={150}
              />

              <LearningPathItem
                title="BOX AND 1 HYBRID DEFENSE"
                description="Master this combination defense to shut down star players"
                status="upcoming"
                href="/box-and-1"
                estimatedTime="5 MIN"
                points={200}
              />

              <LearningPathItem
                title="DEFENSIVE STRATEGIES QUIZ"
                description="Test your knowledge of basketball defensive concepts"
                status="upcoming"
                href="/quiz"
                estimatedTime="10 MIN"
                points={250}
              />

              <LearningPathItem
                title="ADVANCED DEFENSIVE TECHNIQUES"
                description="Learn advanced concepts like help rotation, hedging screens, and more"
                status="locked"
                href="#"
                estimatedTime="COMING SOON"
                points={300}
              />
            </div>
          </div>

          <div className="neo-card bg-white">
            <h2 className="neo-subheading mb-6">YOUR PROGRESS</h2>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-full max-w-md">
                <div className="h-4 w-full bg-white border-4 border-black rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: "25%" }}></div>
                </div>
              </div>
              <span className="font-bold">25% COMPLETE</span>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <p className="font-medium">NEXT UP: ZONE DEFENSE</p>
                <p className="font-bold text-lg">Learn how teams protect areas instead of players</p>
              </div>
              <Link href="/zone" className="neo-button flex items-center gap-2">
                <span>CONTINUE</span>
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function LearningPathItem({
  title,
  description,
  status,
  href,
  estimatedTime,
  points,
}: {
  title: string
  description: string
  status: "completed" | "current" | "upcoming" | "locked"
  href: string
  estimatedTime: string
  points: number
}) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
        {status === "completed" && <CheckCircle className="w-10 h-10 text-primary" />}
        {status === "current" && (
          <div className="w-10 h-10 border-4 border-primary rounded-full flex items-center justify-center">
            <div className="w-5 h-5 bg-primary rounded-full"></div>
          </div>
        )}
        {status === "upcoming" && <Circle className="w-10 h-10 text-black" />}
        {status === "locked" && <Circle className="w-10 h-10 text-gray-300" />}
      </div>

      <div className={`flex-1 neo-card ${status === "current" ? "border-primary" : ""}`}>
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg">{title}</h3>
              <div className="neo-badge flex items-center gap-1">
                <Star size={12} className="text-primary" />
                <span>{points} PTS</span>
              </div>
            </div>
            <p className="text-sm mt-1">{description}</p>
          </div>
          <div className="font-bold">{estimatedTime}</div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          {status === "locked" ? (
            <button className="neo-button-outline opacity-50 cursor-not-allowed" disabled>
              LOCKED
            </button>
          ) : (
            <Link href={href} className={status === "completed" ? "neo-button-outline" : "neo-button"}>
              {status === "completed" ? "REVIEW" : status === "current" ? "CONTINUE" : "START"}
            </Link>
          )}

          {status === "completed" && (
            <div className="neo-badge bg-primary text-white flex items-center gap-1">
              <CheckCircle size={14} />
              <span>COMPLETED</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
