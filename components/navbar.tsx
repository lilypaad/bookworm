'use client'

import React from 'react'
import Link from "next/link"
import {BookOpen} from "lucide-react"
import {usePathname} from "next/navigation"
import {cn} from "@/lib/utils";

const navItems = [
  { label: "Library", href: "/" },
  { label: "Add New", href: "/books/new" },
]

const Navbar = () => {
  const pathName = usePathname()

  return (
    <header className="w-full fixed z-50 bg-('--bg-primary')">
      <div className="wrapper navbar-height py-4 px-4 flex justify-between items-center">
        <Link href="/" className="flex gap-0.5 items-center">
          <BookOpen width={34} height={32} className="pt-1" />
          <span className="font-serif font-bold text-2xl align-[20px]">Bookworm</span>
        </Link>

        <nav className="w-fit flex gap-6.5 items-center pr-1">
          {navItems.map(({ label, href }) => {
            const isActive = pathName === href || (href !== '/' && pathName.startsWith(href))
            return (
              <Link
                href={href}
                key={label}
                className={cn(
                  'text-xl font-normal',
                  isActive ?
                    'text-amber-900' :
                    'text-black hover:opacity-70'
                )}
              >
                {label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
export default Navbar


