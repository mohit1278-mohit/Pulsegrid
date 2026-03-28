import { create } from "zustand"

export type UserRole = "patient" | "hospital" | "driver" | null

export interface Hospital {
  id: string
  name: string
  email?: string
  password?: string
  distance: number
  icuBeds: number
  icuBedsTotal: number
  ventilators: number
  ventilatorsTotal: number
  specialists: number
  equipment: number
  loadStatus: "stable" | "moderate" | "critical"
  location: { lat: number; lng: number }
  phone: string
  address: string
  rating: number // out of 5
  bloodAvailability: {
    "A+": number
    "A-": number
    "B+": number
    "B-": number
    "O+": number
    "O-": number
    "AB+": number
    "AB-": number
  }
  description?: string
  founded_year?: number
  total_beds?: number
  specialties_list?: string[]
  accreditations?: string[]
  awards?: string[]
}

export interface Doctor {
  id: string
  hospital_id: string
  name: string
  qualifications: string[]
  specialty: string
  experience_years: number
  availability: "available" | "on_call" | "off"
  brief_bio: string
  rating: number
  patients_treated: number
}

export interface HospitalScheme {
  id: string
  hospital_id: string
  scheme_key: string
  scheme_name: string
  scheme_full_name: string
  coverage_amount: number
  coverage_description: string
  eligibility_summary: string
  eligibility_details: string
  accepted: boolean
  procedure_categories: string[]
  website_url: string
  helpline: string
}

export interface InsuranceProvider {
  id: string
  hospital_id: string
  provider_name: string
  provider_short_name: string
  provider_type: "cashless" | "reimbursement" | "both"
  plans_covered: string[]
  claim_process_days: number
  tpa_name: string
  tpa_phone: string
}

export interface InsuranceClaim {
  id: string
  patient_id: string
  hospital_id: string
  provider_id: string
  insurance_provider: string
  policy_number: string
  member_name: string
  member_dob: Date
  diagnosis: string
  treatment_description: string
  admission_date: Date
  discharge_date: Date
  claimed_amount: number
  approved_amount?: number
  status: "draft" | "submitted" | "under_review" | "approved" | "rejected"
  rejection_reason?: string
  documents: { name: string; url: string; type: string }[]
  submitted_at: Date
  updated_at: Date
}

export interface AmbulanceTrip {
  id: string
  ambulance_id: string
  driver_id: string
  patient_id: string | null
  hospital_id: string
  patient_name: string
  patient_condition: string
  patient_age: number
  patient_blood_type: string
  patient_allergies: string[]
  patient_medications: string[]
  pickup_lat: number
  pickup_lng: number
  pickup_address: string
  hospital_lat: number
  hospital_lng: number
  estimated_arrival_minutes: number
  status: "dispatched" | "en_route_pickup" | "patient_onboard" | "en_route_hospital" | "arrived" | "completed"
  hospital_notified: boolean
  hospital_prep_started: boolean
  created_at: Date
}

export interface AmbulanceLocation {
  id: string
  ambulance_id: string
  driver_id: string
  latitude: number
  longitude: number
  speed_kmh: number
  heading_degrees: number
  accuracy_meters: number
  timestamp: Date
  trip_id: string
}

export interface HospitalNotification {
  id: string
  hospital_id: string
  trip_id: string
  ambulance_id: string
  driver_name: string
  message_type: "arriving_5min" | "arriving_2min" | "arriving_1min" | "arrived" | "custom"
  custom_message?: string
  patient_name: string
  patient_condition: string
  eta_minutes: number
  is_read: boolean
  created_at: Date
}

export interface ResourceRequest {
  id: string
  fromHospital: string
  toHospital: string
  resourceType: string
  quantity: number
  severity: "low" | "medium" | "high"
  status: "pending" | "approved" | "declined"
  timestamp: Date
}

export interface Notification {
  id: string
  type: "request" | "ambulance" | "arrival" | "alert"
  title: string
  message: string
  timestamp: Date
  read: boolean
}

export interface EmergencyContact {
  name: string
  phone: string
  relationship: string
}

