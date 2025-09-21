"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Baby, TrendingUp, Syringe, Target, ArrowLeft, Plus } from "lucide-react"
import { mockPatients, mockBabyRecords } from "@/lib/mock-data"
import { calculateAge, calculateAgeInMonths, assessBabyGrowth } from "@/lib/utils/health-calculations"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import Link from "next/link"

export default function BabiesPage() {
  const [selectedBaby, setSelectedBaby] = useState<string | null>(null)

  const babyPatients = mockPatients.filter((p) => p.category === "baby")
  const selectedBabyData = selectedBaby ? babyPatients.find((p) => p.id === selectedBaby) : null
  const selectedBabyRecords = selectedBaby ? mockBabyRecords.filter((r) => r.patientId === selectedBaby) : []

  // Generate growth chart data (mock WHO standards)
  const generateGrowthChartData = (gender: "male" | "female") => {
    const data = []
    for (let month = 0; month <= 24; month++) {
      const baseWeight = gender === "male" ? 3.3 : 3.2
      const weightGrowth = gender === "male" ? 0.6 : 0.55
      const expectedWeight = baseWeight + month * weightGrowth

      const baseHeight = gender === "male" ? 50 : 49.5
      const heightGrowth = gender === "male" ? 2.5 : 2.4
      const expectedHeight = baseHeight + month * heightGrowth

      data.push({
        age: month,
        expectedWeight: expectedWeight,
        expectedHeight: expectedHeight,
        // Add some variance for realistic curves
        p10Weight: expectedWeight * 0.85,
        p90Weight: expectedWeight * 1.15,
        p10Height: expectedHeight * 0.92,
        p90Height: expectedHeight * 1.08,
      })
    }
    return data
  }

  const getActualGrowthData = (babyId: string) => {
    const records = mockBabyRecords.filter((r) => r.patientId === babyId)
    const baby = babyPatients.find((p) => p.id === babyId)
    if (!baby) return []

    return records.map((record) => {
      const ageInMonths = calculateAgeInMonths(baby.dateOfBirth)
      return {
        age: ageInMonths,
        actualWeight: record.weight,
        actualHeight: record.height,
        date: record.recordDate,
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
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
              <h1 className="text-3xl font-bold text-gray-900">Monitoring Bayi</h1>
              <p className="text-gray-600">Pemantauan pertumbuhan dan perkembangan bayi</p>
            </div>
          </div>
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Data
          </Button>
        </div>

        {/* Baby Selection */}
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Baby className="h-5 w-5 text-green-600" />
              Daftar Bayi
            </CardTitle>
            <CardDescription>Pilih bayi untuk melihat detail pertumbuhan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {babyPatients.map((baby) => {
                const age = calculateAge(baby.dateOfBirth)
                const ageInMonths = calculateAgeInMonths(baby.dateOfBirth)
                const latestRecord = mockBabyRecords
                  .filter((r) => r.patientId === baby.id)
                  .sort((a, b) => new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime())[0]

                const growthAssessment = latestRecord
                  ? assessBabyGrowth(ageInMonths, latestRecord.weight, latestRecord.height, baby.gender)
                  : null

                return (
                  <Card
                    key={baby.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedBaby === baby.id ? "ring-2 ring-green-500 bg-green-50" : "bg-white"
                    }`}
                    onClick={() => setSelectedBaby(baby.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">
                          {baby.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{baby.name}</h3>
                          <p className="text-sm text-gray-500">{ageInMonths} bulan</p>
                          <p className="text-xs text-gray-400">Wali: {baby.guardianName}</p>
                        </div>
                      </div>
                      {growthAssessment && (
                        <div className="mt-3 flex gap-2">
                          <Badge
                            variant={
                              growthAssessment.alert === "critical"
                                ? "destructive"
                                : growthAssessment.alert === "warning"
                                  ? "default"
                                  : "secondary"
                            }
                            className="text-xs"
                          >
                            {growthAssessment.weightStatus === "underweight"
                              ? "Kurang BB"
                              : growthAssessment.weightStatus === "overweight"
                                ? "Lebih BB"
                                : "BB Normal"}
                          </Badge>
                          {growthAssessment.heightStatus === "stunted" && (
                            <Badge variant="destructive" className="text-xs">
                              Stunting
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Baby Details */}
        {selectedBabyData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Baby Info & Latest Stats */}
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-gray-800">{selectedBabyData.name}</CardTitle>
                <CardDescription>Informasi dan status terkini</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Usia:</span>
                    <span className="text-sm font-medium">
                      {calculateAgeInMonths(selectedBabyData.dateOfBirth)} bulan
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Jenis Kelamin:</span>
                    <span className="text-sm font-medium">
                      {selectedBabyData.gender === "male" ? "Laki-laki" : "Perempuan"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Wali:</span>
                    <span className="text-sm font-medium">{selectedBabyData.guardianName}</span>
                  </div>
                </div>

                {selectedBabyRecords.length > 0 && (
                  <>
                    <hr />
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-800">Data Terakhir</h4>
                      {(() => {
                        const latest = selectedBabyRecords[selectedBabyRecords.length - 1]
                        return (
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Berat Badan:</span>
                              <span className="text-sm font-medium">{latest.weight} kg</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Tinggi Badan:</span>
                              <span className="text-sm font-medium">{latest.height} cm</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Lingkar Kepala:</span>
                              <span className="text-sm font-medium">{latest.headCircumference} cm</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Tanggal:</span>
                              <span className="text-sm font-medium">
                                {new Date(latest.recordDate).toLocaleDateString("id-ID")}
                              </span>
                            </div>
                          </div>
                        )
                      })()}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Growth Charts */}
            <Card className="lg:col-span-2 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Kurva Pertumbuhan
                </CardTitle>
                <CardDescription>Grafik pertumbuhan berdasarkan standar WHO</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="weight" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="weight">Berat Badan</TabsTrigger>
                    <TabsTrigger value="height">Tinggi Badan</TabsTrigger>
                  </TabsList>

                  <TabsContent value="weight" className="space-y-4">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={generateGrowthChartData(selectedBabyData.gender)}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="age"
                            label={{ value: "Usia (bulan)", position: "insideBottom", offset: -5 }}
                          />
                          <YAxis label={{ value: "Berat (kg)", angle: -90, position: "insideLeft" }} />
                          <Tooltip
                            formatter={(value: any, name: string) => [
                              `${value.toFixed(1)} kg`,
                              name === "expectedWeight"
                                ? "Standar WHO"
                                : name === "actualWeight"
                                  ? "Data Aktual"
                                  : name,
                            ]}
                          />
                          <Line
                            type="monotone"
                            dataKey="p10Weight"
                            stroke="#fbbf24"
                            strokeDasharray="5 5"
                            dot={false}
                            name="P10"
                          />
                          <Line
                            type="monotone"
                            dataKey="expectedWeight"
                            stroke="#10b981"
                            strokeWidth={2}
                            dot={false}
                            name="Median"
                          />
                          <Line
                            type="monotone"
                            dataKey="p90Weight"
                            stroke="#fbbf24"
                            strokeDasharray="5 5"
                            dot={false}
                            name="P90"
                          />
                          {getActualGrowthData(selectedBabyData.id).map((point, index) => (
                            <ReferenceLine key={index} x={point.age} stroke="#ef4444" strokeWidth={2} />
                          ))}
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>

                  <TabsContent value="height" className="space-y-4">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={generateGrowthChartData(selectedBabyData.gender)}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="age"
                            label={{ value: "Usia (bulan)", position: "insideBottom", offset: -5 }}
                          />
                          <YAxis label={{ value: "Tinggi (cm)", angle: -90, position: "insideLeft" }} />
                          <Tooltip
                            formatter={(value: any, name: string) => [
                              `${value.toFixed(1)} cm`,
                              name === "expectedHeight"
                                ? "Standar WHO"
                                : name === "actualHeight"
                                  ? "Data Aktual"
                                  : name,
                            ]}
                          />
                          <Line
                            type="monotone"
                            dataKey="p10Height"
                            stroke="#fbbf24"
                            strokeDasharray="5 5"
                            dot={false}
                            name="P10"
                          />
                          <Line
                            type="monotone"
                            dataKey="expectedHeight"
                            stroke="#10b981"
                            strokeWidth={2}
                            dot={false}
                            name="Median"
                          />
                          <Line
                            type="monotone"
                            dataKey="p90Height"
                            stroke="#fbbf24"
                            strokeDasharray="5 5"
                            dot={false}
                            name="P90"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Immunizations & Milestones */}
        {selectedBabyData && selectedBabyRecords.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Immunizations */}
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Syringe className="h-5 w-5 text-blue-600" />
                  Status Imunisasi
                </CardTitle>
                <CardDescription>Riwayat dan jadwal imunisasi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedBabyRecords[0]?.immunizations.map((immunization) => (
                    <div key={immunization.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{immunization.name}</h4>
                        <p className="text-sm text-gray-500">
                          {immunization.completed
                            ? `Diberikan: ${new Date(immunization.dateGiven).toLocaleDateString("id-ID")}`
                            : "Belum diberikan"}
                        </p>
                        {immunization.nextDue && (
                          <p className="text-xs text-orange-600">
                            Jadwal berikutnya: {new Date(immunization.nextDue).toLocaleDateString("id-ID")}
                          </p>
                        )}
                      </div>
                      <Badge variant={immunization.completed ? "default" : "destructive"}>
                        {immunization.completed ? "Selesai" : "Pending"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Milestones */}
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Target className="h-5 w-5 text-purple-600" />
                  Milestone Perkembangan
                </CardTitle>
                <CardDescription>Pencapaian tahap perkembangan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedBabyRecords[0]?.milestones.map((milestone) => (
                    <div key={milestone.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{milestone.name}</h4>
                        <p className="text-sm text-gray-500">Target: {milestone.expectedAge} bulan</p>
                        {milestone.achieved && milestone.achievedDate && (
                          <p className="text-xs text-green-600">
                            Tercapai: {new Date(milestone.achievedDate).toLocaleDateString("id-ID")}
                          </p>
                        )}
                      </div>
                      <Badge variant={milestone.achieved ? "default" : "secondary"}>
                        {milestone.achieved ? "Tercapai" : "Belum"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* No Baby Selected State */}
        {!selectedBaby && (
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="text-center py-12">
              <Baby className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Pilih Bayi untuk Monitoring</h3>
              <p className="text-gray-500">Klik pada salah satu kartu bayi di atas untuk melihat detail pertumbuhan</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
