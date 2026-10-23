
-- 1. Cascading foreign keys
ALTER TABLE public.tvet_courses
  DROP CONSTRAINT IF EXISTS tvet_courses_category_id_fkey,
  ADD CONSTRAINT tvet_courses_category_id_fkey
    FOREIGN KEY (category_id) REFERENCES public.tvet_categories(id) ON DELETE CASCADE;
ALTER TABLE public.tvet_levels
  DROP CONSTRAINT IF EXISTS tvet_levels_course_id_fkey,
  ADD CONSTRAINT tvet_levels_course_id_fkey
    FOREIGN KEY (course_id) REFERENCES public.tvet_courses(id) ON DELETE CASCADE;
ALTER TABLE public.tvet_modules
  DROP CONSTRAINT IF EXISTS tvet_modules_level_id_fkey,
  ADD CONSTRAINT tvet_modules_level_id_fkey
    FOREIGN KEY (level_id) REFERENCES public.tvet_levels(id) ON DELETE CASCADE;
ALTER TABLE public.tvet_resources
  DROP CONSTRAINT IF EXISTS tvet_resources_module_id_fkey,
  ADD CONSTRAINT tvet_resources_module_id_fkey
    FOREIGN KEY (module_id) REFERENCES public.tvet_modules(id) ON DELETE CASCADE;

-- 2. Wipe placeholder data
DELETE FROM public.tvet_resources;
DELETE FROM public.tvet_modules;
DELETE FROM public.tvet_levels;
DELETE FROM public.tvet_courses;

-- 3. General Studies category
INSERT INTO public.tvet_categories (slug, name, description, sort_order)
VALUES ('general-studies', 'General Studies & Complementary Subjects',
        'Mathematics, Sciences, Languages, Entrepreneurship and Civic Education shared across all TVET trades.', 10)
ON CONFLICT (slug) DO NOTHING;

-- 4. Temporary seeder function
CREATE OR REPLACE FUNCTION public._tvet_seed_course(
  p_cat_slug text, p_course_slug text, p_course_title text, p_course_desc text,
  p_l3 text[], p_l4 text[], p_l5 text[]
) RETURNS void LANGUAGE plpgsql AS $fn$
DECLARE
  v_cat uuid; v_course uuid; v_lvl uuid; v_mod text; v_i int;
BEGIN
  SELECT id INTO v_cat FROM public.tvet_categories WHERE slug = p_cat_slug;
  IF v_cat IS NULL THEN RETURN; END IF;
  INSERT INTO public.tvet_courses (category_id, slug, title, description, sort_order)
    VALUES (v_cat, p_course_slug, p_course_title, p_course_desc,
            (SELECT COALESCE(MAX(sort_order),0)+1 FROM public.tvet_courses WHERE category_id = v_cat))
    RETURNING id INTO v_course;

  IF p_l3 IS NOT NULL AND array_length(p_l3,1) > 0 THEN
    INSERT INTO public.tvet_levels (course_id, level, description)
      VALUES (v_course, 'L3', 'Foundation level — core trade skills') RETURNING id INTO v_lvl;
    v_i := 0;
    FOREACH v_mod IN ARRAY p_l3 LOOP
      v_i := v_i + 1;
      INSERT INTO public.tvet_modules (level_id, title, sort_order) VALUES (v_lvl, v_mod, v_i);
    END LOOP;
  END IF;

  IF p_l4 IS NOT NULL AND array_length(p_l4,1) > 0 THEN
    INSERT INTO public.tvet_levels (course_id, level, description)
      VALUES (v_course, 'L4', 'Intermediate level — applied specialisation') RETURNING id INTO v_lvl;
    v_i := 0;
    FOREACH v_mod IN ARRAY p_l4 LOOP
      v_i := v_i + 1;
      INSERT INTO public.tvet_modules (level_id, title, sort_order) VALUES (v_lvl, v_mod, v_i);
    END LOOP;
  END IF;

  IF p_l5 IS NOT NULL AND array_length(p_l5,1) > 0 THEN
    INSERT INTO public.tvet_levels (course_id, level, description)
      VALUES (v_course, 'L5', 'Advanced level — professional mastery & projects') RETURNING id INTO v_lvl;
    v_i := 0;
    FOREACH v_mod IN ARRAY p_l5 LOOP
      v_i := v_i + 1;
      INSERT INTO public.tvet_modules (level_id, title, sort_order) VALUES (v_lvl, v_mod, v_i);
    END LOOP;
  END IF;
END;
$fn$;

