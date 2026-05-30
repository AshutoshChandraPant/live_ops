-- ============================================================
-- LiveOps Seed Data — Week: 26 May – 31 May 2026
-- Source: liveops test.xlsx + session_this_week_test.xlsx
-- Paste this into Supabase SQL Editor AFTER running schema.sql
-- ============================================================

-- ============================================================
-- STEP 1: Placeholder auth users for the ops team
-- After this runs, go to Supabase Dashboard → Authentication →
-- Users → each user → Send password reset email
-- ============================================================

INSERT INTO auth.users (
  id, instance_id, aud, role, email,
  encrypted_password, email_confirmed_at,
  created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data, is_super_admin
) VALUES
  ('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000000','authenticated','authenticated','megha@liveops.internal',       '','2026-01-01 00:00:00+00',now(),now(),'{"provider":"email","providers":["email"]}','{}',false),
  ('00000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000000','authenticated','authenticated','deepsikha@liveops.internal',   '','2026-01-01 00:00:00+00',now(),now(),'{"provider":"email","providers":["email"]}','{}',false),
  ('00000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000000','authenticated','authenticated','manasvi@liveops.internal',     '','2026-01-01 00:00:00+00',now(),now(),'{"provider":"email","providers":["email"]}','{}',false),
  ('00000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000000','authenticated','authenticated','garv@liveops.internal',        '','2026-01-01 00:00:00+00',now(),now(),'{"provider":"email","providers":["email"]}','{}',false),
  ('00000000-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000000','authenticated','authenticated','mustansir@liveops.internal',   '','2026-01-01 00:00:00+00',now(),now(),'{"provider":"email","providers":["email"]}','{}',false),
  ('00000000-0000-0000-0000-000000000006','00000000-0000-0000-0000-000000000000','authenticated','authenticated','mohit@liveops.internal',       '','2026-01-01 00:00:00+00',now(),now(),'{"provider":"email","providers":["email"]}','{}',false),
  ('00000000-0000-0000-0000-000000000007','00000000-0000-0000-0000-000000000000','authenticated','authenticated','saleha@liveops.internal',      '','2026-01-01 00:00:00+00',now(),now(),'{"provider":"email","providers":["email"]}','{}',false),
  ('00000000-0000-0000-0000-000000000008','00000000-0000-0000-0000-000000000000','authenticated','authenticated','anushka@liveops.internal',     '','2026-01-01 00:00:00+00',now(),now(),'{"provider":"email","providers":["email"]}','{}',false),
  ('00000000-0000-0000-0000-000000000009','00000000-0000-0000-0000-000000000000','authenticated','authenticated','akshat@liveops.internal',      '','2026-01-01 00:00:00+00',now(),now(),'{"provider":"email","providers":["email"]}','{}',false),
  ('00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000000','authenticated','authenticated','nandita@liveops.internal',     '','2026-01-01 00:00:00+00',now(),now(),'{"provider":"email","providers":["email"]}','{}',false),
  ('00000000-0000-0000-0000-000000000011','00000000-0000-0000-0000-000000000000','authenticated','authenticated','shivani@liveops.internal',     '','2026-01-01 00:00:00+00',now(),now(),'{"provider":"email","providers":["email"]}','{}',false),
  ('00000000-0000-0000-0000-000000000012','00000000-0000-0000-0000-000000000000','authenticated','authenticated','zoiba@liveops.internal',       '','2026-01-01 00:00:00+00',now(),now(),'{"provider":"email","providers":["email"]}','{}',false),
  ('00000000-0000-0000-0000-000000000013','00000000-0000-0000-0000-000000000000','authenticated','authenticated','prakhar@liveops.internal',     '','2026-01-01 00:00:00+00',now(),now(),'{"provider":"email","providers":["email"]}','{}',false),
  ('00000000-0000-0000-0000-000000000014','00000000-0000-0000-0000-000000000000','authenticated','authenticated','prarthana@liveops.internal',   '','2026-01-01 00:00:00+00',now(),now(),'{"provider":"email","providers":["email"]}','{}',false),
  ('00000000-0000-0000-0000-000000000015','00000000-0000-0000-0000-000000000000','authenticated','authenticated','abhinaba@liveops.internal',    '','2026-01-01 00:00:00+00',now(),now(),'{"provider":"email","providers":["email"]}','{}',false),
  ('00000000-0000-0000-0000-000000000016','00000000-0000-0000-0000-000000000000','authenticated','authenticated','arick@liveops.internal',       '','2026-01-01 00:00:00+00',now(),now(),'{"provider":"email","providers":["email"]}','{}',false),
  ('00000000-0000-0000-0000-000000000017','00000000-0000-0000-0000-000000000000','authenticated','authenticated','riyanka@liveops.internal',     '','2026-01-01 00:00:00+00',now(),now(),'{"provider":"email","providers":["email"]}','{}',false),
  ('00000000-0000-0000-0000-000000000018','00000000-0000-0000-0000-000000000000','authenticated','authenticated','rayan@liveops.internal',       '','2026-01-01 00:00:00+00',now(),now(),'{"provider":"email","providers":["email"]}','{}',false),
  ('00000000-0000-0000-0000-000000000019','00000000-0000-0000-0000-000000000000','authenticated','authenticated','tanisha@liveops.internal',     '','2026-01-01 00:00:00+00',now(),now(),'{"provider":"email","providers":["email"]}','{}',false),
  ('00000000-0000-0000-0000-000000000020','00000000-0000-0000-0000-000000000000','authenticated','authenticated','srinidhi@liveops.internal',    '','2026-01-01 00:00:00+00',now(),now(),'{"provider":"email","providers":["email"]}','{}',false),
  ('00000000-0000-0000-0000-000000000021','00000000-0000-0000-0000-000000000000','authenticated','authenticated','wamiq@liveops.internal',       '','2026-01-01 00:00:00+00',now(),now(),'{"provider":"email","providers":["email"]}','{}',false),
  ('00000000-0000-0000-0000-000000000022','00000000-0000-0000-0000-000000000000','authenticated','authenticated','smaranika@liveops.internal',   '','2026-01-01 00:00:00+00',now(),now(),'{"provider":"email","providers":["email"]}','{}',false),
  ('00000000-0000-0000-0000-000000000023','00000000-0000-0000-0000-000000000000','authenticated','authenticated','shloka@liveops.internal',      '','2026-01-01 00:00:00+00',now(),now(),'{"provider":"email","providers":["email"]}','{}',false),
  ('00000000-0000-0000-0000-000000000024','00000000-0000-0000-0000-000000000000','authenticated','authenticated','shibu@liveops.internal',       '','2026-01-01 00:00:00+00',now(),now(),'{"provider":"email","providers":["email"]}','{}',false)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- STEP 2: Team members