export interface UserLocation {
  latitude: number
  longitude: number
  accuracy: number
  timestamp: Date
}

interface AppState {
  userRole: UserRole
  setUserRole: (role: UserRole) => void
  currentScreen: string
  setCurrentScreen: (screen: string) => void
  currentHospitalId: string | null
  setCurrentHospitalId: (id: string | null) => void
  hospitals: Hospital[]
  addHospital: (hospital: Hospital) => void
  userLocation: UserLocation | null
  setUserLocation: (location: UserLocation | null) => void
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id" | "timestamp">) => void
  markNotificationRead: (id: string) => void
  resourceRequests: ResourceRequest[]
  addResourceRequest: (request: Omit<ResourceRequest, "id" | "timestamp" | "status">) => void
  updateRequestStatus: (id: string, status: "approved" | "declined") => void
  emergencyContact: EmergencyContact | null
  setEmergencyContact: (contact: EmergencyContact) => void
  sosConfirmationEnabled: boolean
  setSosConfirmationEnabled: (enabled: boolean) => void
  locationEnabled: boolean
  setLocationEnabled: (enabled: boolean) => void
  emergencyHistory: { timestamp: Date; status: string }[]
  addEmergencyToHistory: (status: string) => void
  hospitalData: {
    icuBeds: number
    ventilators: number
    specialists: number
    equipment: number
    bloodAvailability: {
      "A+": number
      "A-": number
      "B+": number
      "B-": number
      "O+": number
      "O-": number
      "AB+": number
      "AB-": number
    }
  }
  setHospitalData: (data: AppState["hospitalData"]) => void
  updateHospitalData: (data: Partial<AppState["hospitalData"]>) => void
  isLoggedIn: boolean
  setIsLoggedIn: (loggedIn: boolean) => void
  hospitalName: string
  setHospitalName: (name: string) => void
  selectedHospital: Hospital | null
  setSelectedHospital: (hospital: Hospital | null) => void
  // Mock Collections
  doctors: Doctor[]
  setDoctors: (docs: Doctor[]) => void
  hospitalSchemes: HospitalScheme[]
  insuranceProviders: InsuranceProvider[]
  insuranceClaims: InsuranceClaim[]
  addInsuranceClaim: (claim: InsuranceClaim) => void
  ambulanceTrips: AmbulanceTrip[]
  updateAmbulanceTrip: (id: string, updates: Partial<AmbulanceTrip>) => void
  ambulanceLocations: AmbulanceLocation[]
  upsertAmbulanceLocation: (location: AmbulanceLocation) => void
  hospitalNotifications: HospitalNotification[]
  addHospitalNotification: (notification: HospitalNotification) => void
  markHospitalNotificationRead: (id: string) => void
}

