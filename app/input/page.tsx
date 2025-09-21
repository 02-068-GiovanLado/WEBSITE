"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Send, Users, ArrowLeft, Smartphone, MessageCircle } from "lucide-react"
import { mockPatients } from "@/lib/mock-data"
import Link from "next/link"

export default function WhatsAppInputPage() {
  const [broadcastMessage, setBroadcastMessage] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<"all" | "baby" | "elderly">("all")
  const [isSending, setIsSending] = useState(false)
  const [sendResult, setSendResult] = useState<any>(null)

  const handleBroadcast = async () => {
    if (!broadcastMessage.trim()) return

    setIsSending(true)
    setSendResult(null)

    try {
      const response = await fetch("/api/whatsapp/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: broadcastMessage,
          category: selectedCategory === "all" ? null : selectedCategory,
        }),
      })

      const result = await response.json()
      setSendResult(result)
      setBroadcastMessage("")
    } catch (error) {
      console.error("Error sending broadcast:", error)
      setSendResult({
        success: false,
        error: "Failed to send messages",
      })
    } finally {
      setIsSending(false)
    }
  }

  const babyCount = mockPatients.filter((p) => p.category === "baby").length
  const elderlyCount = mockPatients.filter((p) => p.category === "elderly").length
  const totalCount = mockPatients.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Integrasi WhatsApp</h1>
              <p className="text-gray-600">Kelola input data dan komunikasi melalui WhatsApp</p>
            </div>
          </div>
        </div>

        {/* WhatsApp Integration Info */}
        <Card className="bg-white/90 backdrop-blur-sm border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Smartphone className="h-5 w-5 text-green-600" />
              Status Integrasi WhatsApp
            </CardTitle>
            <CardDescription>Informasi koneksi dan penggunaan WhatsApp Business API</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">Aktif</div>
                <div className="text-sm text-gray-600">Status Koneksi</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">24/7</div>
                <div className="text-sm text-gray-600">Monitoring</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">Auto</div>
                <div className="text-sm text-gray-600">Processing</div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Format Pesan untuk Input Data:</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div>
                  <strong>Bayi:</strong> "Nama: [Nama], Berat: [angka] kg, Tinggi: [angka] cm, Lingkar Kepala: [angka]
                  cm"
                </div>
                <div>
                  <strong>Lansia:</strong> "Nama: [Nama], Tekanan Darah: [sistolik]/[diastolik], Gula Darah: [angka]"
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Broadcast Messages */}
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                Kirim Pesan Broadcast
              </CardTitle>
              <CardDescription>Kirim pesan ke semua atau kategori tertentu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Category Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Target Penerima:</label>
                <Tabs value={selectedCategory} onValueChange={(value: any) => setSelectedCategory(value)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">Semua ({totalCount})</TabsTrigger>
                    <TabsTrigger value="baby">Bayi ({babyCount})</TabsTrigger>
                    <TabsTrigger value="elderly">Lansia ({elderlyCount})</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Message Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Pesan:</label>
                <Textarea
                  placeholder="Tulis pesan yang akan dikirim..."
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <div className="text-xs text-gray-500">{broadcastMessage.length}/1000 karakter</div>
              </div>

              {/* Send Button */}
              <Button
                onClick={handleBroadcast}
                disabled={!broadcastMessage.trim() || isSending}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Send className="h-4 w-4 mr-2" />
                {isSending ? "Mengirim..." : "Kirim Pesan"}
              </Button>

              {/* Send Result */}
              {sendResult && (
                <div
                  className={`p-3 rounded-lg ${sendResult.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
                >
                  {sendResult.success ? (
                    <div className="text-green-800">
                      <div className="font-medium">✅ Pesan berhasil dikirim!</div>
                      <div className="text-sm">
                        Terkirim: {sendResult.totalSent} | Gagal: {sendResult.totalFailed}
                      </div>
                    </div>
                  ) : (
                    <div className="text-red-800">
                      <div className="font-medium">❌ Gagal mengirim pesan</div>
                      <div className="text-sm">{sendResult.error}</div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Messages */}
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <MessageSquare className="h-5 w-5 text-purple-600" />
                Pesan Masuk Terbaru
              </CardTitle>
              <CardDescription>Data kesehatan yang diterima via WhatsApp</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Mock recent messages */}
                <div className="border rounded-lg p-3 bg-green-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">+62812345678</span>
                    <Badge variant="default" className="text-xs">
                      Bayi
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    "Nama: Sari Dewi, Berat: 8.5 kg, Tinggi: 65 cm, Lingkar Kepala: 42 cm"
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>15 Jan 2024, 10:30</span>
                    <Badge variant="secondary" className="text-xs">
                      Diproses
                    </Badge>
                  </div>
                </div>

                <div className="border rounded-lg p-3 bg-purple-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">+62812345680</span>
                    <Badge variant="default" className="text-xs">
                      Lansia
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    "Nama: Nenek Siti, Tekanan Darah: 140/90, Gula Darah: 180"
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>12 Jan 2024, 14:20</span>
                    <Badge variant="destructive" className="text-xs">
                      Peringatan
                    </Badge>
                  </div>
                </div>

                <div className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">+62812345679</span>
                    <Badge variant="outline" className="text-xs">
                      Unknown
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">"Halo, bagaimana cara input data?"</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>10 Jan 2024, 09:15</span>
                    <Badge variant="secondary" className="text-xs">
                      Help Sent
                    </Badge>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-4 bg-transparent">
                <MessageSquare className="h-4 w-4 mr-2" />
                Lihat Semua Pesan
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Templates */}
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Users className="h-5 w-5 text-orange-600" />
              Template Pesan Cepat
            </CardTitle>
            <CardDescription>Template pesan yang sering digunakan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() =>
                  setBroadcastMessage(
                    "🏥 Pengingat: Jangan lupa kirim data kesehatan hari ini. Format: Nama: [nama], Berat: [angka] kg, Tinggi: [angka] cm",
                  )
                }
              >
                <h4 className="font-medium text-gray-900 mb-2">Pengingat Input Data</h4>
                <p className="text-sm text-gray-600">Mengingatkan untuk mengirim data kesehatan</p>
              </div>

              <div
                className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() =>
                  setBroadcastMessage(
                    "📅 Jadwal Posyandu bulan ini: Setiap Selasa minggu ke-2 dan ke-4. Lokasi: Balai Desa Sukamaju. Jangan lupa hadir!",
                  )
                }
              >
                <h4 className="font-medium text-gray-900 mb-2">Jadwal Posyandu</h4>
                <p className="text-sm text-gray-600">Informasi jadwal kegiatan posyandu</p>
              </div>

              <div
                className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() =>
                  setBroadcastMessage(
                    "⚠️ PERINGATAN KESEHATAN: Terdapat kasus demam berdarah di area sekitar. Pastikan lingkungan bebas genangan air dan segera konsultasi jika ada gejala demam.",
                  )
                }
              >
                <h4 className="font-medium text-gray-900 mb-2">Peringatan Kesehatan</h4>
                <p className="text-sm text-gray-600">Alert untuk kondisi kesehatan mendesak</p>
              </div>

              <div
                className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() =>
                  setBroadcastMessage(
                    "💉 Jadwal Imunisasi: Bayi usia 2-4 bulan wajib imunisasi DPT. Hubungi bidan desa untuk jadwal. Gratis untuk semua warga.",
                  )
                }
              >
                <h4 className="font-medium text-gray-900 mb-2">Jadwal Imunisasi</h4>
                <p className="text-sm text-gray-600">Informasi jadwal imunisasi bayi</p>
              </div>

              <div
                className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() =>
                  setBroadcastMessage(
                    "🩺 Pemeriksaan Kesehatan Gratis: Setiap Jumat pagi di Puskesmas. Khusus lansia usia 60+ tahun. Daftar melalui WhatsApp ini.",
                  )
                }
              >
                <h4 className="font-medium text-gray-900 mb-2">Pemeriksaan Gratis</h4>
                <p className="text-sm text-gray-600">Info layanan kesehatan gratis</p>
              </div>

              <div
                className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() =>
                  setBroadcastMessage(
                    "📊 Terima kasih telah mengirim data kesehatan. Data Anda telah tersimpan dan akan dipantau oleh tim kesehatan desa.",
                  )
                }
              >
                <h4 className="font-medium text-gray-900 mb-2">Konfirmasi Data</h4>
                <p className="text-sm text-gray-600">Konfirmasi penerimaan data</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