-- ============================================================

INSERT INTO public.team_members (id, name, role, availability, weekly_capacity) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Megha',      'ops', 'Mon–Sun', 10),
  ('00000000-0000-0000-0000-000000000002', 'Deepsikha',  'ops', 'Mon–Sun', 10),
  ('00000000-0000-0000-0000-000000000003', 'Manasvi',    'ops', 'Wed–Sun', 10),
  ('00000000-0000-0000-0000-000000000004', 'Garv',       'ops', 'Mon–Sun', 10),
  ('00000000-0000-0000-0000-000000000005', 'Mustansir',  'ops', 'Mon–Sun', 10),
  ('00000000-0000-0000-0000-000000000006', 'Mohit',      'ops', 'Mon–Sun', 10),
  ('00000000-0000-0000-0000-000000000007', 'Saleha',     'ops', 'Mon–Sun', 10),
  ('00000000-0000-0000-0000-000000000008', 'Anushka',    'ops', 'Mon–Sun', 10),
  ('00000000-0000-0000-0000-000000000009', 'Akshat',     'ops', 'Mon–Sun', 10),
  ('00000000-0000-0000-0000-000000000010', 'Nandita',    'ops', 'Mon–Sun', 10),
  ('00000000-0000-0000-0000-000000000011', 'Shivani',    'ops', 'Mon–Sun', 10),
  ('00000000-0000-0000-0000-000000000012', 'Zoiba',      'ops', 'Mon–Sun', 10),
  ('00000000-0000-0000-0000-000000000013', 'Prakhar',    'ops', 'Mon–Sun', 10),
  ('00000000-0000-0000-0000-000000000014', 'Prarthana',  'ops', 'Mon–Sun', 10),
  ('00000000-0000-0000-0000-000000000015', 'Abhinaba',   'ops', 'Mon–Sun', 10),
  ('00000000-0000-0000-0000-000000000016', 'Arick',      'ops', 'Mon–Sun', 10),
  ('00000000-0000-0000-0000-000000000017', 'Riyanka',    'ops', 'Mon–Sun', 10),
  ('00000000-0000-0000-0000-000000000018', 'Rayan',      'ops', 'Mon–Sun', 10),
  ('00000000-0000-0000-0000-000000000019', 'Tanisha',    'ops', 'Mon–Sun', 10),
  ('00000000-0000-0000-0000-000000000020', 'Srinidhi',   'ops', 'Mon–Sun', 10),
  ('00000000-0000-0000-0000-000000000021', 'Wamiq',      'ops', 'Mon–Sun', 10),
  ('00000000-0000-0000-0000-000000000022', 'Smaranika',  'ops', 'Sat–Sun', 10),
  ('00000000-0000-0000-0000-000000000023', 'Shloka',     'ops', 'Mon–Tue', 10),
  ('00000000-0000-0000-0000-000000000024', 'Shibu',      'ops', 'Mon–Sun', 10)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- STEP 3: Additional session types (beyond schema defaults)