-- 5. Seed real RTB-style content
SELECT public._tvet_seed_course('ict-multimedia','software-development','Software Development',
  'Build modern web, mobile and cloud applications using real industry tools.',
  ARRAY['Software Project Requirements Analysis','Version Control with Git & GitHub','UX Design Fundamentals','JavaScript Fundamentals','HTML & CSS Web Development','Game Development with Vue Framework','Introduction to Databases','Web Hosting & Deployment'],
  ARRAY['React Development','Mobile Development with React Native','Database Development with PostgreSQL','REST API Development with Node.js','TypeScript for Web Apps','Authentication & Authorization','Testing & Quality Assurance','Agile Software Project'],
  ARRAY['Advanced Software Engineering','Cloud Computing with AWS','DevOps & CI/CD','Microservices Architecture','System Design & Scalability','Software Security','Capstone / Final Project','Industrial Attachment Program (IAP)']);

SELECT public._tvet_seed_course('ict-multimedia','networking-internet-technologies','Networking & Internet Technologies',
  'Design, install and secure modern computer networks.',
  ARRAY['Computer Hardware Maintenance','Network Cabling','IP Addressing & Subnetting','Introduction to Routing & Switching','Operating Systems Installation','Network Troubleshooting Basics'],
  ARRAY['LAN/WAN Configuration','Wireless Networks','Network Security Fundamentals','Linux Server Administration','Windows Server Administration','VoIP & Unified Communications'],
  ARRAY['Cisco Routing & Switching (CCNA level)','Cloud Networking','Advanced Cyber Security','Network Design Project','Penetration Testing Basics','Industrial Attachment Program (IAP)']);

SELECT public._tvet_seed_course('ict-multimedia','multimedia-production','Multimedia Production',
  'Professional photo, audio, video and motion graphics production.',
  ARRAY['Photography Basics','Audio Recording','Video Shooting Techniques','Lighting for Media','Storyboarding'],
  ARRAY['Video Editing with Premiere Pro','Motion Graphics with After Effects','Sound Design','Color Grading','Short Documentary Production'],
  ARRAY['Advanced 3D Animation','Broadcast Production','Streaming & Live Media','Capstone Multimedia Project','Industrial Attachment Program (IAP)']);

SELECT public._tvet_seed_course('energy','electrical-technology','Electrical Technology',
  'Domestic, industrial and renewable electrical installation.',
  ARRAY['Electrical Safety & Workplace Health','Basic Electrical Circuits','Domestic Installation','Measuring Instruments','Lighting Systems'],
  ARRAY['Industrial Installation','Motors & Generators','Programmable Logic Controllers (PLC)','Electrical Maintenance','Single & Three-phase Systems'],
  ARRAY['Power Distribution','Substation Operations','Energy Audit & Efficiency','Capstone Electrical Project','Industrial Attachment Program (IAP)']);

SELECT public._tvet_seed_course('energy','solar-renewable-energy','Solar & Renewable Energy',
  'Design and install solar PV and renewable energy systems.',
  ARRAY['Introduction to Renewable Energy','Solar PV Components','Battery Storage Basics','Off-grid System Installation','Safety & Tools'],
  ARRAY['Grid-tied Solar Systems','Solar Water Heating','Sizing & Load Analysis','Wind & Micro-hydro Basics','Maintenance & Diagnostics'],
  ARRAY['Hybrid Energy Systems','Mini-grid Design','Energy Policy & Business','Capstone Solar Project','Industrial Attachment Program (IAP)']);

SELECT public._tvet_seed_course('construction','building-construction','Building Construction',
  'Plan, build and finish residential and commercial buildings.',
  ARRAY['Construction Safety','Site Setting Out','Masonry Basics','Concrete Works','Roofing Fundamentals','Reading Construction Drawings'],
  ARRAY['Reinforced Concrete','Plumbing in Buildings','Tiling & Finishing','Painting & Decoration','Quantity Surveying Basics'],
  ARRAY['Building Maintenance','Construction Project Management','Estimating & Tendering','Capstone Construction Project','Industrial Attachment Program (IAP)']);

SELECT public._tvet_seed_course('general-studies','mathematics','Mathematics',
  'Numerical reasoning and applied mathematics for every TVET trade.',
  ARRAY['Numbers & Operations','Algebra','Geometry','Trigonometry','Statistics & Probability'],
  ARRAY['Advanced Algebra','Coordinate Geometry','Calculus Basics','Applied Mathematics','Mathematics for Engineering'],
  ARRAY['Differential & Integral Calculus','Linear Algebra','Numerical Methods','Mathematical Modelling','Statistics for Research']);

SELECT public._tvet_seed_course('general-studies','physics','Physics',
  'Mechanics, electricity, waves and thermodynamics with practical labs.',
  ARRAY['Mechanics','Heat & Temperature','Light & Optics','Sound & Waves','Introduction to Electricity'],
  ARRAY['Electromagnetism','Electronics Fundamentals','Thermodynamics','Modern Physics','Practical Lab Work'],
  ARRAY['Applied Electricity & Electronics','Advanced Waves & Optics','Quantum Physics Basics','Engineering Physics Project']);

