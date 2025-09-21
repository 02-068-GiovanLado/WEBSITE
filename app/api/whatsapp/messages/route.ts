import { type NextRequest, NextResponse } from "next/server"
import { mockPatients } from "@/lib/mock-data"

// Get WhatsApp message history
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const patientId = searchParams.get("patientId")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    // In a real app, fetch from database
    // For now, return mock message history
    const mockMessages = [
      {
        id: "msg_1",
        from: "+62812345678",
        message: "Nama: Sari Dewi, Berat: 8.5 kg, Tinggi: 65 cm, Lingkar Kepala: 42 cm",
        timestamp: new Date("2024-01-15T10:30:00Z"),
        processed: true,
        patientId: "1",
        recordType: "baby",
      },
      {
        id: "msg_2",
        from: "+62812345680",
        message: "Nama: Nenek Siti, Tekanan Darah: 140/90, Gula Darah: 180",
        timestamp: new Date("2024-01-12T14:20:00Z"),
        processed: true,
        patientId: "3",
        recordType: "elderly",
      },
    ]

    let filteredMessages = mockMessages
    if (patientId) {
      filteredMessages = mockMessages.filter((msg) => msg.patientId === patientId)
    }

    return NextResponse.json({
      messages: filteredMessages.slice(0, limit),
      total: filteredMessages.length,
    })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Send broadcast message to multiple patients
export async function POST(request: NextRequest) {
  try {
    const { message, patientIds, category } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    let targetPatients = mockPatients

    // Filter by patient IDs if provided
    if (patientIds && patientIds.length > 0) {
      targetPatients = mockPatients.filter((p) => patientIds.includes(p.id))
    }

    // Filter by category if provided
    if (category) {
      targetPatients = targetPatients.filter((p) => p.category === category)
    }

    const results = []

    for (const patient of targetPatients) {
      const phoneNumber = patient.phoneNumber || patient.guardianPhone
      if (phoneNumber) {
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

          const result = await response.json()
          results.push({
            patientId: patient.id,
            patientName: patient.name,
            phoneNumber: phoneNumber,
            success: response.ok,
            messageId: result.messageId,
            error: response.ok ? null : result.error,
          })
        } catch (error) {
          results.push({
            patientId: patient.id,
            patientName: patient.name,
            phoneNumber: phoneNumber,
            success: false,
            error: "Failed to send message",
          })
        }
      }
    }

    const successCount = results.filter((r) => r.success).length
    const failureCount = results.filter((r) => !r.success).length

    return NextResponse.json({
      success: true,
      totalSent: successCount,
      totalFailed: failureCount,
      results: results,
    })
  } catch (error) {
    console.error("Error sending broadcast messages:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
