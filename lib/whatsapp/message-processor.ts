import type { WhatsAppMessage, Patient, BabyHealthRecord, ElderlyHealthRecord } from "@/lib/types"
import { mockPatients } from "@/lib/mock-data"

// Message patterns for health data extraction
const BABY_PATTERNS = {
  weight: /(?:berat|bb)\s*:?\s*(\d+(?:\.\d+)?)\s*kg/i,
  height: /(?:tinggi|tb)\s*:?\s*(\d+(?:\.\d+)?)\s*cm/i,
  headCircumference: /(?:lingkar kepala|lk)\s*:?\s*(\d+(?:\.\d+)?)\s*cm/i,
}

const ELDERLY_PATTERNS = {
  bloodPressure: /(?:tekanan darah|td)\s*:?\s*(\d+)\/(\d+)/i,
  bloodSugar: /(?:gula darah|gd)\s*:?\s*(\d+)/i,
  weight: /(?:berat|bb)\s*:?\s*(\d+(?:\.\d+)?)\s*kg/i,
}

const PATIENT_PATTERNS = {
  name: /(?:nama|pasien)\s*:?\s*([a-zA-Z\s]+)/i,
  age: /(?:umur|usia)\s*:?\s*(\d+)\s*(?:tahun|bulan|thn|bln)/i,
}

export async function processHealthMessage(message: WhatsAppMessage): Promise<void> {
  try {
    console.log(`Processing WhatsApp message from ${message.from}: ${message.message}`)

    // Try to identify patient from message
    const patient = identifyPatient(message.message, message.from)

    if (!patient) {
      // Send help message if patient not found
      await sendHelpMessage(message.from)
      return
    }

    // Process based on patient category
    if (patient.category === "baby") {
      await processBabyHealthData(message, patient)
    } else if (patient.category === "elderly") {
      await processElderlyHealthData(message, patient)
    }

    // Mark message as processed
    message.processed = true
    message.patientId = patient.id
    message.recordType = patient.category
  } catch (error) {
    console.error("Error processing health message:", error)
    await sendErrorMessage(message.from)
  }
}

function identifyPatient(messageText: string, phoneNumber: string): Patient | null {
  // First, try to find patient by phone number
  let patient = mockPatients.find((p) => p.phoneNumber === phoneNumber || p.guardianPhone === phoneNumber)

  if (patient) {
    return patient
  }

  // Try to extract patient name from message
  const nameMatch = messageText.match(PATIENT_PATTERNS.name)
  if (nameMatch) {
    const extractedName = nameMatch[1].trim()
    patient = mockPatients.find((p) => p.name.toLowerCase().includes(extractedName.toLowerCase()))
  }

  return patient
}

async function processBabyHealthData(message: WhatsAppMessage, patient: Patient): Promise<void> {
  const messageText = message.message

  // Extract baby health data
  const weightMatch = messageText.match(BABY_PATTERNS.weight)
  const heightMatch = messageText.match(BABY_PATTERNS.height)
  const headCircumferenceMatch = messageText.match(BABY_PATTERNS.headCircumference)

  if (!weightMatch && !heightMatch && !headCircumferenceMatch) {
    await sendBabyDataFormatMessage(message.from)
    return
  }

  // Create baby health record (in real app, save to database)
  const babyRecord: Partial<BabyHealthRecord> = {
    patientId: patient.id,
    recordDate: message.timestamp,
    weight: weightMatch ? Number.parseFloat(weightMatch[1]) : 0,
    height: heightMatch ? Number.parseFloat(heightMatch[1]) : 0,
    headCircumference: headCircumferenceMatch ? Number.parseFloat(headCircumferenceMatch[1]) : 0,
    immunizations: [],
    milestones: [],
    notes: `Data dari WhatsApp: ${messageText}`,
    healthWorkerId: "whatsapp-bot",
    createdAt: message.timestamp,
  }

  console.log("Baby health record created:", babyRecord)

  // Send confirmation message
  await sendBabyConfirmationMessage(message.from, patient.name, babyRecord)
}

async function processElderlyHealthData(message: WhatsAppMessage, patient: Patient): Promise<void> {
  const messageText = message.message

  // Extract elderly health data
  const bpMatch = messageText.match(ELDERLY_PATTERNS.bloodPressure)
  const sugarMatch = messageText.match(ELDERLY_PATTERNS.bloodSugar)
  const weightMatch = messageText.match(ELDERLY_PATTERNS.weight)

  if (!bpMatch && !sugarMatch && !weightMatch) {
    await sendElderlyDataFormatMessage(message.from)
    return
  }

  // Create elderly health record (in real app, save to database)
  const elderlyRecord: Partial<ElderlyHealthRecord> = {
    patientId: patient.id,
    recordDate: message.timestamp,
    bloodPressure: bpMatch
      ? {
          systolic: Number.parseInt(bpMatch[1]),
          diastolic: Number.parseInt(bpMatch[2]),
        }
      : { systolic: 0, diastolic: 0 },
    bloodSugar: sugarMatch ? Number.parseInt(sugarMatch[1]) : undefined,
    weight: weightMatch ? Number.parseFloat(weightMatch[1]) : 0,
    medications: [],
    symptoms: [],
    notes: `Data dari WhatsApp: ${messageText}`,
    healthWorkerId: "whatsapp-bot",
    alertLevel: "normal",
    createdAt: message.timestamp,
  }

  // Assess alert level based on vital signs
  if (
    elderlyRecord.bloodPressure &&
    (elderlyRecord.bloodPressure.systolic >= 140 || elderlyRecord.bloodPressure.diastolic >= 90)
  ) {
    elderlyRecord.alertLevel = "warning"
  }
  if (elderlyRecord.bloodSugar && elderlyRecord.bloodSugar >= 200) {
    elderlyRecord.alertLevel = "critical"
  }

  console.log("Elderly health record created:", elderlyRecord)

  // Send confirmation message
  await sendElderlyConfirmationMessage(message.from, patient.name, elderlyRecord)
}