-- ============================================================

INSERT INTO public.session_types (name, active) VALUES
  ('Course Kickoff',       true),
  ('Capstone Q&A',         true),
  ('Resume Review',        true),
  ('SysDesign Core',       true),
  ('AI Core Session',      true),
  ('Community Session',    true)
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- STEP 4: Sessions
-- All sessions from the live ops sheet are soft + final confirmed.
-- DONE in sheet → published='Yes' / deck_status='Ready' / instructor_connect='Completed'
-- Blank → 'No' / 'Not Started' / 'Pending'
-- ============================================================

-- Helper: ops member UUIDs for readability
-- Megha=001, Deepsikha=002, Manasvi=003, Garv=004, Mustansir=005
-- Mohit=006, Saleha=007, Anushka=008, Akshat=009, Nandita=010
-- Shivani=011, Zoiba=012, Prakhar=013, Prarthana=014, Abhinaba=015
-- Arick=016, Riyanka=017, Rayan=018, Tanisha=019, Srinidhi=020
-- Wamiq=021, Smaranika=022, Shloka=023, Shibu=024

INSERT INTO public.sessions (
  program, cohort, session_type, date, start_time, end_time,
  instructor, soft_confirmed, final_confirmed,
  ops_in_charge, published, deck_status, instructor_connect, notes
) VALUES

-- ── TUESDAY 26 May ────────────────────────────────────────────
('BEL', 'BEL C18',           'AI Core Session',      '2026-05-26','20:30','22:30', 'Saksham',     true, true, '00000000-0000-0000-0000-000000000001', 'Yes','Not Started','Pending',   null),

