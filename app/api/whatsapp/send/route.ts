import { type NextRequest, NextResponse } from "next/server"

interface SendMessageRequest {
  to: string
  message: string
  type?: "text" | "template"
}

export async function POST(request: NextRequest) {
  try {
    const { to, message, type = "text" }: SendMessageRequest = await request.json()

    // WhatsApp Business API configuration
    const WHATSAPP_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN
    const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID

    if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
      return NextResponse.json({ error: "WhatsApp configuration missing" }, { status: 500 })
    }

    const payload = {
      messaging_product: "whatsapp",
      to: to,
      type: type,
      text: {
        body: message,
      },
    }

    const response = await fetch(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const result = await response.json()

    if (!response.ok) {
      console.error("WhatsApp API error:", result)
      return NextResponse.json({ error: "Failed to send message", details: result }, { status: response.status })
    }

    return NextResponse.json({
      success: true,
      messageId: result.messages[0].id,
    })
  } catch (error) {
    console.error("Send message error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
