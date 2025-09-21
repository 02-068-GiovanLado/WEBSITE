import { type NextRequest, NextResponse } from "next/server"
import type { WhatsAppMessage } from "@/lib/types"
import { processHealthMessage } from "@/lib/whatsapp/message-processor"

// WhatsApp webhook verification
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get("hub.mode")
  const token = searchParams.get("hub.verify_token")
  const challenge = searchParams.get("hub.challenge")

  // Verify webhook (replace with your actual verify token)
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "your_verify_token_here"

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("WhatsApp webhook verified successfully")
    return new NextResponse(challenge, { status: 200 })
  }

  return new NextResponse("Forbidden", { status: 403 })
}

// Handle incoming WhatsApp messages
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Process WhatsApp webhook payload
    if (body.object === "whatsapp_business_account") {
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          if (change.field === "messages") {
            const messages = change.value.messages || []

            for (const message of messages) {
              // Create WhatsApp message object
              const whatsappMessage: WhatsAppMessage = {
                id: message.id,
                from: message.from,
                message: message.text?.body || "",
                timestamp: new Date(Number.parseInt(message.timestamp) * 1000),
                processed: false,
              }

              // Process the health message
              await processHealthMessage(whatsappMessage)
            }
          }
        }
      }
    }

    return NextResponse.json({ status: "success" })
  } catch (error) {
    console.error("WhatsApp webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
