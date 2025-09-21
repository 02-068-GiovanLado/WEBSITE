"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, AlertCircle, UserPlus } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { patientSchema, type PatientFormData } from "@/lib/validation/health-schemas"
import { calculateAge } from "@/lib/utils/health-calculations"

export function PatientRegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
  })

  const selectedCategory = watch("category")
  const dateOfBirth = watch("dateOfBirth")

  // Auto-determine category based on age
  const autoCategory = dateOfBirth
    ? (() => {
        const age = calculateAge(dateOfBirth)
        if (age.years === 0 && age.months <= 24) return "baby"
        if (age.years >= 60) return "elderly"
        return "adult"
      })()
    : null

  const onSubmit = async (data: PatientFormData) => {
    setIsSubmitting(true)
    setSubmitResult(null)

    try {
      // In real app, send to API endpoint
      console.log("Patient registration data:", data)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSubmitResult({
        success: true,
        message: "Pasien berhasil didaftarkan!",
      })
      reset()
    } catch (error) {
      setSubmitResult({
        success: false,
        message: "Gagal mendaftarkan pasien. Silakan coba lagi.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Informasi Dasar</h3>

        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Nama Lengkap *</Label>
          <Input id="name" placeholder="Masukkan nama lengkap" {...register("name")} />
          {errors.name && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Date of Birth */}
        <div className="space-y-2">
          <Label>Tanggal Lahir *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !dateOfBirth && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateOfBirth ? format(dateOfBirth, "PPP", { locale: id }) : <span>Pilih tanggal lahir</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateOfBirth}
                onSelect={(date) => {
                  setValue("dateOfBirth", date || new Date())
                  // Auto-set category based on age
                  if (date && autoCategory) {
                    setValue("category", autoCategory)
                  }
                }}
                initialFocus
                captionLayout="dropdown-buttons"
                fromYear={1920}
                toYear={new Date().getFullYear()}
              />
            </PopoverContent>
          </Popover>
          {errors.dateOfBirth && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.dateOfBirth.message}
            </p>
          )}
          {dateOfBirth && (
            <p className="text-sm text-gray-500">
              Usia: {(() => {
                const age = calculateAge(dateOfBirth)
                return age.years > 0 ? `${age.years} tahun` : `${age.months} bulan`
              })()}
            </p>
          )}
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Label>Jenis Kelamin *</Label>
          <Select onValueChange={(value: "male" | "female") => setValue("gender", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih jenis kelamin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Laki-laki</SelectItem>
              <SelectItem value="female">Perempuan</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.gender.message}
            </p>
          )}
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label>Kategori Pasien *</Label>
          <Select
            value={selectedCategory}
            onValueChange={(value: "baby" | "elderly" | "adult") => setValue("category", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih kategori pasien" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="baby">Bayi (0-2 tahun)</SelectItem>
              <SelectItem value="adult">Dewasa (3-59 tahun)</SelectItem>
              <SelectItem value="elderly">Lansia (60+ tahun)</SelectItem>
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.category.message}
            </p>
          )}
          {autoCategory && autoCategory !== selectedCategory && (
            <p className="text-sm text-orange-600">
              Berdasarkan usia, kategori yang disarankan:{" "}
              {autoCategory === "baby" ? "Bayi" : autoCategory === "elderly" ? "Lansia" : "Dewasa"}
            </p>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Informasi Kontak</h3>

        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="address">Alamat Lengkap *</Label>
          <Textarea id="address" placeholder="Masukkan alamat lengkap" rows={3} {...register("address")} />
          {errors.address && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.address.message}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Nomor Telepon {selectedCategory === "baby" ? "(Opsional)" : "*"}</Label>
          <Input id="phoneNumber" type="tel" placeholder="+62812345678" {...register("phoneNumber")} />
          {errors.phoneNumber && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.phoneNumber.message}
            </p>
          )}
        </div>
      </div>

      {/* Guardian Information (for babies) */}
      {selectedCategory === "baby" && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Informasi Wali</h3>

          {/* Guardian Name */}
          <div className="space-y-2">
            <Label htmlFor="guardianName">Nama Wali</Label>
            <Input id="guardianName" placeholder="Nama orang tua/wali" {...register("guardianName")} />
            {errors.guardianName && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.guardianName.message}
              </p>
            )}
          </div>

          {/* Guardian Phone */}
          <div className="space-y-2">
            <Label htmlFor="guardianPhone">Nomor Telepon Wali</Label>
            <Input id="guardianPhone" type="tel" placeholder="+62812345678" {...register("guardianPhone")} />
            {errors.guardianPhone && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.guardianPhone.message}
              </p>
            )}
          </div>
        </div>
      )}

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
      <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700">
        <UserPlus className="h-4 w-4 mr-2" />
        {isSubmitting ? "Mendaftarkan..." : "Daftarkan Pasien"}
      </Button>
    </form>
  )
}
