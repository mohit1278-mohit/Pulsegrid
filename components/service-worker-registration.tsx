"use client"

import { useEffect, useState } from "react"
import { Download, X, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function ServiceWorkerRegistration() {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
      return
    }

    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/pulsegrid/sw.js")
        .then((registration) => {
          console.log("[v0] Service Worker registered:", registration.scope)

          // Check for updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  setShowUpdatePrompt(true)
                }
              })
            }
          })
        })
        .catch((error) => {
          console.error("[v0] Service Worker registration failed:", error)
        })
    }

    // Handle install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      
      // Show install prompt after a delay (not immediately on page load)
      setTimeout(() => {
        setShowInstallPrompt(true)
      }, 3000)
    }

    // Handle app installed
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setIsInstalled(true)
    }

    setShowInstallPrompt(false)
    setDeferredPrompt(null)
  }

  const handleUpdate = () => {
    window.location.reload()
  }

  if (isInstalled && !showUpdatePrompt) return null

  return (
    <>
      {/* Install Prompt Banner */}
      {showInstallPrompt && !isInstalled && (
        <div
          className={cn(
            "fixed bottom-20 left-4 right-4 z-40",
            "bg-card border border-border rounded-xl shadow-lg",
            "p-4 animate-in slide-in-from-bottom-4 duration-300"
          )}
        >
          <button
            onClick={() => setShowInstallPrompt(false)}
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Download className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-sm">Install PulseGrid</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Add to your home screen for quick access to emergency services
              </p>
              <div className="flex gap-2 mt-3">
                <Button
                  onClick={handleInstall}
                  size="sm"
                  className="h-8 text-xs"
                >
                  Install App
                </Button>
                <Button
                  onClick={() => setShowInstallPrompt(false)}
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs"
                >
                  Not Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Prompt Banner */}
      {showUpdatePrompt && (
        <div
          className={cn(
            "fixed top-4 left-4 right-4 z-50",
            "bg-primary text-primary-foreground rounded-xl shadow-lg",
            "p-4 animate-in slide-in-from-top-4 duration-300"
          )}
        >
          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Update Available</p>
              <p className="text-xs opacity-90">A new version of PulseGrid is ready</p>
            </div>
            <Button
              onClick={handleUpdate}
              variant="secondary"
              size="sm"
              className="h-8 text-xs shrink-0"
            >
              Refresh
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
