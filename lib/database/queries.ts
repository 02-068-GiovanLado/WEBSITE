import { createClient } from "@/lib/supabase/server"
import type { Patient, HealthRecord, Immunization, HealthAlert } from "@/lib/types"

export async function getPatients(type?: "baby" | "elderly"): Promise<Patient[]> {
  const supabase = await createClient()

  let query = supabase.from("patients").select("*").order("created_at", { ascending: false })

  if (type) {
    query = query.eq("patient_type", type)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching patients:", error)
    return []
  }

  return data || []
}

export async function getPatientById(id: string): Promise<Patient | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("patients").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching patient:", error)
    return null
  }

  return data
}

export async function getHealthRecords(patientId: string): Promise<HealthRecord[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("health_records")
    .select("*")
    .eq("patient_id", patientId)
    .order("record_date", { ascending: false })

  if (error) {
    console.error("Error fetching health records:", error)
    return []
  }

  return data || []
}

export async function getImmunizations(patientId: string): Promise<Immunization[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("immunizations")
    .select("*")
    .eq("patient_id", patientId)
    .order("date_given", { ascending: false })

  if (error) {
    console.error("Error fetching immunizations:", error)
    return []
  }

  return data || []
}

export async function getHealthAlerts(patientId?: string): Promise<HealthAlert[]> {
  const supabase = await createClient()

  let query = supabase
    .from("health_alerts")
    .select(`
      *,
      patients (
        name
      )
    `)
    .eq("is_resolved", false)
    .order("created_at", { ascending: false })

  if (patientId) {
    query = query.eq("patient_id", patientId)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching health alerts:", error)
    return []
  }

  return data || []
}

export async function getHealthStats() {
  const supabase = await createClient()

  // Get total patients by type
  const { data: patients } = await supabase.from("patients").select("patient_type")

  // Get unresolved alerts by type
  const { data: alerts } = await supabase.from("health_alerts").select("alert_type").eq("is_resolved", false)

  // Get recent health records
  const { data: recentRecords } = await supabase
    .from("health_records")
    .select("*")
    .gte("record_date", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0])
    .order("record_date", { ascending: false })

  const totalPatients = patients?.length || 0
  const totalBabies = patients?.filter((p) => p.patient_type === "baby").length || 0
  const totalElderly = patients?.filter((p) => p.patient_type === "elderly").length || 0

  const criticalAlerts = alerts?.filter((a) => a.alert_type === "critical").length || 0
  const warningAlerts = alerts?.filter((a) => a.alert_type === "warning").length || 0
  const infoAlerts = alerts?.filter((a) => a.alert_type === "info").length || 0

  const recentCheckups = recentRecords?.length || 0

  return {
    totalPatients,
    totalBabies,
    totalElderly,
    criticalAlerts,
    warningAlerts,
    infoAlerts,
    recentCheckups,
  }
}
