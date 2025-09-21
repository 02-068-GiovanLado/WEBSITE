"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Users, Baby, UserCheck, AlertTriangle, Activity, Calendar, MessageSquare } from "lucide-react"
import { mockPatients, mockHealthAlerts } from "@/lib/mock-data"
import { calculateAge } from "@/lib/utils/health-calculations"
import Link from "next/link"

export default function HealthDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("week")

  // Calculate statistics
  const totalPatients = mockPatients.length
  const babyPatients = mockPatients.filter((p) => p.category === "baby").length
  const elderlyPatients = mockPatients.filter((p) => p.category === "elderly").length
  const activeAlerts = mockHealthAlerts.filter((alert) => !alert.resolved).length
  const criticalAlerts = mockHealthAlerts.filter((alert) => !alert.resolved && alert.severity === "high").length

  const recentAlerts = mockHealthAlerts
    .filter((alert) => !alert.resolved)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 text-balance">Sistem Monitoring Kesehatan Desa Tarahan</h1>
          <p className="text-lg text-gray-600 text-pretty">
            Dashboard pemantauan kesehatan bayi dan lansia Desa Sukamaju
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Pasien</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">{totalPatients}</div>
              <p className="text-xs text-gray-500">Terdaftar dalam sistem</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Bayi</CardTitle>
              <Baby className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">{babyPatients}</div>
              <p className="text-xs text-gray-500">Dalam pemantauan</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Lansia</CardTitle>
              <UserCheck className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700">{elderlyPatients}</div>
              <p className="text-xs text-gray-500">Dalam pemantauan</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-red-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Alert Aktif</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-700">{activeAlerts}</div>
              <p className="text-xs text-gray-500">{criticalAlerts} kritis</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Alerts */}
          <Card className="lg:col-span-2 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Peringatan Terbaru
              </CardTitle>
              <CardDescription>Kondisi yang memerlukan perhatian segera</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentAlerts.length > 0 ? (
                recentAlerts.map((alert) => {
                  const patient = mockPatients.find((p) => p.id === alert.patientId)
                  return (
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
                        <span>{patient?.name}</span>
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
                      <AlertDescription className="text-sm">
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
                  )
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Tidak ada peringatan aktif</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-gray-800">Aksi Cepat</CardTitle>
              <CardDescription>Navigasi ke fitur utama sistem</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/babies" className="block">
                <Button className="w-full justify-start bg-green-600 hover:bg-green-700 text-white">
                  <Baby className="mr-2 h-4 w-4" />
                  Monitoring Bayi
                </Button>
              </Link>

              <Link href="/elderly" className="block">
                <Button className="w-full justify-start bg-purple-600 hover:bg-purple-700 text-white">
                  <UserCheck className="mr-2 h-4 w-4" />
                  Monitoring Lansia
                </Button>
              </Link>

              <Link href="/input" className="block">
                <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Input Data WhatsApp
                </Button>
              </Link>

              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Jadwal Kunjungan
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Patient Overview */}
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-gray-800">Daftar Pasien</CardTitle>
            <CardDescription>Ringkasan pasien yang terdaftar dalam sistem</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">Semua</TabsTrigger>
                <TabsTrigger value="babies">Bayi</TabsTrigger>
                <TabsTrigger value="elderly">Lansia</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                <div className="grid gap-4">
                  {mockPatients.map((patient) => {
                    const age = calculateAge(patient.dateOfBirth)
                    return (
                      <div
                        key={patient.id}
                        className="flex items-center justify-between p-4 border rounded-lg bg-gray-50"
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                              patient.category === "baby" ? "bg-green-500" : "bg-purple-500"
                            }`}
                          >
                            {patient.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{patient.name}</h3>
                            <p className="text-sm text-gray-500">
                              {patient.category === "baby" ? `${age.months} bulan` : `${age.years} tahun`} •{" "}
                              {patient.address}
                            </p>
                          </div>
                        </div>
                        <Badge variant={patient.category === "baby" ? "default" : "secondary"}>
                          {patient.category === "baby" ? "Bayi" : "Lansia"}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              </TabsContent>

              <TabsContent value="babies">
                <div className="grid gap-4">
                  {mockPatients
                    .filter((p) => p.category === "baby")
                    .map((patient) => {
                      const age = calculateAge(patient.dateOfBirth)
                      return (
                        <div
                          key={patient.id}
                          className="flex items-center justify-between p-4 border rounded-lg bg-green-50"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">
                              {patient.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{patient.name}</h3>
                              <p className="text-sm text-gray-500">
                                {age.months} bulan • Wali: {patient.guardianName}
                              </p>
                            </div>
                          </div>
                          <Link href={`/babies/${patient.id}`}>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              Lihat Detail
                            </Button>
                          </Link>
                        </div>
                      )
                    })}
                </div>
              </TabsContent>

              <TabsContent value="elderly">
                <div className="grid gap-4">
                  {mockPatients
                    .filter((p) => p.category === "elderly")
                    .map((patient) => {
                      const age = calculateAge(patient.dateOfBirth)
                      return (
                        <div
                          key={patient.id}
                          className="flex items-center justify-between p-4 border rounded-lg bg-purple-50"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold">
                              {patient.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{patient.name}</h3>
                              <p className="text-sm text-gray-500">
                                {age.years} tahun • {patient.address}
                              </p>
                            </div>
                          </div>
                          <Link href={`/elderly/${patient.id}`}>
                            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                              Lihat Detail
                            </Button>
                          </Link>
                        </div>
                      )
                    })}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