const mockHospitals: Hospital[] = [
  {
    id: "1",
    name: "Bombay Hospital Indore",
    email: "admin@bombay.com",
    password: "password123",
    distance: 1.2,
    icuBeds: 25,
    icuBedsTotal: 40,
    ventilators: 12,
    ventilatorsTotal: 25,
    specialists: 7,
    equipment: 90,
    loadStatus: "stable",
    location: { lat: 22.7533, lng: 75.8937 },
    phone: "0731-2559811",
    address: "Ring Road, Indore, Madhya Pradesh 452010",
    rating: 4.6,
    bloodAvailability: { "A+": 12, "A-": 4, "B+": 8, "B-": 2, "O+": 15, "O-": 5, "AB+": 3, "AB-": 1 },
    description: "Bombay Hospital Indore is a NABH-accredited multi-specialty tertiary care hospital established in 2003, with a 500-bed capacity dedicated to delivering world-class healthcare. Our facility is equipped with cutting-edge diagnostic and surgical technology including a 128-slice CT scanner, 3T MRI, and a state-of-the-art catheterisation lab.\n\nWe house a team of 150+ highly qualified specialists across 30 medical departments, offering comprehensive care from emergency medicine to complex cardiac surgeries and neurosurgery. Our 24/7 emergency department handles over 200 critical cases daily with an average response time of under 8 minutes.\n\nRecognised nationally for excellence in patient outcomes, Bombay Hospital Indore has been awarded the Best Multi-Specialty Hospital by the National Healthcare Awards consecutively for 5 years and maintains an infection control rate 40% below the national average.",
    founded_year: 2003,
    total_beds: 500,
    specialties_list: ["Emergency Medicine", "Cardiology", "Neurology", "Oncology", "Orthopaedics", "Gastroenterology", "Critical Care", "Pulmonology"],
    accreditations: ["NABH", "JCI", "ISO 9001:2015"],
    awards: ["Best Multi-Specialty Hospital 2023", "National Healthcare Excellence Award 2022"]
  },
  {
    id: "2",
    name: "CHL Hospital",
    email: "admin@chl.com",
    password: "password123",
    distance: 2.5,
    icuBeds: 18,
    icuBedsTotal: 30,
    ventilators: 8,
    ventilatorsTotal: 15,
    specialists: 3,
    equipment: 85,
    loadStatus: "moderate",
    location: { lat: 22.7244, lng: 75.8839 },
    phone: "0731-6621111",
    address: "AB Road, LIG Square, Indore, Madhya Pradesh 452008",
    rating: 4.2,
    bloodAvailability: { "A+": 5, "A-": 1, "B+": 3, "B-": 0, "O+": 8, "O-": 2, "AB+": 1, "AB-": 0 },
  },
  {
    id: "3",
    name: "Choithram Hospital",
    email: "admin@choithram.com",
    password: "password123",
    distance: 3.8,
    icuBeds: 10,
    icuBedsTotal: 35,
    ventilators: 5,
    ventilatorsTotal: 20,
    specialists: 2,
    equipment: 80,
    loadStatus: "critical",
    location: { lat: 22.6953, lng: 75.8573 },
    phone: "0731-2362491",
    address: "Manik Bagh Road, Indore, Madhya Pradesh 452014",
    rating: 4.0,
    bloodAvailability: { "A+": 2, "A-": 0, "B+": 1, "B-": 0, "O+": 4, "O-": 0, "AB+": 0, "AB-": 0 },
  },
  {
    id: "4",
    name: "Medanta Super Specialty Hospital",
    email: "admin@medanta.com",
    password: "password123",
    distance: 4.2,
    icuBeds: 30,
    icuBedsTotal: 50,
    ventilators: 15,
    ventilatorsTotal: 30,
    specialists: 2,
    equipment: 95,
    loadStatus: "stable",
    location: { lat: 22.7523, lng: 75.8983 },
    phone: "0731-4747000",
    address: "PU4 Scheme No 54, Vijay Nagar, Indore, Madhya Pradesh 452010",
    rating: 4.8,
    bloodAvailability: { "A+": 25, "A-": 8, "B+": 15, "B-": 5, "O+": 30, "O-": 10, "AB+": 8, "AB-": 3 },
  },
]

