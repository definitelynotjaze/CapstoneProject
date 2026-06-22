// ================================================================
//  OPTICANA — db.js
//  Central mock data store. No logic. No imports.
// ================================================================

var patients = [
  {
    id: 'P001', firstName: 'Maria', lastName: 'Santos', name: 'Maria Santos',
    gender: 'Female', dob: '1990-03-15', age: 35,
    contact: '09171234567', email: 'maria.santos@email.com', password: 'patient123',
    address: '123 Rizal St, Bacoor, Cavite', bloodType: 'O+',
    registeredDate: '2024-01-15', lastVisit: '2025-12-10',
    qrData: 'OPTICANA-P001-MARIASANTOS',
    status: 'active',
    occupation: 'Accountant',
    medicalHistory: 'Hypertension (controlled, on medication). No known drug allergies.',
    opticalHistory: 'Myopia diagnosed at age 12. First prescription glasses at 14. Annual check-ups since 2018.',
    prescriptions: [
      { id: 'RX001', date: '2025-12-10', doctor: 'Dr. Ruziel Palaje',
        od: { sph: '-1.25', cyl: '-0.25', axis: '90' }, os: { sph: '-1.00', cyl: '0.00', axis: '0' },
        lensType: 'Single Vision, Anti-Reflective Coating', remarks: 'Valid for 1 year. Update if vision worsens.' }
    ],
    consultations: [
      { id: 'C001', date: '2025-12-10', doctor: 'Dr. Ruziel Palaje', type: 'Eye Examination',
        diagnosis: 'Myopia, Mild', prescription: 'OD: -1.25 / OS: -1.00', remarks: 'Follow-up in 6 months' },
      { id: 'C002', date: '2025-06-22', doctor: 'Dr. Lalaine Cana', type: 'Follow-up Consultation',
        diagnosis: 'Astigmatism', prescription: 'OD: -0.75 -0.50 x90 / OS: -0.50 -0.25 x85', remarks: 'Update prescription lenses' }
    ],
    examinations: [
      { id: 'E001', date: '2025-12-10', doctor: 'Dr. Ruziel Palaje',
        od: { sph: '-1.25', cyl: '-0.25', axis: '90', va: '20/40', add: '0.00' },
        os: { sph: '-1.00', cyl: '0.00', axis: '0',  va: '20/30', add: '0.00' },
        iop: { od: '14', os: '13' }, pd: '62/60',
        diagnosis: 'Myopia, Mild', recommendation: 'Single Vision Lenses, Anti-Reflective Coating',
        testResults: 'Visual field test: Normal. Color vision: Ishihara — Normal. Tonometry: 14/13 mmHg (within normal range).',
        prescriptionDetails: 'OD: -1.25 -0.25 x90 / OS: -1.00 sph. Full-time wear recommended. Anti-reflective coating advised.',
        lensType: 'Single Vision', lensMaterial: 'CR-39',
        lensCoating: ['Anti-Reflective', 'Scratch Resistant'],
        frameSelection: 'Full rim, lightweight titanium alloy',
        remarks: 'Patient shows steady improvement. Recommend glasses update.', status: 'completed' },
      { id: 'E006', date: '2025-06-22', doctor: 'Dr. Lalaine Cana',
        od: { sph: '-1.00', cyl: '-0.50', axis: '90', va: '20/60', add: '0.00' },
        os: { sph: '-0.75', cyl: '-0.25', axis: '85', va: '20/50', add: '0.00' },
        iop: { od: '13', os: '12' }, pd: '62/60',
        diagnosis: 'Myopia with Astigmatism', recommendation: 'Update prescription lenses',
        testResults: 'Color vision: Normal. Visual fields: Full to confrontation. Slit-lamp: Clear anterior segment.',
        prescriptionDetails: 'OD: -1.00 -0.50 x90 / OS: -0.75 -0.25 x85. Follow-up in 6 months.',
        lensType: 'Single Vision', lensMaterial: 'CR-39',
        lensCoating: ['Anti-Reflective'],
        frameSelection: 'Existing frame — lens replacement only',
        remarks: 'Slight increase in astigmatism component. Update lenses recommended.', status: 'completed' }
    ]
  },
  {
    id: 'P002', firstName: 'Jose', lastName: 'Reyes', name: 'Jose Reyes',
    gender: 'Male', dob: '1985-07-22', age: 40,
    contact: '09182345678', email: 'jose.reyes@email.com', password: 'patient456',
    address: '45 Mabini Ave, Imus, Cavite', bloodType: 'A+',
    registeredDate: '2024-03-10', lastVisit: '2025-11-05',
    qrData: 'OPTICANA-P002-JOSEREYES',
    status: 'active',
    occupation: 'Civil Engineer',
    medicalHistory: 'Mild allergic rhinitis. No other significant medical history.',
    opticalHistory: 'First corrective lenses prescribed in 2024. Mild hyperopia. No prior optical history.',
    prescriptions: [
      { id: 'RX002', date: '2025-11-05', doctor: 'Dr. Carmen Sumaya',
        od: { sph: '+1.00', cyl: '0.00', axis: '0' }, os: { sph: '+0.75', cyl: '0.00', axis: '0' },
        lensType: 'Reading Glasses, Standard Lens', remarks: 'For near work only. Return in 3 months.' }
    ],
    consultations: [
      { id: 'C003', date: '2025-11-05', doctor: 'Dr. Carmen Sumaya', type: 'Eye Examination',
        diagnosis: 'Hyperopia', prescription: 'OD: +1.00 / OS: +0.75', remarks: 'First time with corrective lenses' }
    ],
    examinations: [
      { id: 'E002', date: '2025-11-05', doctor: 'Dr. Carmen Sumaya',
        od: { sph: '+1.00', cyl: '0.00', axis: '0',  va: '20/50', add: '0.00' },
        os: { sph: '+0.75', cyl: '0.00', axis: '0',  va: '20/40', add: '0.00' },
        iop: { od: '15', os: '16' }, pd: '64',
        diagnosis: 'Hyperopia, Mild', recommendation: 'Reading Glasses, Standard Lens',
        testResults: 'Near vision test: Reduced at standard reading distance. Color vision: Normal. Maddox Rod: Normal binocularity.',
        prescriptionDetails: 'OD: +1.00 sph / OS: +0.75 sph. For near work and reading only. Not for driving.',
        lensType: 'Single Vision', lensMaterial: 'Polycarbonate',
        lensCoating: ['Anti-Reflective', 'Blue Light Filter'],
        frameSelection: 'Half-rim, brown acetate, reading style',
        remarks: 'Advised to reduce screen time. Return in 3 months.', status: 'completed' },
      { id: 'E007', date: '2024-06-15', doctor: 'Dr. Ruziel Palaje',
        od: { sph: '+0.75', cyl: '0.00', axis: '0', va: '20/40', add: '0.00' },
        os: { sph: '+0.50', cyl: '0.00', axis: '0', va: '20/40', add: '0.00' },
        iop: { od: '14', os: '14' }, pd: '64',
        diagnosis: 'Hyperopia, Borderline', recommendation: 'Monitoring; no glasses yet',
        testResults: 'Unaided near vision slightly reduced. Distance vision normal. IOP within range.',
        prescriptionDetails: 'No prescription required at this stage. Re-evaluate in 12 months.',
        lensType: 'N/A', lensMaterial: 'N/A', lensCoating: [],
        frameSelection: 'N/A — monitoring only',
        remarks: 'Patient asymptomatic. First documented visit. Advised annual check.', status: 'completed' }
    ]
  },
  {
    id: 'P003', firstName: 'Ana', lastName: 'Garcia', name: 'Ana Garcia',
    gender: 'Female', dob: '1998-11-03', age: 27,
    contact: '09193456789', email: 'ana.garcia@email.com', password: 'patient789',
    address: '78 Luna St, Dasmariñas, Cavite', bloodType: 'B+',
    registeredDate: '2024-06-20', lastVisit: '2025-10-15',
    qrData: 'OPTICANA-P003-ANAGARCIA',
    status: 'active',
    occupation: 'Nursing Student',
    medicalHistory: 'No significant medical history. No known drug allergies.',
    opticalHistory: 'Astigmatism noted during school eye exam in 2022. Trial toric lenses fitted Oct 2025.',
    prescriptions: [
      { id: 'RX003', date: '2025-10-15', doctor: 'Dr. Julianne Rosche Cana',
        od: { sph: '-0.50', cyl: '-1.25', axis: '180' }, os: { sph: '-0.25', cyl: '-1.00', axis: '175' },
        lensType: 'Toric Contact Lenses / Corrective Glasses', remarks: 'Patient tolerates contact lenses well.' }
    ],
    consultations: [
      { id: 'C004', date: '2025-10-15', doctor: 'Dr. Julianne Rosche Cana', type: 'Eye Examination',
        diagnosis: 'Astigmatism, Moderate', prescription: 'OD: -0.50 -1.25 x180 / OS: -0.25 -1.00 x175', remarks: 'Toric lenses recommended' }
    ],
    examinations: [
      { id: 'E003', date: '2025-10-15', doctor: 'Dr. Julianne Rosche Cana',
        od: { sph: '-0.50', cyl: '-1.25', axis: '180', va: '20/60', add: '0.00' },
        os: { sph: '-0.25', cyl: '-1.00', axis: '175', va: '20/50', add: '0.00' },
        iop: { od: '12', os: '11' }, pd: '30/30',
        diagnosis: 'Astigmatism, Moderate', recommendation: 'Toric Contact Lenses or Corrective Glasses',
        testResults: 'Keratometry OD: 42.50/44.00 @180, OS: 43.00/44.25 @175. Color vision: Normal. Cover test: Orthophoria.',
        prescriptionDetails: 'OD: -0.50 -1.25 x180 / OS: -0.25 -1.00 x175. Daily disposable toric contact lenses or spectacles.',
        lensType: 'Contact Lens', lensMaterial: 'High Index',
        lensCoating: ['Scratch Resistant'],
        frameSelection: 'N/A — contact lens patient; backup spectacle frame TBD',
        remarks: 'Patient tolerates contact lenses. Fitted with trial pair.', status: 'completed' }
    ]
  },
  {
    id: 'P004', firstName: 'Carlo', lastName: 'Mendoza', name: 'Carlo Mendoza',
    gender: 'Male', dob: '1978-05-30', age: 47,
    contact: '09204567890', email: 'carlo.mendoza@email.com', password: 'patient000',
    address: '22 Aguinaldo Hwy, General Trias, Cavite', bloodType: 'O-',
    registeredDate: '2023-09-01', lastVisit: '2026-01-20',
    qrData: 'OPTICANA-P004-CARLOMENDOZA',
    status: 'active',
    occupation: 'Businessman',
    medicalHistory: 'Type 2 Diabetes Mellitus (managed). Mild hypertension. Family history of cardiovascular disease.',
    opticalHistory: 'Presbyopia onset at age 45. Progressive multifocal lenses prescribed in 2024. Annual checkups.',
    prescriptions: [
      { id: 'RX004', date: '2026-01-20', doctor: 'Dr. Christian Garabiles',
        od: { sph: '+0.25', cyl: '-0.25', axis: '90' }, os: { sph: '+0.25', cyl: '0.00', axis: '0' },
        lensType: 'Progressive Multifocal Lenses', remarks: 'Add +2.00. Gradual adaptation period advised.' },
      { id: 'RX005', date: '2025-07-10', doctor: 'Dr. Ruziel Palaje',
        od: { sph: '+0.25', cyl: '0.00', axis: '0' }, os: { sph: '0.00', cyl: '0.00', axis: '0' },
        lensType: 'Progressive Lenses', remarks: 'Add +1.75. Annual checkup recommended.' }
    ],
    consultations: [
      { id: 'C005', date: '2026-01-20', doctor: 'Dr. Christian Garabiles', type: 'Eye Examination',
        diagnosis: 'Presbyopia', prescription: 'Add: +2.00 both eyes', remarks: 'Progressive lenses prescribed' },
      { id: 'C006', date: '2025-07-10', doctor: 'Dr. Ruziel Palaje', type: 'Eye Examination',
        diagnosis: 'Presbyopia, Mild', prescription: 'Add: +1.75 both eyes', remarks: 'Annual vision check done' }
    ],
    examinations: [
      { id: 'E004', date: '2026-01-20', doctor: 'Dr. Christian Garabiles',
        od: { sph: '+0.25', cyl: '-0.25', axis: '90', va: '20/30', add: '+2.00' },
        os: { sph: '+0.25', cyl: '0.00',  axis: '0',  va: '20/30', add: '+2.00' },
        iop: { od: '18', os: '17' }, pd: '31/32',
        diagnosis: 'Presbyopia', recommendation: 'Progressive Multifocal Lenses',
        testResults: 'Near point convergence: Slightly reduced. Cover test: Orthophoria. Fundus: Normal macula. IOP: 18/17 mmHg.',
        prescriptionDetails: 'Distance OD: +0.25 -0.25 x90 / OS: +0.25 sph. Add +2.00 OU. Progressive multifocal recommended.',
        lensType: 'Progressive', lensMaterial: 'High Index',
        lensCoating: ['Anti-Reflective', 'Blue Light Filter', 'Scratch Resistant'],
        frameSelection: 'Full rim, wide bridge, rectangular frame — medium to large size',
        remarks: 'IOP within normal range. Advised annual checkup.', status: 'completed' },
      { id: 'E008', date: '2025-07-10', doctor: 'Dr. Ruziel Palaje',
        od: { sph: '+0.25', cyl: '0.00', axis: '0', va: '20/30', add: '+1.75' },
        os: { sph: '0.00',  cyl: '0.00', axis: '0', va: '20/30', add: '+1.75' },
        iop: { od: '16', os: '16' }, pd: '31/32',
        diagnosis: 'Presbyopia, Mild', recommendation: 'Progressive Lenses, Add +1.75',
        testResults: 'Annual vision check. Distance vision adequate. Near vision slightly reduced. IOP normal.',
        prescriptionDetails: 'OD: +0.25 sph / OS: plano. Add +1.75 OU. Suitable for progressive or bifocal lenses.',
        lensType: 'Progressive', lensMaterial: 'CR-39',
        lensCoating: ['Anti-Reflective'],
        frameSelection: 'Existing frame usable — lens replacement',
        remarks: 'Annual vision check done. Patient adapting well to reading correction.', status: 'completed' }
    ]
  },
  {
    id: 'P005', firstName: 'Rosa', lastName: 'Dela Cruz', name: 'Rosa Dela Cruz',
    gender: 'Female', dob: '2002-02-14', age: 24,
    contact: '09215678901', email: 'rosa.delacruz@email.com', password: 'patient111',
    address: '10 Rizal Ave, Tagaytay, Cavite', bloodType: 'AB+',
    registeredDate: '2026-02-10', lastVisit: '—',
    qrData: 'OPTICANA-P005-ROSADELACRUZ',
    status: 'active',
    occupation: 'Registered Nurse',
    medicalHistory: 'No known allergies. No chronic conditions. Healthy adult.',
    opticalHistory: 'No prior optical history. First visit for routine eye screening in February 2026.',
    prescriptions: [],
    consultations: [],
    examinations: []
  },
  {
    id: 'P006', firstName: 'Benjamin', lastName: 'Torres', name: 'Benjamin Torres',
    gender: 'Male', dob: '1972-09-08', age: 53,
    contact: '09226789012', email: 'ben.torres@email.com', password: 'patient222',
    address: '55 Bonifacio St, Trece Martires, Cavite', bloodType: 'A-',
    registeredDate: '2023-04-15', lastVisit: '2025-09-03',
    qrData: 'OPTICANA-P006-BENTORRES',
    status: 'inactive',
    occupation: 'Retired (former Accountant)',
    medicalHistory: 'Hypertension (on medication). Family history of primary open-angle glaucoma (father and uncle). Under active monitoring.',
    opticalHistory: 'No corrective lenses prior to 2025. IOP concern flagged in September 2025 examination. Referred to Ophthalmologist for further evaluation.',
    prescriptions: [],
    consultations: [
      { id: 'C007', date: '2025-09-03', doctor: 'Dr. Lalaine Cana', type: 'Eye Examination',
        diagnosis: 'Glaucoma Suspect', prescription: 'Monitoring only', remarks: 'IOP elevated. Referred to Ophthalmologist for further evaluation.' }
    ],
    examinations: [
      { id: 'E005', date: '2025-09-03', doctor: 'Dr. Lalaine Cana',
        od: { sph: '0.00', cyl: '0.00', axis: '0', va: '20/20', add: '0.00' },
        os: { sph: '0.00', cyl: '0.00', axis: '0', va: '20/20', add: '0.00' },
        iop: { od: '24', os: '23' }, pd: '62',
        diagnosis: 'Glaucoma Suspect — Elevated IOP', recommendation: 'Referral to Ophthalmologist',
        testResults: 'IOP OD: 24 mmHg, OS: 23 mmHg — elevated bilaterally. Optic disc: mild cupping noted OU. Fundus: Normal macula, clear media. Visual fields: Pending perimetry.',
        prescriptionDetails: 'No corrective lenses required at this time. IOP monitoring every 3 months. Formal perimetry required.',
        lensType: 'N/A', lensMaterial: 'N/A', lensCoating: [],
        frameSelection: 'N/A — no prescription',
        remarks: 'Visual fields pending. Patient advised to avoid eye strain.', status: 'completed' }
    ]
  },
  { id: 'P007', firstName: 'Angela',    lastName: 'Lim',       name: 'Angela Lim',
    gender: 'Female', dob: '1996-04-12', age: 29, contact: '09237890123',
    email: 'angela.lim@email.com', password: 'patient007',
    address: '8 Magsaysay St, Bacoor, Cavite', bloodType: 'B+',
    registeredDate: '2024-08-10', lastVisit: '2026-03-28',
    qrData: 'OPTICANA-P007-ANGELALIM', status: 'active',
    occupation: 'Graphic Designer',
    medicalHistory: 'No known allergies. No chronic conditions.',
    opticalHistory: 'Myopia diagnosed at age 16. Regular check-ups since 2022.',
    prescriptions: [], consultations: [], examinations: [] },
  { id: 'P008', firstName: 'Ricardo',   lastName: 'Bautista',  name: 'Ricardo Bautista',
    gender: 'Male', dob: '1963-11-20', age: 61, contact: '09248901234',
    email: 'ricardo.bautista@email.com', password: 'patient008',
    address: '34 Imus Blvd, Imus, Cavite', bloodType: 'O+',
    registeredDate: '2023-11-05', lastVisit: '2026-03-25',
    qrData: 'OPTICANA-P008-RICARDOBAUTISTA', status: 'active',
    occupation: 'Retired Teacher',
    medicalHistory: 'Hypertension (controlled). Type 2 Diabetes (managed).',
    opticalHistory: 'Presbyopia with early cataract changes. Annual monitoring since 2023.',
    prescriptions: [], consultations: [], examinations: [] },
  { id: 'P009', firstName: 'Patricia',  lastName: 'Navarro',   name: 'Patricia Navarro',
    gender: 'Female', dob: '2004-01-08', age: 22, contact: '09259012345',
    email: 'patricia.navarro@email.com', password: 'patient009',
    address: '12 Aguinaldo Hwy, Dasmariñas, Cavite', bloodType: 'A-',
    registeredDate: '2025-06-15', lastVisit: '2026-03-22',
    qrData: 'OPTICANA-P009-PATRICIANAVARRO', status: 'active',
    occupation: 'College Student',
    medicalHistory: 'No known medical conditions.',
    opticalHistory: 'First optical exam in 2025. Mild myopia detected.',
    prescriptions: [], consultations: [], examinations: [] },
  { id: 'P010', firstName: 'Miguel',    lastName: 'Flores',    name: 'Miguel Flores',
    gender: 'Male', dob: '1977-07-03', age: 48, contact: '09260123456',
    email: 'miguel.flores@email.com', password: 'patient010',
    address: '67 Cavite St, General Trias, Cavite', bloodType: 'AB-',
    registeredDate: '2024-02-20', lastVisit: '2026-03-20',
    qrData: 'OPTICANA-P010-MIGUELFLORES', status: 'active',
    occupation: 'Civil Servant',
    medicalHistory: 'Mild hypertension. No drug allergies.',
    opticalHistory: 'Astigmatism diagnosed 2020. Progressive lenses since 2024.',
    prescriptions: [], consultations: [], examinations: [] },
  { id: 'P011', firstName: 'Sofia',     lastName: 'Ramos',     name: 'Sofia Ramos',
    gender: 'Female', dob: '2009-03-25', age: 17, contact: '09271234567',
    email: 'sofia.ramos@email.com', password: 'patient011',
    address: '19 Bonifacio Ave, Bacoor, Cavite', bloodType: 'O-',
    registeredDate: '2025-09-01', lastVisit: '2026-03-18',
    qrData: 'OPTICANA-P011-SOFIARAMOS', status: 'active',
    occupation: 'High School Student',
    medicalHistory: 'No known medical conditions.',
    opticalHistory: 'Myopia first noted during school check-up 2024.',
    prescriptions: [], consultations: [], examinations: [] },
  { id: 'P012', firstName: 'Daniel',    lastName: 'Aquino',    name: 'Daniel Aquino',
    gender: 'Male', dob: '1971-05-14', age: 55, contact: '09282345678',
    email: 'daniel.aquino@email.com', password: 'patient012',
    address: '28 Rizal St, Trece Martires, Cavite', bloodType: 'B-',
    registeredDate: '2023-07-18', lastVisit: '2026-03-15',
    qrData: 'OPTICANA-P012-DANIELAQUINO', status: 'active',
    occupation: 'Engineer',
    medicalHistory: 'Hyperlipidemia. No allergies.',
    opticalHistory: 'Presbyopia onset 2019. Bifocal lenses currently in use.',
    prescriptions: [], consultations: [], examinations: [] },
  { id: 'P013', firstName: 'Catherine', lastName: 'De Leon',   name: 'Catherine De Leon',
    gender: 'Female', dob: '1988-09-30', age: 38, contact: '09293456789',
    email: 'catherine.deleon@email.com', password: 'patient013',
    address: '5 Luna Ave, Imus, Cavite', bloodType: 'A+',
    registeredDate: '2024-05-10', lastVisit: '2026-03-12',
    qrData: 'OPTICANA-P013-CATHERINEDELEON', status: 'active',
    occupation: 'Nurse',
    medicalHistory: 'No chronic conditions. No known allergies.',
    opticalHistory: 'Myopia with astigmatism diagnosed 2019. Contact lens user since 2021.',
    prescriptions: [], consultations: [], examinations: [] },
  { id: 'P014', firstName: 'Marco',     lastName: 'Villanueva', name: 'Marco Villanueva',
    gender: 'Male', dob: '1984-12-07', age: 42, contact: '09304567890',
    email: 'marco.villanueva@email.com', password: 'patient014',
    address: '41 Emilio Aguinaldo Hwy, Bacoor, Cavite', bloodType: 'O+',
    registeredDate: '2024-01-22', lastVisit: '2026-03-10',
    qrData: 'OPTICANA-P014-MARCOVILLANUEVA', status: 'active',
    occupation: 'Architect',
    medicalHistory: 'No significant medical history.',
    opticalHistory: 'Hyperopia noted 2018. Reading glasses prescribed 2022.',
    prescriptions: [], consultations: [], examinations: [] },
  { id: 'P015', firstName: 'Jasmine',   lastName: 'Cruz',      name: 'Jasmine Cruz',
    gender: 'Female', dob: '2000-06-18', age: 26, contact: '09315678901',
    email: 'jasmine.cruz@email.com', password: 'patient015',
    address: '7 Padre Burgos St, Dasmariñas, Cavite', bloodType: 'AB+',
    registeredDate: '2025-03-05', lastVisit: '2026-03-08',
    qrData: 'OPTICANA-P015-JASMINECRUZ', status: 'active',
    occupation: 'Marketing Associate',
    medicalHistory: 'No known conditions.',
    opticalHistory: 'First optical consultation March 2025. Mild myopia.',
    prescriptions: [], consultations: [], examinations: [] },
  { id: 'P016', firstName: 'Eduardo',   lastName: 'Santiago',  name: 'Eduardo Santiago',
    gender: 'Male', dob: '1959-02-11', age: 67, contact: '09326789012',
    email: 'eduardo.santiago@email.com', password: 'patient016',
    address: '100 Sampaloc St, General Trias, Cavite', bloodType: 'A+',
    registeredDate: '2023-06-12', lastVisit: '2026-03-05',
    qrData: 'OPTICANA-P016-EDUARDOSANTIAGO', status: 'active',
    occupation: 'Retired',
    medicalHistory: 'Hypertension, Diabetes Type 2, history of mild stroke (2020, fully recovered).',
    opticalHistory: 'Presbyopia and early macular changes. Bi-annual monitoring required.',
    prescriptions: [], consultations: [], examinations: [] },
  { id: 'P017', firstName: 'Rachel',    lastName: 'Tan',       name: 'Rachel Tan',
    gender: 'Female', dob: '1995-08-22', age: 31, contact: '09337890123',
    email: 'rachel.tan@email.com', password: 'patient017',
    address: '23 Magsaysay Blvd, Imus, Cavite', bloodType: 'B+',
    registeredDate: '2024-10-08', lastVisit: '2026-03-03',
    qrData: 'OPTICANA-P017-RACHELTAN', status: 'active',
    occupation: 'Software Developer',
    medicalHistory: 'No chronic conditions. Mild anxiety (managed).',
    opticalHistory: 'High myopia since childhood. Annual checks since 2018.',
    prescriptions: [], consultations: [], examinations: [] },
  { id: 'P018', firstName: 'Vincent',   lastName: 'Gonzales',  name: 'Vincent Gonzales',
    gender: 'Male', dob: '1982-10-15', age: 44, contact: '09348901234',
    email: 'vincent.gonzales@email.com', password: 'patient018',
    address: '56 Aguinaldo Hwy, Bacoor, Cavite', bloodType: 'O-',
    registeredDate: '2023-12-20', lastVisit: '2026-02-28',
    qrData: 'OPTICANA-P018-VINCENTGONZALES', status: 'active',
    occupation: 'Sales Manager',
    medicalHistory: 'No known allergies. Mild hypertension.',
    opticalHistory: 'Astigmatism with presbyopia onset 2023.',
    prescriptions: [], consultations: [], examinations: [] },
  { id: 'P019', firstName: 'Isabella',  lastName: 'Cruz',      name: 'Isabella Cruz',
    gender: 'Female', dob: '2007-04-03', age: 19, contact: '09359012345',
    email: 'isabella.cruz@email.com', password: 'patient019',
    address: '14 Luna St, Dasmariñas, Cavite', bloodType: 'A+',
    registeredDate: '2026-04-11', lastVisit: '2026-04-11',
    qrData: 'OPTICANA-P019-ISABELLACRUZ', status: 'active',
    occupation: 'College Student',
    medicalHistory: 'No known medical conditions.',
    opticalHistory: 'First optical exam. Referred by school physician.',
    prescriptions: [], consultations: [], examinations: [] },
  { id: 'P020', firstName: 'Gabriel',   lastName: 'Villanueva', name: 'Gabriel Villanueva',
    gender: 'Male', dob: '1989-01-30', age: 37, contact: '09360123456',
    email: 'gabriel.villanueva@email.com', password: 'patient020',
    address: '88 Rizal Ave, Bacoor, Cavite', bloodType: 'B+',
    registeredDate: '2026-04-14', lastVisit: '2026-04-14',
    qrData: 'OPTICANA-P020-GABRIELVILLANUEVA', status: 'active',
    occupation: 'Physical Therapist',
    medicalHistory: 'No known conditions.',
    opticalHistory: 'Walk-in new patient. First optical examination.',
    prescriptions: [], consultations: [], examinations: [] },
  { id: 'P021', firstName: 'Christine', lastName: 'Morales',   name: 'Christine Morales',
    gender: 'Female', dob: '1976-07-19', age: 50, contact: '09371234567',
    email: 'christine.morales@email.com', password: 'patient021',
    address: '33 Del Pilar St, Imus, Cavite', bloodType: 'AB-',
    registeredDate: '2023-09-14', lastVisit: '2026-02-25',
    qrData: 'OPTICANA-P021-CHRISTINEMORALES', status: 'active',
    occupation: 'Accountant',
    medicalHistory: 'Hypothyroidism (medicated). No allergies.',
    opticalHistory: 'Progressive myopia and dry eye syndrome since 2020.',
    prescriptions: [], consultations: [], examinations: [] },
  { id: 'P022', firstName: 'Anthony',   lastName: 'Reyes',     name: 'Anthony Reyes',
    gender: 'Male', dob: '1968-03-28', age: 58, contact: '09382345678',
    email: 'anthony.reyes@email.com', password: 'patient022',
    address: '77 Burgos St, Bacoor, Cavite', bloodType: 'O+',
    registeredDate: '2023-02-10', lastVisit: '2026-02-20',
    qrData: 'OPTICANA-P022-ANTHONYREYES', status: 'inactive',
    occupation: 'Business Owner',
    medicalHistory: 'Controlled hypertension. No known allergies.',
    opticalHistory: 'Presbyopia with cataracts (early stage). Referred to ophthalmologist.',
    prescriptions: [], consultations: [], examinations: [] },
  { id: 'P023', firstName: 'Nicole',    lastName: 'Fernandez', name: 'Nicole Fernandez',
    gender: 'Female', dob: '2002-11-05', age: 24, contact: '09393456789',
    email: 'nicole.fernandez@email.com', password: 'patient023',
    address: '9 Mabini St, Dasmariñas, Cavite', bloodType: 'A-',
    registeredDate: '2025-07-22', lastVisit: '2026-02-15',
    qrData: 'OPTICANA-P023-NICOLEFERNANDEZ', status: 'active',
    occupation: 'Administrative Assistant',
    medicalHistory: 'No significant medical history.',
    opticalHistory: 'Mild myopia. First glasses prescribed July 2025.',
    prescriptions: [], consultations: [], examinations: [] },
  { id: 'P024', firstName: 'Luis',      lastName: 'Pascual',   name: 'Luis Pascual',
    gender: 'Male', dob: '1956-08-16', age: 70, contact: '09404567890',
    email: 'luis.pascual@email.com', password: 'patient024',
    address: '50 Padre Burgos Ave, Trece Martires, Cavite', bloodType: 'B+',
    registeredDate: '2023-01-30', lastVisit: '2026-02-10',
    qrData: 'OPTICANA-P024-LUISPASCUAL', status: 'active',
    occupation: 'Retired',
    medicalHistory: 'Glaucoma (medicated, stable). Hypertension. Diabetes Type 2.',
    opticalHistory: 'Long-standing glaucoma management. Low vision assessment 2024.',
    prescriptions: [], consultations: [], examinations: [] },
  { id: 'P025', firstName: 'Samantha',  lastName: 'Dela Rosa', name: 'Samantha Dela Rosa',
    gender: 'Female', dob: '1994-12-01', age: 32, contact: '09415678901',
    email: 'samantha.delarosa@email.com', password: 'patient025',
    address: '16 Emilio Aguinaldo Hwy, Imus, Cavite', bloodType: 'O+',
    registeredDate: '2024-07-05', lastVisit: '2026-02-05',
    qrData: 'OPTICANA-P025-SAMANTHADELAROSA', status: 'active',
    occupation: 'Teacher',
    medicalHistory: 'No chronic conditions. Seasonal allergies.',
    opticalHistory: 'Myopia with astigmatism. Progressive lenses since 2024.',
    prescriptions: [], consultations: [], examinations: [] }
]

