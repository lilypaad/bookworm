'use client'

import React from 'react'
import Link from "next/link"
import {BookOpen} from "lucide-react"
import {usePathname} from "next/navigation"
import {cn} from "@/lib/utils";
import { Show, SignInButton, UserButton, useUser } from '@clerk/nextjs'

const navItems = [
  { label: "Library", href: "/" },
  { label: "Add New", href: "/books/new" },
]

const Navbar = () => {
  const pathName = usePathname()
  const { user } = useUser()

  return (
    // <header className="container mx-auto">
    <header className="fixed w-full z-50 bg-background">
      <div className="container mx-auto">
        <div className="py-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex gap-0.5 items-center">
            <BookOpen width={34} height={32} className="pt-1" />
            <span className="font-serif font-bold text-2xl align-[20px]">Bookworm</span>
          </Link>

          {/* navbar items */}
          <nav className="flex gap-x-7 items-center overflow-x-auto">
            {navItems.map(({ label, href }) => {
              const isActive = pathName === href || (href !== '/' && pathName.startsWith(href))
              return (
                <Link
                  href={href}
                  key={label}
                  className={cn(
                    'text-lg font-medium',
                    isActive ?
                      'text-amber-900 border-b-2 border-amber-900 pb-0.5' :
                      'text-black hover:opacity-70'
                  )}
                >
                  {label}
                </Link>
              )
            })}
            <div className="flex gap-2 items-center">
              <Show when="signed-out">
                <div className="text-lg font-medium text-black hover:opacity-70">
                  <SignInButton />
                </div>
              </Show>
              <Show when="signed-in">
                <UserButton />
                {user?.firstName && (
                  <Link href="/subscriptions" className="text-lg font-sans font-medium text-black hover:opacity-70">
                    {user.firstName}
                  </Link>
                )}
              </Show>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
export default Navbar


