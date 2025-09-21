// Utility functions for health calculations and assessments

export function calculateAge(birthDate: Date): { years: number; months: number } {
  const today = new Date()
  const birth = new Date(birthDate)

  let years = today.getFullYear() - birth.getFullYear()
  let months = today.getMonth() - birth.getMonth()

  if (months < 0) {
    years--
    months += 12
  }

  return { years, months }
}

export function calculateAgeInMonths(birthDate: Date): number {
  const { years, months } = calculateAge(birthDate)
  return years * 12 + months
}

export function assessBloodPressure(
  systolic: number,
  diastolic: number,
): {
  category: "normal" | "elevated" | "high_stage1" | "high_stage2" | "crisis"
  alert: "normal" | "warning" | "critical"
} {
  if (systolic >= 180 || diastolic >= 120) {
    return { category: "crisis", alert: "critical" }
  } else if (systolic >= 140 || diastolic >= 90) {
    return { category: "high_stage2", alert: "critical" }
  } else if (systolic >= 130 || diastolic >= 80) {
    return { category: "high_stage1", alert: "warning" }
  } else if (systolic >= 120 && diastolic < 80) {
    return { category: "elevated", alert: "warning" }
  } else {
    return { category: "normal", alert: "normal" }
  }
}

export function assessBloodSugar(
  value: number,
  testType: "fasting" | "random" = "random",
): {
  category: "normal" | "prediabetes" | "diabetes"
  alert: "normal" | "warning" | "critical"
} {
  if (testType === "fasting") {
    if (value >= 126) {
      return { category: "diabetes", alert: "critical" }
    } else if (value >= 100) {
      return { category: "prediabetes", alert: "warning" }
    } else {
      return { category: "normal", alert: "normal" }
    }
  } else {
    if (value >= 200) {
      return { category: "diabetes", alert: "critical" }
    } else if (value >= 140) {
      return { category: "prediabetes", alert: "warning" }
    } else {
      return { category: "normal", alert: "normal" }
    }
  }
}

// WHO growth standards for babies (simplified)
export function assessBabyGrowth(
  ageInMonths: number,
  weight: number,
  height: number,
  gender: "male" | "female",
): {
  weightStatus: "underweight" | "normal" | "overweight"
  heightStatus: "stunted" | "normal" | "tall"
  alert: "normal" | "warning" | "critical"
} {
  // Simplified assessment - in real implementation, use WHO growth charts
  const expectedWeight = gender === "male" ? 3.3 + ageInMonths * 0.6 : 3.2 + ageInMonths * 0.55
  const expectedHeight = gender === "male" ? 50 + ageInMonths * 2.5 : 49.5 + ageInMonths * 2.4

  const weightPercentile = (weight / expectedWeight) * 100
  const heightPercentile = (height / expectedHeight) * 100

  let weightStatus: "underweight" | "normal" | "overweight" = "normal"
  let heightStatus: "stunted" | "normal" | "tall" = "normal"
  let alert: "normal" | "warning" | "critical" = "normal"

  if (weightPercentile < 80) {
    weightStatus = "underweight"
    alert = "warning"
  } else if (weightPercentile > 120) {
    weightStatus = "overweight"
    alert = "warning"
  }

  if (heightPercentile < 85) {
    heightStatus = "stunted"
    alert = "critical"
  } else if (heightPercentile > 115) {
    heightStatus = "tall"
  }

  return { weightStatus, heightStatus, alert }
}
