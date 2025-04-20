import Link from "next/link"
import { Trophy, Medal, Award } from "lucide-react"
import Navbar from "@/components/navbar"

export default function LeaderboardPage() {
  const leaderboardData = [
    { rank: 1, name: "CoachMike", points: 1250, badges: 8, level: "All-Star" },
    { rank: 2, name: "DefenseGuru", points: 1120, badges: 7, level: "Veteran" },
    { rank: 3, name: "HoopMaster", points: 980, badges: 6, level: "Veteran" },
    { rank: 4, name: "BballIQ", points: 840, badges: 5, level: "Pro" },
    { rank: 5, name: "DefensiveStop", points: 760, badges: 4, level: "Pro" },
    { rank: 6, name: "ZoneMaster", points: 650, badges: 4, level: "Amateur" },
    { rank: 7, name: "Defender101", points: 540, badges: 3, level: "Amateur" },
    { rank: 8, name: "CourtVision", points: 480, badges: 3, level: "Rookie" },
    { rank: 9, name: "BoxOut", points: 420, badges: 2, level: "Rookie" },
    { rank: 10, name: "You", points: 350, badges: 2, level: "Rookie" },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="neo-subheading">DEFENSIVE IQ LEADERBOARD</h1>
            <Link href="/learning-path" className="neo-button-outline">
              BACK TO LEARNING
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {leaderboardData.slice(0, 3).map((player, index) => (
              <div key={index} className="neo-card text-center">
                <div className="flex justify-center mb-4">
                  {index === 0 && (
                    <div className="w-20 h-20 bg-accent border-4 border-black rounded-full flex items-center justify-center">
                      <Trophy size={40} className="text-black" />
                    </div>
                  )}
                  {index === 1 && (
                    <div className="w-20 h-20 bg-secondary border-4 border-black rounded-full flex items-center justify-center">
                      <Medal size={40} className="text-white" />
                    </div>
                  )}
                  {index === 2 && (
                    <div className="w-20 h-20 bg-primary border-4 border-black rounded-full flex items-center justify-center">
                      <Award size={40} className="text-white" />
                    </div>
                  )}
                </div>
                <div className="text-2xl font-bold">{player.name}</div>
                <div className="text-sm font-bold mb-4">{player.level}</div>
                <div className="text-3xl font-bold">{player.points}</div>
                <div className="text-sm font-bold">POINTS</div>
                <div className="mt-4 neo-badge">{player.badges} BADGES</div>
              </div>
            ))}
          </div>

          <div className="neo-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted border-b-4 border-black">
                    <th className="px-6 py-4 text-left font-bold">RANK</th>
                    <th className="px-6 py-4 text-left font-bold">PLAYER</th>
                    <th className="px-6 py-4 text-left font-bold">LEVEL</th>
                    <th className="px-6 py-4 text-left font-bold">POINTS</th>
                    <th className="px-6 py-4 text-left font-bold">BADGES</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((player, index) => (
                    <tr
                      key={index}
                      className={`border-b-4 border-black ${player.name === "You" ? "bg-accent bg-opacity-20" : ""}`}
                    >
                      <td className="px-6 py-4 font-bold">{player.rank}</td>
                      <td className="px-6 py-4 font-bold">
                        {player.name}
                        {player.name === "You" && " (YOU)"}
                      </td>
                      <td className="px-6 py-4">{player.level}</td>
                      <td className="px-6 py-4 font-bold">{player.points}</td>
                      <td className="px-6 py-4">
                        <div className="neo-badge">{player.badges}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="neo-card bg-muted mt-12">
            <h2 className="font-bold text-xl mb-6">HOW TO CLIMB THE LEADERBOARD:</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary border-4 border-black rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div className="font-bold pt-1">Complete all learning modules and quizzes</div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary border-4 border-black rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div className="font-bold pt-1">Earn badges by completing challenges</div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary border-4 border-black rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div className="font-bold pt-1">Finish quizzes quickly for time bonuses</div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary border-4 border-black rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold">
                  4
                </div>
                <div className="font-bold pt-1">Complete daily challenges for bonus points</div>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
