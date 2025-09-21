"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, UserCheck, Calendar, FileText, Heart, Pill } from "lucide-react"
import { mockPatients, mockElderlyRecords } from "@/lib/mock-data"
import { calculateAge, assessBloodPressure, assessBloodSugar } from "@/lib/utils/health-calculations"
import Link from "next/link"

export default function ElderlyDetailPage() {
  const params = useParams()
  const elderlyId = params.id as string

  const elderly = mockPatients.find((p) => p.id === elderlyId && p.category === "elderly")
  const elderlyRecords = mockElderlyRecords.filter((r) => r.patientId === elderlyId)

  if (!elderly) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="text-center py-12">
              <UserCheck className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Lansia Tidak Ditemukan</h3>
              <p className="text-gray-500 mb-4">Data lansia yang Anda cari tidak tersedia</p>
              <Link href="/elderly">
                <Button>Kembali ke Daftar Lansia</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const age = calculateAge(elderly.dateOfBirth)
  const latestRecord = elderlyRecords.sort(
    (a, b) => new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime(),
  )[0]

  const bpAssessment = latestRecord
    ? assessBloodPressure(latestRecord.bloodPressure.systolic, latestRecord.bloodPressure.diastolic)
    : null

  const sugarAssessment = latestRecord?.bloodSugar ? assessBloodSugar(latestRecord.bloodSugar) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/elderly">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{elderly.name}</h1>
              <p className="text-gray-600">Detail monitoring kesehatan lansia</p>
            </div>
          </div>
        </div>

        {/* Elderly Profile */}
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <UserCheck className="h-5 w-5 text-purple-600" />
              Profil Lansia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Informasi Dasar</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nama:</span>
                    <span className="font-medium">{elderly.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Usia:</span>
                    <span className="font-medium">{age.years} tahun</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Jenis Kelamin:</span>
                    <span className="font-medium">{elderly.gender === "male" ? "Laki-laki" : "Perempuan"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tanggal Lahir:</span>
                    <span className="font-medium">{new Date(elderly.dateOfBirth).toLocaleDateString("id-ID")}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Kontak</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">No. Telepon:</span>
                    <span className="font-medium">{elderly.phoneNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Alamat:</span>
                    <span className="font-medium text-right">{elderly.address}</span>
                  </div>
                </div>
              </div>

              {latestRecord && (
                <>
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-900">Tanda Vital Terakhir</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tekanan Darah:</span>
                        <span className="font-medium">
                          {latestRecord.bloodPressure.systolic}/{latestRecord.bloodPressure.diastolic} mmHg
                        </span>
                      </div>
                      {latestRecord.bloodSugar && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Gula Darah:</span>
                          <span className="font-medium">{latestRecord.bloodSugar} mg/dL</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Berat Badan:</span>
                        <span className="font-medium">{latestRecord.weight} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tanggal:</span>
                        <span className="font-medium">
                          {new Date(latestRecord.recordDate).toLocaleDateString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-900">Status Kesehatan</h3>
                    <div className="space-y-2">
                      {bpAssessment && (
                        <Badge
                          variant={
                            bpAssessment.alert === "critical"
                              ? "destructive"
                              : bpAssessment.alert === "warning"
                                ? "default"
                                : "secondary"
                          }
                        >
                          TD:{" "}
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
                      )}
                      {sugarAssessment && (
                        <Badge
                          variant={
                            sugarAssessment.alert === "critical"
                              ? "destructive"
                              : sugarAssessment.alert === "warning"
                                ? "default"
                                : "secondary"
                          }
                          className="block w-fit"
                        >
                          GD:{" "}
                          {sugarAssessment.category === "normal"
                            ? "Normal"
                            : sugarAssessment.category === "prediabetes"
                              ? "Prediabetes"
                              : "Diabetes"}
                        </Badge>
                      )}
                      <Badge
                        variant={
                          latestRecord.alertLevel === "critical"
                            ? "destructive"
                            : latestRecord.alertLevel === "warning"
                              ? "default"
                              : "secondary"
                        }
                        className="block w-fit"
                      >
                        Status:{" "}
                        {latestRecord.alertLevel === "normal"
                          ? "Normal"
                          : latestRecord.alertLevel === "warning"
                            ? "Perhatian"
                            : "Kritis"}
                      </Badge>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Health Records History */}
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <FileText className="h-5 w-5 text-blue-600" />
              Riwayat Pemeriksaan
            </CardTitle>
            <CardDescription>Catatan pemeriksaan kesehatan dan tanda vital</CardDescription>
          </CardHeader>
          <CardContent>
            {elderlyRecords.length > 0 ? (
              <div className="space-y-6">
                {elderlyRecords
                  .sort((a, b) => new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime())
                  .map((record) => {
                    const bpAssess = assessBloodPressure(record.bloodPressure.systolic, record.bloodPressure.diastolic)
                    const sugarAssess = record.bloodSugar ? assessBloodSugar(record.bloodSugar) : null

                    return (
                      <div key={record.id} className="border rounded-lg p-6 bg-gray-50">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-medium text-gray-900">
                            Pemeriksaan {new Date(record.recordDate).toLocaleDateString("id-ID")}
                          </h3>
                          <Badge variant="outline">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(record.recordDate).toLocaleDateString("id-ID")}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="text-center p-4 bg-white rounded-lg">
                            <Heart className="h-6 w-6 mx-auto mb-2 text-red-500" />
                            <div className="text-xl font-bold text-red-600">
                              {record.bloodPressure.systolic}/{record.bloodPressure.diastolic}
                            </div>
                            <div className="text-sm text-gray-600">mmHg</div>
                            <div className="text-xs text-gray-500">Tekanan Darah</div>
                            <Badge
                              variant={
                                bpAssess.alert === "critical"
                                  ? "destructive"
                                  : bpAssess.alert === "warning"
                                    ? "default"
                                    : "secondary"
                              }
                              className="mt-1 text-xs"
                            >
                              {bpAssess.category === "normal" ? "Normal" : "Tinggi"}
                            </Badge>
                          </div>

                          {record.bloodSugar && (
                            <div className="text-center p-4 bg-white rounded-lg">
                              <div className="text-xl font-bold text-purple-600">{record.bloodSugar}</div>
                              <div className="text-sm text-gray-600">mg/dL</div>
                              <div className="text-xs text-gray-500">Gula Darah</div>
                              {sugarAssess && (
                                <Badge
                                  variant={
                                    sugarAssess.alert === "critical"
                                      ? "destructive"
                                      : sugarAssess.alert === "warning"
                                        ? "default"
                                        : "secondary"
                                  }
                                  className="mt-1 text-xs"
                                >
                                  {sugarAssess.category === "normal" ? "Normal" : "Tinggi"}
                                </Badge>
                              )}
                            </div>
                          )}

                          <div className="text-center p-4 bg-white rounded-lg">
                            <div className="text-xl font-bold text-blue-600">{record.weight}</div>
                            <div className="text-sm text-gray-600">kg</div>
                            <div className="text-xs text-gray-500">Berat Badan</div>
                          </div>
                        </div>

                        {/* Medications */}
                        {record.medications.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                              <Pill className="h-4 w-4 text-green-600" />
                              Obat-obatan
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {record.medications.map((med) => (
                                <div key={med.id} className="p-2 bg-white rounded text-sm">
                                  <span className="font-medium">{med.name}</span> - {med.dosage}, {med.frequency}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Symptoms */}
                        {record.symptoms.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">Gejala yang Dilaporkan</h4>
                            <div className="flex flex-wrap gap-2">
                              {record.symptoms.map((symptom, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {symptom}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Notes */}
                        {record.notes && (
                          <div className="bg-white p-3 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-1">Catatan:</h4>
                            <p className="text-sm text-gray-600">{record.notes}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
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