var doctors = [
  { id: 'D001', name: 'Dr. Ruziel Palaje', firstName: 'Ruziel', lastName: 'Palaje',
    specialization: 'Optometrist', email: 'dr.palaje@canaoptical.com', password: 'doctor123',
    contact: '09181234567', available: true, days: ['Mon', 'Wed', 'Fri'],
    hours: '8:00 AM – 5:00 PM', status: 'active' },
  { id: 'D002', name: 'Dr. Lalaine Cana', firstName: 'Lalaine', lastName: 'Cana',
    specialization: 'Optometrist', email: 'dr.cana@canaoptical.com', password: 'doctor456',
    contact: '09182345678', available: true, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    hours: '8:00 AM – 6:00 PM', status: 'active' },
  { id: 'D004', name: 'Dr. Christian Garabiles', firstName: 'Christian', lastName: 'Garabiles',
    specialization: 'Optometrist', email: 'dr.garabiles@canaoptical.com', password: 'doctor101',
    contact: '09184567890', available: true, days: ['Tue', 'Thu'],
    hours: '9:00 AM – 5:00 PM', status: 'active' },
  { id: 'D005', name: 'Dr. Carmen Sumaya', firstName: 'Carmen', lastName: 'Sumaya',
    specialization: 'Optometrist', email: 'dr.sumaya@canaoptical.com', password: 'doctor202',
    contact: '09185678901', available: true, days: ['Mon', 'Tue', 'Thu'],
    hours: '8:00 AM – 5:00 PM', status: 'active' },
  { id: 'D006', name: 'Dr. Julianne Rosche Cana', firstName: 'Julianne Rosche', lastName: 'Cana',
    specialization: 'Optometrist', email: 'dr.jrcana@canaoptical.com', password: 'doctor303',
    contact: '09186789012', available: true, days: ['Wed', 'Fri'],
    hours: '10:00 AM – 6:00 PM', status: 'active' }
]