// Helper functions to send WhatsApp messages
async function sendHelpMessage(phoneNumber: string): Promise<void> {
  const helpMessage = `
🏥 *Sistem Monitoring Kesehatan Desa*

Untuk mengirim data kesehatan, gunakan format:

*Untuk Bayi:*
Nama: [Nama Bayi]
Berat: [angka] kg
Tinggi: [angka] cm
Lingkar Kepala: [angka] cm

*Untuk Lansia:*
Nama: [Nama Pasien]
Tekanan Darah: [sistolik]/[diastolik]
Gula Darah: [angka]
Berat: [angka] kg

Contoh: "Nama: Sari Dewi, Berat: 8.5 kg, Tinggi: 65 cm"
  `

  await sendWhatsAppMessage(phoneNumber, helpMessage)
}

async function sendBabyDataFormatMessage(phoneNumber: string): Promise<void> {
  const message = `
❌ Format data bayi tidak valid.

Gunakan format:
Nama: [Nama Bayi]
Berat: [angka] kg
Tinggi: [angka] cm
Lingkar Kepala: [angka] cm

Contoh: "Nama: Sari Dewi, Berat: 8.5 kg, Tinggi: 65 cm, Lingkar Kepala: 42 cm"
  `

  await sendWhatsAppMessage(phoneNumber, message)
}

async function sendElderlyDataFormatMessage(phoneNumber: string): Promise<void> {
  const message = `
❌ Format data lansia tidak valid.

Gunakan format:
Nama: [Nama Pasien]
Tekanan Darah: [sistolik]/[diastolik]
Gula Darah: [angka]
Berat: [angka] kg

Contoh: "Nama: Nenek Siti, Tekanan Darah: 140/90, Gula Darah: 180"
  `

  await sendWhatsAppMessage(phoneNumber, message)
}

async function sendBabyConfirmationMessage(
  phoneNumber: string,
  patientName: string,
  record: Partial<BabyHealthRecord>,
): Promise<void> {
  const message = `
✅ *Data Bayi Berhasil Disimpan*

👶 Pasien: ${patientName}
📊 Data yang tercatat:
${record.weight ? `• Berat: ${record.weight} kg` : ""}
${record.height ? `• Tinggi: ${record.height} cm` : ""}
${record.headCircumference ? `• Lingkar Kepala: ${record.headCircumference} cm` : ""}

📅 Tanggal: ${record.recordDate?.toLocaleDateString("id-ID")}

Terima kasih telah mengirim data kesehatan!
  `

  await sendWhatsAppMessage(phoneNumber, message)
}

async function sendElderlyConfirmationMessage(
  phoneNumber: string,
  patientName: string,
  record: Partial<ElderlyHealthRecord>,
): Promise<void> {
  let alertMessage = ""
  if (record.alertLevel === "warning") {
    alertMessage = "\n⚠️ *PERHATIAN:* Tanda vital menunjukkan kondisi yang perlu diperhatikan."
  } else if (record.alertLevel === "critical") {
    alertMessage = "\n🚨 *KRITIS:* Segera konsultasi dengan tenaga kesehatan!"
  }

  const message = `
✅ *Data Lansia Berhasil Disimpan*

👴 Pasien: ${patientName}
📊 Data yang tercatat:
${record.bloodPressure?.systolic ? `• Tekanan Darah: ${record.bloodPressure.systolic}/${record.bloodPressure.diastolic} mmHg` : ""}
${record.bloodSugar ? `• Gula Darah: ${record.bloodSugar} mg/dL` : ""}
${record.weight ? `• Berat: ${record.weight} kg` : ""}

📅 Tanggal: ${record.recordDate?.toLocaleDateString("id-ID")}
${alertMessage}

Terima kasih telah mengirim data kesehatan!
  `

  await sendWhatsAppMessage(phoneNumber, message)
}

async function sendErrorMessage(phoneNumber: string): Promise<void> {
  const message = `
❌ Terjadi kesalahan dalam memproses data.

Silakan coba lagi atau hubungi petugas kesehatan untuk bantuan.
  `

  await sendWhatsAppMessage(phoneNumber, message)
}

async function sendWhatsAppMessage(phoneNumber: string, message: string): Promise<void> {
  try {
    const response = await fetch("/api/whatsapp/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: phoneNumber,
        message: message,
      }),
    })

    if (!response.ok) {
      console.error("Failed to send WhatsApp message:", await response.text())
    }
  } catch (error) {
    console.error("Error sending WhatsApp message:", error)
  }
}