const mockDoctors: Doctor[] = [
  { id: "d1", hospital_id: "1", name: "Dr. Priya Sharma", qualifications: ["MBBS", "MD (Internal Medicine)", "FCPS"], specialty: "Critical Care", experience_years: 14, availability: "available", brief_bio: "Dr. Priya Sharma is a critical care specialist with 14 years of experience in managing complex ICU cases. She completed her FCPS from the Royal College of Physicians and has published 12 peer-reviewed papers.", rating: 4.9, patients_treated: 4800 },
  { id: "d2", hospital_id: "1", name: "Dr. Arjun Mehta", qualifications: ["MBBS", "MS (General Surgery)", "MCh (Surgical Oncology)"], specialty: "Emergency Surgery", experience_years: 11, availability: "available", brief_bio: "Senior consultant surgeon specializing in emergency abdominal and trauma surgery. Trained at AIIMS Delhi and has performed over 3,000 major surgical procedures.", rating: 4.8, patients_treated: 3200 },
  { id: "d3", hospital_id: "1", name: "Dr. Sunita Rao", qualifications: ["MBBS", "DM (Cardiology)", "FACC"], specialty: "Interventional Cardiology", experience_years: 18, availability: "on_call", brief_bio: "One of the region's leading interventional cardiologists with 18 years of experience. Fellowship from American College of Cardiology. Specializes in primary angioplasty and structural heart disease.", rating: 4.9, patients_treated: 6100 },
  { id: "d4", hospital_id: "1", name: "Dr. Vikram Nair", qualifications: ["MBBS", "MD (Anaesthesiology)", "PDCC (Critical Care)"], specialty: "Critical Care Anaesthesia", experience_years: 9, availability: "available", brief_bio: "Expert in critical care anaesthesia and pain management. Completed post-doctoral certification in critical care from CMC Vellore. Handles complex cases involving multi-organ failure.", rating: 4.7, patients_treated: 2900 },
  { id: "d5", hospital_id: "1", name: "Dr. Kavitha Iyer", qualifications: ["MBBS", "DM (Neurology)", "FIAN"], specialty: "Stroke and Neurocritical Care", experience_years: 16, availability: "off", brief_bio: "Neurologist specializing in acute stroke management and neurocritical care. Fellow of the Indian Academy of Neurology. Has set up the city's first dedicated stroke unit.", rating: 4.8, patients_treated: 5300 },
  { id: "d6", hospital_id: "1", name: "Dr. Rohit Kumar", qualifications: ["MBBS", "MS (Orthopaedics)", "DNB", "Fellowship (Trauma)"], specialty: "Trauma and Orthopaedic Surgery", experience_years: 12, availability: "available", brief_bio: "Trauma surgery specialist with expertise in complex fracture management and joint reconstruction. Completed trauma fellowship at R Adams Cowley Shock Trauma Centre, USA.", rating: 4.8, patients_treated: 4100 },
  { id: "d7", hospital_id: "1", name: "Dr. Neha Patel", qualifications: ["MBBS", "DM (Gastroenterology)", "DNB"], specialty: "Digestive and Liver Care", experience_years: 10, availability: "available", brief_bio: "Gastroenterologist with expertise in advanced endoscopy, liver disease management, and inflammatory bowel disease.", rating: 4.7, patients_treated: 3400 },
  { id: "d8", hospital_id: "2", name: "Dr. Anil Desai", qualifications: ["MBBS", "MS (General Surgery)", "FRCS"], specialty: "General Surgery", experience_years: 22, availability: "available", brief_bio: "Senior general surgeon leading the CHL Hospital surgery department. Excellent record in laparoscopic interventions.", rating: 4.8, patients_treated: 8200 },
  { id: "d9", hospital_id: "2", name: "Dr. Ritu Singh", qualifications: ["MBBS", "MD (Pediatrics)"], specialty: "Pediatrics", experience_years: 15, availability: "on_call", brief_bio: "Expert pediatrician focusing on neonatal care and childhood infectious diseases.", rating: 4.9, patients_treated: 5400 },
  { id: "d10", hospital_id: "2", name: "Dr. Amit Verma", qualifications: ["MBBS", "MD (Pulmonology)"], specialty: "Pulmonology", experience_years: 11, availability: "available", brief_bio: "Specialist in respiratory medicine, treating severe asthma, COPD, and sleep apnea cases.", rating: 4.6, patients_treated: 3100 },
  { id: "d11", hospital_id: "3", name: "Dr. Sanjay Gupta", qualifications: ["MBBS", "MS", "MCh (Plastic Surgery)"], specialty: "Plastic & Reconstructive Surgery", experience_years: 19, availability: "off", brief_bio: "Renowned reconstructive surgeon specializing in burn treatments and accident trauma recovery at Choithram Hospital.", rating: 4.9, patients_treated: 2600 },
  { id: "d12", hospital_id: "3", name: "Dr. Meera Menon", qualifications: ["MBBS", "MD (Internal Medicine)", "FACP"], specialty: "Internal Medicine", experience_years: 24, availability: "available", brief_bio: "Highly experienced diagnostician and internal medicine specialist treating multi-systemic acute and chronic illnesses.", rating: 4.8, patients_treated: 9800 },
  { id: "d13", hospital_id: "4", name: "Dr. Kabir Khan", qualifications: ["MBBS", "DM (Oncology)"], specialty: "Medical Oncology", experience_years: 13, availability: "available", brief_bio: "Leading oncologist at Medanta, spearheading the targeted chemotherapy and immunotherapy ward.", rating: 4.9, patients_treated: 3900 },
  { id: "d14", hospital_id: "4", name: "Dr. Ananya Roy", qualifications: ["MBBS", "MS (Ophthalmology)"], specialty: "Ophthalmology", experience_years: 9, availability: "available", brief_bio: "Expert eye surgeon specializing in advanced cataract techniques, LASIK, and retinal disease management.", rating: 4.7, patients_treated: 4100 },
]

