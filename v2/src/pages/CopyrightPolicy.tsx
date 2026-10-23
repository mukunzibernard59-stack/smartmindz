import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import BackButton from '@/components/BackButton';
import { Copyright, BookOpen, ShieldAlert, Mail, Scale, Calendar } from 'lucide-react';

const CopyrightPolicy: React.FC = () => (
  <div className="min-h-screen flex flex-col bg-background">
    <SEO
      title="Copyright & Content Policy — SmartMind"
      description="How SmartMind handles copyright: ownership of original content, use of Rwanda TVET Board (RTB) public curriculum materials, respect for third-party rights, and our DMCA-style takedown and counter-notice procedure."
      path="/copyright"
    />
    <Navbar />
    <main className="flex-1 pt-24 py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-4">
          <BackButton />
        </div>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Copyright className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Copyright &amp; Content Policy</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Last updated: January 2026
            </p>
          </div>
        </div>

        <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
          SmartMind (smartmindz.site) is a free learning platform built for students across Rwanda
          and the wider East African region. We take copyright seriously, both because it is the
          law and because the teachers and institutions whose work we reference deserve credit and
          protection. This page explains, in plain language, who owns what on SmartMind, how we use
          publicly available curriculum material, how we respond to copyright concerns, and how you
          can report a problem or dispute a takedown.
        </p>

        <div className="space-y-8">
          <section className="bg-card rounded-xl p-6 border">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Copyright className="h-5 w-5 text-primary" /> Ownership of Original Content
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Unless stated otherwise, the SmartMind name, logo, website design, user interface,
              original blog articles, FAQ answers, how-to guides, and software code are the
              intellectual property of SmartMind and its founder, Bernard Mukunzi. You may read,
              share links to, and quote short excerpts of this original content for personal,
              non-commercial, and educational use, provided you credit SmartMind and link back to
              the source page. You may not republish our articles in full, resell our content, or
              present it as your own without our written permission.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Content you personally create using SmartMind's tools — for example, letters, CVs,
              study notes, or images generated with Writer Studio or Design Studio — belongs to
              you. We do not claim ownership over the documents, essays, or images you produce with
              our tools, as described in our{' '}
              <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>.
            </p>
          </section>

          <section className="bg-card rounded-xl p-6 border">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" /> Rwanda TVET Board (RTB) Curriculum Materials
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Our TVET Library organizes and presents curriculum documents, module outlines, and
              competence-based training references that originate from the Rwanda TVET Board (RTB)
              and Rwanda Polytechnic. These materials are sourced from official, publicly released
              curriculum publications intended for use by TVET schools, trainers, and students
              nationwide. SmartMind does not claim authorship of RTB-issued curriculum content: the
              national curriculum, module codes, learning outcomes, and official competence
              standards remain the intellectual property of the Rwanda TVET Board and the
              Government of Rwanda.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Where we reformat, summarize, index, or present these public documents in a more
              searchable and mobile-friendly way, we do so to improve access for students who may
              not have a reliable way to find or download the original PDFs. If RTB, Rwanda
              Polytechnic, or any official body identifies a document on SmartMind that should be
              updated, corrected, removed, or attributed differently, we will act promptly — contact
              us using the details below.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              If you represent RTB or a TVET school and would like to formally partner with us,
              correct an outdated module, or request that specific content be taken down or
              re-attributed, please email us; we treat requests from official training institutions
              as a priority.
            </p>
          </section>

          <section className="bg-card rounded-xl p-6 border">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" /> Respecting Third-Party Copyright
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              SmartMind respects the intellectual property rights of others and expects the same
              from anyone who uses or contributes to our platform. We do not knowingly host
              pirated textbooks, copyrighted past exam papers sold commercially, paywalled
              publisher content, or copyrighted media (images, audio, or video) without
              permission or a valid public license.
            </p>
            <ul className="space-y-2 text-muted-foreground list-disc pl-5">
              <li>Material contributed by teachers or users must be their own work, be released under an open license, or be used with the rights holder's permission.</li>
              <li>AI-generated notes, quizzes, and translations produced by our tools are generated dynamically and are not copies of any single copyrighted textbook.</li>
              <li>Images produced by Design Studio are generated or transformed by AI and are not sourced from copyrighted stock libraries without a valid license.</li>
              <li>Links to external resources point to the original publisher or official source wherever possible.</li>
            </ul>
          </section>

          <section className="bg-card rounded-xl p-6 border">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-destructive" /> Copyright Takedown Procedure
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              If you are a copyright owner, or an agent authorized to act on a copyright owner's
              behalf, and you believe that material available on SmartMind infringes your
              copyright, you may submit a takedown notice. To be effective, please include:
            </p>
            <ul className="space-y-2 text-muted-foreground list-disc pl-5 mb-4">
              <li>Your full name, organization (if applicable), and contact details.</li>
              <li>A description of the copyrighted work you believe has been infringed.</li>
              <li>The exact URL(s) on smartmindz.site where the material appears.</li>
              <li>A statement that you have a good-faith belief the use is not authorized by the copyright owner, its agent, or the law.</li>
              <li>A statement, made under penalty of perjury, that the information in your notice is accurate and that you are the copyright owner or authorized to act on their behalf.</li>
              <li>Your physical or electronic signature.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              Send takedown requests to{' '}
              <a href="mailto:mukunzibernard59@gmail.com" className="text-primary hover:underline">
                mukunzibernard59@gmail.com
              </a>{' '}
              with the subject line "Copyright Takedown Request." We review every valid notice and
              typically remove or disable access to the reported material within five (5) business
              days of receiving a complete request, often much sooner for clear-cut cases.
            </p>
          </section>

          <section className="bg-card rounded-xl p-6 border">
            <h2 className="text-xl font-semibold mb-4">Our Response Commitment</h2>
            <p className="text-muted-foreground leading-relaxed">
              We take every copyright report seriously. Once we receive a complete and valid
              notice, we will acknowledge receipt within two business days, investigate the claim,
              and — where the claim is valid — remove or disable public access to the material
              while we resolve the matter. We will notify the person or organization who originally
              uploaded or contributed the material, where one can be identified, so they have the
              opportunity to respond. Repeat or clearly bad-faith infringement by a contributor may
              result in that contributor losing the ability to submit content to SmartMind.
            </p>
          </section>

          <section className="bg-card rounded-xl p-6 border">
            <h2 className="text-xl font-semibold mb-4">Counter-Notice Procedure</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              If you believe material you submitted or that is attributed to you was removed or
              disabled by mistake or misidentification, you may submit a counter-notice. Your
              counter-notice should include:
            </p>
            <ul className="space-y-2 text-muted-foreground list-disc pl-5 mb-4">
              <li>Your name, address, and contact information.</li>
              <li>Identification of the material and its location on SmartMind before it was removed.</li>
              <li>A statement, under penalty of perjury, that you have a good-faith belief the material was removed as a result of mistake or misidentification.</li>
              <li>A statement that you consent to the jurisdiction appropriate to resolve disputes with the original complainant.</li>
              <li>Your physical or electronic signature.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              Send counter-notices to the same address,{' '}
              <a href="mailto:mukunzibernard59@gmail.com" className="text-primary hover:underline">
                mukunzibernard59@gmail.com
              </a>
              , with the subject line "Copyright Counter-Notice." We will review counter-notices in
              good faith and, where appropriate, restore the material after a reasonable waiting
              period, unless we receive notice that the original complainant has initiated legal
              action to keep it removed.
            </p>
          </section>

          <section className="bg-card rounded-xl p-6 border">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" /> Contact Us
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              For any copyright question, takedown request, counter-notice, or attribution
              correction, email us at{' '}
              <a href="mailto:mukunzibernard59@gmail.com" className="text-primary hover:underline">
                mukunzibernard59@gmail.com
              </a>
              . For general questions about how SmartMind handles data and third-party advertising,
              see our{' '}
              <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link> and{' '}
              <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>.
            </p>
          </section>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default CopyrightPolicy;