var staff = [
  { id: 'S001', name: 'Ana Lim', firstName: 'Ana', lastName: 'Lim',
    email: 'ana.lim@canaoptical.com', password: 'staff123', contact: '09161234567', status: 'active' },
  { id: 'S002', name: 'Carlos Tan', firstName: 'Carlos', lastName: 'Tan',
    email: 'carlos.tan@canaoptical.com', password: 'staff456', contact: '09162345678', status: 'active' }
]

var admins = [
  { id: 'ADM001', name: 'Roberto Cruz', firstName: 'Roberto', lastName: 'Cruz',
    email: 'admin@canaoptical.com', password: 'admin123', contact: '09151234567', status: 'active' }
]

var appointments = [
  { id: 'A001', patientId: 'P001', patientName: 'Maria Santos',
    doctorId: 'D001', doctorName: 'Dr. Ruziel Palaje',
    date: '2026-03-28', time: '9:00 AM', type: 'Eye Examination', status: 'approved', notes: '' },
  { id: 'A002', patientId: 'P002', patientName: 'Jose Reyes',
    doctorId: 'D002', doctorName: 'Dr. Lalaine Cana',
    date: '2026-03-29', time: '10:00 AM', type: 'Follow-up Consultation', status: 'pending', notes: 'Returning patient, previous prescription review' },
  { id: 'A003', patientId: 'P003', patientName: 'Ana Garcia',
    doctorId: 'D001', doctorName: 'Dr. Ruziel Palaje',
    date: '2026-03-27', time: '2:00 PM', type: 'Eye Examination', status: 'approved', notes: '' },
  { id: 'A004', patientId: 'P004', patientName: 'Carlo Mendoza',
    doctorId: 'D002', doctorName: 'Dr. Lalaine Cana',
    date: '2026-03-20', time: '11:00 AM', type: 'Eye Examination', status: 'cancelled', notes: 'Patient requested cancellation' },
  { id: 'A005', patientId: 'P005', patientName: 'Rosa Dela Cruz',
    doctorId: 'D002', doctorName: 'Dr. Lalaine Cana',
    date: '2026-03-30', time: '3:00 PM', type: 'Eye Examination', status: 'pending', notes: 'First-time patient' },
  { id: 'A006', patientId: 'P006', patientName: 'Benjamin Torres',
    doctorId: 'D002', doctorName: 'Dr. Lalaine Cana',
    date: '2026-03-18', time: '9:00 AM', type: 'Follow-up Consultation', status: 'disapproved', notes: 'The requested time slot was not available on the selected date. Please choose a different schedule.' },
  { id: 'A006B', patientId: 'P004', patientName: 'Carlo Mendoza',
    doctorId: 'D004', doctorName: 'Dr. Christian Garabiles',
    date: '2026-03-18', time: '10:00 AM', type: 'Follow-up Consultation', status: 'disapproved', notes: 'The selected doctor does not have consultations scheduled on the requested date. Please select an available consultation day.' },
  { id: 'A006C', patientId: 'P002', patientName: 'Jose Reyes',
    doctorId: 'D005', doctorName: 'Dr. Carmen Sumaya',
    date: '2026-03-10', time: '2:00 PM', type: 'Eye Examination', status: 'disapproved', notes: 'There was a scheduling conflict on the requested date. Please submit a new request for an available slot.' },
  { id: 'A007', patientId: 'P001', patientName: 'Maria Santos',
    doctorId: 'D002', doctorName: 'Dr. Lalaine Cana',
    date: '2025-12-10', time: '10:00 AM', type: 'Eye Examination', status: 'completed', notes: '' },
  { id: 'A008', patientId: 'P002', patientName: 'Jose Reyes',
    doctorId: 'D001', doctorName: 'Dr. Ruziel Palaje',
    date: '2026-04-01', time: '1:00 PM', type: 'Eye Examination', status: 'approved', notes: '' },
  { id: 'A009', patientId: 'P003', patientName: 'Ana Garcia',
    doctorId: 'D002', doctorName: 'Dr. Lalaine Cana',
    date: '2026-04-02', time: '11:00 AM', type: 'Follow-up Consultation', status: 'pending', notes: '' },
  { id: 'A010', patientId: 'P004', patientName: 'Carlo Mendoza',
    doctorId: 'D001', doctorName: 'Dr. Ruziel Palaje',
    date: '2026-04-07', time: '9:00 AM', type: 'Eye Examination', status: 'pending', notes: '' },

  // ── Dr. Ruziel Palaje (Mon/Wed/Fri) ──────────────────
  { id: 'A011', patientId: 'P005', patientName: 'Rosa Dela Cruz',
    doctorId: 'D001', doctorName: 'Dr. Ruziel Palaje',
    date: '2026-03-23', time: '10:00 AM', type: 'Eye Examination', status: 'approved', notes: 'Referred by Dr. Cana' },
  { id: 'A012', patientId: 'P006', patientName: 'Benjamin Torres',
    doctorId: 'D001', doctorName: 'Dr. Ruziel Palaje',
    date: '2026-03-16', time: '2:00 PM', type: 'Follow-up Consultation', status: 'completed', notes: 'Prescription renewal' },
  { id: 'A013', patientId: 'P003', patientName: 'Ana Garcia',
    doctorId: 'D001', doctorName: 'Dr. Ruziel Palaje',
    date: '2026-03-25', time: '11:00 AM', type: 'Eye Examination', status: 'pending', notes: '' },

  // ── Dr. Lalaine Cana (Mon–Fri) ───────────────────────
  { id: 'A014', patientId: 'P003', patientName: 'Ana Garcia',
    doctorId: 'D002', doctorName: 'Dr. Lalaine Cana',
    date: '2026-03-23', time: '9:00 AM', type: 'Eye Examination', status: 'approved', notes: '' },
  { id: 'A015', patientId: 'P004', patientName: 'Carlo Mendoza',
    doctorId: 'D002', doctorName: 'Dr. Lalaine Cana',
    date: '2026-03-24', time: '1:00 PM', type: 'Follow-up Consultation', status: 'approved', notes: 'Post-op check' },
  { id: 'A016', patientId: 'P005', patientName: 'Rosa Dela Cruz',
    doctorId: 'D002', doctorName: 'Dr. Lalaine Cana',
    date: '2026-03-19', time: '10:00 AM', type: 'Eye Examination', status: 'completed', notes: '' },
  { id: 'A017', patientId: 'P006', patientName: 'Benjamin Torres',
    doctorId: 'D002', doctorName: 'Dr. Lalaine Cana',
    date: '2026-03-26', time: '3:00 PM', type: 'Eye Examination', status: 'pending', notes: 'IOP follow-up' },

  // ── Dr. Christian Garabiles (Tue/Thu) ────────────────
  { id: 'A018', patientId: 'P001', patientName: 'Maria Santos',
    doctorId: 'D004', doctorName: 'Dr. Christian Garabiles',
    date: '2026-03-24', time: '9:00 AM', type: 'Eye Examination', status: 'approved', notes: '' },
  { id: 'A019', patientId: 'P002', patientName: 'Jose Reyes',
    doctorId: 'D004', doctorName: 'Dr. Christian Garabiles',
    date: '2026-03-26', time: '11:00 AM', type: 'Follow-up Consultation', status: 'approved', notes: 'Glasses adjustment' },
  { id: 'A020', patientId: 'P003', patientName: 'Ana Garcia',
    doctorId: 'D004', doctorName: 'Dr. Christian Garabiles',
    date: '2026-03-17', time: '2:00 PM', type: 'Eye Examination', status: 'completed', notes: '' },
  { id: 'A021', patientId: 'P004', patientName: 'Carlo Mendoza',
    doctorId: 'D004', doctorName: 'Dr. Christian Garabiles',
    date: '2026-04-02', time: '9:00 AM', type: 'Eye Examination', status: 'pending', notes: 'First visit' },
  { id: 'A022', patientId: 'P005', patientName: 'Rosa Dela Cruz',
    doctorId: 'D004', doctorName: 'Dr. Christian Garabiles',
    date: '2026-03-19', time: '10:00 AM', type: 'Eye Examination', status: 'cancelled', notes: 'Patient cancelled — rescheduling' },

  // ── Dr. Carmen Sumaya (Mon/Tue/Thu) ───────────────────
  { id: 'A023', patientId: 'P001', patientName: 'Maria Santos',
    doctorId: 'D005', doctorName: 'Dr. Carmen Sumaya',
    date: '2026-03-23', time: '2:00 PM', type: 'Follow-up Consultation', status: 'approved', notes: '' },
  { id: 'A024', patientId: 'P002', patientName: 'Jose Reyes',
    doctorId: 'D005', doctorName: 'Dr. Carmen Sumaya',
    date: '2026-03-24', time: '10:00 AM', type: 'Eye Examination', status: 'pending', notes: '' },
  { id: 'A025', patientId: 'P006', patientName: 'Benjamin Torres',
    doctorId: 'D005', doctorName: 'Dr. Carmen Sumaya',
    date: '2026-03-12', time: '9:00 AM', type: 'Eye Examination', status: 'completed', notes: 'No significant change in prescription' },
  { id: 'A026', patientId: 'P003', patientName: 'Ana Garcia',
    doctorId: 'D005', doctorName: 'Dr. Carmen Sumaya',
    date: '2026-03-26', time: '1:00 PM', type: 'Eye Examination', status: 'approved', notes: '' },

  // ── Dr. Julianne Rosche Cana (Wed/Fri) ───────────────
  { id: 'A027', patientId: 'P004', patientName: 'Carlo Mendoza',
    doctorId: 'D006', doctorName: 'Dr. Julianne Rosche Cana',
    date: '2026-03-25', time: '10:00 AM', type: 'Eye Examination', status: 'approved', notes: '' },
  { id: 'A028', patientId: 'P005', patientName: 'Rosa Dela Cruz',
    doctorId: 'D006', doctorName: 'Dr. Julianne Rosche Cana',
    date: '2026-03-27', time: '2:00 PM', type: 'Follow-up Consultation', status: 'pending', notes: '' },
  { id: 'A029', patientId: 'P001', patientName: 'Maria Santos',
    doctorId: 'D006', doctorName: 'Dr. Julianne Rosche Cana',
    date: '2026-03-20', time: '11:00 AM', type: 'Eye Examination', status: 'completed', notes: 'Prescription unchanged' },
  { id: 'A030', patientId: 'P002', patientName: 'Jose Reyes',
    doctorId: 'D006', doctorName: 'Dr. Julianne Rosche Cana',
    date: '2026-04-04', time: '9:00 AM', type: 'Eye Examination', status: 'pending', notes: '' },

  // ── Dr. Lalaine Cana ────────────────────────────────────────────
  { id: 'A031', patientId: 'P001', patientName: 'Maria Santos',
    doctorId: 'D002', doctorName: 'Dr. Lalaine Cana',
    date: '2026-03-23', time: '9:00 AM', type: 'Eye Examination', status: 'approved', notes: '' },
  { id: 'A032', patientId: 'P002', patientName: 'Jose Reyes',
    doctorId: 'D002', doctorName: 'Dr. Lalaine Cana',
    date: '2026-03-25', time: '11:00 AM', type: 'Follow-up Consultation', status: 'pending', notes: '' },
  { id: 'A033', patientId: 'P003', patientName: 'Ana Garcia',
    doctorId: 'D002', doctorName: 'Dr. Lalaine Cana',
    date: '2026-03-19', time: '2:00 PM', type: 'Eye Examination', status: 'completed', notes: '' },
  { id: 'A034', patientId: 'P004', patientName: 'Carlo Mendoza',
    doctorId: 'D002', doctorName: 'Dr. Lalaine Cana',
    date: '2026-03-24', time: '3:00 PM', type: 'Eye Examination', status: 'approved', notes: '' },

  // ── Dr. Ruziel Palaje ────────────────────────────────────────────
  { id: 'A035', patientId: 'P001', patientName: 'Maria Santos',
    doctorId: 'D001', doctorName: 'Dr. Ruziel Palaje',
    date: '2026-03-23', time: '9:00 AM', type: 'Eye Examination', status: 'approved', notes: '' },
  { id: 'A036', patientId: 'P002', patientName: 'Jose Reyes',
    doctorId: 'D001', doctorName: 'Dr. Ruziel Palaje',
    date: '2026-03-23', time: '10:30 AM', type: 'Eye Examination', status: 'approved', notes: '' },
  { id: 'A037', patientId: 'P003', patientName: 'Ana Garcia',
    doctorId: 'D001', doctorName: 'Dr. Ruziel Palaje',
    date: '2026-03-23', time: '1:00 PM', type: 'Follow-up Consultation', status: 'approved', notes: 'Prescription review' },
  { id: 'A038', patientId: 'P004', patientName: 'Carlo Mendoza',
    doctorId: 'D001', doctorName: 'Dr. Ruziel Palaje',
    date: '2026-03-25', time: '9:00 AM', type: 'Eye Examination', status: 'pending', notes: '' },
  { id: 'A039', patientId: 'P005', patientName: 'Rosa Dela Cruz',
    doctorId: 'D001', doctorName: 'Dr. Ruziel Palaje',
    date: '2026-03-25', time: '11:00 AM', type: 'Eye Examination', status: 'pending', notes: 'First-time patient' },
  { id: 'A040', patientId: 'P006', patientName: 'Benjamin Torres',
    doctorId: 'D001', doctorName: 'Dr. Ruziel Palaje',
    date: '2026-03-14', time: '9:00 AM', type: 'Eye Examination', status: 'completed', notes: 'IOP stable' },
  { id: 'A041', patientId: 'P001', patientName: 'Maria Santos',
    doctorId: 'D001', doctorName: 'Dr. Ruziel Palaje',
    date: '2026-03-28', time: '10:00 AM', type: 'Follow-up Consultation', status: 'pending', notes: '' },

  // ── Dr. Ruziel Palaje — additional March coverage (Mon/Wed/Fri) ──
  { id: 'A042', patientId: 'P002', patientName: 'Jose Reyes',       doctorId: 'D001', doctorName: 'Dr. Ruziel Palaje',         date: '2026-03-02', time: '9:00 AM',  type: 'Eye Examination',        status: 'completed', notes: '' },
  { id: 'A043', patientId: 'P004', patientName: 'Carlo Mendoza',    doctorId: 'D001', doctorName: 'Dr. Ruziel Palaje',         date: '2026-03-02', time: '11:00 AM', type: 'Eye Examination',          status: 'completed', notes: '' },
  { id: 'A044', patientId: 'P005', patientName: 'Rosa Dela Cruz',   doctorId: 'D001', doctorName: 'Dr. Ruziel Palaje',         date: '2026-03-04', time: '9:00 AM',  type: 'Follow-up Consultation',  status: 'completed', notes: '' },
  { id: 'A045', patientId: 'P003', patientName: 'Ana Garcia',       doctorId: 'D001', doctorName: 'Dr. Ruziel Palaje',         date: '2026-03-06', time: '10:00 AM', type: 'Eye Examination',        status: 'completed', notes: '' },
  { id: 'A046', patientId: 'P006', patientName: 'Benjamin Torres',  doctorId: 'D001', doctorName: 'Dr. Ruziel Palaje',         date: '2026-03-09', time: '2:00 PM',  type: 'Follow-up Consultation',     status: 'completed', notes: '' },
  { id: 'A047', patientId: 'P001', patientName: 'Maria Santos',     doctorId: 'D001', doctorName: 'Dr. Ruziel Palaje',         date: '2026-03-11', time: '9:00 AM',  type: 'Eye Examination',        status: 'completed', notes: '' },
  { id: 'A048', patientId: 'P002', patientName: 'Jose Reyes',       doctorId: 'D001', doctorName: 'Dr. Ruziel Palaje',         date: '2026-03-13', time: '11:00 AM', type: 'Eye Examination',          status: 'completed', notes: '' },
  { id: 'A049', patientId: 'P004', patientName: 'Carlo Mendoza',    doctorId: 'D001', doctorName: 'Dr. Ruziel Palaje',         date: '2026-03-18', time: '9:00 AM',  type: 'Follow-up Consultation',  status: 'completed', notes: '' },
  { id: 'A050', patientId: 'P005', patientName: 'Rosa Dela Cruz',   doctorId: 'D001', doctorName: 'Dr. Ruziel Palaje',         date: '2026-03-20', time: '2:00 PM',  type: 'Eye Examination',        status: 'completed', notes: '' },

  // ── Dr. Lalaine Cana — additional March coverage (Mon–Fri) ──────
  { id: 'A051', patientId: 'P003', patientName: 'Ana Garcia',       doctorId: 'D002', doctorName: 'Dr. Lalaine Cana',          date: '2026-03-02', time: '9:00 AM',  type: 'Eye Examination',        status: 'completed', notes: '' },
  { id: 'A052', patientId: 'P006', patientName: 'Benjamin Torres',  doctorId: 'D002', doctorName: 'Dr. Lalaine Cana',          date: '2026-03-03', time: '10:30 AM', type: 'Follow-up Consultation',  status: 'completed', notes: '' },
  { id: 'A053', patientId: 'P004', patientName: 'Carlo Mendoza',    doctorId: 'D002', doctorName: 'Dr. Lalaine Cana',          date: '2026-03-05', time: '2:00 PM',  type: 'Eye Examination',          status: 'completed', notes: '' },
  { id: 'A054', patientId: 'P001', patientName: 'Maria Santos',     doctorId: 'D002', doctorName: 'Dr. Lalaine Cana',          date: '2026-03-09', time: '9:00 AM',  type: 'Eye Examination',        status: 'completed', notes: '' },
  { id: 'A055', patientId: 'P002', patientName: 'Jose Reyes',       doctorId: 'D002', doctorName: 'Dr. Lalaine Cana',          date: '2026-03-10', time: '11:00 AM', type: 'Follow-up Consultation',     status: 'completed', notes: '' },
  { id: 'A056', patientId: 'P005', patientName: 'Rosa Dela Cruz',   doctorId: 'D002', doctorName: 'Dr. Lalaine Cana',          date: '2026-03-12', time: '9:00 AM',  type: 'Eye Examination',    status: 'completed', notes: '' },
  { id: 'A057', patientId: 'P003', patientName: 'Ana Garcia',       doctorId: 'D002', doctorName: 'Dr. Lalaine Cana',          date: '2026-03-16', time: '2:00 PM',  type: 'Eye Examination',        status: 'completed', notes: '' },
  { id: 'A058', patientId: 'P006', patientName: 'Benjamin Torres',  doctorId: 'D002', doctorName: 'Dr. Lalaine Cana',          date: '2026-03-17', time: '10:00 AM', type: 'Follow-up Consultation',  status: 'completed', notes: '' },
  { id: 'A059', patientId: 'P001', patientName: 'Maria Santos',     doctorId: 'D002', doctorName: 'Dr. Lalaine Cana',          date: '2026-03-18', time: '3:00 PM',  type: 'Eye Examination',          status: 'completed', notes: '' },
  { id: 'A060', patientId: 'P004', patientName: 'Carlo Mendoza',    doctorId: 'D002', doctorName: 'Dr. Lalaine Cana',          date: '2026-03-30', time: '9:00 AM',  type: 'Eye Examination',        status: 'pending',   notes: '' },

  // ── Dr. Christian Garabiles — additional March coverage (Tue/Thu) ──
  { id: 'A061', patientId: 'P001', patientName: 'Maria Santos',     doctorId: 'D004', doctorName: 'Dr. Christian Garabiles',   date: '2026-03-03', time: '9:00 AM',  type: 'Eye Examination',        status: 'completed', notes: '' },
  { id: 'A062', patientId: 'P002', patientName: 'Jose Reyes',       doctorId: 'D004', doctorName: 'Dr. Christian Garabiles',   date: '2026-03-05', time: '11:00 AM', type: 'Eye Examination',          status: 'completed', notes: '' },
  { id: 'A063', patientId: 'P006', patientName: 'Benjamin Torres',  doctorId: 'D004', doctorName: 'Dr. Christian Garabiles',   date: '2026-03-10', time: '9:00 AM',  type: 'Follow-up Consultation',  status: 'completed', notes: '' },
  { id: 'A064', patientId: 'P003', patientName: 'Ana Garcia',       doctorId: 'D004', doctorName: 'Dr. Christian Garabiles',   date: '2026-03-12', time: '2:00 PM',  type: 'Eye Examination',        status: 'completed', notes: '' },
  { id: 'A065', patientId: 'P005', patientName: 'Rosa Dela Cruz',   doctorId: 'D004', doctorName: 'Dr. Christian Garabiles',   date: '2026-03-31', time: '10:00 AM', type: 'Follow-up Consultation',     status: 'pending',   notes: '' },
  { id: 'A066', patientId: 'P004', patientName: 'Carlo Mendoza',    doctorId: 'D004', doctorName: 'Dr. Christian Garabiles',   date: '2026-03-31', time: '1:00 PM',  type: 'Eye Examination',    status: 'pending',   notes: '' },

  // ── Dr. Carmen Sumaya — additional March coverage (Mon/Tue/Thu) ──
  { id: 'A067', patientId: 'P002', patientName: 'Jose Reyes',       doctorId: 'D005', doctorName: 'Dr. Carmen Sumaya',         date: '2026-03-02', time: '9:00 AM',  type: 'Eye Examination',        status: 'completed', notes: '' },
  { id: 'A068', patientId: 'P004', patientName: 'Carlo Mendoza',    doctorId: 'D005', doctorName: 'Dr. Carmen Sumaya',         date: '2026-03-03', time: '10:30 AM', type: 'Follow-up Consultation',  status: 'completed', notes: '' },
  { id: 'A069', patientId: 'P001', patientName: 'Maria Santos',     doctorId: 'D005', doctorName: 'Dr. Carmen Sumaya',         date: '2026-03-05', time: '2:00 PM',  type: 'Eye Examination',          status: 'completed', notes: '' },
  { id: 'A070', patientId: 'P006', patientName: 'Benjamin Torres',  doctorId: 'D005', doctorName: 'Dr. Carmen Sumaya',         date: '2026-03-09', time: '9:00 AM',  type: 'Eye Examination',    status: 'completed', notes: '' },
  { id: 'A071', patientId: 'P003', patientName: 'Ana Garcia',       doctorId: 'D005', doctorName: 'Dr. Carmen Sumaya',         date: '2026-03-10', time: '11:00 AM', type: 'Eye Examination',        status: 'completed', notes: '' },
  { id: 'A072', patientId: 'P005', patientName: 'Rosa Dela Cruz',   doctorId: 'D005', doctorName: 'Dr. Carmen Sumaya',         date: '2026-03-17', time: '2:00 PM',  type: 'Follow-up Consultation',     status: 'completed', notes: '' },
  { id: 'A073', patientId: 'P002', patientName: 'Jose Reyes',       doctorId: 'D005', doctorName: 'Dr. Carmen Sumaya',         date: '2026-03-30', time: '9:00 AM',  type: 'Eye Examination',        status: 'pending',   notes: '' },
  { id: 'A074', patientId: 'P001', patientName: 'Maria Santos',     doctorId: 'D005', doctorName: 'Dr. Carmen Sumaya',         date: '2026-03-31', time: '11:00 AM', type: 'Follow-up Consultation',  status: 'pending',   notes: '' },

  // ── Dr. Julianne Rosche Cana — additional March coverage (Wed/Fri) ──
  { id: 'A075', patientId: 'P003', patientName: 'Ana Garcia',       doctorId: 'D006', doctorName: 'Dr. Julianne Rosche Cana',  date: '2026-03-04', time: '10:00 AM', type: 'Eye Examination',        status: 'completed', notes: '' },
  { id: 'A076', patientId: 'P005', patientName: 'Rosa Dela Cruz',   doctorId: 'D006', doctorName: 'Dr. Julianne Rosche Cana',  date: '2026-03-06', time: '2:00 PM',  type: 'Follow-up Consultation',  status: 'completed', notes: '' },
  { id: 'A077', patientId: 'P001', patientName: 'Maria Santos',     doctorId: 'D006', doctorName: 'Dr. Julianne Rosche Cana',  date: '2026-03-11', time: '9:00 AM',  type: 'Eye Examination',          status: 'completed', notes: '' },
  { id: 'A078', patientId: 'P004', patientName: 'Carlo Mendoza',    doctorId: 'D006', doctorName: 'Dr. Julianne Rosche Cana',  date: '2026-03-13', time: '11:00 AM', type: 'Eye Examination',        status: 'completed', notes: '' },
  { id: 'A079', patientId: 'P002', patientName: 'Jose Reyes',       doctorId: 'D006', doctorName: 'Dr. Julianne Rosche Cana',  date: '2026-03-18', time: '3:00 PM',  type: 'Follow-up Consultation',     status: 'completed', notes: '' },
  { id: 'A080', patientId: 'P006', patientName: 'Benjamin Torres',  doctorId: 'D006', doctorName: 'Dr. Julianne Rosche Cana',  date: '2026-03-04', time: '2:00 PM',  type: 'Eye Examination',    status: 'completed', notes: '' },

  // ── Dr. Lalaine Cana — additional March coverage (reassigned) ──
  { id: 'A081', patientId: 'P001', patientName: 'Maria Santos',     doctorId: 'D002', doctorName: 'Dr. Lalaine Cana',          date: '2026-03-02', time: '9:00 AM',  type: 'Eye Examination',        status: 'completed', notes: '' },
  { id: 'A082', patientId: 'P002', patientName: 'Jose Reyes',       doctorId: 'D002', doctorName: 'Dr. Lalaine Cana',          date: '2026-03-03', time: '11:00 AM', type: 'Follow-up Consultation',  status: 'completed', notes: '' },
  { id: 'A083', patientId: 'P006', patientName: 'Benjamin Torres',  doctorId: 'D002', doctorName: 'Dr. Lalaine Cana',          date: '2026-03-05', time: '2:00 PM',  type: 'Eye Examination',          status: 'completed', notes: '' },
  { id: 'A084', patientId: 'P003', patientName: 'Ana Garcia',       doctorId: 'D002', doctorName: 'Dr. Lalaine Cana',          date: '2026-03-09', time: '9:00 AM',  type: 'Eye Examination',        status: 'completed', notes: '' },
  { id: 'A085', patientId: 'P004', patientName: 'Carlo Mendoza',    doctorId: 'D002', doctorName: 'Dr. Lalaine Cana',          date: '2026-03-10', time: '10:30 AM', type: 'Eye Examination',    status: 'completed', notes: '' },
  { id: 'A086', patientId: 'P005', patientName: 'Rosa Dela Cruz',   doctorId: 'D002', doctorName: 'Dr. Lalaine Cana',          date: '2026-03-16', time: '9:00 AM',  type: 'Follow-up Consultation',  status: 'completed', notes: '' },
  { id: 'A087', patientId: 'P001', patientName: 'Maria Santos',     doctorId: 'D002', doctorName: 'Dr. Lalaine Cana',          date: '2026-03-17', time: '2:00 PM',  type: 'Eye Examination',        status: 'completed', notes: '' },
  { id: 'A088', patientId: 'P002', patientName: 'Jose Reyes',       doctorId: 'D002', doctorName: 'Dr. Lalaine Cana',          date: '2026-03-26', time: '11:00 AM', type: 'Eye Examination',          status: 'approved',  notes: '' },
  { id: 'A089', patientId: 'P006', patientName: 'Benjamin Torres',  doctorId: 'D002', doctorName: 'Dr. Lalaine Cana',          date: '2026-03-27', time: '9:00 AM',  type: 'Follow-up Consultation',     status: 'approved',  notes: '' },

  // ── Dr. Ruziel Palaje — additional March coverage (reassigned) ──
  { id: 'A090', patientId: 'P003', patientName: 'Ana Garcia',       doctorId: 'D001', doctorName: 'Dr. Ruziel Palaje',         date: '2026-03-02', time: '9:00 AM',  type: 'Eye Examination',        status: 'completed', notes: '' },
  { id: 'A091', patientId: 'P006', patientName: 'Benjamin Torres',  doctorId: 'D001', doctorName: 'Dr. Ruziel Palaje',         date: '2026-03-02', time: '11:00 AM', type: 'Eye Examination',          status: 'completed', notes: '' },
  { id: 'A092', patientId: 'P004', patientName: 'Carlo Mendoza',    doctorId: 'D001', doctorName: 'Dr. Ruziel Palaje',         date: '2026-03-04', time: '10:00 AM', type: 'Follow-up Consultation',  status: 'completed', notes: '' },
  { id: 'A093', patientId: 'P002', patientName: 'Jose Reyes',       doctorId: 'D001', doctorName: 'Dr. Ruziel Palaje',         date: '2026-03-06', time: '9:00 AM',  type: 'Eye Examination',        status: 'completed', notes: '' },
  { id: 'A094', patientId: 'P005', patientName: 'Rosa Dela Cruz',   doctorId: 'D001', doctorName: 'Dr. Ruziel Palaje',         date: '2026-03-06', time: '11:00 AM', type: 'Follow-up Consultation',     status: 'completed', notes: '' },
  { id: 'A095', patientId: 'P001', patientName: 'Maria Santos',     doctorId: 'D001', doctorName: 'Dr. Ruziel Palaje',         date: '2026-03-13', time: '9:00 AM',  type: 'Eye Examination',          status: 'completed', notes: '' },
  { id: 'A096', patientId: 'P003', patientName: 'Ana Garcia',       doctorId: 'D001', doctorName: 'Dr. Ruziel Palaje',         date: '2026-03-13', time: '11:00 AM', type: 'Eye Examination',        status: 'completed', notes: '' },
  { id: 'A097', patientId: 'P004', patientName: 'Carlo Mendoza',    doctorId: 'D001', doctorName: 'Dr. Ruziel Palaje',         date: '2026-03-27', time: '9:00 AM',  type: 'Follow-up Consultation',  status: 'pending',   notes: '' },
  { id: 'A098', patientId: 'P006', patientName: 'Benjamin Torres',  doctorId: 'D001', doctorName: 'Dr. Ruziel Palaje',         date: '2026-03-27', time: '11:00 AM', type: 'Eye Examination',    status: 'pending',   notes: '' },

  // ── Today's Appointments (dynamic — always today) ──────────────
  { id: 'A099', patientId: 'P001', patientName: 'Maria Santos',     doctorId: 'D001', doctorName: 'Dr. Ruziel Palaje',         date: new Date().toISOString().split('T')[0], time: '9:00 AM',  type: 'Eye Examination',         status: 'completed', notes: '' },
  { id: 'A100', patientId: 'P002', patientName: 'Jose Reyes',       doctorId: 'D001', doctorName: 'Dr. Ruziel Palaje',         date: new Date().toISOString().split('T')[0], time: '10:00 AM', type: 'Follow-up Consultation',  status: 'approved',  notes: '' },
  { id: 'A101', patientId: 'P004', patientName: 'Carlo Mendoza',    doctorId: 'D001', doctorName: 'Dr. Ruziel Palaje',         date: new Date().toISOString().split('T')[0], time: '11:00 AM', type: 'Eye Examination',          status: 'approved',  notes: '' },
  { id: 'A102', patientId: 'P003', patientName: 'Ana Garcia',       doctorId: 'D002', doctorName: 'Dr. Lalaine Cana',          date: new Date().toISOString().split('T')[0], time: '2:00 PM',  type: 'Eye Examination',         status: 'approved',  notes: '' },
  { id: 'A103', patientId: 'P005', patientName: 'Rosa Dela Cruz',   doctorId: 'D002', doctorName: 'Dr. Lalaine Cana',          date: new Date().toISOString().split('T')[0], time: '3:00 PM',  type: 'Follow-up Consultation',  status: 'approved',  notes: 'Post-prescription check' }
]

