// Blog posts — long-form original content (300+ words each) for AdSense content requirement.
// Add new posts here; slug becomes the URL.

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  author: string;
  date: string;      // ISO
  readMinutes: number;
  tags: string[];
  cover?: string;
  content: string;   // Markdown-ish paragraphs separated by \n\n. Use ## for h2.
}

export const posts: BlogPost[] = [
  {
    slug: 'how-to-study-for-tvet-exams-rwanda',
    title: 'How to Study for Rwanda TVET Exams: A Complete Guide',
    description: 'A practical, step-by-step revision plan for Rwanda TVET students preparing for national assessments — from planning your week to the night before the exam.',
    author: 'SmartMind Team',
    date: '2026-05-12',
    readMinutes: 8,
    tags: ['TVET', 'Study', 'Rwanda'],
    content: `Rwanda TVET national assessments are unlike most school exams. They are designed around practical competencies, not memorized theory, which means your revision needs to look very different from the "read the textbook three times" habit most of us grew up with. This guide walks you through a revision system that consistently helps our TVET students score in the top band — and it costs nothing but your time.

## Start With The Competency Map

Every TVET module is anchored to a set of learning outcomes and performance criteria published by the Rwanda TVET Board. Before you open any note, print the competency list for your module and treat it as your checklist. For each line, write one of three marks next to it: green if you can perform it under exam conditions, yellow if you understand it in theory but haven't practiced enough, and red if you don't know it at all. Ninety percent of failed TVET exams come from students who never made this map — they revise what they already know instead of what they don't.

## Build A Weekly Revision Rhythm

Divide your week into 60-minute focused blocks. In each block, pick one red item and work it up to yellow, or one yellow item and drill it to green. Do not touch green items for more than a quick weekly review. This is the single biggest change you can make: stop rereading chapters you already understand. If you have four weeks before an assessment, that is roughly 30 hours of focused study — enough to move an entire module from red to green if you use each block honestly.

## Practice, Don't Reread

TVET is a doing subject. Reading about how to wire a distribution board does not teach you to wire one. Whenever possible, physically perform the task, even in a simplified form. When physical practice isn't possible, use the Smart Tutor in SmartMind to generate step-by-step problems on the exact topic you're weak on, then work them by hand before checking the answer. Passive reading gives roughly 10% retention after a week; active recall pushes retention above 70%.

## Use Past Papers Ruthlessly

Every Rwanda TVET module has a bank of past assessment items. Do not save them for the end. From week two of your revision, do one past paper section per study block under exam conditions — timer running, notes closed. Mark yourself strictly. The pattern of questions you get wrong will reveal weak areas your competency map missed.

## The Night Before

Do not learn anything new the night before an exam. Instead, review your green list to confirm confidence, look over key formulas or diagrams for 20 minutes, then stop. Sleep is not optional — a tired brain forgets skills it drilled perfectly the day before. Prepare your tools, ID, and clothes; go to bed early; and eat a real breakfast in the morning. Confidence at 8 AM is worth more than an extra hour of panicked cramming at midnight.`,
  },
  {
    slug: 'learn-kinyarwanda-english-with-smartmind',
    title: 'Learning Kinyarwanda and English Together: Tips That Actually Work',
    description: 'How bilingual learners in Rwanda can use SmartMind to grow both Kinyarwanda and English at the same time — with concrete daily habits.',
    author: 'SmartMind Team',
    date: '2026-05-18',
    readMinutes: 6,
    tags: ['Language', 'Kinyarwanda', 'English'],
    content: `Rwandans grow up code-switching. In one conversation you might mix Kinyarwanda, English, French, and Swahili without noticing. That linguistic flexibility is a superpower — but it can also mean neither language reaches the depth needed for university, work, or writing. Here is how to deliberately grow both Kinyarwanda and English at the same time.

## Read The Same Story Twice

Pick a short news article, folk tale, or Bible passage and read it first in Kinyarwanda, then in English. Do not translate word for word — read for meaning, then compare how each language expresses the same idea. This trains your brain to think in each language rather than translating between them. Twenty minutes a day for a month will noticeably improve both.

## Write A Daily Two-Language Journal

Every evening, write three sentences in Kinyarwanda about your day, then rewrite the same three ideas in English. Do not use a translator. Struggling to find the right word is the entire point — it forces your brain to build vocabulary in both directions. Once a week, paste your entries into the SmartMind Translator to check accuracy.

## Speak, Don't Just Read

Language lives in the mouth, not the eye. Find one person you can talk to in your weaker language for 15 minutes a day. If you have nobody to practice with, use the SmartMind Smart Tutor voice mode and hold a real conversation about your day, a class topic, or a news story. Mistakes are the fastest teachers.

## Watch Local And International Media

Watch one Rwandan news bulletin in Kinyarwanda and one international bulletin in English every day. You will notice that vocabulary you never learned in class — economy, agriculture, health — appears repeatedly in news, which cements it faster than a textbook ever could.

## Track Progress With A Vocabulary Notebook

Every new word or phrase you meet, in either language, goes in a small notebook with a sentence you actually wrote yourself. Review it every Sunday. Within three months you will have a personal dictionary of the words that matter to your life — not the generic ones in a textbook.`,
  },
  {
    slug: 'best-free-ai-study-tools-2026',
    title: 'The Best Free Study Tools for African Students in 2026',
    description: 'A practical review of the most useful free study tools available to students across Africa this year — what each one is good for and what to skip.',
    author: 'SmartMind Team',
    date: '2026-06-02',
    readMinutes: 7,
    tags: ['Tools', 'Study', 'Africa'],
    content: `The last two years have quietly transformed what a student with a phone and a data bundle can do. Below is our honest 2026 shortlist of free tools that actually help African students learn faster — and the ones we recommend skipping.

## Smart Tutors

A good AI tutor should explain concepts step by step, adjust its language to your level, and let you ask follow-ups without judgment. SmartMind's Smart Tutor is our pick for African learners because it defaults to a curriculum you can actually follow, works in Kinyarwanda and Swahili, and does not require a paid plan. For English-only revision, the free tier of Khan Academy is still excellent, especially for mathematics up to A-level.

## Note-Taking

Handwriting notes on paper wins for memory, but digital notes win for search. Google Keep is free, syncs everywhere, and is enough for most students. If you want structured notebooks with linking, Obsidian is free for personal use — a small learning curve but worth it for long revision cycles. Avoid apps that lock features behind a monthly fee; you will lose access the moment your data runs out.

## Flashcards And Spaced Repetition

Anki remains the undefeated champion. It is free on Android and desktop, and its algorithm is the reason medical students all over the world use it. Build your own deck for each module — the act of making the card is half the learning.

## Reading And Textbooks

The Internet Archive's open library gives you free access to millions of textbooks. Project Gutenberg covers everything out of copyright, which for TVET means most of the fundamental engineering, agriculture, and economics classics. Combine these with the SmartMind TVET Library for Rwanda-specific curriculum coverage.

## Practice And Past Papers

For national curriculum, the Rwanda TVET Board publishes past assessment items on its official portal. For international qualifications like Cambridge or IB, the Physics And Maths Tutor site is free and comprehensive. Time yourself; mark honestly.

## What To Skip

Skip apps that promise "AI essay writing" without teaching you anything, tools that require you to give up your contact list, and any product that hides basic features behind a subscription. Your goal is to learn, not to become dependent on a single expensive vendor.`,
  },
  {
    slug: 'writing-a-strong-cv-first-job',
    title: 'How to Write a Strong CV for Your First Job in Rwanda',
    description: 'A step-by-step guide for TVET graduates and young Rwandans building their first professional CV — with examples of what employers actually look for.',
    author: 'SmartMind Team',
    date: '2026-06-14',
    readMinutes: 7,
    tags: ['Career', 'CV', 'Jobs'],
    content: `A first CV is uniquely hard to write. You feel like you have nothing to say, so you either leave it too short or you pad it with things nobody will read. This guide shows what actually goes on a strong first-job CV in Rwanda, drawn from what recruiters at both local firms and international NGOs consistently tell us.

## Keep It To One Page

If you have less than five years of formal experience, your CV must fit on a single A4 page. Recruiters spend an average of seven seconds per CV on a first review. Two-page CVs from junior candidates are almost always skimmed and often skipped entirely. The SmartMind Writer Studio has a "First Job CV" template that already enforces this length.

## Lead With A Two-Sentence Profile

Instead of an "Objective" line ("Seeking a position where I can grow…"), write a two-sentence profile that names what you can do and what you're looking for. Example: "TVET Level 4 graduate in Networking with hands-on experience configuring routers and small business LANs. Looking for a junior IT support role where I can contribute immediately and continue learning enterprise systems." That opening tells a recruiter, in seven seconds, whether you fit.

## Show Skills With Evidence

Under skills, do not simply list "Communication, Teamwork, Leadership." Everyone writes that. Instead, group skills by function and back each cluster with one concrete example. "Networking: configured VLANs and DHCP on Cisco switches during a school project of 20 users." That single line proves the skill better than five buzzwords.

## Turn School Projects Into Experience

If you have no formal jobs yet, promote your significant school and community projects into an "Experience" section. Give each project a title, dates, and three bullet points describing what you did and what changed as a result. A well-written school project entry reads exactly like a junior job — because in terms of skills exercised, it often is.

## Include Certifications, Skip The Photo

List every course, certificate, and workshop, even short online ones, with dates. In Rwanda, most professional employers no longer expect a photo on the CV and some large organisations discard CVs that include one to avoid bias. Include your national ID and email, and a phone number that reaches you the same day.

## Proofread — Twice

Typos in a first CV are fatal. Read your CV out loud once. Then paste it into the SmartMind Writer Studio and ask it to check grammar and clarity. Finally, ask one person you trust to read it fresh. Three passes catches 99% of mistakes.`,
  },
  {
    slug: 'staying-focused-while-studying-with-a-phone',
    title: 'How to Actually Study on a Phone Without Getting Distracted',
    description: 'Practical, tested strategies for studying effectively when a smartphone is your only device — and how to keep social media from stealing your revision hours.',
    author: 'SmartMind Team',
    date: '2026-06-21',
    readMinutes: 6,
    tags: ['Study', 'Focus', 'Habits'],
    content: `For most African students the smartphone is not a study accessory — it is the entire computer. That means the same device you use to read notes is the one buzzing with WhatsApp, TikTok, and football updates. Here is how to make it work.

## Create A Study Mode

On both Android and iPhone you can create a Focus profile that silences everything except calls from family. Set it to activate every day at your usual study time. Notifications are the number-one killer of deep study — a single WhatsApp preview breaks concentration for roughly 15 minutes even if you ignore it. Do not rely on willpower; make the phone stop asking.

## Use One App At A Time

When studying, open only one app in full screen. Do not run YouTube in the background "for music" — pick either an offline playlist you queued the night before, or complete silence. Every extra background app is a temptation and a battery drain.

## Follow The 25/5 Rhythm

Twenty-five minutes of study, five minutes of movement. This is old advice because it works. Set a timer. During the five minutes do not check social media — stand, drink water, look out a window. The break is for your brain, not for another dopamine hit. After four cycles take a proper 20-minute break.

## Keep Social Apps On A Separate Home Screen

Move Instagram, TikTok, WhatsApp, and Facebook off your main home screen. The single act of having to swipe an extra page reduces accidental opens by roughly half. If a specific app has become genuinely destructive, uninstall it for a week. You will not miss it.

## Use SmartMind As Your Study Hub

Because SmartMind combines notes, tutor, and quizzes in one app, you can keep the whole study session inside a single tab rather than jumping between browser windows. Every jump is a chance to get distracted.

## Sleep Is Study Time

The phone in your bed at midnight is not helping you revise. It is destroying tomorrow's revision. Charge your phone in another room. If your family shares a room, put the phone screen-down across the space, on airplane mode. Six hours of good sleep beats eight hours interrupted by notifications every single time.`,
  },
  {
    slug: 'ai-tutor-vs-human-teacher',
    title: 'AI Tutor vs Human Teacher: What Each Is Actually Good At',
    description: 'An honest comparison of what a smart AI tutor does well, what only a real teacher can give you, and how to combine both for the fastest learning.',
    author: 'SmartMind Team',
    date: '2026-06-28',
    readMinutes: 6,
    tags: ['Learning', 'AI', 'Teaching'],
    content: `AI tutors have moved from curiosity to daily study tool in less than three years. Some students now rely on them almost exclusively, and some teachers worry about being replaced. The honest answer is that AI and human teachers are good at very different things, and combining them beats either one alone.

## What An AI Tutor Does Best

An AI tutor is always available, patient, and non-judgemental. You can ask the same question five times in a row and it never sighs. It scales down to your level automatically — if you ask about photosynthesis in simple English, it answers in simple English. It generates unlimited practice problems on the exact topic you are weak on, in seconds. For raw drill, retrieval practice, and explaining concepts step-by-step, it is genuinely excellent.

## What Only A Human Teacher Can Give You

A human teacher notices when your face changes. They see confusion you have not put into words yet. They know your background — that your family speaks Kinyarwanda at home, that you missed a week last month, that you are stronger in practicals than theory. They give you a reason to show up. They correct your body posture at a workbench. They tell you honestly when you are not working hard enough, and they cheer for you when you are. No AI does any of this, and pretending otherwise sets students up to fail.

## Combine Them Correctly

Use your teacher for the things only they can do: live demonstrations, one-on-one feedback on your work, motivation, and the deep human judgement of "you are ready for this exam" or "you are not." Use the AI tutor for the things it does best: drilling problems late at night, explaining a topic a fourth different way, checking your grammar, generating a quiz from your notes ten minutes before class starts.

## Do Not Outsource Thinking

The one habit that ruins students is copying AI answers into their homework and moving on. You have not learned anything. The rule at SmartMind is simple: ask the AI to explain, work the problem yourself on paper, then check. If you cannot reproduce the reasoning without looking, you do not yet know it. This is true whether your source is an AI, a friend, or the teacher.

## The Future Belongs To Both

Students who learn to use AI as a smart study partner while still respecting and using their human teachers will run circles around students who use only one or the other. The tools are new; the fundamental principles of learning are not.`,
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}
