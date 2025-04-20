"use client"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Trophy } from "lucide-react"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  const navLinks = [
    { name: "HOME", path: "/" },
    { name: "ONE-ON-ONE", path: "/one-on-one" },
    { name: "ZONE", path: "/zone" },
    { name: "BOX AND 1", path: "/box-and-1" },
    { name: "QUIZ", path: "/quiz" },
  ]

  return (
    <header className="bg-[#002387] border-b-4 border-black sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#c1ff00] border-4 border-black rounded-full flex items-center justify-center">
              <Trophy size={16} className="text-black" />
            </div>
            <span className="font-archivo text-xl text-white">DEFENSE IQ</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`font-bold relative ${
                  isActive(link.path) ? "text-[#c1ff00]" : "text-white hover:text-[#c1ff00]"
                } transition-colors`}
              >
                {link.name}
                {isActive(link.path) && <div className="absolute -bottom-1 left-0 w-full h-1 bg-[#c1ff00]"></div>}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden bg-[#002387] border-t-4 border-black">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`font-bold py-2 px-4 rounded-lg ${
                    isActive(link.path) ? "bg-[#c1ff00] text-black" : "text-white hover:bg-[#001a66]"
                  } transition-colors`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}