var activityLog = [
  { id: 'L001', user: 'Roberto Cruz',      role: 'Admin',   action: 'Logged in to the system',                                                          timestamp: '2026-04-14 08:02:11', type: 'login' },
  { id: 'L002', user: 'Ana Lim',           role: 'Staff',   action: 'Logged in to the system',                                                          timestamp: '2026-04-14 08:15:44', type: 'login' },
  { id: 'L003', user: 'Dr. Ruziel Palaje', role: 'Doctor',  action: 'Logged in to the system',                                                          timestamp: '2026-04-14 08:30:00', type: 'login' },
  { id: 'L004', user: 'Maria Santos',      role: 'Patient', action: 'Logged in to patient portal',                                                       timestamp: '2026-04-14 09:05:22', type: 'login' },
  { id: 'L005', user: 'Ana Lim',           role: 'Staff',   action: 'Added new patient record: Angela Lim (P007)',                                       timestamp: '2026-04-14 09:12:38', type: 'patient' },
  { id: 'L006', user: 'Roberto Cruz',      role: 'Admin',   action: 'Approved appointment A090 for Angela Lim',                                         timestamp: '2026-04-14 09:20:05', type: 'appointment' },
  { id: 'L007', user: 'Dr. Ruziel Palaje', role: 'Doctor',  action: 'Saved optical examination for Angela Lim (E010)',                                  timestamp: '2026-04-14 10:45:30', type: 'examination' },
  { id: 'L008', user: 'Carlos Tan',        role: 'Staff',   action: 'Generated Patient Visit Summary report for April 2026',                            timestamp: '2026-04-14 11:00:14', type: 'report' },
  { id: 'L009', user: 'Roberto Cruz',      role: 'Admin',   action: 'Updated doctor schedule for Dr. Ruziel Palaje — added Saturday morning slots',     timestamp: '2026-04-14 11:15:00', type: 'schedule' },
  { id: 'L010', user: 'Ana Lim',           role: 'Staff',   action: 'Added new patient record: Ricardo Bautista (P008)',                                 timestamp: '2026-04-14 11:30:55', type: 'patient' },
  { id: 'L011', user: 'Roberto Cruz',      role: 'Admin',   action: 'Archived appointment A012 — patient no-show, past date',                           timestamp: '2026-04-14 11:45:20', type: 'archive' },
  { id: 'L012', user: 'Dr. Lalaine Cana',  role: 'Doctor',  action: 'Logged in to the system',                                                          timestamp: '2026-04-14 13:00:08', type: 'login' },
  { id: 'L013', user: 'Dr. Lalaine Cana',  role: 'Doctor',  action: 'Saved optical examination for Ricardo Bautista (E011)',                            timestamp: '2026-04-14 14:22:47', type: 'examination' },
  { id: 'L014', user: 'Maria Santos',      role: 'Patient', action: 'Requested appointment A095 with Dr. Ruziel Palaje',                                timestamp: '2026-04-14 15:10:33', type: 'appointment' },
  { id: 'L015', user: 'Roberto Cruz',      role: 'Admin',   action: 'Updated clinic settings — holiday schedule for April 2026',                        timestamp: '2026-04-14 15:30:00', type: 'settings' },
  { id: 'L016', user: 'Ana Lim',           role: 'Staff',   action: 'Approved appointment A095 for Maria Santos',                                       timestamp: '2026-04-14 15:45:18', type: 'appointment' },
  { id: 'L017', user: 'Roberto Cruz',      role: 'Admin',   action: 'Created new staff account: Lorna Bacus (S003)',                                     timestamp: '2026-04-13 09:05:00', type: 'account' },
  { id: 'L018', user: 'Carlos Tan',        role: 'Staff',   action: 'Logged in to the system',                                                          timestamp: '2026-04-13 08:20:10', type: 'login' },
  { id: 'L019', user: 'Carlos Tan',        role: 'Staff',   action: 'Updated contact information for Jose Reyes (P002)',                                timestamp: '2026-04-13 09:40:55', type: 'patient' },
  { id: 'L020', user: 'Roberto Cruz',      role: 'Admin',   action: 'Generated Revenue Report for Q1 2026',                                             timestamp: '2026-04-13 10:00:00', type: 'report' },
  { id: 'L021', user: 'Dr. Ruziel Palaje', role: 'Doctor',  action: 'Updated schedule — blocked April 18 for medical conference',                       timestamp: '2026-04-13 10:30:22', type: 'schedule' },
  { id: 'L022', user: 'Ana Lim',           role: 'Staff',   action: 'Archived patient record for inactive account P022 (Anthony Reyes)',                timestamp: '2026-04-13 11:00:47', type: 'archive' },
  { id: 'L023', user: 'Jose Reyes',        role: 'Patient', action: 'Logged in to patient portal',                                                       timestamp: '2026-04-13 11:20:00', type: 'login' },
  { id: 'L024', user: 'Jose Reyes',        role: 'Patient', action: 'Requested appointment A096 with Dr. Lalaine Cana',                                 timestamp: '2026-04-13 11:25:14', type: 'appointment' },
  { id: 'L025', user: 'Dr. Lalaine Cana',  role: 'Doctor',  action: 'Saved optical examination for Sofia Ramos (E012)',                                 timestamp: '2026-04-13 14:10:05', type: 'examination' },
  { id: 'L026', user: 'Roberto Cruz',      role: 'Admin',   action: 'Reset password for staff account: Ana Lim',                                        timestamp: '2026-04-12 09:00:00', type: 'account' },
  { id: 'L027', user: 'Ana Lim',           role: 'Staff',   action: 'Added new patient record: Patricia Navarro (P009)',                                 timestamp: '2026-04-12 09:30:48', type: 'patient' },
  { id: 'L028', user: 'Carlos Tan',        role: 'Staff',   action: 'Disapproved appointment A082 — outside clinic hours',                              timestamp: '2026-04-12 10:05:30', type: 'appointment' },
  { id: 'L029', user: 'Roberto Cruz',      role: 'Admin',   action: 'Updated doctor schedule for Dr. Lalaine Cana — extended Friday hours',             timestamp: '2026-04-12 10:45:00', type: 'schedule' },
  { id: 'L030', user: 'Dr. Ruziel Palaje', role: 'Doctor',  action: 'Saved optical examination for Daniel Aquino (E013)',                               timestamp: '2026-04-12 11:30:20', type: 'examination' },
  { id: 'L031', user: 'Ana Lim',           role: 'Staff',   action: 'Generated Appointment Summary report for March 2026',                              timestamp: '2026-04-12 13:00:00', type: 'report' },
  { id: 'L032', user: 'Roberto Cruz',      role: 'Admin',   action: 'Archived old examination records from 2023 (batch of 18)',                         timestamp: '2026-04-12 14:00:00', type: 'archive' },
  { id: 'L033', user: 'Ana Garcia',        role: 'Patient', action: 'Logged in to patient portal',                                                       timestamp: '2026-04-11 10:00:22', type: 'login' },
  { id: 'L034', user: 'Ana Garcia',        role: 'Patient', action: 'Requested appointment A097 with Dr. Ruziel Palaje',                                timestamp: '2026-04-11 10:08:45', type: 'appointment' },
  { id: 'L035', user: 'Roberto Cruz',      role: 'Admin',   action: 'Updated clinic settings — SMS reminder interval changed to 24 hours',              timestamp: '2026-04-11 11:00:00', type: 'settings' },
  { id: 'L036', user: 'Carlos Tan',        role: 'Staff',   action: 'Updated address for Catherine De Leon (P013)',                                     timestamp: '2026-04-11 11:20:33', type: 'patient' },
  { id: 'L037', user: 'Dr. Lalaine Cana',  role: 'Doctor',  action: 'Saved optical examination for Marco Villanueva (E014)',                            timestamp: '2026-04-11 14:00:10', type: 'examination' },
  { id: 'L038', user: 'Roberto Cruz',      role: 'Admin',   action: 'Deactivated staff account: Lorna Bacus (S003) — on leave',                         timestamp: '2026-04-10 09:00:00', type: 'account' },
  { id: 'L039', user: 'Ana Lim',           role: 'Staff',   action: 'Added new patient record: Miguel Flores (P010)',                                   timestamp: '2026-04-10 09:30:15', type: 'patient' },
  { id: 'L040', user: 'Roberto Cruz',      role: 'Admin',   action: 'Approved appointment A093 for Vincent Gonzales',                                   timestamp: '2026-04-10 10:00:00', type: 'appointment' },
  { id: 'L041', user: 'Dr. Ruziel Palaje', role: 'Doctor',  action: 'Generated Examination Records report for March 2026',                              timestamp: '2026-04-10 10:30:00', type: 'report' },
  { id: 'L042', user: 'Roberto Cruz',      role: 'Admin',   action: 'Updated doctor schedule — added Dr. Ruziel Palaje Wednesdays 1 PM–5 PM',          timestamp: '2026-04-10 11:00:00', type: 'schedule' },
  { id: 'L043', user: 'Ana Lim',           role: 'Staff',   action: 'Archived appointment A015 — completed and past retention period',                  timestamp: '2026-04-10 11:30:00', type: 'archive' },
  { id: 'L044', user: 'Benjamin Torres',   role: 'Patient', action: 'Logged in to patient portal',                                                       timestamp: '2026-04-09 09:00:55', type: 'login' },
  { id: 'L045', user: 'Benjamin Torres',   role: 'Patient', action: 'Requested appointment A098 with Dr. Ruziel Palaje',                                timestamp: '2026-04-09 09:10:22', type: 'appointment' },
  { id: 'L046', user: 'Carlos Tan',        role: 'Staff',   action: 'Updated insurance details for Rosa Dela Cruz (P005)',                              timestamp: '2026-04-09 10:00:00', type: 'patient' },
  { id: 'L047', user: 'Roberto Cruz',      role: 'Admin',   action: 'Updated clinic settings — email notification template revised',                    timestamp: '2026-04-09 10:30:00', type: 'settings' },
  { id: 'L048', user: 'Dr. Lalaine Cana',  role: 'Doctor',  action: 'Saved optical examination for Jasmine Cruz (E015)',                                timestamp: '2026-04-09 14:00:00', type: 'examination' },
  { id: 'L049', user: 'Roberto Cruz',      role: 'Admin',   action: 'Created new doctor account: Dr. Marco Salazar (D003)',                             timestamp: '2026-04-08 09:00:00', type: 'account' },
  { id: 'L050', user: 'Ana Lim',           role: 'Staff',   action: 'Generated Prescription Summary report for Q1 2026',                               timestamp: '2026-04-08 10:00:00', type: 'report' },
  { id: 'L051', user: 'Roberto Cruz',      role: 'Admin',   action: 'Archived 12 inactive patient records — last visit before 2024',                   timestamp: '2026-04-08 11:00:00', type: 'archive' },
  { id: 'L052', user: 'Roberto Cruz',      role: 'Admin',   action: 'Updated doctor schedule — blocked April 9–10 for Dr. Lalaine Cana (leave)',       timestamp: '2026-04-07 15:00:00', type: 'schedule' }
]

