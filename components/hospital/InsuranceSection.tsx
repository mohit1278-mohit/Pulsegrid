"use client"

import { useAppStore } from "@/lib/store"
import { ShieldAlert, FileText, CheckCircle2, Building, HeartPulse } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface Props {
  hospitalId: string
}

export function InsuranceSection({ hospitalId }: Props) {
  const { insuranceProviders, addInsuranceClaim, selectedHospital } = useAppStore()
  const providers = insuranceProviders.filter(p => p.hospital_id === hospitalId)
  
  const [isFiling, setIsFiling] = useState(false)
  const [formState, setFormState] = useState({
    provider_id: "",
    policy_number: "",
    member_name: "",
    diagnosis: "",
    claimed_amount: ""
  })

  if (providers.length === 0) return null

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()
  }

  const handleFileClaim = (e: React.FormEvent) => {
    e.preventDefault()
    
    addInsuranceClaim({
      id: "claim_" + Date.now(),
      patient_id: "patient_1", // Mocked
      hospital_id: hospitalId,
      provider_id: formState.provider_id,
      insurance_provider: providers.find(p => p.id === formState.provider_id)?.provider_name || "",
      policy_number: formState.policy_number,
      member_name: formState.member_name,
      member_dob: new Date("1980-01-01"), // Mocked
      diagnosis: formState.diagnosis,
      treatment_description: "General Treatment",
      admission_date: new Date(),
      discharge_date: new Date(Date.now() + 86400000 * 3), // +3 days
      claimed_amount: parseFloat(formState.claimed_amount),
      status: "submitted",
      documents: [],
      submitted_at: new Date(),
      updated_at: new Date()
    })

    setIsFiling(false)
    alert("Claim filed successfully and sent to hospital administration.")
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-rose-500" />
          <h2 className="text-lg font-bold">Health Insurance</h2>
        </div>
        
        <Dialog open={isFiling} onOpenChange={setIsFiling}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-rose-500 hover:bg-rose-600 text-white">
              <FileText className="w-4 h-4 mr-2" />
              File Claim
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>File Insurance Claim</DialogTitle>
              <DialogDescription>
                Submit initial details for a cashless claim or reimbursement at {selectedHospital?.name}.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleFileClaim} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="provider">Insurance Provider</Label>
                <Select required value={formState.provider_id} onValueChange={(val) => setFormState(prev => ({...prev, provider_id: val}))}>
                  <SelectTrigger id="provider">
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {providers.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.provider_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="policyNumber">Policy ID / TPA Number</Label>
                <Input required id="policyNumber" value={formState.policy_number} onChange={e => setFormState(prev => ({...prev, policy_number: e.target.value}))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="memberName">Patient Name (as per policy)</Label>
                <Input required id="memberName" value={formState.member_name} onChange={e => setFormState(prev => ({...prev, member_name: e.target.value}))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="diagnosis">Primary Diagnosis</Label>
                <Input required id="diagnosis" placeholder="e.g. Viral Fever, Appendicitis" value={formState.diagnosis} onChange={e => setFormState(prev => ({...prev, diagnosis: e.target.value}))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedCost">Estimated Cost (₹)</Label>
                <Input required id="estimatedCost" type="number" min="0" value={formState.claimed_amount} onChange={e => setFormState(prev => ({...prev, claimed_amount: e.target.value}))} />
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full bg-rose-500 hover:bg-rose-600 text-white mt-4">Submit Claim Request</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {providers.map((p) => (
          <div key={p.id} className="border rounded-xl p-3 bg-card flex flex-col items-center text-center group hover:border-rose-200 dark:hover:border-rose-800 transition-colors">
            <div className={`w-12 h-12 rounded-full mb-2 flex items-center justify-center text-sm font-bold shadow-inner ${
              p.provider_type === 'cashless' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
              p.provider_type === 'both' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
              'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
            }`}>
              {getInitials(p.provider_short_name)}
            </div>
            
            <h3 className="font-bold text-sm leading-tight mb-1 line-clamp-2 min-h-[40px]">
              {p.provider_short_name}
            </h3>
            
            <div className="flex flex-wrap justify-center gap-1 mt-auto">
              {p.provider_type === 'cashless' || p.provider_type === 'both' ? (
                <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-emerald-200 text-emerald-600 bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:bg-emerald-900/20">Cashless</Badge>
              ) : null}
              {p.provider_type === 'reimbursement' || p.provider_type === 'both' ? (
                <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-orange-200 text-orange-600 bg-orange-50 dark:border-orange-800 dark:text-orange-400 dark:bg-orange-900/20">Reimburse</Badge>
              ) : null}
            </div>
            
            <div className="mt-2 text-[10px] text-muted-foreground pt-2 border-t w-full">
              ~{p.claim_process_days} days to process
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
