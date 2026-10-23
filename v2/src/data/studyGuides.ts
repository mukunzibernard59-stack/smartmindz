export interface KeyTopic {
  title: string;
  explanation: string;
}

export interface ModuleSummary {
  title: string;
  summary: string;
}

export interface PracticeQuestion {
  question: string;
  answer: string;
  explanation: string;
}

export interface StudyGuide {
  slug: string;
  subject: string;
  sector: string;
  description: string;
  intro: string[];
  keyTopics: KeyTopic[];
  moduleSummaries: ModuleSummary[];
  practiceQuestions: PracticeQuestion[];
}

export const studyGuides: StudyGuide[] = [
  {
    slug: 'ict-multimedia',
    subject: 'ICT & Multimedia',
    sector: 'ict-multimedia',
    description:
      'A study guide for TVET learners in ICT & Multimedia covering software, networking, multimedia production and cybersecurity fundamentals.',
    intro: [
      "ICT & Multimedia is one of the most in-demand trade areas inside Rwanda's TVET system, combining software skills, computer networking, multimedia production and the basics of cybersecurity. Learners who choose this pathway are preparing for careers as technicians, support staff, junior developers, graphic and video editors, and network assistants in both the public and private sector. Because digital tools now touch almost every industry, the skills built in this sector tend to transfer well into other trades too, from documenting agricultural data to managing bookings in hospitality businesses.",
      'This guide is meant to support your revision, not replace your official course materials, handouts, or your teacher\'s instructions. Use it alongside the resources available in the Library section of this app, where you can find your school\'s actual modules, notes and past exercises organized by level. Treat this guide as a map of the big ideas you are likely to meet across your course, written in plain language so you can check your own understanding before and after classroom sessions.',
      "As you work through ICT & Multimedia topics, focus on being able to explain concepts in your own words, not just recognize them. Employers and assessors in this field consistently reward people who can troubleshoot calmly, document what they did, and explain technical ideas to non-technical colleagues. Treat every exercise, whether it's assembling a computer, editing a short video, or sketching a network diagram, as practice for that kind of clear communication.",
    ],
    keyTopics: [
      {
        title: 'Computer Systems & Hardware Basics',
        explanation:
          'Every ICT learner needs a solid mental model of how a computer is put together: the processor, memory, storage, input and output devices, and the power and cooling systems that keep everything running. Understanding hardware is not just theory — it helps you diagnose problems faster, choose the right components for a task, and explain to a client why a machine is slow or failing. Spend time physically identifying components where possible, and practice describing what each part does and how they work together as a system.',
      },
      {
        title: 'Operating Systems & Software Installation',
        explanation:
          'Operating systems manage hardware resources and let users run applications, so comfort with installing, configuring and maintaining an OS is a core employability skill. This includes partitioning storage, installing drivers, managing user accounts and permissions, and keeping software updated. Practicing on both older and newer systems helps you build confidence that transfers across different computer labs, offices, and client machines you may encounter after graduation.',
      },
      {
        title: 'Computer Networking Fundamentals',
        explanation:
          'Networking topics cover how devices communicate: cabling and connectors, IP addressing, routers and switches, and the difference between local and wider area networks. Being able to sketch a simple network diagram, explain why a connection has failed, and test connectivity with basic tools is valuable both for exams and for real workplace troubleshooting. Build the habit of checking the physical layer first (cables, power, lights) before assuming a software problem.',
      },
      {
        title: 'Multimedia Production Basics',
        explanation:
          "Multimedia work spans image editing, audio basics, video capture and editing, and designing simple graphics for print or screen. Even a short promotional video or a simple poster requires planning: knowing your audience, gathering the right raw material, and then editing with a clear message in mind. Practicing with free or trial tools, and critically reviewing your own work against the brief you were given, builds the editing judgment that separates competent multimedia technicians from beginners.",
      },
      {
        title: 'Cybersecurity Awareness',
        explanation:
          "Basic cybersecurity habits — strong passwords, recognizing suspicious links or messages, keeping software updated, and backing up important files — protect both individuals and the organizations they work for. As a TVET graduate you may be the person colleagues turn to for advice on staying safe online, so it helps to be able to explain risks and good habits simply, without jargon, and to model safe behavior yourself in how you handle accounts and devices.",
      },
    ],
    moduleSummaries: [
      { title: 'Computer Hardware & Maintenance', summary: 'Covers identifying components, assembling and disassembling machines safely, and routine maintenance to extend equipment life.' },
      { title: 'Operating Systems & Applications', summary: 'Covers installing, configuring and troubleshooting common operating systems and everyday productivity software.' },
      { title: 'Networking Essentials', summary: 'Covers cabling, addressing, basic network devices, and testing connections across a small local network.' },
      { title: 'Multimedia & Graphic Design', summary: 'Covers planning, producing and editing images, audio and video for practical, real-world communication tasks.' },
      { title: 'Digital Safety & Professional Practice', summary: 'Covers safe computing habits, data backup, basic security awareness, and professional workplace conduct in ICT roles.' },
    ],
    practiceQuestions: [
      {
        question: 'Why is it useful to check physical connections (cables, power, indicator lights) before assuming a software fault when a computer or network is not working?',
        answer: 'Because many "software" problems are actually caused by loose cables, unplugged power, or disconnected hardware, and checking these first saves time and avoids unnecessary software changes.',
        explanation: 'Good troubleshooting moves from the simplest, most observable causes to more complex ones. Physical layer checks are quick and rule out a large share of common faults before you spend time investigating configuration or software issues.',
      },
      {
        question: 'What is the difference between an operating system and an application, and why does the distinction matter for troubleshooting?',
        answer: 'The operating system manages hardware and provides the base environment the computer runs on, while an application is software built on top of the OS for a specific task; separating the two helps you decide whether a problem is system-wide or limited to one program.',
        explanation: 'If only one application fails, the fault is often in that application or its settings; if many applications fail or the whole machine behaves oddly, the operating system or hardware is a more likely cause.',
      },
      {
        question: 'Give one practical reason a technician should document the steps taken while fixing a computer or network issue.',
        answer: 'Documentation helps the technician or a colleague solve the same problem faster next time, and gives the client or employer a clear record of what was changed.',
        explanation: 'In real workplaces, undocumented fixes are often forgotten or repeated unnecessarily. Clear notes build trust with clients and support teamwork among technicians who may need to pick up unfinished work.',
      },
      {
        question: 'Why should a short promotional video or poster be planned before any editing software is opened?',
        answer: 'Planning first — knowing the audience, message and available raw material — saves editing time and keeps the final product focused instead of cluttered.',
        explanation: 'Jumping straight into software without a plan often produces unfocused work that has to be redone. A short outline or storyboard clarifies the goal before technical production begins.',
      },
      {
        question: 'Name one simple cybersecurity habit a TVET ICT student can model for colleagues who are less familiar with technology.',
        answer: 'Using a strong, unique password for each important account, and avoiding clicking on suspicious links from unknown senders.',
        explanation: 'Simple, consistent habits spread further than technical lectures. Being a visible example of safe behavior at work or school helps raise awareness among people who may not have formal ICT training.',
      },
    ],
  },
  {
    slug: 'energy',
    subject: 'Energy',
    sector: 'energy',
    description:
      'A study guide for TVET learners in the Energy trade, covering electrical fundamentals, renewable energy systems and power system basics.',
    intro: [
      "The Energy trade area trains technicians who can install, maintain and troubleshoot electrical systems, including a growing focus on renewable energy such as solar power. Rwanda, like many countries, is expanding access to electricity in both urban and rural areas, which means graduates from this pathway are needed for wiring buildings, installing solar panels, and maintaining the equipment that keeps homes, schools and businesses powered.",
      'This guide walks through the broad themes you are likely to study, written as a revision companion rather than a replacement for your official modules, workshop practice, or safety training delivered by your instructors. Electrical work carries real safety risks, so always follow your school\'s safety procedures and supervisor instructions during any hands-on practice — this guide focuses on the conceptual knowledge that supports safe, confident practical work.',
      'Success in the Energy trade depends on combining theory with careful, methodical hands-on practice. Employers value technicians who respect safety procedures, double-check their work before switching on a system, and can explain clearly to a client or supervisor what was done and why. Use the key topics and practice questions below to test whether you can explain core ideas simply, which is often a sign that you have truly understood them.',
    ],
    keyTopics: [
      {
        title: 'Basic Electrical Principles',
        explanation:
          'Understanding voltage, current, resistance and how they relate to each other is the foundation for almost everything else in this trade. These concepts explain why wires are sized the way they are, why some appliances need thicker cables, and why a circuit might trip or fail. Being able to reason through a simple circuit, even on paper, builds the intuition needed for safe and effective troubleshooting in the field.',
      },
      {
        title: 'Electrical Wiring & Installation',
        explanation:
          "Wiring work covers planning a safe layout, choosing appropriate materials, and correctly installing switches, sockets, and distribution boards. A well-planned wiring job considers both current needs and reasonable future expansion, and always follows safety best practices such as proper earthing and isolation before working on a circuit. Precision and patience matter more than speed, since mistakes in wiring can create fire or shock hazards.",
      },
      {
        title: 'Renewable Energy Systems',
        explanation:
          'Solar power is an increasingly important part of the Energy curriculum, covering how photovoltaic panels convert sunlight into electricity, how batteries store that energy, and how inverters make it usable for everyday appliances. Learners should understand the basic components of a solar system — panels, charge controller, battery bank and inverter — and why each one is needed, since renewable systems are now common in off-grid and backup power installations.',
      },
      {
        title: 'Power System Safety',
        explanation:
          "Safety is not a separate add-on in electrical work; it is built into every step of the job, from isolating power before starting a task to using the correct protective equipment and tools. Understanding why safety procedures exist, not just following them mechanically, helps a technician adapt sensibly when conditions are not exactly like a textbook example. A disciplined safety mindset is one of the most valued traits employers look for in Energy trade graduates.",
      },
      {
        title: 'Maintenance & Fault-Finding',
        explanation:
          'Electrical and solar systems need regular inspection to catch small problems — loose connections, worn insulation, dust on solar panels — before they become expensive failures or safety hazards. Fault-finding is a logical process: observe symptoms, check the simplest and most likely causes first, and test systematically rather than guessing. Keeping simple maintenance records also helps track recurring issues and plan future repairs.',
      },
    ],
    moduleSummaries: [
      { title: 'Electrical Fundamentals', summary: 'Covers the core relationships between voltage, current and resistance, and how they apply to simple circuits.' },
      { title: 'Domestic & Building Wiring', summary: 'Covers planning and installing safe wiring layouts, sockets, switches and distribution boards in buildings.' },
      { title: 'Solar & Renewable Energy Installation', summary: 'Covers the components and basic sizing of small solar power systems for homes and small businesses.' },
      { title: 'Workplace Electrical Safety', summary: 'Covers isolation procedures, protective equipment, and safe working practices around live and de-energized systems.' },
      { title: 'Inspection & Maintenance', summary: 'Covers routine checks, basic fault-finding methods, and keeping simple maintenance records for electrical systems.' },
    ],
    practiceQuestions: [
      {
        question: 'Why must power to a circuit be isolated and confirmed off before a technician begins working on it?',
        answer: 'Working on a live circuit risks electric shock or fire, so isolating and testing that the circuit is de-energized protects the technician and anyone nearby.',
        explanation: 'This is one of the most important safety habits in electrical work. Confirming isolation (not just assuming it) prevents accidents caused by mislabeled switches or forgotten connections.',
      },
      {
        question: 'What are the four main components typically found in a small off-grid solar power system, and what role does each play?',
        answer: 'Solar panels generate electricity from sunlight, a charge controller regulates the charging of the battery, the battery stores energy for later use, and the inverter converts stored energy into a usable form for appliances.',
        explanation: 'Understanding this chain helps a technician reason through why a solar system might underperform — for example, a faulty charge controller can damage a battery even if the panels themselves are working fine.',
      },
      {
        question: 'A homeowner says their lights flicker whenever a large appliance switches on. What is one likely area a technician should check first?',
        answer: 'The connections and wiring sizing on that circuit, since loose connections or undersized wiring often cause voltage drops when a high-demand appliance draws extra current.',
        explanation: 'Flickering tied to appliance use points toward a shared circuit issue rather than a fault in the appliance itself, guiding the technician to inspect wiring and connections before replacing equipment.',
      },
      {
        question: 'Why is regular inspection of a solar installation important even if the system appears to be working?',
        answer: 'Dust buildup on panels, loose terminals, or early battery wear can reduce performance gradually without causing an obvious failure, so regular checks catch problems before they become costly.',
        explanation: 'Preventive maintenance is cheaper and safer than reactive repair after a full system failure, and it extends the working life of the installation.',
      },
      {
        question: 'Explain in your own words why understanding basic electrical theory (voltage, current, resistance) helps even with practical, hands-on wiring tasks.',
        answer: 'Theory explains why certain wire sizes, fuse ratings or circuit designs are chosen, which helps a technician make sound decisions rather than copying patterns without understanding them.',
        explanation: 'A technician who understands the underlying principles can adapt to new or unusual situations safely, while someone who only memorizes steps may struggle when a job does not match a familiar pattern.',
      },
    ],
  },
  {
    slug: 'construction-building-services',
    subject: 'Construction & Building Services',
    sector: 'construction',
    description:
      'A study guide for TVET learners in Construction & Building Services, covering masonry, plumbing, basic building practice and surveying.',
    intro: [
      'Construction & Building Services prepares learners for hands-on trades such as masonry, plumbing, and general building work, along with foundational surveying skills used to plan and lay out construction sites. This sector is directly tied to the visible growth of towns and cities, and skilled tradespeople are consistently needed to build and maintain homes, schools, offices and public infrastructure.',
      "This guide summarizes broad themes you are likely to encounter in your coursework, intended to support your revision alongside your official modules and site-based or workshop practice. Construction work involves physical safety considerations, correct use of tools, and attention to building codes and standards set by your training institution and local authorities, so always follow your instructor's guidance for any practical task.",
      'Across all building trades, precision, patience and respect for safety procedures separate reliable tradespeople from those who cut corners. A wall built slightly out of level, or a pipe installed with the wrong slope, can cause problems that are expensive to fix later. Use this guide to check your conceptual understanding, then practice applying it carefully under supervision.',
    ],
    keyTopics: [
      {
        title: 'Masonry Fundamentals',
        explanation:
          'Masonry work involves laying blocks or bricks accurately, using mortar correctly, and building up straight, plumb and level walls. Good masonry depends on preparation: setting up string lines, checking corners, and maintaining consistent mortar joints throughout a wall. Learners should practice checking their own work with a spirit level and plumb line rather than relying on sight alone, since small errors compound as a wall gets taller.',
      },
      {
        title: 'Basic Plumbing Systems',
        explanation:
          "Plumbing covers the supply of clean water into a building and the safe removal of wastewater, including pipe sizing, fittings, and the correct slope for drainage pipes so that waste flows away properly rather than pooling. Understanding the difference between pressurized supply lines and gravity-fed drainage lines helps explain why certain installation mistakes cause leaks or blockages, and why professional plumbing follows specific layout rules.",
      },
      {
        title: 'Reading Building Plans',
        explanation:
          'Before any construction work begins, tradespeople need to read and interpret building plans — understanding scale, symbols, and how a two-dimensional drawing represents a three-dimensional structure. This skill connects classroom learning directly to site work, since a technician who can read plans accurately avoids costly mistakes and communicates more effectively with site supervisors and engineers.',
      },
      {
        title: 'Basic Surveying & Setting Out',
        explanation:
          "Surveying and setting out establish the correct position, levels and boundaries for a construction project before building begins. Simple tools like string lines, levels and measuring tapes are used to transfer the dimensions from a plan onto the actual ground. Getting this stage right is critical, because an error in setting out can affect the entire structure built on top of it.",
      },
      {
        title: 'Construction Site Safety',
        explanation:
          "Construction sites carry real physical risks — falls, heavy materials, power tools, and uneven ground — so understanding and following site safety procedures protects both the worker and others nearby. This includes using personal protective equipment correctly, keeping work areas tidy, and communicating hazards to teammates. A professional attitude toward safety is one of the clearest signs of a well-trained tradesperson.",
      },
    ],
    moduleSummaries: [
      { title: 'Masonry & Block Work', summary: 'Covers laying blocks and bricks accurately, mixing and applying mortar, and building straight, level walls.' },
      { title: 'Plumbing & Drainage', summary: 'Covers basic water supply and drainage systems, pipe fittings, and correct installation practices.' },
      { title: 'Building Plan Reading', summary: 'Covers interpreting scaled drawings, symbols and specifications used in construction projects.' },
      { title: 'Surveying & Setting Out', summary: 'Covers using basic tools to transfer plan measurements and levels onto an actual construction site.' },
      { title: 'Site Safety Practice', summary: 'Covers protective equipment, hazard awareness, and safe working habits on an active construction site.' },
    ],
    practiceQuestions: [
      {
        question: 'Why do masons check their work with a spirit level and plumb line regularly while building a wall, rather than only at the end?',
        answer: 'Small errors in level or plumb compound as the wall gets taller, so checking regularly catches mistakes early when they are easy to correct.',
        explanation: 'Waiting until a wall is finished to check alignment can mean the whole wall needs to be rebuilt, while frequent checks allow small corrections along the way.',
      },
      {
        question: 'Why must drainage pipes be installed with a consistent slope rather than running flat?',
        answer: 'A proper slope allows wastewater to flow away by gravity; a flat or incorrectly sloped pipe can cause waste to pool and lead to blockages or bad odors.',
        explanation: 'Unlike pressurized supply pipes, most drainage systems rely on gravity, so the angle of the pipe is a critical design and installation detail.',
      },
      {
        question: 'What is one risk of starting construction work without first carefully reading and understanding the building plan?',
        answer: 'Work may be built in the wrong position, size, or orientation, leading to costly rework or structural problems.',
        explanation: 'Plans communicate the designer\'s intent precisely; skipping this step increases the chance of misunderstanding dimensions or layout.',
      },
      {
        question: 'Why is accurate setting out considered one of the most important early steps in a construction project?',
        answer: 'Because every later stage of construction is built relative to the initial set-out points and levels, an early error can affect the whole structure.',
        explanation: 'Mistakes made at the setting-out stage are often hidden until much later, by which point they are far more expensive and difficult to fix.',
      },
      {
        question: 'Give one example of how good communication about hazards can prevent accidents on a construction site.',
        answer: 'Warning teammates about an open trench, wet surface, or overhead work in progress allows them to avoid the hazard rather than discovering it by accident.',
        explanation: 'Many site accidents happen because a hazard was known to one person but not communicated to others working nearby, showing why clear communication is a core safety skill.',
      },
    ],
  },
  {
    slug: 'hospitality-tourism',
    subject: 'Hospitality & Tourism',
    sector: 'hospitality-tourism',
    description:
      'A study guide for TVET learners in Hospitality & Tourism, covering culinary skills, tourism services and hotel management basics.',
    intro: [
      "Hospitality & Tourism trains learners for careers in restaurants, hotels, and the broader tourism industry, combining practical culinary skills with customer service, housekeeping and basic hotel or tour operation management. Tourism is a significant part of Rwanda's economy, and well-trained hospitality graduates are needed across hotels, lodges, restaurants and tour companies to deliver the quality of service that keeps visitors returning.",
      'This guide highlights broad themes across the Hospitality & Tourism pathway, meant to support revision alongside your practical kitchen sessions, front-of-house training, and official course modules. Many of the most important skills in this field — patience, attentiveness, cleanliness and clear communication — are best developed through repeated hands-on practice and feedback from instructors and supervisors.',
      'Guests and clients remember how they were treated more than almost anything else, which is why hospitality training places heavy emphasis on service attitude alongside technical skills like cooking or housekeeping. As you study, try to connect each technical topic to the guest experience it ultimately affects — a clean room, a well-cooked meal, or a smoothly organized tour all come from the same foundation of discipline and care.',
    ],
    keyTopics: [
      {
        title: 'Food Preparation & Kitchen Hygiene',
        explanation:
          "Culinary training starts with hygiene and food safety, because poor practices can make people sick and damage a business's reputation quickly. Learners study correct food storage temperatures, cross-contamination prevention, and proper handwashing and surface cleaning routines, alongside basic cooking techniques like knife skills, measuring, and understanding how heat changes ingredients. Consistency — producing a dish the same way every time — is a core professional skill in any kitchen.",
      },
      {
        title: 'Customer Service Fundamentals',
        explanation:
          'Good customer service means anticipating guest needs, communicating clearly and politely, and handling complaints calmly and professionally. In hospitality, the way a problem is resolved often matters more to a guest than the fact that a problem happened at all. Practicing scenarios — a late order, a double-booked room, a dietary request — builds the confidence needed to respond gracefully under pressure in a real workplace.',
      },
      {
        title: 'Housekeeping Standards',
        explanation:
          "Housekeeping covers the systematic cleaning and preparation of guest rooms and public areas to a consistent standard, including bed-making, bathroom sanitation, and restocking supplies. A well-run housekeeping operation follows a checklist-driven routine so that no guest ever receives a room that was rushed or incomplete. Attention to small details — a straightened picture frame, a fully stocked amenity tray — is often what separates an average stay from a memorable one.",
      },
      {
        title: 'Tourism & Guiding Basics',
        explanation:
          'Tourism-focused learners study how to plan simple itineraries, communicate basic information about local attractions, and support visitors with logistics such as transport and accommodation coordination. Even without specializing as a licensed guide, understanding how tourism businesses operate — bookings, group coordination, and basic visitor safety — helps graduates work effectively in tour companies, lodges and visitor centers.',
      },
      {
        title: 'Basic Hotel & Restaurant Operations',
        explanation:
          'Running a hotel or restaurant involves coordinating many moving parts: reservations, staffing, inventory, and maintaining quality standards across departments. Learners benefit from understanding how front-of-house and back-of-house teams depend on each other, since a delay in the kitchen or a miscommunication at the front desk can affect the entire guest experience. This big-picture awareness helps graduates work well as part of a larger hospitality team.',
      },
    ],
    moduleSummaries: [
      { title: 'Food Safety & Culinary Skills', summary: 'Covers hygienic food handling, basic cooking techniques, and consistent recipe execution.' },
      { title: 'Guest Service & Communication', summary: 'Covers professional communication, handling requests and complaints, and creating a positive guest experience.' },
      { title: 'Housekeeping Operations', summary: 'Covers systematic room cleaning, sanitation standards, and maintaining public area presentation.' },
      { title: 'Tourism Services', summary: 'Covers basic itinerary planning, visitor support, and coordination within tour and travel operations.' },
      { title: 'Hotel & Restaurant Management Basics', summary: 'Covers how front-of-house and back-of-house teams coordinate to deliver consistent service quality.' },
    ],
    practiceQuestions: [
      {
        question: 'Why is consistent food safety practice (like correct storage temperatures and handwashing) treated as a non-negotiable part of kitchen training?',
        answer: 'Because lapses in food safety can make guests seriously ill and seriously damage a business\'s reputation and legal standing, consistency is treated as essential rather than optional.',
        explanation: 'Unlike a minor service mistake, a food safety failure can have health consequences, which is why hygiene routines are drilled repeatedly until they become automatic habits.',
      },
      {
        question: 'A guest complains that their room was not ready on time. What is a professional first response from hospitality staff?',
        answer: 'Acknowledge the inconvenience calmly, apologize sincerely, and offer a practical solution such as temporary luggage storage or a status update, rather than becoming defensive.',
        explanation: 'How a complaint is handled often shapes the guest\'s overall impression more than the original problem itself, which is why calm, solution-focused responses are emphasized in training.',
      },
      {
        question: 'Why does housekeeping typically follow a detailed checklist for cleaning each room rather than relying on memory?',
        answer: 'A checklist ensures every room meets the same standard consistently, even when different staff members are working or when someone is rushed.',
        explanation: 'Checklists reduce the chance of small details being missed, which matters because guests often notice the small, easily-overlooked details most.',
      },
      {
        question: 'Why is it useful for a tourism trainee to understand basic logistics like transport and accommodation coordination, even if they want to become a guide rather than a logistics coordinator?',
        answer: 'Guides regularly depend on logistics running smoothly, so understanding how bookings and transport work helps them anticipate problems and support visitors more effectively.',
        explanation: 'Hospitality and tourism roles are interconnected; even a specialist role benefits from a working understanding of the surrounding operations.',
      },
      {
        question: 'Explain how a delay in the kitchen can affect the front-of-house team, even though they are different departments.',
        answer: 'If food preparation is delayed, front-of-house staff must manage guest expectations, possibly apologize, and adjust table turnover, showing how closely linked the two teams are.',
        explanation: 'This illustrates why hospitality training emphasizes teamwork and communication across departments rather than treating kitchen and service work as fully separate.',
      },
    ],
  },
  {
    slug: 'agriculture-food-processing',
    subject: 'Agriculture & Food Processing',
    sector: 'agriculture',
    description:
      'A study guide for TVET learners in Agriculture & Food Processing, covering crop production, livestock care and agro-processing basics.',
    intro: [
      'Agriculture & Food Processing trains learners in the practical knowledge needed to grow crops, raise livestock, and turn raw agricultural produce into processed food products ready for market. Agriculture remains a central part of many local economies, and graduates from this pathway can work on farms, in agro-processing facilities, in extension and advisory services, or start their own small agribusinesses.',
      'This guide summarizes broad themes across crop production, livestock management and agro-processing, intended to support your revision alongside field practice and official course materials. Agricultural knowledge is deeply practical and tied to local conditions, so always apply what you learn here alongside your instructors\' guidance about soils, seasons and practices specific to your area.',
      'A recurring theme across this sector is managing biological processes that cannot be rushed — crops need time to grow, animals need consistent care, and fermentation or drying processes in food processing follow their own timelines. Patience, observation and record-keeping are just as important as physical labor, because they help a farmer or technician catch problems early and make better decisions over time.',
    ],
    keyTopics: [
      {
        title: 'Crop Production Fundamentals',
        explanation:
          "Successful crop production depends on understanding soil preparation, appropriate spacing and planting depth, watering needs, and recognizing common pests and diseases early. Learners study how to match crop choices and practices to the conditions available, and how simple practices like crop rotation or proper spacing can meaningfully improve yields. Careful observation of plants throughout the growing season helps catch problems while they are still easy to manage.",
      },
      {
        title: 'Livestock Care Basics',
        explanation:
          'Livestock management covers feeding, housing, basic health monitoring, and recognizing signs of illness or stress in animals. Good animal husbandry balances productivity with animal welfare, since healthy, well-cared-for animals are generally more productive over time. Learners should practice observing animal behavior closely, since changes in eating, movement or appearance are often the first signs that something needs attention.',
      },
      {
        title: 'Soil & Water Management',
        explanation:
          "Soil fertility and proper water management directly determine how well crops grow, which is why understanding basic soil types, drainage, and irrigation approaches is central to this trade. Overwatering and underwatering both create problems, so learners should study how to judge appropriate watering based on crop type, soil and weather conditions rather than following a fixed schedule blindly.",
      },
      {
        title: 'Food Processing & Preservation',
        explanation:
          'Agro-processing turns raw produce into more stable, marketable products through techniques such as drying, fermenting, or basic packaging, extending shelf life and often increasing the value of the original produce. Understanding why each preservation method works — for example, why drying removes the moisture that spoilage organisms need — helps learners apply techniques correctly and troubleshoot when a batch does not turn out as expected.',
      },
      {
        title: 'Farm Record-Keeping & Planning',
        explanation:
          "Keeping simple records of planting dates, input costs, yields and animal health events helps a farmer or technician learn from each season and make better decisions going forward. Record-keeping might seem like a small administrative task, but over several seasons it reveals patterns — which practices improved yields, which did not — that are hard to notice from memory alone.",
      },
    ],
    moduleSummaries: [
      { title: 'Crop Production', summary: 'Covers soil preparation, planting, pest and disease recognition, and practices that support healthy crop growth.' },
      { title: 'Livestock Management', summary: 'Covers feeding, housing, and basic health monitoring practices for farm animals.' },
      { title: 'Soil & Irrigation Basics', summary: 'Covers understanding soil conditions and applying appropriate water management for different crops.' },
      { title: 'Agro-Processing Techniques', summary: 'Covers basic preservation and processing methods that extend shelf life and add value to raw produce.' },
      { title: 'Farm Planning & Records', summary: 'Covers keeping simple, useful records to track costs, yields and decisions across growing seasons.' },
    ],
    practiceQuestions: [
      {
        question: 'Why is early observation of crops during the growing season important for pest and disease management?',
        answer: 'Catching a problem early, while it affects only a few plants, is much easier and cheaper to manage than waiting until it has spread across a whole field.',
        explanation: 'Many pest and disease problems grow worse over time if untreated, so regular observation allows for smaller, more effective interventions.',
      },
      {
        question: 'What are two signs that might indicate an animal is unwell, even before more serious symptoms appear?',
        answer: 'Reduced eating or drinking, and unusual changes in movement, posture or general behavior compared to the animal\'s normal pattern.',
        explanation: 'Animals often cannot communicate illness directly, so caretakers rely on noticing deviations from normal behavior as an early warning sign.',
      },
      {
        question: 'Why can both overwatering and underwatering be harmful to crops?',
        answer: 'Overwatering can cause root rot and nutrient loss from the soil, while underwatering causes stress and poor growth, so irrigation needs to be matched to actual crop and soil needs.',
        explanation: 'Understanding this balance helps learners avoid the common mistake of following a rigid watering schedule that ignores actual soil moisture and weather conditions.',
      },
      {
        question: 'Explain why drying is an effective method of food preservation.',
        answer: 'Drying removes much of the moisture that bacteria, mold and other spoilage organisms need to grow, which slows down spoilage and extends shelf life.',
        explanation: 'Understanding the underlying reason behind a preservation method helps learners judge how thoroughly a product needs to be dried and why incomplete drying can still lead to spoilage.',
      },
      {
        question: 'Why might a farmer who keeps simple written records make better decisions over several seasons than one who relies only on memory?',
        answer: 'Records make it possible to compare actual results across seasons objectively, revealing patterns in what worked and what did not, rather than relying on memory, which can be inconsistent.',
        explanation: 'Record-keeping turns farming experience into a more structured kind of learning, helping a farmer improve practices deliberately rather than by chance.',
      },
    ],
  },
  {
    slug: 'transport-logistics',
    subject: 'Transport & Logistics',
    sector: 'transport-logistics',
    description:
      'A study guide for TVET learners in Transport & Logistics, covering driving fundamentals, logistics coordination and automotive basics.',
    intro: [
      "Transport & Logistics prepares learners for roles connected to moving people and goods efficiently and safely, spanning driving skills, basic automotive knowledge, and the coordination work involved in logistics and supply chains. As trade and commerce grow, reliable transport and logistics professionals are needed to keep goods moving between farms, factories, markets and customers, and to keep vehicles and fleets running safely.",
      'This guide outlines broad themes across this pathway to support your revision alongside official course materials, practical driving instruction, and workshop sessions on vehicle maintenance. Transport work involves real responsibility for safety — of drivers, passengers, and other road users — so always follow your instructors\' guidance and local traffic regulations during any practical training.',
      'A theme that runs through this whole sector is reliability: goods need to arrive on time and in good condition, and vehicles need to be safe and ready when needed. Building habits of careful planning, basic vehicle checks, and honest, clear communication about delays or problems will serve you well whether you end up driving, managing logistics, or maintaining vehicles.',
    ],
    keyTopics: [
      {
        title: 'Road Safety & Driving Fundamentals',
        explanation:
          "Safe driving starts with understanding traffic rules, defensive driving habits, and how to respond calmly to unexpected situations on the road. Learners study how following distance, speed control and awareness of other road users reduce accident risk, and why habits like checking mirrors and signaling early are not just rules but practical ways to protect everyone on the road. Consistent, disciplined habits matter more than occasional careful driving.",
      },
      {
        title: 'Basic Vehicle Maintenance',
        explanation:
          'Understanding basic vehicle systems — engine, brakes, tires, fluids and lights — allows a driver or technician to spot early warning signs of a problem before it causes a breakdown or accident. Routine pre-trip checks, such as inspecting tire condition and fluid levels, are simple habits that prevent many common vehicle failures. Learners should practice explaining what each check is looking for, not just performing it mechanically.',
      },
      {
        title: 'Logistics & Supply Chain Basics',
        explanation:
          "Logistics coordination involves planning how goods move from origin to destination efficiently, considering factors like loading, routing, and timing. Even simple improvements, such as better route planning or more efficient loading, can noticeably reduce costs and delays. Learners benefit from thinking through how a delay or mistake at one point in a supply chain (a late pickup, a mislabeled package) can cascade into problems further down the line.",
      },
      {
        title: 'Cargo Handling & Documentation',
        explanation:
          'Properly loading, securing and documenting cargo protects both the goods and the people handling them, and creates a clear record in case of disputes or damage claims. Learners study why certain loading patterns are safer, how to secure different types of cargo, and why accurate documentation (what was loaded, when, and in what condition) matters for accountability throughout a transport journey.',
      },
      {
        title: 'Customer & Fleet Communication',
        explanation:
          "Transport and logistics work depends on clear communication: informing customers of delays, updating dispatchers on vehicle status, and reporting problems honestly and promptly. Professionals in this field are trusted with other people's goods, time and safety, so clear, timely communication when something goes wrong is just as important as technical driving or vehicle skills.",
      },
    ],
    moduleSummaries: [
      { title: 'Road Safety & Defensive Driving', summary: 'Covers traffic rules, hazard awareness, and safe driving habits for different road conditions.' },
      { title: 'Vehicle Systems & Maintenance', summary: 'Covers basic engine, brake, tire and fluid checks, and routine maintenance to prevent breakdowns.' },
      { title: 'Logistics Planning', summary: 'Covers route planning, loading efficiency, and coordinating the movement of goods from origin to destination.' },
      { title: 'Cargo Handling & Documentation', summary: 'Covers safely securing cargo and maintaining accurate records throughout a transport journey.' },
      { title: 'Professional Communication in Transport', summary: 'Covers clear, timely communication with customers, dispatchers and teams when plans change or problems arise.' },
    ],
    practiceQuestions: [
      {
        question: 'Why is maintaining a safe following distance considered a core defensive driving habit?',
        answer: 'A safe following distance gives the driver enough time and space to react if the vehicle ahead stops suddenly, reducing the risk of a collision.',
        explanation: 'Defensive driving focuses on creating margins for error, and following distance is one of the simplest, most effective margins a driver controls directly.',
      },
      {
        question: 'Why should a driver perform a pre-trip vehicle check even if the vehicle seemed fine on the last trip?',
        answer: 'Vehicle conditions can change between trips — tires can lose pressure, fluids can leak slowly — so a fresh check catches new problems before they cause a breakdown on the road.',
        explanation: 'Treating a pre-trip check as a routine habit, not a one-time task, is what actually prevents many common vehicle failures.',
      },
      {
        question: 'How can a small mistake early in a supply chain, such as a mislabeled package, affect later stages of delivery?',
        answer: 'It can cause the package to be routed incorrectly, delayed at a checkpoint, or delivered to the wrong recipient, creating extra cost and time to correct further down the chain.',
        explanation: 'This illustrates why accuracy early in a logistics process is so valuable — errors tend to become more expensive and harder to fix the further they travel through the system.',
      },
      {
        question: 'Why is accurate documentation of cargo condition important when goods are loaded and unloaded?',
        answer: 'It creates a clear record of the cargo\'s condition at each stage, which helps resolve disputes fairly if damage or loss is discovered later.',
        explanation: 'Without documentation, it becomes difficult to determine where in the journey a problem occurred, which can lead to unfair blame or unresolved disputes.',
      },
      {
        question: 'Give an example of why honest, prompt communication about a delay is better for a transport business than staying silent and hoping the delay goes unnoticed.',
        answer: 'Prompt communication allows the customer or dispatcher to adjust their own plans, which builds trust, while silence often leads to bigger frustration and loss of trust once the delay is discovered.',
        explanation: 'Reliability in transport and logistics is built as much on honest communication as on technical performance, since customers value being kept informed even when things do not go perfectly.',
      },
    ],
  },
];

export const getGuideBySlug = (slug: string): StudyGuide | undefined =>
  studyGuides.find((guide) => guide.slug === slug);