function getExamRecords() {
  var result = []
  patients.forEach(function(p) {
    ;(p.examinations || []).forEach(function(e) {
      var od = e.od || {}
      var os = e.os || {}
      var sph = function(v) { return v && v !== '0.00' ? v : '' }
      var cyl = function(v) { return v && v !== '0.00' ? v : '' }
      var rxStr = function(eye) {
        var parts = [eye.sph || '']
        if (eye.cyl && eye.cyl !== '0.00') parts.push(eye.cyl + (eye.axis ? ' ×' + eye.axis : ''))
        if (eye.add && eye.add !== '0.00') parts.push('Add ' + eye.add)
        return parts.filter(Boolean).join(' ')
      }
      result.push({
        id:                  e.id,
        patientId:           p.id,
        patientName:         p.name,
        doctor:              e.doctor || '',
        date:                e.date   || '',
        diagnosis:           e.diagnosis           || '',
        lensType:            e.lensType            || '—',
        lensMaterial:        e.lensMaterial        || '',
        lensCoating:         e.lensCoating         || [],
        frameSelection:      e.frameSelection      || '',
        status:              e.status              || 'completed',
        od:                  od,
        os:                  os,
        iop:                 e.iop                 || {},
        pd:                  e.pd                  || '',
        recommendation:      e.recommendation      || '',
        testResults:         e.testResults         || '',
        prescriptionDetails: e.prescriptionDetails || ('OD: ' + rxStr(od) + ' / OS: ' + rxStr(os)).trim(),
        remarks:             e.remarks             || ''
      })
    })
  })
  result.sort(function(a, b) { return b.date.localeCompare(a.date) })
  return result
}

