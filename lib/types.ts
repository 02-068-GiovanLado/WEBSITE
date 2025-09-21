// Health monitoring data types for the village health system

export interface Patient {
  id: string
  name: string
  dateOfBirth: Date
  gender: "male" | "female"
  address: string
  phoneNumber?: string
  guardianName?: string
  guardianPhone?: string
  category: "baby" | "elderly" | "adult"
  createdAt: Date
  updatedAt: Date
}

export interface BabyHealthRecord {
  id: string
  patientId: string
  recordDate: Date
  weight: number // in kg
  height: number // in cm
  headCircumference: number // in cm
  immunizations: Immunization[]
  milestones: Milestone[]
  notes?: string
  healthWorkerId: string
  createdAt: Date
}

export interface ElderlyHealthRecord {
  id: string
  patientId: string
  recordDate: Date
  bloodPressure: {
    systolic: number
    diastolic: number
  }
  bloodSugar?: number // mg/dL
  weight: number // in kg
  medications: Medication[]
  symptoms: string[]
  notes?: string
  healthWorkerId: string
  alertLevel: "normal" | "warning" | "critical"
  createdAt: Date
}

export interface Immunization {
  id: string
  name: string
  dateGiven: Date
  nextDue?: Date
  completed: boolean
}

export interface Milestone {
  id: string
  name: string
  expectedAge: number // in months
  achieved: boolean
  achievedDate?: Date
}

export interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  startDate: Date
  endDate?: Date
  active: boolean
}

export interface HealthWorker {
  id: string
  name: string
  phoneNumber: string
  role: "nurse" | "midwife" | "doctor" | "volunteer"
  assignedArea: string
  createdAt: Date
}

export interface HealthAlert {
  id: string
  patientId: string
  type: "growth_concern" | "missed_immunization" | "high_bp" | "medication_reminder" | "checkup_due"
  severity: "low" | "medium" | "high"
  message: string
  resolved: boolean
  createdAt: Date
  resolvedAt?: Date
}

// Growth chart data for babies
export interface GrowthData {
  age: number // in months
  weight: number
  height: number
  headCircumference: number
}

// WhatsApp integration types
export interface WhatsAppMessage {
  id: string
  from: string
  message: string
  timestamp: Date
  processed: boolean
  patientId?: string
  recordType?: "baby" | "elderly"
}
