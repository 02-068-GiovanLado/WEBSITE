-- Insert sample patients
INSERT INTO public.patients (id, name, date_of_birth, gender, address, phone, patient_type) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Sari Dewi', '2023-03-15', 'female', 'Jl. Mawar No. 12, Desa Sukamaju', '081234567890', 'baby'),
('550e8400-e29b-41d4-a716-446655440002', 'Ahmad Rizki', '2023-07-22', 'male', 'Jl. Melati No. 8, Desa Sukamaju', '081234567891', 'baby'),
('550e8400-e29b-41d4-a716-446655440003', 'Siti Aminah', '1945-12-10', 'female', 'Jl. Kenanga No. 5, Desa Sukamaju', '081234567892', 'elderly'),
('550e8400-e29b-41d4-a716-446655440004', 'Pak Budi', '1950-08-03', 'male', 'Jl. Anggrek No. 15, Desa Sukamaju', '081234567893', 'elderly');

-- Insert sample health records
INSERT INTO public.health_records (patient_id, record_date, weight, height, head_circumference, blood_pressure_systolic, blood_pressure_diastolic, blood_sugar, temperature, notes, recorded_by) VALUES
-- Baby records
('550e8400-e29b-41d4-a716-446655440001', '2024-01-15', 6.5, 58.0, 38.5, NULL, NULL, NULL, 36.8, 'Perkembangan normal, aktif', 'Bidan Sari'),
('550e8400-e29b-41d4-a716-446655440001', '2024-02-15', 7.2, 60.0, 39.0, NULL, NULL, NULL, 36.9, 'Berat badan naik sesuai kurva pertumbuhan', 'Bidan Sari'),
('550e8400-e29b-41d4-a716-446655440002', '2024-01-20', 5.8, 55.0, 37.5, NULL, NULL, NULL, 37.0, 'Bayi sehat, menyusu dengan baik', 'Bidan Sari'),

-- Elderly records
('550e8400-e29b-41d4-a716-446655440003', '2024-01-10', 55.0, 150.0, NULL, 140, 90, 120, 36.5, 'Tekanan darah sedikit tinggi', 'Perawat Andi'),
('550e8400-e29b-41d4-a716-446655440003', '2024-02-10', 54.5, 150.0, NULL, 135, 85, 110, 36.6, 'Tekanan darah membaik', 'Perawat Andi'),
('550e8400-e29b-41d4-a716-446655440004', '2024-01-12', 68.0, 165.0, NULL, 160, 95, 180, 37.2, 'Hipertensi dan diabetes, perlu monitoring ketat', 'Perawat Andi');

-- Insert sample immunizations
INSERT INTO public.immunizations (patient_id, vaccine_name, date_given, next_due_date, notes) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'BCG', '2023-03-16', NULL, 'Diberikan 1 hari setelah lahir'),
('550e8400-e29b-41d4-a716-446655440001', 'Hepatitis B', '2023-03-16', '2023-04-16', 'Dosis pertama'),
('550e8400-e29b-41d4-a716-446655440001', 'DPT-HB-Hib', '2023-05-15', '2023-07-15', 'Dosis pertama'),
('550e8400-e29b-41d4-a716-446655440002', 'BCG', '2023-07-23', NULL, 'Diberikan 1 hari setelah lahir'),
('550e8400-e29b-41d4-a716-446655440002', 'Hepatitis B', '2023-07-23', '2023-08-23', 'Dosis pertama');

-- Insert sample health alerts
INSERT INTO public.health_alerts (patient_id, alert_type, message, is_resolved) VALUES
('550e8400-e29b-41d4-a716-446655440003', 'warning', 'Tekanan darah tinggi (140/90) - perlu monitoring', false),
('550e8400-e29b-41d4-a716-446655440004', 'critical', 'Diabetes tidak terkontrol (gula darah 180) - perlu tindakan segera', false),
('550e8400-e29b-41d4-a716-446655440001', 'info', 'Jadwal imunisasi DPT-HB-Hib dosis kedua sudah tiba', false);