const mockHospitalSchemes: HospitalScheme[] = [
  { id: "s1", hospital_id: "1", scheme_key: "pm_jay", scheme_name: "PM-JAY", scheme_full_name: "Pradhan Mantri Jan Arogya Yojana (Ayushman Bharat)", coverage_amount: 500000, coverage_description: "Up to Rs. 5 Lakhs per year for secondary and tertiary hospitalization", eligibility_summary: "BPL families as per SECC 2011 database", eligibility_details: "Applicable to families listed in the Socio-Economic Caste Census 2011. Covers 10.74 crore poor and vulnerable families. No premium required. Fully cashless at empanelled hospitals.", accepted: true, procedure_categories: ["Surgery", "ICU", "Chemotherapy", "Dialysis"], website_url: "https://pmjay.gov.in", helpline: "14555" },
  { id: "s2", hospital_id: "1", scheme_key: "cm_health", scheme_name: "CM Health Scheme", scheme_full_name: "Chief Minister's Comprehensive Health Insurance Scheme", coverage_amount: 200000, coverage_description: "Up to Rs. 2 Lakhs per family per year", eligibility_summary: "State residents with annual income below Rs. 72,000", eligibility_details: "Applicable to residents of the state with a valid income certificate. Covers the entire family including spouse, parents, and 3 dependent children. Cashless treatment at empanelled hospitals.", accepted: true, procedure_categories: ["General Surgery", "Maternity", "Cardiac", "Ortho"], website_url: "https://cms.tn.gov.in", helpline: "104" },
  { id: "s3", hospital_id: "1", scheme_key: "esi", scheme_name: "ESI", scheme_full_name: "Employee State Insurance Scheme", coverage_amount: 0, coverage_description: "Full medical coverage with no upper limit for registered employees", eligibility_summary: "Employees earning up to Rs. 21,000/month registered under ESIC", eligibility_details: "Covers registered employees and their dependents. Includes OPD, hospitalization, specialist consultations, maternity, disability, and dependants benefits. Employee contributes 0.75% of wages.", accepted: true, procedure_categories: ["All Medical", "Maternity", "Emergency"], website_url: "https://esic.gov.in", helpline: "1800-11-2526" },
  { id: "s4", hospital_id: "1", scheme_key: "cghs", scheme_name: "CGHS", scheme_full_name: "Central Government Health Scheme", coverage_amount: 0, coverage_description: "Comprehensive medical care for central govt employees and pensioners", eligibility_summary: "Central government employees, pensioners, and their dependents", eligibility_details: "Covers allopathic, AYUSH treatments, specialist consultations, diagnostic tests, hospitalization. Available in 25 cities with CGHS Wellness Centres.", accepted: true, procedure_categories: ["All Specialties", "Diagnostics", "Medicines"], website_url: "https://cghs.gov.in", helpline: "1800-11-4000" },
  { id: "s5", hospital_id: "1", scheme_key: "nps", scheme_name: "NPS", scheme_full_name: "National Programme for the Health Care of the Elderly", coverage_amount: 0, coverage_description: "Free healthcare for senior citizens aged 60+", eligibility_summary: "Indian citizens aged 60 years and above", eligibility_details: "Provides dedicated wards, free medicines, free diagnostic services, and physiotherapy. Covers geriatric care and management of age-related chronic diseases.", accepted: true, procedure_categories: ["Geriatric Care", "Physiotherapy", "Medicines"], website_url: "https://mohfw.gov.in", helpline: "1800-180-1104" },
]

