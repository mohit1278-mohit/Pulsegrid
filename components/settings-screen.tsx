"use client"

import { useState } from "react"
import { 
  ChevronLeft, 
  UserCircle, 
  Bell, 
  MapPin, 
  History, 
  LogOut,
  Phone,
  Shield
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export function SettingsScreen() {
  const {
    emergencyContact,
    setEmergencyContact,
    sosConfirmationEnabled,
    setSosConfirmationEnabled,
    locationEnabled,
    setLocationEnabled,
    emergencyHistory,
    setUserRole,
    setCurrentScreen,
    userRole,
    setIsLoggedIn,
  } = useAppStore()

  const [contactForm, setContactForm] = useState({
    name: emergencyContact?.name || "",
    phone: emergencyContact?.phone || "",
    relationship: emergencyContact?.relationship || "",
  })

  const [showContactDialog, setShowContactDialog] = useState(false)

  const handleSaveContact = () => {
    setEmergencyContact(contactForm)
    setShowContactDialog(false)
  }

  const handleLogout = () => {
    setUserRole(null)
    setIsLoggedIn(false)
    setCurrentScreen("home")
  }

  const settingsItems = [
    {
      icon: UserCircle,
      title: "Emergency Contact",
      description: emergencyContact 
        ? `${emergencyContact.name} - ${emergencyContact.phone}`
        : "Add emergency contact",
      action: () => setShowContactDialog(true),
    },
    {
      icon: Shield,
      title: "SOS Confirmation",
      description: "Show confirmation before sending SOS",
      toggle: true,
      value: sosConfirmationEnabled,
      onChange: setSosConfirmationEnabled,
    },
    {
      icon: MapPin,
      title: "Location Access",
      description: "Allow app to access your location",
      toggle: true,
      value: locationEnabled,
      onChange: setLocationEnabled,
    },
  ]

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="px-4 py-4">
          <h1 className="text-xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your preferences
          </p>
        </div>
      </header>

      <main className="px-4 py-4 space-y-4 max-w-2xl mx-auto w-full">
        {/* Settings List */}
        <Card>
          <CardContent className="p-0 divide-y divide-border">
            {settingsItems.map((item, index) => {
              const Icon = item.icon
              return (
                <div
                  key={index}
                  className={cn(
                    "flex items-center justify-between p-4",
                    !item.toggle && "cursor-pointer active:bg-secondary/50"
                  )}
                  onClick={!item.toggle ? item.action : undefined}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  {item.toggle && (
                    <Switch
                      checked={item.value}
                      onCheckedChange={item.onChange}
                    />
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Emergency History (Patient only) */}
        {userRole === "patient" && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <History className="w-4 h-4" />
                Emergency History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {emergencyHistory.length > 0 ? (
                <div className="space-y-3">
                  {emergencyHistory.slice(0, 5).map((entry, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-muted-foreground">
                        {entry.timestamp.toLocaleDateString()} -{" "}
                        {entry.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className="font-medium">{entry.status}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No emergency history
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Logout Button */}
        <Button
          variant="outline"
          className="w-full h-12 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </Button>
      </main>

      {/* Emergency Contact Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent className="max-w-[340px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Emergency Contact</DialogTitle>
            <DialogDescription>
              Add a contact to be notified in case of emergency
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="contact-name">Name</Label>
              <Input
                id="contact-name"
                placeholder="John Doe"
                value={contactForm.name}
                onChange={(e) =>
                  setContactForm({ ...contactForm, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-phone">Phone Number</Label>
              <Input
                id="contact-phone"
                placeholder="(555) 123-4567"
                value={contactForm.phone}
                onChange={(e) =>
                  setContactForm({ ...contactForm, phone: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-relationship">Relationship</Label>
              <Input
                id="contact-relationship"
                placeholder="Spouse, Parent, etc."
                value={contactForm.relationship}
                onChange={(e) =>
                  setContactForm({
                    ...contactForm,
                    relationship: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveContact} className="w-full">
              Save Contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
