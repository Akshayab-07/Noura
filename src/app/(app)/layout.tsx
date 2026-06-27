'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Calendar, BookOpen, TrendingUp,
  ShoppingBasket, Bell, Settings, LogOut, Leaf, Menu, X, MessageCircle
} from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import AIAssistant from '@/components/AIAssistant'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/meal-plan', label: 'Meal Plan', icon: Calendar },
  { href: '/recipes', label: 'Recipes', icon: BookOpen },
  { href: '/progress', label: 'Progress', icon: TrendingUp },
  { href: '/grocery', label: 'Grocery List', icon: ShoppingBasket },
  { href: '/reminders', label: 'Reminders', icon: Bell },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [aiOpen, setAiOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('Logged out successfully.')
    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 fixed left-0 top-0 h-screen bg-surface-container-low border-r border-outline-variant/40 z-40">
        {/* Logo */}
        <div className="flex items-center gap-2 p-6 border-b border-outline-variant/40">
          <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center">
            <Leaf className="w-5 h-5 text-on-primary" />
          </div>
          <span className="font-headline text-xl font-bold text-primary">Noura</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'nav-item',
                  active && 'nav-item-active'
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-outline-variant/40">
          <button
            onClick={handleLogout}
            className="nav-item w-full text-error hover:bg-error-container hover:text-error"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant/40">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center">
              <Leaf className="w-4 h-4 text-on-primary" />
            </div>
            <span className="font-headline text-lg font-bold text-primary">Noura</span>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl hover:bg-surface-container-low transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="bg-surface border-t border-outline-variant/40 px-4 py-3 animate-fade-in">
            <nav className="space-y-1">
              {NAV_ITEMS.map(item => {
                const active = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn('nav-item', active && 'nav-item-active')}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              <button onClick={handleLogout} className="nav-item w-full text-error">
                <LogOut className="w-5 h-5" />
                <span>Log Out</span>
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Main content */}
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 min-h-screen">
        <div className="page-container py-6 md:py-8">
          {children}
        </div>
      </main>

      {/* AI Assistant FAB */}
      <button
        onClick={() => setAiOpen(true)}
        className="ai-fab"
        title="Ask Noura AI"
        id="ai-assistant-btn"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* AI Assistant Panel */}
      <AIAssistant open={aiOpen} onClose={() => setAiOpen(false)} />
    </div>
  )
}
