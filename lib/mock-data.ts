// Mock data for development and demonstration
import type { Patient, BabyHealthRecord, ElderlyHealthRecord, HealthWorker, HealthAlert } from "./types"

export const mockPatients: Patient[] = [
  {
    id: "1",
    name: "Sari Dewi",
    dateOfBirth: new Date("2023-08-15"),
    gender: "female",
    address: "Jl. Mawar No. 12, Desa Sukamaju",
    guardianName: "Ibu Rina",
    guardianPhone: "+62812345678",
    category: "baby",
    createdAt: new Date("2023-08-16"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Ahmad Rizki",
    dateOfBirth: new Date("2023-06-20"),
    gender: "male",
    address: "Jl. Melati No. 8, Desa Sukamaju",
    guardianName: "Bapak Andi",
    guardianPhone: "+62812345679",
    category: "baby",
    createdAt: new Date("2023-06-21"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "3",
    name: "Nenek Siti",
    dateOfBirth: new Date("1950-03-10"),
    gender: "female",
    address: "Jl. Kenanga No. 5, Desa Sukamaju",
    phoneNumber: "+62812345680",
    category: "elderly",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2024-01-12"),
  },
  {
    id: "4",
    name: "Kakek Budi",
    dateOfBirth: new Date("1948-11-25"),
    gender: "male",
    address: "Jl. Anggrek No. 15, Desa Sukamaju",
    phoneNumber: "+62812345681",
    category: "elderly",
    createdAt: new Date("2023-02-01"),
    updatedAt: new Date("2024-01-08"),
  },
]

export const mockBabyRecords: BabyHealthRecord[] = [
  {
    id: "1",
    patientId: "1",
    recordDate: new Date("2024-01-15"),
    weight: 8.5,
    height: 65,
    headCircumference: 42,
    immunizations: [
      {
        id: "1",
        name: "BCG",
        dateGiven: new Date("2023-08-16"),
        completed: true,
      },
      {
        id: "2",
        name: "Hepatitis B",
        dateGiven: new Date("2023-09-15"),
        nextDue: new Date("2024-02-15"),
        completed: true,
      },
    ],
    milestones: [
      {
        id: "1",
        name: "Mengangkat kepala",
        expectedAge: 2,
        achieved: true,
        achievedDate: new Date("2023-10-15"),
      },
      {
        id: "2",
        name: "Berguling",
        expectedAge: 4,
        achieved: true,
        achievedDate: new Date("2023-12-20"),
      },
    ],
    notes: "Perkembangan baik, berat badan sesuai kurva pertumbuhan",
    healthWorkerId: "1",
    createdAt: new Date("2024-01-15"),
  },
]

export const mockElderlyRecords: ElderlyHealthRecord[] = [
  {
    id: "1",
    patientId: "3",
    recordDate: new Date("2024-01-12"),
    bloodPressure: {
      systolic: 140,
      diastolic: 90,
    },
    bloodSugar: 180,
    weight: 55,
    medications: [
      {
        id: "1",
        name: "Amlodipine",
        dosage: "5mg",
        frequency: "1x sehari",
        startDate: new Date("2023-06-01"),
        active: true,
      },
    ],
    symptoms: ["Pusing ringan", "Kelelahan"],
    notes: "Tekanan darah tinggi, perlu monitoring ketat",
    healthWorkerId: "1",
    alertLevel: "warning",
    createdAt: new Date("2024-01-12"),
  },
]

export const mockHealthWorkers: HealthWorker[] = [
  {
    id: "1",
    name: "Suster Maya",
    phoneNumber: "+62812345690",
    role: "nurse",
    assignedArea: "Desa Sukamaju",
    createdAt: new Date("2023-01-01"),
  },
]

export const mockHealthAlerts: HealthAlert[] = [
  {
    id: "1",
    patientId: "3",
    type: "high_bp",
    severity: "high",
    message: "Tekanan darah Nenek Siti 140/90 - perlu pemeriksaan lanjutan",
    resolved: false,
    createdAt: new Date("2024-01-12"),
  },
  {
    id: "2",
    patientId: "2",
    type: "missed_immunization",
    severity: "medium",
    message: "Ahmad Rizki terlambat imunisasi DPT - jadwal ulang diperlukan",
    resolved: false,
    createdAt: new Date("2024-01-10"),
  },
]
