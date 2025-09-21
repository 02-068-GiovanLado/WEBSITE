import { z } from "zod"

// Baby health record validation schema
export const babyHealthSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  recordDate: z.date({
    required_error: "Record date is required",
  }),
  weight: z
    .number()
    .min(0.5, "Weight must be at least 0.5 kg")
    .max(30, "Weight cannot exceed 30 kg")
    .refine((val) => Number(val.toFixed(2)) === val, "Weight must have at most 2 decimal places"),
  height: z
    .number()
    .min(30, "Height must be at least 30 cm")
    .max(150, "Height cannot exceed 150 cm")
    .refine((val) => Number(val.toFixed(1)) === val, "Height must have at most 1 decimal place"),
  headCircumference: z
    .number()
    .min(25, "Head circumference must be at least 25 cm")
    .max(60, "Head circumference cannot exceed 60 cm")
    .refine((val) => Number(val.toFixed(1)) === val, "Head circumference must have at most 1 decimal place"),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
  healthWorkerId: z.string().min(1, "Health worker ID is required"),
})

// Elderly health record validation schema
export const elderlyHealthSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  recordDate: z.date({
    required_error: "Record date is required",
  }),
  bloodPressure: z
    .object({
      systolic: z
        .number()
        .min(60, "Systolic pressure must be at least 60 mmHg")
        .max(300, "Systolic pressure cannot exceed 300 mmHg"),
      diastolic: z
        .number()
        .min(30, "Diastolic pressure must be at least 30 mmHg")
        .max(200, "Diastolic pressure cannot exceed 200 mmHg"),
    })
    .refine((data) => data.systolic > data.diastolic, {
      message: "Systolic pressure must be higher than diastolic pressure",
      path: ["systolic"],
    }),
  bloodSugar: z
    .number()
    .min(30, "Blood sugar must be at least 30 mg/dL")
    .max(800, "Blood sugar cannot exceed 800 mg/dL")
    .optional(),
  weight: z
    .number()
    .min(20, "Weight must be at least 20 kg")
    .max(200, "Weight cannot exceed 200 kg")
    .refine((val) => Number(val.toFixed(1)) === val, "Weight must have at most 1 decimal place"),
  symptoms: z.array(z.string()).max(10, "Cannot have more than 10 symptoms").optional(),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
  healthWorkerId: z.string().min(1, "Health worker ID is required"),
})

// Patient registration validation schema
export const patientSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  dateOfBirth: z
    .date({
      required_error: "Date of birth is required",
    })
    .refine((date) => date <= new Date(), "Date of birth cannot be in the future"),
  gender: z.enum(["male", "female"], {
    required_error: "Gender is required",
  }),
  address: z
    .string()
    .min(10, "Address must be at least 10 characters")
    .max(200, "Address cannot exceed 200 characters"),
  phoneNumber: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, "Invalid phone number format")
    .optional(),
  guardianName: z
    .string()
    .min(2, "Guardian name must be at least 2 characters")
    .max(100, "Guardian name cannot exceed 100 characters")
    .optional(),
  guardianPhone: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, "Invalid phone number format")
    .optional(),
  category: z.enum(["baby", "elderly", "adult"], {
    required_error: "Category is required",
  }),
})

// Immunization record validation schema
export const immunizationSchema = z.object({
  name: z.string().min(1, "Immunization name is required"),
  dateGiven: z.date({
    required_error: "Date given is required",
  }),
  nextDue: z.date().optional(),
  completed: z.boolean().default(true),
})

// Medication validation schema
export const medicationSchema = z.object({
  name: z.string().min(1, "Medication name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  frequency: z.string().min(1, "Frequency is required"),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date().optional(),
  active: z.boolean().default(true),
})

export type BabyHealthFormData = z.infer<typeof babyHealthSchema>
export type ElderlyHealthFormData = z.infer<typeof elderlyHealthSchema>
export type PatientFormData = z.infer<typeof patientSchema>
export type ImmunizationFormData = z.infer<typeof immunizationSchema>
export type MedicationFormData = z.infer<typeof medicationSchema>
