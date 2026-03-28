"use client"

import { useState } from "react"
import { 
  Plus, 
  Package, 
  Clock, 
  CheckCircle2, 
  XCircle,
  AlertTriangle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"

const statusConfig = {
  pending: { label: "Pending", icon: Clock, className: "bg-warning/10 text-warning" },
  approved: { label: "Approved", icon: CheckCircle2, className: "bg-success/10 text-success" },
  declined: { label: "Declined", icon: XCircle, className: "bg-emergency/10 text-emergency" },
}

const severityConfig = {
  low: { label: "Low", className: "bg-muted text-muted-foreground" },
  medium: { label: "Medium", className: "bg-warning/10 text-warning" },
  high: { label: "High", className: "bg-emergency/10 text-emergency" },
}

export function ResourceRequests() {
  const { 
    resourceRequests, 
    addResourceRequest, 
    updateRequestStatus,
    hospitals,
    hospitalName,
    addNotification
  } = useAppStore()
  
  const [showNewRequestDialog, setShowNewRequestDialog] = useState(false)
  const [newRequest, setNewRequest] = useState({
    toHospital: "",
    resourceType: "",
    quantity: "",
    severity: "medium" as "low" | "medium" | "high",
  })

  const handleCreateRequest = () => {
    addResourceRequest({
      fromHospital: hospitalName || "Your Hospital",
      toHospital: newRequest.toHospital,
      resourceType: newRequest.resourceType,
      quantity: parseInt(newRequest.quantity) || 1,
      severity: newRequest.severity,
    })
    
    addNotification({
      type: "request",
      title: "Request Sent",
      message: `Resource request sent to ${newRequest.toHospital}`,
      read: false,
    })

    setShowNewRequestDialog(false)
    setNewRequest({
      toHospital: "",
      resourceType: "",
      quantity: "",
      severity: "medium",
    })
  }

  const handleUpdateStatus = (id: string, status: "approved" | "declined") => {
    updateRequestStatus(id, status)
    addNotification({
      type: "request",
      title: `Request ${status === "approved" ? "Approved" : "Declined"}`,
      message: `You have ${status} a resource request`,
      read: false,
    })
  }

  // Mock incoming requests for demo
  const incomingRequests = [
    {
      id: "incoming-1",
      fromHospital: "City Medical Center",
      resourceType: "Ventilators",
      quantity: 2,
      severity: "high" as const,
      status: "pending" as const,
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
    },
    {
      id: "incoming-2",
      fromHospital: "Regional Emergency",
      resourceType: "ICU Beds",
      quantity: 3,
      severity: "medium" as const,
      status: "pending" as const,
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
    },
  ]

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Resource Requests</h1>
            <p className="text-sm text-muted-foreground">
              Manage incoming and outgoing requests
            </p>
          </div>
          <Button 
            size="icon" 
            onClick={() => setShowNewRequestDialog(true)}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="px-4 py-4 space-y-6 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Incoming Requests */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
            Incoming Requests
          </h2>
          <div className="space-y-3">
            {incomingRequests.map((request) => {
              const status = statusConfig[request.status]
              const severity = severityConfig[request.severity]
              const StatusIcon = status.icon

              return (
                <Card key={request.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {request.fromHospital}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Requesting {request.quantity} {request.resourceType}
                        </p>
                      </div>
                      <Badge className={cn("shrink-0", severity.className)}>
                        {severity.label}
                      </Badge>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 h-10 bg-success hover:bg-success/90 text-success-foreground"
                        onClick={() => handleUpdateStatus(request.id, "approved")}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button 
                        variant="outline"
                        className="flex-1 h-10"
                        onClick={() => handleUpdateStatus(request.id, "declined")}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Decline
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
            
            {incomingRequests.length === 0 && (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No incoming requests</p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Outgoing Requests */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
            Your Requests
          </h2>
          <div className="space-y-3">
            {resourceRequests.map((request) => {
              const status = statusConfig[request.status]
              const severity = severityConfig[request.severity]
              const StatusIcon = status.icon

              return (
                <Card key={request.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {request.toHospital}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {request.quantity} {request.resourceType}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={cn(status.className)}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {status.label}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
            
            {resourceRequests.length === 0 && (
              <Card>
                <CardContent className="p-6 text-center">
                  <Package className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No outgoing requests</p>
                  <Button 
                    variant="link" 
                    className="mt-2"
                    onClick={() => setShowNewRequestDialog(true)}
                  >
                    Create your first request
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
        </div>
      </main>

      {/* New Request Dialog */}
      <Dialog open={showNewRequestDialog} onOpenChange={setShowNewRequestDialog}>
        <DialogContent className="max-w-[340px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>New Resource Request</DialogTitle>
            <DialogDescription>
              Request resources from another hospital
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Request From</Label>
              <Select
                value={newRequest.toHospital}
                onValueChange={(value) =>
                  setNewRequest({ ...newRequest, toHospital: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select hospital" />
                </SelectTrigger>
                <SelectContent>
                  {hospitals.map((hospital) => (
                    <SelectItem key={hospital.id} value={hospital.name}>
                      {hospital.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Resource Type</Label>
              <Select
                value={newRequest.resourceType}
                onValueChange={(value) =>
                  setNewRequest({ ...newRequest, resourceType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select resource" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ICU Beds">ICU Beds</SelectItem>
                  <SelectItem value="Ventilators">Ventilators</SelectItem>
                  <SelectItem value="Specialist Doctors">Specialist Doctors</SelectItem>
                  <SelectItem value="Medical Equipment">Medical Equipment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Quantity Needed</Label>
              <Input
                type="number"
                placeholder="Enter quantity"
                value={newRequest.quantity}
                onChange={(e) =>
                  setNewRequest({ ...newRequest, quantity: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Patient Severity</Label>
              <Select
                value={newRequest.severity}
                onValueChange={(value: "low" | "medium" | "high") =>
                  setNewRequest({ ...newRequest, severity: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - Non-urgent</SelectItem>
                  <SelectItem value="medium">Medium - Urgent</SelectItem>
                  <SelectItem value="high">High - Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button 
              onClick={handleCreateRequest} 
              className="w-full"
              disabled={!newRequest.toHospital || !newRequest.resourceType || !newRequest.quantity}
            >
              Send Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