SELECT public._tvet_seed_course('general-studies','english-communication','English & Communication Skills',
  'Professional English for the workplace.',
  ARRAY['Grammar Foundations','Listening & Speaking','Reading Comprehension','Workplace Vocabulary','Basic Writing Skills'],
  ARRAY['Technical English','Business Correspondence','Presentation Skills','Report Writing','Meetings & Negotiation'],
  ARRAY['Professional Writing','Advanced Public Speaking','Research Writing','Cross-cultural Communication']);

SELECT public._tvet_seed_course('general-studies','entrepreneurship','Entrepreneurship',
  'Start, run and grow a business in Rwanda.',
  ARRAY['Introduction to Entrepreneurship','Innovation & Creativity','Identifying Business Opportunities','Financial Literacy','Personal Budgeting'],
  ARRAY['Business Planning','Marketing Basics','Small Business Management','Bookkeeping','Customer Service'],
  ARRAY['Business Strategy','Project Financing','Digital Marketing','Business Law & Taxes','Capstone Business Plan']);

SELECT public._tvet_seed_course('general-studies','ict-fundamentals','ICT Fundamentals',
  'Digital literacy and core computing skills.',
  ARRAY['Computer Applications (Word, Excel, PowerPoint)','Digital Literacy','Internet & Email','File Management','Typing Skills'],
  ARRAY['Networking Fundamentals','Database Fundamentals','Cyber Security Basics','Cloud Storage & Collaboration','Intro to Programming'],
  ARRAY['Data Analysis with Spreadsheets','Advanced Cyber Hygiene','IT Support Fundamentals','Capstone Digital Project']);

SELECT public._tvet_seed_course('general-studies','graphic-design','Graphic Design',
  'Design principles, branding and digital publishing.',
  ARRAY['Design Principles','Typography Basics','Colour Theory','Sketching for Designers','Introduction to Adobe Photoshop'],
  ARRAY['Adobe Illustrator','Layout & Composition','Branding & Visual Identity','Print Design','Digital Publishing'],
  ARRAY['UI/UX Design','Packaging Design','Portfolio Development','Capstone Design Project']);

SELECT public._tvet_seed_course('general-studies','technical-drawing','Technical Drawing',
  'Engineering drawing and CAD.',
  ARRAY['Drawing Instruments & Standards','Orthographic Projection','Isometric Drawing','Dimensioning','Sectioning'],
  ARRAY['Introduction to AutoCAD','2D CAD Drafting','Assembly Drawings','Working Drawings'],
  ARRAY['3D Modelling with CAD','Civil/Mechanical CAD Project','BIM Fundamentals']);

SELECT public._tvet_seed_course('general-studies','kinyarwanda','Kinyarwanda',
  'National language proficiency and professional communication.',
  ARRAY['Kinyarwanda Grammar','Reading Comprehension','Composition Writing','Oral Expression'],
  ARRAY['Professional Kinyarwanda','Literature & Poetry','Translation Practice','Workplace Correspondence'],
  ARRAY['Advanced Composition','Public Speaking in Kinyarwanda','Research Project']);

SELECT public._tvet_seed_course('general-studies','civic-education','Civic Education',
  'Citizenship, governance and Rwandan values.',
  ARRAY['Rwandan History','Constitution & Citizenship','Human Rights','Community Service'],
  ARRAY['Governance & Democracy','Conflict Resolution','Gender & Society','Sustainable Development'],
  ARRAY['Pan-Africanism','Global Citizenship','Civic Leadership Project']);

SELECT public._tvet_seed_course('general-studies','workplace-safety-health','Workplace Safety & Health',
  'Occupational health and safety across all TVET trades.',
  ARRAY['Workplace Hazards','Personal Protective Equipment (PPE)','First Aid Basics','Fire Safety','Ergonomics'],
  ARRAY['Risk Assessment','Safety Audits','Emergency Procedures','Environmental Protection'],
  ARRAY['Occupational Health Management','Safety Leadership','Capstone Safety Project']);

SELECT public._tvet_seed_course('general-studies','industrial-attachment','Industrial Attachment Program (IAP)',
  'Real-world workplace experience required for graduation.',
  ARRAY['IAP Orientation','Workplace Ethics','Logbook Keeping'],
  ARRAY['Mid-IAP Reflection','Skills Application','Supervisor Reporting'],
  ARRAY['Final IAP Report','Presentation & Defense','Portfolio Submission']);

-- 6. Drop the temporary helper
DROP FUNCTION public._tvet_seed_course(text,text,text,text,text[],text[],text[]);
