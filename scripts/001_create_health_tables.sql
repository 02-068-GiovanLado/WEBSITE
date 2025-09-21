-- Create patients table
CREATE TABLE IF NOT EXISTS public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  address TEXT,
  phone TEXT,
  emergency_contact TEXT,
  patient_type TEXT NOT NULL CHECK (patient_type IN ('baby', 'elderly')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create health_records table
CREATE TABLE IF NOT EXISTS public.health_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  weight DECIMAL(5,2),
  height DECIMAL(5,2),
  head_circumference DECIMAL(5,2),
  blood_pressure_systolic INTEGER,
  blood_pressure_diastolic INTEGER,
  blood_sugar INTEGER,
  temperature DECIMAL(4,1),
  notes TEXT,
  recorded_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create immunizations table
CREATE TABLE IF NOT EXISTS public.immunizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  vaccine_name TEXT NOT NULL,
  date_given DATE NOT NULL,
  next_due_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create health_alerts table
CREATE TABLE IF NOT EXISTS public.health_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('critical', 'warning', 'info')),
  message TEXT NOT NULL,
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create whatsapp_messages table
CREATE TABLE IF NOT EXISTS public.whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number TEXT NOT NULL,
  message_content TEXT NOT NULL,
  message_type TEXT NOT NULL CHECK (message_type IN ('incoming', 'outgoing')),
  processed BOOLEAN DEFAULT FALSE,
  patient_id UUID REFERENCES public.patients(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.immunizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a village health system)
-- In a real deployment, you'd want proper user authentication and role-based access

-- Patients policies
CREATE POLICY "Allow all operations on patients" ON public.patients FOR ALL USING (true) WITH CHECK (true);

-- Health records policies
CREATE POLICY "Allow all operations on health_records" ON public.health_records FOR ALL USING (true) WITH CHECK (true);

-- Immunizations policies
CREATE POLICY "Allow all operations on immunizations" ON public.immunizations FOR ALL USING (true) WITH CHECK (true);

-- Health alerts policies
CREATE POLICY "Allow all operations on health_alerts" ON public.health_alerts FOR ALL USING (true) WITH CHECK (true);

-- WhatsApp messages policies
CREATE POLICY "Allow all operations on whatsapp_messages" ON public.whatsapp_messages FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_patients_type ON public.patients(patient_type);
CREATE INDEX IF NOT EXISTS idx_health_records_patient_id ON public.health_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_health_records_date ON public.health_records(record_date);
CREATE INDEX IF NOT EXISTS idx_immunizations_patient_id ON public.immunizations(patient_id);
CREATE INDEX IF NOT EXISTS idx_health_alerts_patient_id ON public.health_alerts(patient_id);
CREATE INDEX IF NOT EXISTS idx_health_alerts_resolved ON public.health_alerts(is_resolved);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_processed ON public.whatsapp_messages(processed);