const mockInsuranceProviders: InsuranceProvider[] = [
  { id: "i1", hospital_id: "1", provider_name: "Star Health and Allied Insurance", provider_short_name: "Star Health", provider_type: "cashless", plans_covered: ["Family Health Optima", "Comprehensive", "Senior Citizen Red Carpet"], claim_process_days: 7, tpa_name: "Medi Assist", tpa_phone: "1800-425-2255" },
  { id: "i2", hospital_id: "1", provider_name: "HDFC ERGO General Insurance", provider_short_name: "HDFC ERGO", provider_type: "cashless", plans_covered: ["Optima Secure", "Optima Secure Global", "My Health Suraksha"], claim_process_days: 5, tpa_name: "Heritage Health TPA", tpa_phone: "1800-266-0700" },
  { id: "i3", hospital_id: "1", provider_name: "ICICI Lombard General Insurance", provider_short_name: "ICICI Lombard", provider_type: "both", plans_covered: ["iHealth Plus", "Complete Health Insurance", "Golden Shield"], claim_process_days: 7, tpa_name: "ICICI Lombard TPA", tpa_phone: "1800-2666" },
  { id: "i4", hospital_id: "1", provider_name: "New India Assurance Company", provider_short_name: "New India", provider_type: "both", plans_covered: ["Family Floater Mediclaim", "Senior Citizen Mediclaim"], claim_process_days: 14, tpa_name: "Paramount TPA", tpa_phone: "1800-209-1300" },
  { id: "i5", hospital_id: "1", provider_name: "Bajaj Allianz General Insurance", provider_short_name: "Bajaj Allianz", provider_type: "reimbursement", plans_covered: ["Health Guard", "Health Guard Gold", "Tax Gain"], claim_process_days: 10, tpa_name: "Vipul MedCorp", tpa_phone: "1800-209-5858" },
  { id: "i6", hospital_id: "1", provider_name: "Care Health Insurance", provider_short_name: "Care (Religare)", provider_type: "cashless", plans_covered: ["Care", "Care Freedom", "Care Senior"], claim_process_days: 6, tpa_name: "Care TPA", tpa_phone: "1800-102-6655" },
  { id: "i7", hospital_id: "1", provider_name: "United India Insurance", provider_short_name: "United India", provider_type: "both", plans_covered: ["Family Medicare", "Individual Mediclaim"], claim_process_days: 14, tpa_name: "Family Health Plan TPA", tpa_phone: "1800-425-4315" },
  { id: "i8", hospital_id: "1", provider_name: "Niva Bupa Health Insurance", provider_short_name: "Niva Bupa", provider_type: "cashless", plans_covered: ["ReAssure 2.0", "Health Companion", "Aspire"], claim_process_days: 5, tpa_name: "Niva Bupa TPA", tpa_phone: "1800-200-8888" },
]