-- ── WEDNESDAY 27 May ──────────────────────────────────────────
('PML', 'PML C30',           'Capstone Q&A',         '2026-05-27','20:00','21:00', 'Abhijeet',    true, true, '00000000-0000-0000-0000-000000000002', 'Yes','Ready',      'Completed', null),
('BEL', 'BEL C14',           'Resume Review',        '2026-05-27','20:00','22:00', 'Arsh',        true, true, '00000000-0000-0000-0000-000000000003', 'No', 'Not Started','Pending',   null),
('BEL', 'BEL C17',           'SysDesign Core',       '2026-05-27','20:30','22:30', 'Ankit',       true, true, '00000000-0000-0000-0000-000000000004', 'Yes','Not Started','Pending',   null),
('BEL', 'BEL C19 (NODE)',     'Core Session',         '2026-05-27','20:30','22:30', 'Jay',         true, true, '00000000-0000-0000-0000-000000000005', 'Yes','Not Started','Pending',   null),
('BEL', 'BEL C19 (PYTHON)',   'Core Session',         '2026-05-27','20:30','22:30', 'Shantanu',    true, true, '00000000-0000-0000-0000-000000000006', 'Yes','Ready',      'Pending',   null),
('BEL', 'BEL C20 (NODE)',     'Core Session',         '2026-05-27','21:00','23:00', 'Utkarsh',     true, true, '00000000-0000-0000-0000-000000000007', 'Yes','Not Started','Pending',   null),

-- ── THURSDAY 28 May ───────────────────────────────────────────
('PML', 'PML C37',           'Course Kickoff',       '2026-05-28','20:00','21:30', 'Airtribe',    true, true, '00000000-0000-0000-0000-000000000002', 'Yes','Not Started','Pending',   null),
('BEL', 'BEL C16',           'SysDesign Core',       '2026-05-28','20:30','22:30', 'Ankit',       true, true, '00000000-0000-0000-0000-000000000008', 'Yes','Not Started','Pending',   null),
('BEL', 'BEL C20 (JAVA)',     'Core Session',         '2026-05-28','20:30','22:30', 'Pawan',       true, true, '00000000-0000-0000-0000-000000000009', 'Yes','Not Started','Pending',   null),
('BEL', 'BEL C20 (PYTHON)',   'Core Session',         '2026-05-28','20:30','22:30', 'Shantanu',    true, true, '00000000-0000-0000-0000-000000000010', 'Yes','Ready',      'Pending',   null),

-- ── FRIDAY 29 May ─────────────────────────────────────────────
('B2B', 'B2B CAB',           'Core Session',         '2026-05-29','09:00','11:00', 'Sumant',      true, true, '00000000-0000-0000-0000-000000000011', 'No', 'Ready',      'Completed', null),
('BEL', 'BEL C19 (JAVA)',     'Core Session',         '2026-05-29','20:30','22:30', 'Pawan',       true, true, '00000000-0000-0000-0000-000000000012', 'Yes','Not Started','Pending',   null),

