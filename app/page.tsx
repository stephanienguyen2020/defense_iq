import type React from "react"
import Link from "next/link"
import { Star, ShieldCheck, Users, Target, ArrowRight } from "lucide-react"
import Navbar from "@/components/navbar"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section with Defense Strategies */}
        <section className="bg-[#002387] min-h-screen py-8 relative overflow-hidden neo-grid">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
                <div>
                  <h1 className="neo-heading font-archivo text-white mb-6">
                    <span className="text-[#c1ff00]">DEFENSE</span>
                    <br />
                    IQ
                  </h1>
                  <p className="text-white text-xl mb-8">
                    Master the art of basketball defense with our interactive learning platform. Level up your game!
                  </p>

                  <div className="flex gap-4 mb-8">
                    <Link href="/learning-path" className="inline-block neo-button text-black">
                      START LEARNING NOW
                    </Link>
                    <Link href="/quiz" className="inline-block neo-button-outline text-black">
                      TAKE THE QUIZ
                    </Link>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#c1ff00] border-4 border-black rounded-full flex items-center justify-center">
                    <div className="w-20 h-20 border-4 border-black rounded-full"></div>
                  </div>

                  <div className="glass-card p-6 relative z-10">
                    <h2 className="font-archivo text-2xl font-bold mb-4 text-white">LEARNING STATS</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 border-4 border-black rounded-lg bg-[#c1ff00]">
                        <div className="text-3xl font-bold text-black">5.2K</div>
                        <div className="text-sm font-bold text-black">LEARNERS</div>
                      </div>
                      <div className="p-3 border-4 border-black rounded-lg bg-white">
                        <div className="text-3xl font-bold text-black">87%</div>
                        <div className="text-sm font-bold text-black">AVG SCORE</div>
                      </div>
                      <div className="p-3 border-4 border-black rounded-lg bg-white">
                        <div className="text-3xl font-bold text-black">92%</div>
                        <div className="text-sm font-bold text-black">COMPLETION</div>
                      </div>
                      <div className="p-3 border-4 border-black rounded-lg bg-[#c1ff00]">
                        <div className="text-3xl font-bold text-black">15m</div>
                        <div className="text-sm font-bold text-black">AVG TIME</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Defense Strategies Cards */}
              <div className="grid md:grid-cols-3 gap-6 relative z-10">
                <DefenseCard
                  title="ONE-ON-ONE DEFENSE"
                  description="Guard individual players effectively with proper stance and positioning"
                  href="/one-on-one"
                  badge="FUNDAMENTALS"
                  points={100}
                  icon={<ShieldCheck size={32} className="text-white" />}
                />

                <DefenseCard
                  title="ZONE DEFENSE"
                  description="Protect areas of the court as a team with strategic positioning"
                  href="/zone"
                  badge="TEAM STRATEGY"
                  points={150}
                  icon={<Users size={32} className="text-white" />}
                />

                <DefenseCard
                  title="BOX AND 1"
                  description="Shut down star players while maintaining overall court coverage"
                  href="/box-and-1"
                  badge="ADVANCED"
                  points={200}
                  icon={<Target size={32} className="text-white" />}
                />
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#c1ff00] border-4 border-black rounded-full"></div>
          <div className="absolute top-24 right-24 w-32 h-32 bg-[#c1ff00] border-4 border-black rounded-full"></div>

          {/* Decorative arrows */}
          <svg
            className="absolute top-1/4 left-16 w-32 h-32 text-[#c1ff00]"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 12H19M19 12L12 5M19 12L12 19"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <svg
            className="absolute bottom-1/4 right-16 w-32 h-32 text-[#c1ff00]"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 12H5M5 12L12 5M5 12L12 19"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </section>
      </main>
    </div>
  )
}

// Update the DefenseCard component to improve text contrast
function DefenseCard({
  title,
  description,
  href,
  badge,
  points,
  icon,
}: {
  title: string
  description: string
  href: string
  badge: string
  points: number
  icon: React.ReactNode
}) {
  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-xl text-white">{title}</h3>
          <div className="neo-badge">{badge}</div>
        </div>
        <p className="text-white mb-6">{description}</p>
      </div>

      <div className="mt-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-1">
            <Star size={16} className="text-[#c1ff00]" />
            <span className="font-bold text-[#c1ff00]">{points} PTS</span>
          </div>
          <div className="flex items-center gap-2 bg-[#002387] p-2 rounded-full border-2 border-[#c1ff00]">{icon}</div>
        </div>

        <Link
          href={href}
          className="flex items-center justify-center gap-2 w-full bg-[#c1ff00] border-4 border-black rounded-lg py-2 font-bold text-black hover:bg-opacity-90 transition-colors"
        >
          LEARN MORE
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