export const useAppStore = create<AppState>((set) => ({
  userRole: null,
  setUserRole: (role) => set({ userRole: role }),
  currentScreen: "home",
  setCurrentScreen: (screen) => set({ currentScreen: screen }),
  currentHospitalId: null,
  setCurrentHospitalId: (id) => set({ currentHospitalId: id }),
  hospitals: mockHospitals,
  addHospital: (hospital) => set((state) => ({ hospitals: [...state.hospitals, hospital] })),
  userLocation: null,
  setUserLocation: (location) => set({ userLocation: location }),
  notifications: [
    {
      id: "1",
      type: "request",
      title: "Resource Request",
      message: "CHL Hospital requested 2 ventilators",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: false,
    },
    {
      id: "2",
      type: "alert",
      title: "System Alert",
      message: "Choithram Hospital at critical capacity",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      read: true,
    },
  ],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        {
          ...notification,
          id: Math.random().toString(36).substring(7),
          timestamp: new Date(),
        },
        ...state.notifications,
      ],
    })),
  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  resourceRequests: [],
  addResourceRequest: (request) =>
    set((state) => ({
      resourceRequests: [
        {
          ...request,
          id: Math.random().toString(36).substring(7),
          timestamp: new Date(),
          status: "pending",
        },
        ...state.resourceRequests,
      ],
    })),
  updateRequestStatus: (id, status) =>
    set((state) => ({
      resourceRequests: state.resourceRequests.map((r) =>
        r.id === id ? { ...r, status } : r
      ),
    })),
  emergencyContact: null,
  setEmergencyContact: (contact) => set({ emergencyContact: contact }),
  sosConfirmationEnabled: true,
  setSosConfirmationEnabled: (enabled) =>
    set({ sosConfirmationEnabled: enabled }),
  locationEnabled: true,
  setLocationEnabled: (enabled) => set({ locationEnabled: enabled }),
  emergencyHistory: [],
  addEmergencyToHistory: (status) =>
    set((state) => ({
      emergencyHistory: [
        { timestamp: new Date(), status },
        ...state.emergencyHistory,
      ],
    })),
  hospitalData: {
    icuBeds: 25,
    ventilators: 12,
    specialists: 7,
    equipment: 90,
    bloodAvailability: { "A+": 12, "A-": 4, "B+": 8, "B-": 2, "O+": 15, "O-": 5, "AB+": 3, "AB-": 1 },
  },
  setHospitalData: (data) => set({ hospitalData: data }),
  updateHospitalData: (data) =>
    set((state) => {
      // Create new hospital data state
      const newHospitalData = { ...state.hospitalData, ...data }
      
      if (!state.currentHospitalId) return { hospitalData: newHospitalData }

      // Sync it to the global hospitals array for the currently logged in hospital
      const updatedHospitals = state.hospitals.map(h => {
        if (h.id === state.currentHospitalId) {
          return {
            ...h,
            icuBeds: newHospitalData.icuBeds,
            ventilators: newHospitalData.ventilators,
            specialists: newHospitalData.specialists,
            equipment: newHospitalData.equipment,
            bloodAvailability: newHospitalData.bloodAvailability
          }
        }
        return h
      })

      return {
        hospitalData: newHospitalData,
        hospitals: updatedHospitals
      }
    }),
  isLoggedIn: false,
  setIsLoggedIn: (loggedIn) => set({ isLoggedIn: loggedIn }),
  hospitalName: "",
  setHospitalName: (name) => set({ hospitalName: name }),
  selectedHospital: null,
  setSelectedHospital: (hospital) => set({ selectedHospital: hospital }),
  doctors: mockDoctors,
  setDoctors: (docs) => set({ doctors: docs }),
  hospitalSchemes: mockHospitalSchemes,
  insuranceProviders: mockInsuranceProviders,
  insuranceClaims: [],
  addInsuranceClaim: (claim) => set((state) => ({ insuranceClaims: [...state.insuranceClaims, claim] })),
  ambulanceTrips: [],
  updateAmbulanceTrip: (id, updates) => set((state) => ({
    ambulanceTrips: state.ambulanceTrips.map(trip => trip.id === id ? { ...trip, ...updates } : trip)
  })),
  ambulanceLocations: [],
  upsertAmbulanceLocation: (location) => set((state) => {
    const exists = state.ambulanceLocations.findIndex(l => l.ambulance_id === location.ambulance_id)
    if (exists >= 0) {
      const newLocations = [...state.ambulanceLocations]
      newLocations[exists] = location
      return { ambulanceLocations: newLocations }
    }
    return { ambulanceLocations: [...state.ambulanceLocations, location] }
  }),
  hospitalNotifications: [],
  addHospitalNotification: (notification) => set((state) => ({
    hospitalNotifications: [notification, ...state.hospitalNotifications]
  })),
  markHospitalNotificationRead: (id) => set((state) => ({
    hospitalNotifications: state.hospitalNotifications.map(n => n.id === id ? { ...n, is_read: true } : n)
  }))
}))
