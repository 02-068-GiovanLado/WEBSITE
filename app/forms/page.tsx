"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserPlus, Baby, UserCheck, ArrowLeft, FileText } from "lucide-react"
import Link from "next/link"
import { BabyHealthForm } from "@/components/forms/baby-health-form"
import { ElderlyHealthForm } from "@/components/forms/elderly-health-form"
import { PatientRegistrationForm } from "@/components/forms/patient-registration-form"

export default function FormsPage() {
  const [activeTab, setActiveTab] = useState("baby-health")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
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
              <h1 className="text-3xl font-bold text-gray-900">Form Input Data</h1>
              <p className="text-gray-600">Input manual data kesehatan dan registrasi pasien</p>
            </div>
          </div>
        </div>

        {/* Forms */}
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <FileText className="h-5 w-5 text-blue-600" />
              Form Input Data Kesehatan
            </CardTitle>
            <CardDescription>Pilih jenis form sesuai dengan data yang akan diinput</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="baby-health" className="flex items-center gap-2">
                  <Baby className="h-4 w-4" />
                  Data Bayi
                </TabsTrigger>
                <TabsTrigger value="elderly-health" className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  Data Lansia
                </TabsTrigger>
                <TabsTrigger value="patient-registration" className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Registrasi Pasien
                </TabsTrigger>
              </TabsList>

              <TabsContent value="baby-health" className="space-y-4">
                <BabyHealthForm />
              </TabsContent>

              <TabsContent value="elderly-health" className="space-y-4">
                <ElderlyHealthForm />
              </TabsContent>

              <TabsContent value="patient-registration" className="space-y-4">
                <PatientRegistrationForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