// Defaults shown until _syncClinicSettings() replaces these with live DB data.
var CLINIC_SERVICES = [
  { id: 1, name: 'Eye Examination',                   description: "A comprehensive assessment of the patient's eye condition to evaluate vision and overall eye health.",                    duration: 30, status: 'active', icon: 'eye' },
  { id: 2, name: 'Vision Screening',                  description: 'A basic check to determine if a patient has possible vision problems that may require further examination.',              duration: 15, status: 'active', icon: 'activity' },
  { id: 3, name: 'Refraction',                        description: "A procedure used to determine the correct lens power needed to improve the patient's vision.",                            duration: 25, status: 'active', icon: 'search' },
  { id: 4, name: 'Diagnosis of Refractive Errors',    description: 'Identification of vision conditions such as nearsightedness, farsightedness, and astigmatism.',                          duration: 25, status: 'active', icon: 'alert-circle' },
  { id: 5, name: 'Prescription of Corrective Lenses', description: "Issuance of eyeglass or contact lens prescriptions based on the patient's vision needs.",                               duration: 20, status: 'active', icon: 'file-text' },
  { id: 6, name: 'Lens Fitting',                      description: 'Adjustment and fitting of lenses to ensure proper alignment, comfort, and visual clarity.',                              duration: 20, status: 'active', icon: 'award' },
  { id: 7, name: 'Optical Frame Selection',           description: 'Assisting patients in choosing frames that fit properly and suit their preferences.',                                    duration: 15, status: 'active', icon: 'archive' },
  { id: 8, name: 'Follow-up Consultation',            description: "Subsequent visits to review the patient's vision condition and assess any changes after treatment or prescription.",     duration: 20, status: 'active', icon: 'refresh-cw' }
]
var _svcNextId = 9

