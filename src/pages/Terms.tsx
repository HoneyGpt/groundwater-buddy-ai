import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h1 className="text-3xl font-bold text-foreground mb-8">Terms of Service</h1>
          
          <div className="text-muted-foreground mb-6">
            <p className="font-medium">INGRES-AI — Official Application</p>
            <p>Operated by: Auron Hive Tech & Harshita Bhaskaruni</p>
            <p>Effective date: 24-09-2025</p>
          </div>

          <div className="space-y-8 text-foreground">
            <p className="text-muted-foreground">
              Welcome — and thank you for trusting INGRES-AI. These Terms of Service ("Terms") explain the rules for using the INGRES-AI services, website, and applications (collectively, the "Service"), operated by Auron Hive Tech in collaboration with Harshita Bhaskaruni. By accessing or using the Service you agree to be bound by these Terms. If you do not agree, please do not use the Service.
            </p>

            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance & Scope</h2>
              <ul className="list-decimal pl-6 space-y-2 text-muted-foreground">
                <li>These Terms govern your use of the Service, whether you are a casual public user, a registered official user, or an administrator.</li>
                <li>The Service includes the public dashboard, the official dashboard (authenticated access), AI chatbot(s) (Lovable/HoneyGPT), document ingestion tools, data export features, and related interfaces.</li>
                <li>Additional policies (Privacy Policy, Cookie Policy, Data Processing Agreements) apply and form part of these Terms where referenced.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Who Operates the Service & Ownership</h2>
              <ul className="list-decimal pl-6 space-y-2 text-muted-foreground">
                <li>The Service and all intellectual property in it (code, design, UI, content, datasets created by Auron Hive Tech, and derivative works) are owned solely by Auron Hive Tech and Harshita Bhaskaruni, unless expressly stated otherwise.</li>
                <li>This Service was developed as a project for the Smart India Hackathon (SIH) and is intended for real-world use and further development. All copyrights, trademarks, and moral rights remain with Auron Hive Tech and Harshita Bhaskaruni.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Eligibility & Accounts</h2>
              <ul className="list-decimal pl-6 space-y-2 text-muted-foreground">
                <li>Public features of the Service are available without account creation. Official features require registration and authentication.</li>
                <li>When you register, you must provide accurate information and keep it current. You are responsible for safeguarding your credentials and for all activity from your account.</li>
                <li>You agree to notify Auron Hive Tech immediately of any unauthorized use or security breach involving your account.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. User Conduct & Acceptable Use</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>4.1. You agree not to use the Service to:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Violate any law or regulation;</li>
                  <li>Upload content that is obscene, defamatory, hateful, abusive, or infringes another's rights;</li>
                  <li>Attempt to gain unauthorized access to other systems or data;</li>
                  <li>Interfere with the operation or performance of the Service;</li>
                  <li>Reverse engineer, decompile, or attempt to extract source code or model weights unless expressly permitted.</li>
                </ul>
                <p>4.2. You agree not to use the Service to collect personal data about others without consent, or to engage in discriminatory practices.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Content & Intellectual Property</h2>
              <ul className="list-decimal pl-6 space-y-2 text-muted-foreground">
                <li><strong>Your Content:</strong> You retain ownership of content you upload (documents, chat logs, images). By uploading, you grant Auron Hive Tech a limited license to use, store, process, and (if you enable sharing) display that content to provide the Service (storage, search, indexing, AI processing).</li>
                <li><strong>Our Content:</strong> The Service's UI, code, models, and curated data produced by Auron Hive Tech are Auron property. You may not copy, redistribute, or republish Auron-owned content without explicit written permission.</li>
                <li><strong>Third-party Content:</strong> The Service may incorporate third-party data, APIs, or open data. Use of such data is subject to the third party's terms and licenses. Auron Hive Tech disclaims responsibility where third-party licenses impose additional restrictions.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Data Use, Ingestion & Exports</h2>
              <ul className="list-decimal pl-6 space-y-2 text-muted-foreground">
                <li>Uploaded documents are processed to extract text, build embeddings, and index content for semantic search and AI answers. You consent to this processing when you upload documents.</li>
                <li>The Official Dashboard provides export capabilities (CSV, GeoJSON, PDF). Exports of potentially sensitive or restricted data may be restricted to official roles; exports are logged and auditable.</li>
                <li>You may request deletion of your uploaded content; Auron Hive Tech will remove content from active indexes within a reasonable time and may retain anonymized logs for security/audit purposes as required by law.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. AI Responses, Accuracy & Disclaimers</h2>
              <ul className="list-decimal pl-6 space-y-2 text-muted-foreground">
                <li>The Service uses AI (LLMs and semantic search) to generate answers. AI responses are advisory only. While we strive for accuracy, AI outputs may be incomplete or occasionally incorrect. Always verify technical, legal, medical, or policy decisions using authoritative sources.</li>
                <li>For numeric, time-series, or official metrics, the Service will prioritize certified data ingested from the knowledge base (Supabase / official datasets). When rendering human-readable text, the LLM may paraphrase; the original source and timestamp will be displayed when available.</li>
                <li>Auron Hive Tech disclaims liability for decisions taken solely on the basis of AI output. The Service should not replace professional advice.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Privacy & Data Protection</h2>
              <ul className="list-decimal pl-6 space-y-2 text-muted-foreground">
                <li>Auron Hive Tech's Privacy Policy explains how we collect, use, store, and secure personal data. By using the Service you also agree to the Privacy Policy.</li>
                <li>We implement reasonable security measures (encryption, access controls). However, no online system is perfectly secure; we cannot guarantee absolute security.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Fees, Trials & Payment (if applicable)</h2>
              <ul className="list-decimal pl-6 space-y-2 text-muted-foreground">
                <li>The public access tier is free. Official features may be subject to subscription, licensing, or access fees in the future — any changes will be posted in advance.</li>
                <li>If fees are charged, you agree to the billing terms, refund policy (if any), and that charges are non-refundable unless required by law or stated otherwise.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Termination & Suspension</h2>
              <ul className="list-decimal pl-6 space-y-2 text-muted-foreground">
                <li>You may delete your account at any time. Auron Hive Tech may suspend or terminate access for violation of these Terms, illegal activity, or security concerns.</li>
                <li>On termination, personal data will be handled per the Privacy Policy and applicable law. Non-personal aggregated data and logs may be retained for analytics and compliance.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Indemnity</h2>
              <p className="text-muted-foreground">
                You agree to indemnify and hold harmless Auron Hive Tech, Harshita Bhaskaruni, and their officers, employees, and partners from any claim or demand (including legal fees) arising out of: (a) your misuse of the Service; (b) your violation of these Terms; or (c) your breach of any law or third-party rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Limitation of Liability</h2>
              <ul className="list-decimal pl-6 space-y-2 text-muted-foreground">
                <li>To the fullest extent permitted by law, Auron Hive Tech and Harshita Bhaskaruni will not be liable for: indirect, incidental, special, punitive or consequential damages, loss of profits, loss of data, or business interruption arising from your use of the Service.</li>
                <li>Our total aggregate liability for claims related to the Service shall not exceed the greater of (a) ₹10,000 (Indian Rupees) or (b) the total fees actually paid by you to Auron Hive Tech in the preceding 12 months, if any. (If you are a consumer, some jurisdictions may not allow these limits.)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">13. Notices & Updates</h2>
              <ul className="list-decimal pl-6 space-y-2 text-muted-foreground">
                <li>We may update these Terms from time to time. Important changes will be notified reasonably (email or site notice). Continued use after notices means acceptance of the updated Terms.</li>
                <li>For legal notices or communications to Auron Hive Tech, use: Email: harshitabhaskaruni@gmail.com</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">14. Governing Law & Dispute Resolution</h2>
              <ul className="list-decimal pl-6 space-y-2 text-muted-foreground">
                <li>These Terms are governed by the laws of India. Any disputes shall first be attempted to be resolved via mediation or good-faith negotiation. If unresolved in 30 days, disputes may be brought in the appropriate courts in India.</li>
                <li>If any provision of these Terms is found invalid or unenforceable, the remainder will continue in full force and effect.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">15. Third-Party Services & Open-Source Components</h2>
              <ul className="list-decimal pl-6 space-y-2 text-muted-foreground">
                <li>The Service uses third-party and open-source tools (e.g., Supabase, open libraries). Their licenses govern those components. Auron Hive Tech does not assume liability for external providers' services.</li>
                <li>By using the Service, you also agree to comply with third-party terms when using integrated features (e.g., Google APIs, mapping services).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">16. Copyright & Takedown Policy</h2>
              <p className="text-muted-foreground">
                If you believe your copyrighted work has been used in violation, please contact Auron Hive Tech at harshitabhaskaruni@gmail.com with take-down details, proof of ownership, and a good-faith statement. We will respond and act in accordance with applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">17. Miscellaneous</h2>
              <ul className="list-decimal pl-6 space-y-2 text-muted-foreground">
                <li>These Terms, together with the Privacy Policy and any other policy we publish, form the entire agreement between you and Auron Hive Tech.</li>
                <li>No waiver of any term is a continuing waiver. Rights not expressly granted are reserved by Auron Hive Tech.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">18. Contact</h2>
              <p className="text-muted-foreground">
                If you have questions about these Terms, email us at: <a href="mailto:harshitabhaskaruni@gmail.com" className="text-accent hover:underline">harshitabhaskaruni@gmail.com</a> or contact the project lead: Harshita Bhaskaruni.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;