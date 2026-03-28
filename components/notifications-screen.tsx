"use client"

import { Bell, AlertTriangle, Ambulance, UserCheck, Package } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"

const typeIcons = {
  request: Package,
  ambulance: Ambulance,
  arrival: UserCheck,
  alert: AlertTriangle,
}

const typeColors = {
  request: "bg-primary/10 text-primary",
  ambulance: "bg-emergency/10 text-emergency",
  arrival: "bg-success/10 text-success",
  alert: "bg-warning/10 text-warning",
}

export function NotificationsScreen() {
  const { notifications, markNotificationRead } = useAppStore()

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="px-4 py-4">
          <h1 className="text-xl font-bold text-foreground">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            {notifications.filter((n: any) => !n.read).length} unread
          </p>
        </div>
      </header>

      <main className="px-4 py-4 max-w-3xl mx-auto w-full">
        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification: any) => {
              const Icon = typeIcons[notification.type as keyof typeof typeIcons] || Bell
              const colorClass = typeColors[notification.type as keyof typeof typeColors] || "bg-secondary text-secondary-foreground"

              return (
                <Card
                  key={notification.id}
                  className={cn(
                    "cursor-pointer transition-colors",
                    !notification.read && "border-primary/30 bg-primary/5"
                  )}
                  onClick={() => markNotificationRead(notification.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                          colorClass
                        )}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-medium text-foreground">
                            {notification.title}
                          </h3>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatTime(notification.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                    {!notification.read && (
                      <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary" />
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No notifications yet</p>
          </div>
        )}
      </main>
    </div>
  )
}