-- ── SATURDAY 30 May ───────────────────────────────────────────
('B2B',       'B2B CAB',           'Core Session',         '2026-05-30','09:00','11:00', 'Sumant',       true, true, '00000000-0000-0000-0000-000000000011', 'No', 'Ready',      'Completed', null),
('GenAI',     'GENAI C5',          'Core Session',         '2026-05-30','10:00','12:00', 'Karan Purohit',true, true, '00000000-0000-0000-0000-000000000013', 'No', 'Ready',      'Pending',   null),
('GenAI',     'GENAI C6',          'Core Session',         '2026-05-30','10:00','12:00', 'Rohit',        true, true, '00000000-0000-0000-0000-000000000010', 'No', 'Ready',      'Completed', null),
('GenAI',     'GENAI C7',          'Core Session',         '2026-05-30','10:00','12:00', 'Arun',         true, true, '00000000-0000-0000-0000-000000000014', 'No', 'Ready',      'Pending',   null),
('Community', 'COMMUNITY',         'Community Session',    '2026-05-30','11:00','15:00', 'Sunmeet',      true, true, '00000000-0000-0000-0000-000000000015', 'No', 'Not Started','Pending',   'Claude AI Community Session'),
('PML',       'PML C25-28',        'Interview Prep Session','2026-05-30','11:00','13:00', 'Saurabh',     true, true, '00000000-0000-0000-0000-000000000016', 'Yes','Not Started','Pending',   'Merged cohorts C25-C28'),
('PML',       'PML C31',           'Core Session',         '2026-05-30','11:00','13:00', 'Suraj',        true, true, null,                                  'Yes','Ready',      'Pending',   null),
('PML',       'PML C32',           'Core Session',         '2026-05-30','11:00','14:00', 'Chandan',      true, true, '00000000-0000-0000-0000-000000000012', 'Yes','Ready',      'Pending',   null),
('PML',       'PML C33',           'Core Session',         '2026-05-30','11:00','13:00', 'Bikash',       true, true, '00000000-0000-0000-0000-000000000019', 'Yes','Ready',      'Completed', null),
('PML',       'PML C34',           'Core Session',         '2026-05-30','11:00','13:00', 'Sarosh',       true, true, '00000000-0000-0000-0000-000000000017', 'Yes','Ready',      'Pending',   null),
('PML',       'PML C36',           'Core Session',         '2026-05-30','11:00','13:00', 'Sumant',       true, true, '00000000-0000-0000-0000-000000000018', 'Yes','Ready',      'Completed', null),
('PML',       'PML C37',           'Core Session',         '2026-05-30','11:00','13:00', 'Karan',        true, true, '00000000-0000-0000-0000-000000000002', 'Yes','Ready',      'Pending',   null),
('BEL',       'BEL C18 (JAVA)',     'DSA Session',          '2026-05-30','11:00','13:30', 'Gurmandeep',   true, true, '00000000-0000-0000-0000-000000000023', 'Yes','Not Started','Pending',   null),
('BEL',       'BEL C19 (NODE)',     'Core Session',         '2026-05-30','11:00','13:00', null,           true, true, null,                                  'No', 'Not Started','Pending',   null),
('BEL',       'BEL C19 (PYTHON)',   'Core Session',         '2026-05-30','11:00','13:00', 'Shantanu',     true, true, null,                                  'No', 'Not Started','Pending',   null),
('BEL',       'BEL C20 (NODE)',     'DSA Session',          '2026-05-30','11:00','13:30', 'Ankush',       true, true, '00000000-0000-0000-0000-000000000024', 'Yes','Not Started','Pending',   'Ops start only'),
('BEL',       'BEL C20 (JAVA)',     'DSA Session',          '2026-05-30','11:00','13:30', 'Archit',       true, true, '00000000-0000-0000-0000-000000000006', 'Yes','Not Started','Pending',   null),
('BEL',       'BEL C21 (JAVA)',     'Core Session',         '2026-05-30','11:00','13:00', 'Aashray',      true, true, '00000000-0000-0000-0000-000000000007', 'Yes','Not Started','Pending',   null),
('BEL',       'BEL C21 (NODE)',     'Core Session',         '2026-05-30','11:00','13:00', 'Jay',          true, true, '00000000-0000-0000-0000-000000000005', 'Yes','Not Started','Pending',   null),
('BEL',       'BEL C21 (PYTHON)',   'Core Session',         '2026-05-30','11:00','13:00', 'Abhijeet',     true, true, '00000000-0000-0000-0000-000000000020', 'Yes','Ready',      'Pending',   null),
('GenAI',     'GENAI C8',          'Workshop',             '2026-05-30','12:00','13:00', 'Pushpak',      true, true, '00000000-0000-0000-0000-000000000021', 'No', 'Not Started','Pending',   'Founder Roadmap'),
('BEL',       'BEL C16',           'SysDesign Core',       '2026-05-30','12:00','14:00', 'Ankit',        true, true, '00000000-0000-0000-0000-000000000008', 'Yes','Not Started','Pending',   null),
('BEL',       'BEL C19 (JAVA)',     'Core Session',         '2026-05-30','12:00','15:00', 'Pawan',        true, true, '00000000-0000-0000-0000-000000000003', 'Yes','Not Started','Pending',   null),
('PML',       'PML C31 & C32',     'Mentor Session',       '2026-05-30','15:00','17:00', 'Chandan',      true, true, '00000000-0000-0000-0000-000000000017', 'Yes','Not Started','Completed', 'AI Mentor Session'),
('PML',       'PML C35',           'Core Session',         '2026-05-30','16:00','19:00', 'Bikash',       true, true, '00000000-0000-0000-0000-000000000018', 'Yes','Ready',      'Completed', null),
('BEL',       'BEL COMMUNITY',     'Community Session',    '2026-05-30','17:00','19:00', null,           true, true, null,                                  'No', 'Not Started','Pending',   null),
('GenAI',     'GENAI C8',          'Workshop',             '2026-05-30','16:00','17:00', 'Anitha',       true, true, '00000000-0000-0000-0000-000000000021', 'No', 'Not Started','Pending',   'Product & Design Roadmap'),
('PML',       'PML COMMUNITY',     'Mock Interview',       '2026-05-30','17:00','18:00', 'Airtribe',     true, true, '00000000-0000-0000-0000-000000000012', 'Yes','Not Started','Pending',   'P2P Mock'),
('PML',       'PML C33',           'Mentor Session',       '2026-05-30','17:00','18:30', 'Mentors',      true, true, '00000000-0000-0000-0000-000000000005', 'Yes','Not Started','Pending',   'Office Hours'),
('PML',       'PML C34',           'Mentor Session',       '2026-05-30','17:00','18:30', 'Mentors',      true, true, '00000000-0000-0000-0000-000000000002', 'Yes','Not Started','Pending',   'Office Hours'),
('PML',       'PML C36',           'Mentor Session',       '2026-05-30','17:00','18:30', 'Mentors',      true, true, '00000000-0000-0000-0000-000000000023', 'Yes','Not Started','Pending',   'Office Hours'),
('PML',       'PML C37',           'Mentor Session',       '2026-05-30','17:00','18:30', 'Mentors',      true, true, '00000000-0000-0000-0000-000000000022', 'Yes','Not Started','Pending',   'Ice Breaking — Office Hours'),
('GenAI',     'GENAI C6',          'Mentor Session',       '2026-05-30','17:00','19:00', 'Mentors',      true, true, '00000000-0000-0000-0000-000000000011', 'No', 'Not Started','Pending',   'Office Hours'),
('GenAI',     'GENAI C7',          'Mentor Session',       '2026-05-30','17:00','19:00', 'Mentors',      true, true, '00000000-0000-0000-0000-000000000013', 'No', 'Not Started','Pending',   'Office Hours'),
('BEL',       'BEL C20 (NODE)',     'Mentor Session',       '2026-05-30','17:00','18:30', 'Tarun',        true, true, '00000000-0000-0000-0000-000000000016', 'Yes','Not Started','Pending',   null),
('BEL',       'BEL C20 (JAVA)',     'Mentor Session',       '2026-05-30','17:00','18:30', 'Rahul',        true, true, '00000000-0000-0000-0000-000000000019', 'Yes','Not Started','Pending',   null),
('BEL',       'BEL C20 (PYTHON)',   'Mentor Session',       '2026-05-30','17:00','18:30', 'Shivraj',      true, true, '00000000-0000-0000-0000-000000000020', 'Yes','Not Started','Pending',   null),
('BEL',       'BEL C21 (JAVA)',     'DSA Session',          '2026-05-30','17:00','19:00', 'Himanshu',     true, true, '00000000-0000-0000-0000-000000000009', 'Yes','Not Started','Pending',   null),
('BEL',       'BEL C21 (NODE)',     'DSA Session',          '2026-05-30','17:00','19:00', 'Prerna',       true, true, '00000000-0000-0000-0000-000000000010', 'Yes','Not Started','Pending',   null),
('BEL',       'BEL C21 (PYTHON)',   'DSA Session',          '2026-05-30','17:00','19:00', 'Aakash',       true, true, '00000000-0000-0000-0000-000000000014', 'Yes','Not Started','Pending',   null),
('BEL',       'BEL C18',           'AI Core Session',      '2026-05-30','17:30','19:30', 'Saksham',      true, true, '00000000-0000-0000-0000-000000000007', 'Yes','Ready',      'Pending',   null),