var clinicInfo = {
  name: 'Cana Optical Clinic',
  tagline: 'Clear Vision. Compassionate Care.',
  address: 'Unit 3 Paseo de Carmona, Brgy. Maduya, Carmona, Cavite',
  phone: '0929 663 6080',
  mobile: '0929 663 6080',
  email: 'canaopticalclinic@gmail.com',
  hours: 'Monday – Saturday: 9:00 AM – 5:00 PM',
  tinNo: '123-456-789-000',
  phicNo: '01-123456789-0',
  logoUrl: null
}

var consultationSettings = {
  defaultDuration:         '30 min',
  maxAdvanceBooking:       '3 months',
  minAdvanceBooking:       '1 day',
  maxApptsPerDoctorPerDay: 12,
  morningStart:   '8:00 AM',
  morningEnd:     '12:00 PM',
  afternoonStart: '1:00 PM',
  afternoonEnd:   '5:00 PM',
  lunchBreak:  true,
  clinicDays:  ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
}

// Parses consultationSettings.minAdvanceBooking ('Same day','1 day','2 days',…)
// into the minimum number of days ahead a patient booking must be made.
// Booking calendars (wizard + Doctor Availability) read this so the rule
// stays in sync the moment admin changes it in Settings — no hardcoded "today".
function minAdvanceDays() {
  const v = (consultationSettings.minAdvanceBooking || '').toLowerCase()
  if (!v || v.includes('same')) return 0
  const m = v.match(/\d+/)
  return m ? parseInt(m[0], 10) : 1
}

