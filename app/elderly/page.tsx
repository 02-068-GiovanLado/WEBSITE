"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { UserCheck, Activity, Pill, AlertTriangle, ArrowLeft, Plus, TrendingUp } from "lucide-react"
import { mockPatients, mockElderlyRecords, mockHealthAlerts } from "@/lib/mock-data"
import { calculateAge, assessBloodPressure, assessBloodSugar } from "@/lib/utils/health-calculations"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import Link from "next/link"

export default function ElderlyPage() {
  const [selectedElderly, setSelectedElderly] = useState<string | null>(null)

  const elderlyPatients = mockPatients.filter((p) => p.category === "elderly")
  const selectedElderlyData = selectedElderly ? elderlyPatients.find((p) => p.id === selectedElderly) : null
  const selectedElderlyRecords = selectedElderly
    ? mockElderlyRecords.filter((r) => r.patientId === selectedElderly)
    : []
  const elderlyAlerts = selectedElderly
    ? mockHealthAlerts.filter((a) => a.patientId === selectedElderly && !a.resolved)
    : []

  // Generate mock vital signs trend data
  const generateVitalTrends = (patientId: string) => {
    const baseData = []
    const today = new Date()

    for (let i = 30; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      // Mock data with some variation
      const baseSystolic = 130 + Math.random() * 20
      const baseDiastolic = 80 + Math.random() * 15
      const baseBloodSugar = 140 + Math.random() * 40

      baseData.push({
        date: date.toISOString().split("T")[0],
        systolic: Math.round(baseSystolic),
        diastolic: Math.round(baseDiastolic),
        bloodSugar: Math.round(baseBloodSugar),
        weight: 55 + Math.random() * 5,
      })
    }

    return baseData
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
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
              <h1 className="text-3xl font-bold text-gray-900">Monitoring Lansia</h1>
              <p className="text-gray-600">Pemantauan kesehatan dan tanda vital lansia</p>
            </div>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Data
          </Button>
        </div>

        {/* Elderly Selection */}
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <UserCheck className="h-5 w-5 text-purple-600" />
              Daftar Lansia
            </CardTitle>
            <CardDescription>Pilih lansia untuk melihat detail kesehatan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {elderlyPatients.map((elderly) => {
                const age = calculateAge(elderly.dateOfBirth)
                const latestRecord = mockElderlyRecords
                  .filter((r) => r.patientId === elderly.id)
                  .sort((a, b) => new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime())[0]

                const bpAssessment = latestRecord
                  ? assessBloodPressure(latestRecord.bloodPressure.systolic, latestRecord.bloodPressure.diastolic)
                  : null

                const sugarAssessment = latestRecord?.bloodSugar ? assessBloodSugar(latestRecord.bloodSugar) : null

                const patientAlerts = mockHealthAlerts.filter((a) => a.patientId === elderly.id && !a.resolved)

                return (
                  <Card
                    key={elderly.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedElderly === elderly.id ? "ring-2 ring-purple-500 bg-purple-50" : "bg-white"
                    }`}
                    onClick={() => setSelectedElderly(elderly.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold">
                          {elderly.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{elderly.name}</h3>
                          <p className="text-sm text-gray-500">{age.years} tahun</p>
                          <p className="text-xs text-gray-400">{elderly.address}</p>
                        </div>
                      </div>

                      {/* Health Status Indicators */}
                      <div className="mt-3 space-y-2">
                        {latestRecord && (
                          <div className="flex gap-2 flex-wrap">
                            <Badge
                              variant={
                                bpAssessment?.alert === "critical"
                                  ? "destructive"
                                  : bpAssessment?.alert === "warning"
                                    ? "default"
                                    : "secondary"
                              }
                              className="text-xs"
                            >
                              TD: {latestRecord.bloodPressure.systolic}/{latestRecord.bloodPressure.diastolic}
                            </Badge>
                            {latestRecord.bloodSugar && (
                              <Badge
                                variant={
                                  sugarAssessment?.alert === "critical"
                                    ? "destructive"
                                    : sugarAssessment?.alert === "warning"
                                      ? "default"
                                      : "secondary"
                                }
                                className="text-xs"
                              >
                                GD: {latestRecord.bloodSugar}
                              </Badge>
                            )}
                          </div>
                        )}
                        {patientAlerts.length > 0 && (
                          <div className="flex items-center gap-1 text-red-600">
                            <AlertTriangle className="h-3 w-3" />
                            <span className="text-xs">{patientAlerts.length} peringatan aktif</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Elderly Details */}
        {selectedElderlyData && (
          <>
            {/* Health Alerts */}
            {elderlyAlerts.length > 0 && (
              <Card className="bg-white/90 backdrop-blur-sm border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="h-5 w-5" />
                    Peringatan Kesehatan
                  </CardTitle>
                  <CardDescription>Kondisi yang memerlukan perhatian segera</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {elderlyAlerts.map((alert) => (
                    <Alert
                      key={alert.id}
                      className={`border-l-4 ${
                        alert.severity === "high"
                          ? "border-l-red-500 bg-red-50"
                          : alert.severity === "medium"
                            ? "border-l-orange-500 bg-orange-50"
                            : "border-l-yellow-500 bg-yellow-50"
                      }`}
                    >
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle className="flex items-center justify-between">
                        <span>Peringatan Kesehatan</span>
                        <Badge
                          variant={
                            alert.severity === "high"
                              ? "destructive"
                              : alert.severity === "medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {alert.severity === "high" ? "Kritis" : alert.severity === "medium" ? "Sedang" : "Rendah"}
                        </Badge>
                      </AlertTitle>
                      <AlertDescription>
                        {alert.message}
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(alert.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Patient Info & Latest Vitals */}
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-gray-800">{selectedElderlyData.name}</CardTitle>
                  <CardDescription>Informasi dan tanda vital terkini</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Usia:</span>
                      <span className="text-sm font-medium">
                        {calculateAge(selectedElderlyData.dateOfBirth).years} tahun
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Jenis Kelamin:</span>
                      <span className="text-sm font-medium">
                        {selectedElderlyData.gender === "male" ? "Laki-laki" : "Perempuan"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Telepon:</span>
                      <span className="text-sm font-medium">{selectedElderlyData.phoneNumber}</span>
                    </div>
                  </div>

                  {selectedElderlyRecords.length > 0 && (
                    <>
                      <hr />
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-800">Tanda Vital Terakhir</h4>
                        {(() => {
                          const latest = selectedElderlyRecords[selectedElderlyRecords.length - 1]
                          const bpAssessment = assessBloodPressure(
                            latest.bloodPressure.systolic,
                            latest.bloodPressure.diastolic,
                          )
                          return (
                            <div className="space-y-3">
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600">Tekanan Darah:</span>
                                  <div className="text-right">
                                    <span className="text-sm font-medium">
                                      {latest.bloodPressure.systolic}/{latest.bloodPressure.diastolic} mmHg
                                    </span>
                                    <Badge
                                      variant={
                                        bpAssessment.alert === "critical"
                                          ? "destructive"
                                          : bpAssessment.alert === "warning"
                                            ? "default"
                                            : "secondary"
                                      }
                                      className="ml-2 text-xs"
                                    >
                                      {bpAssessment.category === "normal"
                                        ? "Normal"
                                        : bpAssessment.category === "elevated"
                                          ? "Tinggi"
                                          : bpAssessment.category === "high_stage1"
                                            ? "Hipertensi 1"
                                            : bpAssessment.category === "high_stage2"
                                              ? "Hipertensi 2"
                                              : "Krisis"}
                                    </Badge>
                                  </div>
                                </div>
                              </div>

                              {latest.bloodSugar && (
                                <div className="p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Gula Darah:</span>
                                    <div className="text-right">
                                      <span className="text-sm font-medium">{latest.bloodSugar} mg/dL</span>
                                      {(() => {
                                        const sugarAssessment = assessBloodSugar(latest.bloodSugar)
                                        return (
                                          <Badge
                                            variant={
                                              sugarAssessment.alert === "critical"
                                                ? "destructive"
                                                : sugarAssessment.alert === "warning"
                                                  ? "default"
                                                  : "secondary"
                                            }
                                            className="ml-2 text-xs"
                                          >
                                            {sugarAssessment.category === "normal"
                                              ? "Normal"
                                              : sugarAssessment.category === "prediabetes"
                                                ? "Prediabetes"
                                                : "Diabetes"}
                                          </Badge>
                                        )
                                      })()}
                                    </div>
                                  </div>
                                </div>
                              )}

                              <div className="p-3 bg-gray-50 rounded-lg">
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Berat Badan:</span>
                                  <span className="text-sm font-medium">{latest.weight} kg</span>
                                </div>
                              </div>

                              <div className="p-3 bg-gray-50 rounded-lg">
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Tanggal Periksa:</span>
                                  <span className="text-sm font-medium">
                                    {new Date(latest.recordDate).toLocaleDateString("id-ID")}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        })()}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Vital Signs Trends */}
              <Card className="lg:col-span-2 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Tren Tanda Vital
                  </CardTitle>
                  <CardDescription>Grafik perkembangan tanda vital 30 hari terakhir</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="blood-pressure" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="blood-pressure">Tekanan Darah</TabsTrigger>
                      <TabsTrigger value="blood-sugar">Gula Darah</TabsTrigger>
                      <TabsTrigger value="weight">Berat Badan</TabsTrigger>
                    </TabsList>

                    <TabsContent value="blood-pressure" className="space-y-4">
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={generateVitalTrends(selectedElderlyData.id)}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="date"
                              tickFormatter={(value) =>
                                new Date(value).toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit" })
                              }
                            />
                            <YAxis label={{ value: "mmHg", angle: -90, position: "insideLeft" }} />
                            <Tooltip
                              labelFormatter={(value) => new Date(value).toLocaleDateString("id-ID")}
                              formatter={(value: any, name: string) => [
                                `${value} mmHg`,
                                name === "systolic" ? "Sistolik" : "Diastolik",
                              ]}
                            />
                            <Line type="monotone" dataKey="systolic" stroke="#ef4444" strokeWidth={2} name="Sistolik" />
                            <Line
                              type="monotone"
                              dataKey="diastolic"
                              stroke="#3b82f6"
                              strokeWidth={2}
                              name="Diastolik"
                            />
                            {/* Reference lines for normal BP */}
                            <Line
                              type="monotone"
                              dataKey={() => 120}
                              stroke="#10b981"
                              strokeDasharray="5 5"
                              dot={false}
                              name="Normal Sistolik"
                            />
                            <Line
                              type="monotone"
                              dataKey={() => 80}
                              stroke="#10b981"
                              strokeDasharray="5 5"
                              dot={false}
                              name="Normal Diastolik"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </TabsContent>

                    <TabsContent value="blood-sugar" className="space-y-4">
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={generateVitalTrends(selectedElderlyData.id)}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="date"
                              tickFormatter={(value) =>
                                new Date(value).toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit" })
                              }
                            />
                            <YAxis label={{ value: "mg/dL", angle: -90, position: "insideLeft" }} />
                            <Tooltip
                              labelFormatter={(value) => new Date(value).toLocaleDateString("id-ID")}
                              formatter={(value: any) => [`${value} mg/dL`, "Gula Darah"]}
                            />
                            <Area
                              type="monotone"
                              dataKey="bloodSugar"
                              stroke="#8b5cf6"
                              fill="#8b5cf6"
                              fillOpacity={0.3}
                            />
                            {/* Reference line for normal blood sugar */}
                            <Line
                              type="monotone"
                              dataKey={() => 140}
                              stroke="#10b981"
                              strokeDasharray="5 5"
                              dot={false}
                              name="Batas Normal"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </TabsContent>

                    <TabsContent value="weight" className="space-y-4">
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={generateVitalTrends(selectedElderlyData.id)}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="date"
                              tickFormatter={(value) =>
                                new Date(value).toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit" })
                              }
                            />
                            <YAxis label={{ value: "kg", angle: -90, position: "insideLeft" }} />
                            <Tooltip
                              labelFormatter={(value) => new Date(value).toLocaleDateString("id-ID")}
                              formatter={(value: any) => [`${value.toFixed(1)} kg`, "Berat Badan"]}
                            />
                            <Line
                              type="monotone"
                              dataKey="weight"
                              stroke="#f59e0b"
                              strokeWidth={2}
                              name="Berat Badan"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Medications & Symptoms */}
            {selectedElderlyRecords.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Current Medications */}
                <Card className="bg-white/90 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <Pill className="h-5 w-5 text-green-600" />
                      Obat-obatan Aktif
                    </CardTitle>
                    <CardDescription>Daftar obat yang sedang dikonsumsi</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedElderlyRecords[0]?.medications
                        .filter((med) => med.active)
                        .map((medication) => (
                          <div key={medication.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <h4 className="font-medium text-gray-900">{medication.name}</h4>
                              <p className="text-sm text-gray-500">
                                {medication.dosage} • {medication.frequency}
                              </p>
                              <p className="text-xs text-gray-400">
                                Mulai: {new Date(medication.startDate).toLocaleDateString("id-ID")}
                              </p>
                            </div>
                            <Badge variant="default">Aktif</Badge>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Symptoms */}
                <Card className="bg-white/90 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <Activity className="h-5 w-5 text-orange-600" />
                      Gejala Terbaru
                    </CardTitle>
                    <CardDescription>Keluhan dan gejala yang dilaporkan</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedElderlyRecords[0]?.symptoms.map((symptom, index) => (
                        <div key={index} className="p-3 border rounded-lg bg-orange-50">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span className="text-sm font-medium text-gray-900">{symptom}</span>
                          </div>
                        </div>
                      ))}
                      {selectedElderlyRecords[0]?.notes && (
                        <div className="p-3 border rounded-lg bg-blue-50">
                          <h4 className="font-medium text-gray-900 mb-1">Catatan Tambahan:</h4>
                          <p className="text-sm text-gray-600">{selectedElderlyRecords[0].notes}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}

        {/* No Elderly Selected State */}
        {!selectedElderly && (
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="text-center py-12">
              <UserCheck className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Pilih Lansia untuk Monitoring</h3>
              <p className="text-gray-500">Klik pada salah satu kartu lansia di atas untuk melihat detail kesehatan</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
