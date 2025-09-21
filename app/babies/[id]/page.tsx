"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Baby, Calendar, FileText } from "lucide-react"
import { mockPatients, mockBabyRecords } from "@/lib/mock-data"
import { calculateAge, calculateAgeInMonths, assessBabyGrowth } from "@/lib/utils/health-calculations"
import Link from "next/link"

export default function BabyDetailPage() {
  const params = useParams()
  const babyId = params.id as string

  const baby = mockPatients.find((p) => p.id === babyId && p.category === "baby")
  const babyRecords = mockBabyRecords.filter((r) => r.patientId === babyId)

  if (!baby) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="text-center py-12">
              <Baby className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Bayi Tidak Ditemukan</h3>
              <p className="text-gray-500 mb-4">Data bayi yang Anda cari tidak tersedia</p>
              <Link href="/babies">
                <Button>Kembali ke Daftar Bayi</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const age = calculateAge(baby.dateOfBirth)
  const ageInMonths = calculateAgeInMonths(baby.dateOfBirth)
  const latestRecord = babyRecords.sort(
    (a, b) => new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime(),
  )[0]
  const growthAssessment = latestRecord
    ? assessBabyGrowth(ageInMonths, latestRecord.weight, latestRecord.height, baby.gender)
    : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/babies">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{baby.name}</h1>
              <p className="text-gray-600">Detail monitoring pertumbuhan bayi</p>
            </div>
          </div>
        </div>

        {/* Baby Profile */}
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Baby className="h-5 w-5 text-green-600" />
              Profil Bayi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Informasi Dasar</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nama:</span>
                    <span className="font-medium">{baby.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Usia:</span>
                    <span className="font-medium">{ageInMonths} bulan</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Jenis Kelamin:</span>
                    <span className="font-medium">{baby.gender === "male" ? "Laki-laki" : "Perempuan"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tanggal Lahir:</span>
                    <span className="font-medium">{new Date(baby.dateOfBirth).toLocaleDateString("id-ID")}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Kontak Wali</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nama Wali:</span>
                    <span className="font-medium">{baby.guardianName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">No. Telepon:</span>
                    <span className="font-medium">{baby.guardianPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Alamat:</span>
                    <span className="font-medium text-right">{baby.address}</span>
                  </div>
                </div>
              </div>

              {latestRecord && (
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">Data Terakhir</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Berat Badan:</span>
                      <span className="font-medium">{latestRecord.weight} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tinggi Badan:</span>
                      <span className="font-medium">{latestRecord.height} cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lingkar Kepala:</span>
                      <span className="font-medium">{latestRecord.headCircumference} cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tanggal:</span>
                      <span className="font-medium">
                        {new Date(latestRecord.recordDate).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {growthAssessment && (
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">Status Pertumbuhan</h3>
                  <div className="space-y-2">
                    <Badge
                      variant={
                        growthAssessment.alert === "critical"
                          ? "destructive"
                          : growthAssessment.alert === "warning"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {growthAssessment.weightStatus === "underweight"
                        ? "Berat Badan Kurang"
                        : growthAssessment.weightStatus === "overweight"
                          ? "Berat Badan Lebih"
                          : "Berat Badan Normal"}
                    </Badge>
                    <Badge
                      variant={growthAssessment.heightStatus === "stunted" ? "destructive" : "secondary"}
                      className="block w-fit"
                    >
                      {growthAssessment.heightStatus === "stunted"
                        ? "Stunting"
                        : growthAssessment.heightStatus === "tall"
                          ? "Tinggi"
                          : "Tinggi Normal"}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Records History */}
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <FileText className="h-5 w-5 text-blue-600" />
              Riwayat Pemeriksaan
            </CardTitle>
            <CardDescription>Catatan pemeriksaan kesehatan dan pertumbuhan</CardDescription>
          </CardHeader>
          <CardContent>
            {babyRecords.length > 0 ? (
              <div className="space-y-4">
                {babyRecords
                  .sort((a, b) => new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime())
                  .map((record) => (
                    <div key={record.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900">
                          Pemeriksaan {new Date(record.recordDate).toLocaleDateString("id-ID")}
                        </h3>
                        <Badge variant="outline">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(record.recordDate).toLocaleDateString("id-ID")}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-3 bg-white rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{record.weight}</div>
                          <div className="text-sm text-gray-600">kg</div>
                          <div className="text-xs text-gray-500">Berat Badan</div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{record.height}</div>
                          <div className="text-sm text-gray-600">cm</div>
                          <div className="text-xs text-gray-500">Tinggi Badan</div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">{record.headCircumference}</div>
                          <div className="text-sm text-gray-600">cm</div>
                          <div className="text-xs text-gray-500">Lingkar Kepala</div>
                        </div>
                      </div>

                      {record.notes && (
                        <div className="bg-white p-3 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-1">Catatan:</h4>
                          <p className="text-sm text-gray-600">{record.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Belum ada riwayat pemeriksaan</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
