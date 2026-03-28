"use client"

import { useState } from "react"
import { Home, Building2, Bell, Settings, FileHeart, Menu, X, Activity } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const patientNavItems = [
  { id: "dashboard", icon: Home, label: "Home" },
  { id: "hospitals", icon: Building2, label: "Hospitals" },
  { id: "schemes", icon: FileHeart, label: "Schemes" },
  { id: "notifications", icon: Bell, label: "Alerts" },
  { id: "settings", icon: Settings, label: "Settings" },
]

const hospitalNavItems = [
  { id: "hospital-dashboard", icon: Home, label: "Dashboard" },
  { id: "resource-requests", icon: Building2, label: "Requests" },
  { id: "notifications", icon: Bell, label: "Alerts" },
  { id: "settings", icon: Settings, label: "Settings" },
]

export function TopNavigation() {
  const { currentScreen, setCurrentScreen, userRole, notifications, setUserRole } = useAppStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const navItems = userRole === "hospital" ? hospitalNavItems : patientNavItems
  const unreadCount = notifications.filter((n: any) => !n.read).length

  const handleNavClick = (id: string) => {
    setCurrentScreen(id as any)
    setMobileMenuOpen(false)
  }
  
  const handleLogout = () => {
    setUserRole(null)
    setCurrentScreen("home")
    setMobileMenuOpen(false)
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50 flex items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavClick(userRole === "hospital" ? "hospital-dashboard" : "dashboard")}>
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
            <Activity className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg hidden sm:block">PulseGrid</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentScreen === item.id || 
              (item.id === "hospitals" && currentScreen === "hospital-detail") ||
              (item.id === "dashboard" && currentScreen === "dashboard") ||
              (item.id === "schemes" && currentScreen === "scheme-details")
            const showBadge = item.id === "notifications" && unreadCount > 0

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <div className="relative flex items-center">
                  <Icon className="w-5 h-5" />
                  {showBadge && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emergency text-emergency-foreground text-[10px] rounded-full flex items-center justify-center font-bold">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <span>{item.label}</span>
              </button>
            )
          })}
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground ml-2">
            Logout
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-muted-foreground hover:text-foreground"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 bg-background z-40 md:hidden flex flex-col border-t border-border">
          <div className="flex flex-col p-4 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = currentScreen === item.id || 
                (item.id === "hospitals" && currentScreen === "hospital-detail") ||
                (item.id === "dashboard" && currentScreen === "dashboard") ||
                (item.id === "schemes" && currentScreen === "scheme-details")
              const showBadge = item.id === "notifications" && unreadCount > 0

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl transition-colors w-full text-left",
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent"
                  )}
                >
                  <div className="relative">
                    <Icon className="w-6 h-6" />
                    {showBadge && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-emergency text-emergency-foreground text-[10px] rounded-full flex items-center justify-center font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <span className="font-medium text-base">{item.label}</span>
                </button>
              )
            })}
            <div className="h-px bg-border my-2 mx-4" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 p-4 rounded-xl text-muted-foreground hover:bg-accent w-full text-left"
            >
              <Activity className="w-6 h-6 text-transparent" /> {/* Spacer icon */}
              <span className="font-medium text-base text-destructive">Logout</span>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