function minAdvanceTooltip() {
  const n = minAdvanceDays()
  if (n === 0) return ''
  if (n === 1) return 'Same-day appointments are not available.'
  return `Appointments must be booked at least ${n} days in advance.`
}

// Helpers that work on the raw data
function getPatientById(id)     { return patients.find(p => p.id === id) }
function getDoctorById(id)      { return doctors.find(d => d.id === id) }
function getAppointmentById(id) { return appointments.find(a => a.id === id) }

function getAppointmentsForDoctor(doctorId) {
  return appointments.filter(a => a.doctorId === doctorId)
}
function getAppointmentsForPatient(patientId) {
  return appointments.filter(a => a.patientId === patientId)
}
function getTodayAppts() {
  const today = new Date().toISOString().split('T')[0]
  return appointments.filter(a => a.date === today)
}

function updateAppointmentStatus(id, status) {
  const a = appointments.find(a => a.id === id)
  if (a) {
    a.status = status
    // Deciding the appointment's status supersedes any reschedule request
    // still attached to it (mirrors the server-side clear in update.php)
    delete a.rescheduleRequest
  }
}

function addAppointment(appt) {
  appointments.push(appt)
}

function addActivityLog(entry) {
  activityLog.unshift(entry)
  fetch('api/activity/log.php', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry)
  }).catch(() => {})
}

// Build the flat "all users" list for User Management
function getAllUsers() {
  const rows = []
  admins.forEach(u  => rows.push({ ...u, role: 'Admin' }))
  staff.forEach(u   => rows.push({ ...u, role: 'Staff' }))
  doctors.forEach(u => rows.push({ ...u, role: 'Doctor' }))
  patients.forEach(u => rows.push({ ...u, role: 'Patient' }))
  return rows
}

// ── Archived Records (soft-deleted, Admin-only) ────────────────
var archivedRecords = []

function addArchivedRecord(entry) {
  archivedRecords.push(entry)
}

function removeArchivedRecord(id) {
  const idx = archivedRecords.findIndex(r => r.id === id)
  if (idx !== -1) archivedRecords.splice(idx, 1)
}

// ── Contact Messages (public contact-form submissions) ─────────
var contactMessages = []
