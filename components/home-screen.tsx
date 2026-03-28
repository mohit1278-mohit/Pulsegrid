"use client"

import { 
  Activity, 
  AlertCircle, 
  Clock, 
  HeartPulse, 
  Ambulance, 
  Building2, 
  ChevronRight, 
  ShieldCheck, 
  Navigation 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { motion, type Variants } from "framer-motion"

export function HomeScreen() {
  const { setUserRole, setCurrentScreen } = useAppStore()

  const handlePatientAccess = () => {
    setUserRole("patient")
    setCurrentScreen("dashboard")
  }

  const handleHospitalAccess = () => {
    setCurrentScreen("hospital-login")
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  return (
    <div className="min-h-[100dvh] w-full bg-white text-[#1F2937] relative overflow-x-hidden overflow-y-auto selection:bg-[#EAF4FF] font-sans">
      {/* Dynamic Background Elements - Clean Blue Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#EAF4FF] blur-[120px] pointer-events-none mix-blend-multiply opacity-70" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#EAF4FF] blur-[120px] pointer-events-none mix-blend-multiply opacity-50" />

      {/* Subtle grid pattern background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.2]" 
           style={{ backgroundImage: 'radial-gradient(circle at center, #007BFF 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <motion.div 
        className="w-full max-w-5xl mx-auto px-6 py-12 md:py-24 flex flex-col items-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Header / Logo */}
        <motion.div variants={itemVariants} className="flex flex-col items-center mb-16">
          <div className="relative mb-5 group">
            <div className="absolute inset-0 bg-[#007BFF]/20 rounded-2xl blur-xl animate-pulse duration-3000" />
            <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-[#007BFF] shadow-[0_8px_30px_rgba(0,123,255,0.3)] border border-[#007BFF]/20 transition-transform duration-300 group-hover:scale-105">
              <Activity className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#1F2937]">
            Pulse<span className="text-[#007BFF]">Grid</span>
          </h2>
        </motion.div>

        {/* Hero Section */}
        <motion.div variants={itemVariants} className="text-center mb-24 max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1F2937] mb-8 leading-[1.15] tracking-tight">
            Every Second Matters <br className="hidden md:block"/> in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#007BFF] to-[#0056b3]">Emergencies</span>
          </h1>
          <p className="text-[#1F2937]/70 text-lg md:text-xl leading-relaxed">
            Finding hospitals with available beds, ambulances, and critical resources in real-time shouldn’t be a struggle.
          </p>
        </motion.div>

        {/* Feature Cards Section */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          
          {/* Problem Highlight Card */}
          <motion.div variants={itemVariants} className="w-full h-full relative group">
            <div className="absolute inset-0 bg-red-100 rounded-[2rem] blur-xl opacity-0 transition-opacity duration-500 group-hover:opacity-50" />
            <div className="relative h-full w-full bg-white border border-[#F5F7FA] rounded-[2rem] p-8 md:p-10 shadow-[0_8px_30px_rgba(31,41,55,0.04)] transition-all duration-300 group-hover:shadow-[0_20px_40px_rgba(31,41,55,0.08)] group-hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-red-50 text-red-500 rounded-xl shadow-sm border border-red-100">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-[#1F2937]">Current Problem</h3>
              </div>
              <ul className="space-y-6">
                {[
                  { icon: Building2, text: "No real-time hospital availability" },
                  { icon: Clock, text: "Delayed emergency response" },
                  { icon: AlertCircle, text: "Lack of coordination between hospitals & patients" }
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-[#1F2937]/70 font-medium">
                    <item.icon className="w-6 h-6 text-red-400 mt-0.5 shrink-0" />
                    <span className="text-base md:text-lg leading-relaxed">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Solution Section */}
          <motion.div variants={itemVariants} className="w-full h-full relative group">
            <div className="absolute inset-0 bg-[#EAF4FF] rounded-[2rem] blur-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative h-full w-full bg-white border border-[#007BFF]/20 rounded-[2rem] p-8 md:p-10 shadow-[0_8px_30px_rgba(0,123,255,0.06)] transition-all duration-300 group-hover:shadow-[0_20px_40px_rgba(0,123,255,0.12)] group-hover:-translate-y-1 group-hover:border-[#007BFF]/40">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-[#EAF4FF] text-[#007BFF] rounded-xl shadow-sm border border-[#007BFF]/10">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-[#007BFF]">Our Solution – PulseGrid</h3>
              </div>
              <ul className="space-y-6">
                {[
                  { icon: HeartPulse, text: "Real-time hospital resource tracking" },
                  { icon: Navigation, text: "Instant ambulance routing" },
                  { icon: ShieldCheck, text: "Smart SOS system" }
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-[#1F2937]">
                    <item.icon className="w-6 h-6 text-[#007BFF] mt-0.5 shrink-0" />
                    <span className="text-base md:text-lg font-medium leading-relaxed">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div variants={itemVariants} className="w-full max-w-2xl flex flex-col sm:flex-row gap-5 mb-24">
          <Button
            onClick={handlePatientAccess}
            size="lg"
            className="flex-1 h-16 text-lg font-semibold rounded-2xl gap-3 bg-[#007BFF] text-white hover:bg-[#0056b3] border-0 shadow-[0_8px_25px_rgba(0,123,255,0.3)] hover:shadow-[0_12px_35px_rgba(0,123,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            <Ambulance className="w-6 h-6" />
            Get Emergency Help
            <ChevronRight className="w-5 h-5 ml-auto sm:ml-2 opacity-80" />
          </Button>
          
          <Button
            onClick={handleHospitalAccess}
            variant="outline"
            size="lg"
            className="flex-1 h-16 text-lg font-semibold rounded-2xl gap-3 border-[#EAF4FF] bg-[#F5F7FA] text-[#1F2937] hover:bg-[#EAF4FF] hover:text-[#007BFF] hover:border-[#007BFF]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[0_4px_15px_rgba(31,41,55,0.03)] hover:shadow-[0_8px_20px_rgba(0,123,255,0.1)]"
          >
            <Building2 className="w-6 h-6 text-[#007BFF]" />
            Hospital Dashboard
            <ChevronRight className="w-5 h-5 ml-auto sm:ml-2 opacity-60" />
          </Button>
        </motion.div>

        {/* Footer */}
        <motion.div variants={itemVariants} className="text-center">
          <p className="text-base font-medium tracking-wide text-[#1F2937]/50">
            Built to save time. <span className="text-[#007BFF] font-semibold">Built to save lives.</span>
          </p>
        </motion.div>

      </motion.div>
    </div>
  )
}
