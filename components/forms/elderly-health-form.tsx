"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Save, AlertCircle, X } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { elderlyHealthSchema, type ElderlyHealthFormData } from "@/lib/validation/health-schemas"
import { mockPatients } from "@/lib/mock-data"
import { calculateAge, assessBloodPressure, assessBloodSugar } from "@/lib/utils/health-calculations"

const COMMON_SYMPTOMS = [
  "Pusing",
  "Sakit kepala",
  "Mual",
  "Muntah",
  "Sesak napas",
  "Nyeri dada",
  "Kelelahan",
  "Demam",
  "Batuk",
  "Pilek",
  "Nyeri sendi",
  "Sulit tidur",
]

export function ElderlyHealthForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null)
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])

  const elderlyPatients = mockPatients.filter((p) => p.category === "elderly")

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ElderlyHealthFormData>({
    resolver: zodResolver(elderlyHealthSchema),
    defaultValues: {
      recordDate: new Date(),
      healthWorkerId: "current-user", // In real app, get from auth context
      symptoms: [],
    },
  })

  const selectedPatientId = watch("patientId")
  const selectedPatient = elderlyPatients.find((p) => p.id === selectedPatientId)
  const systolic = watch("bloodPressure.systolic")
  const diastolic = watch("bloodPressure.diastolic")
  const bloodSugar = watch("bloodSugar")

  // Calculate health assessments
  const bpAssessment = systolic && diastolic ? assessBloodPressure(systolic, diastolic) : null
  const sugarAssessment = bloodSugar ? assessBloodSugar(bloodSugar) : null

  const addSymptom = (symptom: string) => {
    if (!selectedSymptoms.includes(symptom)) {
      const newSymptoms = [...selectedSymptoms, symptom]
      setSelectedSymptoms(newSymptoms)
      setValue("symptoms", newSymptoms)
    }
  }

  const removeSymptom = (symptom: string) => {
    const newSymptoms = selectedSymptoms.filter((s) => s !== symptom)
    setSelectedSymptoms(newSymptoms)
    setValue("symptoms", newSymptoms)
  }

  const onSubmit = async (data: ElderlyHealthFormData) => {
    setIsSubmitting(true)
    setSubmitResult(null)

    try {
      // In real app, send to API endpoint
      console.log("Elderly health data:", data)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSubmitResult({
        success: true,
        message: "Data kesehatan lansia berhasil disimpan!",
      })
      reset()
      setSelectedSymptoms([])
    } catch (error) {
      setSubmitResult({
        success: false,
        message: "Gagal menyimpan data. Silakan coba lagi.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Patient Selection */}
      <div className="space-y-2">
        <Label htmlFor="patientId">Pilih Lansia *</Label>
        <Select onValueChange={(value) => setValue("patientId", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih lansia yang akan diperiksa" />
          </SelectTrigger>
          <SelectContent>
            {elderlyPatients.map((elderly) => {
              const age = calculateAge(elderly.dateOfBirth)
              return (
                <SelectItem key={elderly.id} value={elderly.id}>
                  {elderly.name} ({age.years} tahun) - {elderly.address}
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
        {errors.patientId && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors.patientId.message}
          </p>
        )}
      </div>

      {/* Patient Info Display */}
      {selectedPatient && (
        <Card className="bg-purple-50 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Informasi Pasien</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Nama:</span>
                <span className="ml-2 font-medium">{selectedPatient.name}</span>
              </div>
              <div>
                <span className="text-gray-600">Usia:</span>
                <span className="ml-2 font-medium">{calculateAge(selectedPatient.dateOfBirth).years} tahun</span>
              </div>
              <div>
                <span className="text-gray-600">Jenis Kelamin:</span>
                <span className="ml-2 font-medium">
                  {selectedPatient.gender === "male" ? "Laki-laki" : "Perempuan"}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Telepon:</span>
                <span className="ml-2 font-medium">{selectedPatient.phoneNumber}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Record Date */}
      <div className="space-y-2">
        <Label>Tanggal Pemeriksaan *</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !watch("recordDate") && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {watch("recordDate") ? format(watch("recordDate"), "PPP", { locale: id }) : <span>Pilih tanggal</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={watch("recordDate")}
              onSelect={(date) => setValue("recordDate", date || new Date())}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.recordDate && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors.recordDate.message}
          </p>
        )}
      </div>

      {/* Vital Signs */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Tanda Vital</h3>

        {/* Blood Pressure */}
        <div className="space-y-2">
          <Label>Tekanan Darah (mmHg) *</Label>
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              placeholder="120"
              {...register("bloodPressure.systolic", { valueAsNumber: true })}
              className="w-24"
            />
            <span className="text-gray-500">/</span>
            <Input
              type="number"
              placeholder="80"
              {...register("bloodPressure.diastolic", { valueAsNumber: true })}
              className="w-24"
            />
            <span className="text-sm text-gray-500">mmHg</span>
          </div>
          {(errors.bloodPressure?.systolic || errors.bloodPressure?.diastolic) && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.bloodPressure?.systolic?.message || errors.bloodPressure?.diastolic?.message}
            </p>
          )}
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
              {bpAssessment.category === "normal"
                ? "Normal"
                : bpAssessment.category === "elevated"
                  ? "Tinggi"
                  : bpAssessment.category === "high_stage1"
                    ? "Hipertensi Stadium 1"
                    : bpAssessment.category === "high_stage2"
                      ? "Hipertensi Stadium 2"
                      : "Krisis Hipertensi"}
            </Badge>
          )}
        </div>

        {/* Blood Sugar */}
        <div className="space-y-2">
          <Label htmlFor="bloodSugar">Gula Darah (mg/dL)</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="bloodSugar"
              type="number"
              placeholder="120"
              {...register("bloodSugar", { valueAsNumber: true })}
              className="w-32"
            />
            <span className="text-sm text-gray-500">mg/dL</span>
          </div>
          {errors.bloodSugar && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.bloodSugar.message}
            </p>
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
            >
              {sugarAssessment.category === "normal"
                ? "Normal"
                : sugarAssessment.category === "prediabetes"
                  ? "Prediabetes"
                  : "Diabetes"}
            </Badge>
          )}
        </div>

        {/* Weight */}
        <div className="space-y-2">
          <Label htmlFor="weight">Berat Badan (kg) *</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="weight"
              type="number"
              step="0.1"
              placeholder="65"
              {...register("weight", { valueAsNumber: true })}
              className="w-32"
            />
            <span className="text-sm text-gray-500">kg</span>
          </div>
          {errors.weight && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.weight.message}
            </p>
          )}
        </div>
      </div>

      {/* Symptoms */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Gejala yang Dialami</h3>

        {/* Common Symptoms */}
        <div className="space-y-2">
          <Label>Pilih Gejala Umum</Label>
          <div className="flex flex-wrap gap-2">
            {COMMON_SYMPTOMS.map((symptom) => (
              <Button
                key={symptom}
                type="button"
                variant={selectedSymptoms.includes(symptom) ? "default" : "outline"}
                size="sm"
                onClick={() => (selectedSymptoms.includes(symptom) ? removeSymptom(symptom) : addSymptom(symptom))}
              >
                {symptom}
              </Button>
            ))}
          </div>
        </div>

        {/* Selected Symptoms */}
        {selectedSymptoms.length > 0 && (
          <div className="space-y-2">
            <Label>Gejala Terpilih</Label>
            <div className="flex flex-wrap gap-2">
              {selectedSymptoms.map((symptom) => (
                <Badge key={symptom} variant="default" className="flex items-center gap-1">
                  {symptom}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeSymptom(symptom)} />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Health Assessment */}
      {(bpAssessment?.alert !== "normal" || sugarAssessment?.alert !== "normal") && (
        <Card className="border-2 border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              Peringatan Kesehatan
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 text-sm text-red-800">
              {bpAssessment?.alert !== "normal" && (
                <div>• Tekanan darah menunjukkan kondisi yang perlu diperhatikan</div>
              )}
              {sugarAssessment?.alert !== "normal" && <div>• Gula darah di luar batas normal</div>}
              <div className="font-medium mt-2">Disarankan untuk konsultasi lebih lanjut dengan tenaga medis.</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Catatan Tambahan</Label>
        <Textarea
          id="notes"
          placeholder="Catatan pemeriksaan, kondisi khusus, atau observasi lainnya..."
          rows={3}
          {...register("notes")}
        />
        {errors.notes && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors.notes.message}
          </p>
        )}
      </div>

      {/* Submit Result */}
      {submitResult && (
        <div
          className={`p-3 rounded-lg ${
            submitResult.success
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          {submitResult.message}
        </div>
      )}

      {/* Submit Button */}
      <Button type="submit" disabled={isSubmitting} className="w-full bg-purple-600 hover:bg-purple-700">
        <Save className="h-4 w-4 mr-2" />
        {isSubmitting ? "Menyimpan..." : "Simpan Data Lansia"}
      </Button>
    </form>
  )
}
