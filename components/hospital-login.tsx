"use client"

import { useState } from "react"
import { ChevronLeft, Building2, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppStore } from "@/lib/store"

export function HospitalLogin() {
  const { 
    setCurrentScreen, 
    setUserRole, 
    setIsLoggedIn, 
    setHospitalName,
    setCurrentHospitalId,
    setHospitalData,
    hospitals,
    addHospital,
  } = useAppStore()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState("")

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  })

  const [registerForm, setRegisterForm] = useState({
    hospitalName: "",
    location: "",
    email: "",
    password: "",
    phone: "",
    capacity: "",
    bloodApos: "",
    bloodAneg: "",
    bloodBpos: "",
    bloodBneg: "",
    bloodOpos: "",
    bloodOneg: "",
    bloodABpos: "",
    bloodABneg: "",
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setLoginError("")
    
    // Simulate login delay
    await new Promise((resolve) => setTimeout(resolve, 800))
    
    const foundHospital = hospitals.find(
      (h) => h.email === loginForm.email && h.password === loginForm.password
    )

    if (foundHospital) {
      setHospitalName(foundHospital.name)
      setCurrentHospitalId(foundHospital.id)
      setHospitalData({
        icuBeds: foundHospital.icuBeds,
        ventilators: foundHospital.ventilators,
        specialists: foundHospital.specialists,
        equipment: foundHospital.equipment,
        bloodAvailability: foundHospital.bloodAvailability
      })
      setUserRole("hospital")
      setIsLoggedIn(true)
      setCurrentScreen("hospital-dashboard")
    } else {
      setLoginError("Invalid email or password")
    }
    
    setIsLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate registration delay
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    const newHospitalId = Math.random().toString(36).substring(7)
    const newHospital = {
      id: newHospitalId,
      name: registerForm.hospitalName,
      email: registerForm.email,
      password: registerForm.password,
      distance: Math.round(Math.random() * 10 * 10) / 10 + 1, // Random distance 1-11km
      icuBeds: Math.round(Number(registerForm.capacity) * 0.2), // 20% of capacity is ICU roughly
      icuBedsTotal: Math.round(Number(registerForm.capacity) * 0.3),
      ventilators: Math.round(Number(registerForm.capacity) * 0.1),
      ventilatorsTotal: Math.round(Number(registerForm.capacity) * 0.15),
      specialists: Math.round(Number(registerForm.capacity) * 0.5),
      equipment: 100,
      loadStatus: "stable" as const,
      location: { 
        lat: 22.7 + (Math.random() * 0.1 - 0.05), // near indore 
        lng: 75.8 + (Math.random() * 0.1 - 0.05) 
      },
      phone: registerForm.phone,
      address: registerForm.location,
      rating: 5.0, // newly registered
      bloodAvailability: {
        "A+": Number(registerForm.bloodApos) || 0,
        "A-": Number(registerForm.bloodAneg) || 0,
        "B+": Number(registerForm.bloodBpos) || 0,
        "B-": Number(registerForm.bloodBneg) || 0,
        "O+": Number(registerForm.bloodOpos) || 0,
        "O-": Number(registerForm.bloodOneg) || 0,
        "AB+": Number(registerForm.bloodABpos) || 0,
        "AB-": Number(registerForm.bloodABneg) || 0,
      }
    }

    addHospital(newHospital)
    setCurrentHospitalId(newHospitalId)
    setHospitalData({
      icuBeds: newHospital.icuBeds,
      ventilators: newHospital.ventilators,
      specialists: newHospital.specialists,
      equipment: newHospital.equipment,
      bloodAvailability: newHospital.bloodAvailability
    })
    
    setHospitalName(registerForm.hospitalName)
    setUserRole("hospital")
    setIsLoggedIn(true)
    setCurrentScreen("hospital-dashboard")
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="flex items-center gap-3 px-4 py-4">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => setCurrentScreen("home")}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Hospital Portal</h1>
            <p className="text-sm text-muted-foreground">Login or register your facility</p>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 max-w-md mx-auto w-full">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Building2 className="w-8 h-8 text-primary" />
          </div>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>
                  Sign in to manage your hospital resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Admin Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="admin@hospital.com"
                      value={loginForm.email}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={loginForm.password}
                        onChange={(e) =>
                          setLoginForm({ ...loginForm, password: e.target.value })
                        }
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  {loginError && (
                    <p className="text-sm font-medium text-destructive">{loginError}</p>
                  )}
                  <Button
                    type="submit"
                    className="w-full h-12"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Register Hospital</CardTitle>
                <CardDescription>
                  Create an account to join the network
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="hospital-name">Hospital Name</Label>
                    <Input
                      id="hospital-name"
                      placeholder="General Hospital"
                      value={registerForm.hospitalName}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          hospitalName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location / Address</Label>
                    <Input
                      id="location"
                      placeholder="123 Medical Center Dr"
                      value={registerForm.location}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          location: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Admin Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="admin@hospital.com"
                      value={registerForm.email}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="Create a password"
                      value={registerForm.password}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Contact Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={registerForm.phone}
                        onChange={(e) =>
                          setRegisterForm({
                            ...registerForm,
                            phone: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="capacity">Bed Capacity</Label>
                      <Input
                        id="capacity"
                        type="number"
                        placeholder="100"
                        value={registerForm.capacity}
                        onChange={(e) =>
                          setRegisterForm({
                            ...registerForm,
                            capacity: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3 pt-2 border-t mt-4">
                    <Label className="text-base font-semibold">Blood Availability (Units)</Label>
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { id: "A+", key: "bloodApos" },
                        { id: "A-", key: "bloodAneg" },
                        { id: "B+", key: "bloodBpos" },
                        { id: "B-", key: "bloodBneg" },
                        { id: "O+", key: "bloodOpos" },
                        { id: "O-", key: "bloodOneg" },
                        { id: "AB+", key: "bloodABpos" },
                        { id: "AB-", key: "bloodABneg" },
                      ].map(({ id, key }) => (
                        <div key={id} className="space-y-1.5">
                          <Label htmlFor={key} className="text-xs text-muted-foreground">{id}</Label>
                          <Input
                            id={key}
                            type="number"
                            placeholder="0"
                            min="0"
                            className="h-9"
                            value={registerForm[key as keyof typeof registerForm]}
                            onChange={(e) =>
                              setRegisterForm({
                                ...registerForm,
                                [key]: e.target.value,
                              })
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