-- ── SUNDAY 31 May ─────────────────────────────────────────────
('GenAI',     'GENAI C5',          'Core Session',         '2026-05-31','10:00','12:00', null,           true, true, null,                                  'No', 'Not Started','Pending',   null),
('GenAI',     'GENAI C6',          'Core Session',         '2026-05-31','10:00','12:00', 'Rohit',        true, true, '00000000-0000-0000-0000-000000000010', 'No', 'Ready',      'Pending',   null),
('GenAI',     'GENAI C7',          'Core Session',         '2026-05-31','10:00','12:00', 'Arun',         true, true, '00000000-0000-0000-0000-000000000014', 'No', 'Ready',      'Pending',   null),
('GenAI',     'GENAI C8',          'Workshop',             '2026-05-31','10:00','13:00', 'Rishabh',      true, true, '00000000-0000-0000-0000-000000000021', 'No', 'Not Started','Pending',   'Business Roadmap'),
('PML',       'PML C29-30',        'Interview Prep Session','2026-05-31','11:00','13:00', 'Saurabh',     true, true, '00000000-0000-0000-0000-000000000009', 'Yes','Ready',      'Completed', 'Merged cohorts C29-C30'),
('PML',       'PML C31',           'Core Session',         '2026-05-31','11:00','13:00', 'Suraj',        true, true, null,                                  'Yes','Ready',      'Pending',   null),
('PML',       'PML C32',           'Core Session',         '2026-05-31','11:00','13:00', 'Chandan',      true, true, '00000000-0000-0000-0000-000000000012', 'Yes','Ready',      'Pending',   null),
('PML',       'PML C33',           'Core Session',         '2026-05-31','11:00','13:00', 'Bikash',       true, true, '00000000-0000-0000-0000-000000000019', 'Yes','Ready',      'Pending',   null),
('PML',       'PML C34',           'Core Session',         '2026-05-31','11:00','13:00', 'Sarosh',       true, true, '00000000-0000-0000-0000-000000000017', 'Yes','Ready',      'Pending',   null),
('PML',       'PML C35',           'Mentor Session',       '2026-05-31','11:00','12:30', 'Mentors',      true, true, '00000000-0000-0000-0000-000000000001', 'Yes','Not Started','Pending',   'Office Hours'),
('PML',       'PML C36',           'Core Session',         '2026-05-31','11:00','13:00', 'Sumant',       true, true, '00000000-0000-0000-0000-000000000018', 'Yes','Ready',      'Pending',   null),
('PML',       'PML C37',           'Core Session',         '2026-05-31','11:00','13:00', 'Karan',        true, true, '00000000-0000-0000-0000-000000000022', 'Yes','Ready',      'Pending',   null),
('BEL',       'BEL C19 (NODE)',     'DSA Session',          '2026-05-31','11:00','13:30', 'Ankush',       true, true, '00000000-0000-0000-0000-000000000003', 'Yes','Not Started','Pending',   'Ops start only'),
('BEL',       'BEL C19 (JAVA)',     'DSA Session',          '2026-05-31','11:00','13:30', 'Himanshu',     true, true, '00000000-0000-0000-0000-000000000003', 'Yes','Not Started','Pending',   'Ops start only'),
('BEL',       'BEL C20 (NODE)',     'Core Session',         '2026-05-31','11:00','13:00', 'Utkarsh',      true, true, '00000000-0000-0000-0000-000000000008', 'Yes','Not Started','Pending',   null),
('BEL',       'BEL C20 (PYTHON)',   'Core Session',         '2026-05-31','11:00','13:00', 'Shantanu',     true, true, null,                                  'No', 'Not Started','Pending',   null),
('BEL',       'BEL C21 (JAVA)',     'Core Session',         '2026-05-31','11:00','13:00', 'Aashray',      true, true, '00000000-0000-0000-0000-000000000006', 'Yes','Not Started','Pending',   null),
('BEL',       'BEL C21 (NODE)',     'Core Session',         '2026-05-31','11:00','13:00', 'Jay',          true, true, '00000000-0000-0000-0000-000000000005', 'Yes','Not Started','Pending',   null),
('BEL',       'BEL C17',           'SysDesign Core',       '2026-05-31','12:00','14:00', 'Ankit',        true, true, '00000000-0000-0000-0000-000000000003', 'Yes','Not Started','Pending',   null),
('BEL',       'BEL C20 (JAVA)',     'Core Session',         '2026-05-31','12:00','14:00', 'Pawan',        true, true, '00000000-0000-0000-0000-000000000001', 'Yes','Not Started','Pending',   null),
('BEL',       'BEL C21 (PYTHON)',   'Core Session',         '2026-05-31','13:00','15:00', 'Abhijeet',     true, true, '00000000-0000-0000-0000-000000000007', 'Yes','Not Started','Pending',   null),
('GenAI',     'GENAI C8',          'Workshop',             '2026-05-31','14:00','15:00', 'Karan',        true, true, '00000000-0000-0000-0000-000000000021', 'No', 'Not Started','Pending',   'Tech Roadmap'),
('PML',       'PML C35',           'Core Session',         '2026-05-31','16:00','19:00', 'Bikash',       true, true, '00000000-0000-0000-0000-000000000009', 'Yes','Ready',      'Pending',   null),
('BEL',       'BEL C21 (JAVA)',     'DSA Session',          '2026-05-31','17:00','19:00', 'Himanshu',     true, true, '00000000-0000-0000-0000-000000000005', 'Yes','Not Started','Pending',   null),
('BEL',       'BEL C21 (NODE)',     'DSA Session',          '2026-05-31','17:00','19:00', 'Prerna',       true, true, '00000000-0000-0000-0000-000000000006', 'Yes','Not Started','Pending',   null),
('BEL',       'BEL C21 (PYTHON)',   'DSA Session',          '2026-05-31','17:00','19:00', 'Aakash',       true, true, '00000000-0000-0000-0000-000000000008', 'Yes','Not Started','Pending',   null);

