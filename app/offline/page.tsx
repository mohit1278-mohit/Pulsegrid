"use client"

import { WifiOff, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
        <WifiOff className="w-10 h-10 text-muted-foreground" />
      </div>
      
      <h1 className="text-2xl font-bold text-foreground mb-2">
        You're Offline
      </h1>
      
      <p className="text-muted-foreground max-w-sm mb-8">
        PulseGrid requires an internet connection to show real-time hospital availability and emergency services.
      </p>

      <div className="space-y-4 w-full max-w-xs">
        <Button
          onClick={() => window.location.reload()}
          className="w-full h-12 gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
        
        <div className="p-4 bg-destructive/10 rounded-lg">
          <p className="text-sm font-medium text-destructive mb-1">
            Emergency?
          </p>
          <p className="text-xs text-muted-foreground mb-3">
            If this is a medical emergency, call emergency services directly.
          </p>
          <a
            href="tel:911"
            className="inline-flex items-center justify-center w-full h-10 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium"
          >
            Call 911
          </a>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-8">
        PulseGrid will automatically reconnect when online
      </p>
    </div>
  )
}
