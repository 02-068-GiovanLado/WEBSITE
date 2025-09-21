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
import { CalendarIcon, Save, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { babyHealthSchema, type BabyHealthFormData } from "@/lib/validation/health-schemas"
import { mockPatients } from "@/lib/mock-data"
import { calculateAge, assessBabyGrowth, calculateAgeInMonths } from "@/lib/utils/health-calculations"

export function BabyHealthForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null)

  const babyPatients = mockPatients.filter((p) => p.category === "baby")

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<BabyHealthFormData>({
    resolver: zodResolver(babyHealthSchema),
    defaultValues: {
      recordDate: new Date(),
      healthWorkerId: "current-user", // In real app, get from auth context
    },
  })

  const selectedPatientId = watch("patientId")
  const selectedPatient = babyPatients.find((p) => p.id === selectedPatientId)
  const weight = watch("weight")
  const height = watch("height")

  // Calculate growth assessment if patient and measurements are available
  const growthAssessment =
    selectedPatient && weight && height
      ? assessBabyGrowth(calculateAgeInMonths(selectedPatient.dateOfBirth), weight, height, selectedPatient.gender)
      : null

  const onSubmit = async (data: BabyHealthFormData) => {
    setIsSubmitting(true)
    setSubmitResult(null)

    try {
      // In real app, send to API endpoint
      console.log("Baby health data:", data)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSubmitResult({
        success: true,
        message: "Data kesehatan bayi berhasil disimpan!",
      })
      reset()
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
        <Label htmlFor="patientId">Pilih Bayi *</Label>
        <Select onValueChange={(value) => setValue("patientId", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih bayi yang akan diperiksa" />
          </SelectTrigger>
          <SelectContent>
            {babyPatients.map((baby) => {
              const age = calculateAge(baby.dateOfBirth)
              return (
                <SelectItem key={baby.id} value={baby.id}>
                  {baby.name} ({age.months} bulan) - {baby.guardianName}
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
        <Card className="bg-blue-50 border-blue-200">
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
                <span className="ml-2 font-medium">{calculateAge(selectedPatient.dateOfBirth).months} bulan</span>
              </div>
              <div>
                <span className="text-gray-600">Jenis Kelamin:</span>
                <span className="ml-2 font-medium">
                  {selectedPatient.gender === "male" ? "Laki-laki" : "Perempuan"}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Wali:</span>
                <span className="ml-2 font-medium">{selectedPatient.guardianName}</span>
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

      {/* Measurements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="weight">Berat Badan (kg) *</Label>
          <Input
            id="weight"
            type="number"
            step="0.1"
            placeholder="8.5"
            {...register("weight", { valueAsNumber: true })}
          />
          {errors.weight && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.weight.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="height">Tinggi Badan (cm) *</Label>
          <Input
            id="height"
            type="number"
            step="0.1"
            placeholder="65"
            {...register("height", { valueAsNumber: true })}
          />
          {errors.height && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.height.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="headCircumference">Lingkar Kepala (cm) *</Label>
          <Input
            id="headCircumference"
            type="number"
            step="0.1"
            placeholder="42"
            {...register("headCircumference", { valueAsNumber: true })}
          />
          {errors.headCircumference && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.headCircumference.message}
            </p>
          )}
        </div>
      </div>

      {/* Growth Assessment */}
      {growthAssessment && (
        <Card
          className={`border-2 ${
            growthAssessment.alert === "critical"
              ? "border-red-200 bg-red-50"
              : growthAssessment.alert === "warning"
                ? "border-orange-200 bg-orange-50"
                : "border-green-200 bg-green-50"
          }`}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertCircle
                className={`h-4 w-4 ${
                  growthAssessment.alert === "critical"
                    ? "text-red-600"
                    : growthAssessment.alert === "warning"
                      ? "text-orange-600"
                      : "text-green-600"
                }`}
              />
              Penilaian Pertumbuhan
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Status Berat Badan:</span>
                <span
                  className={`ml-2 ${
                    growthAssessment.weightStatus === "underweight"
                      ? "text-red-600"
                      : growthAssessment.weightStatus === "overweight"
                        ? "text-orange-600"
                        : "text-green-600"
                  }`}
                >
                  {growthAssessment.weightStatus === "underweight"
                    ? "Kurang"
                    : growthAssessment.weightStatus === "overweight"
                      ? "Lebih"
                      : "Normal"}
                </span>
              </div>
              <div>
                <span className="font-medium">Status Tinggi Badan:</span>
                <span
                  className={`ml-2 ${growthAssessment.heightStatus === "stunted" ? "text-red-600" : "text-green-600"}`}
                >
                  {growthAssessment.heightStatus === "stunted"
                    ? "Stunting"
                    : growthAssessment.heightStatus === "tall"
                      ? "Tinggi"
                      : "Normal"}
                </span>
              </div>
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
      <Button type="submit" disabled={isSubmitting} className="w-full bg-green-600 hover:bg-green-700">
        <Save className="h-4 w-4 mr-2" />
        {isSubmitting ? "Menyimpan..." : "Simpan Data Bayi"}
      </Button>
    </form>
  )
}