-- ============================================================
-- STEP 5: Additional ops members (multi-select)
-- PML C37 Course Kickoff (28 May) → Smaranika + Shloka as add. ops
-- ============================================================

INSERT INTO public.session_ops_members (session_id, member_id)
SELECT s.id, '00000000-0000-0000-0000-000000000022'  -- Smaranika
FROM public.sessions s
WHERE s.cohort = 'PML C37'
  AND s.session_type = 'Course Kickoff'
  AND s.date = '2026-05-28'
ON CONFLICT DO NOTHING;

INSERT INTO public.session_ops_members (session_id, member_id)
SELECT s.id, '00000000-0000-0000-0000-000000000023'  -- Shloka
FROM public.sessions s
WHERE s.cohort = 'PML C37'
  AND s.session_type = 'Course Kickoff'
  AND s.date = '2026-05-28'
ON CONFLICT DO NOTHING;

-- ============================================================
-- VERIFICATION
-- Run this query after seeding to confirm everything looks correct:
-- ============================================================
-- SELECT session_status, count(*) FROM sessions_with_status GROUP BY session_status;
-- SELECT count(*) FROM sessions;          -- expect 80
-- SELECT count(*) FROM team_members;      -- expect 24
-- SELECT count(*) FROM session_ops_members; -- expect 2
