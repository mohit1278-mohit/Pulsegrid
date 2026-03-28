"use client"

import { Home, Building2, Bell, Settings, FileHeart } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"

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

export function BottomNavigation() {
  const { currentScreen, setCurrentScreen, userRole, notifications } = useAppStore()
  
  const navItems = userRole === "hospital" ? hospitalNavItems : patientNavItems
  const unreadCount = notifications.filter((n: any) => !n.read).length

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-area-bottom z-50">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
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
              onClick={() => setCurrentScreen(item.id)}
              className={cn(
                "flex flex-col items-center justify-center w-16 h-full relative transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <div className="relative">
                <Icon className="w-6 h-6" />
                {showBadge && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-emergency text-emergency-foreground text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
