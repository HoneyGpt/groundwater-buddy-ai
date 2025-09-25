import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h1 className="text-3xl font-bold text-foreground mb-8">Privacy Policy</h1>
          
          <div className="text-muted-foreground mb-6">
            <p className="font-medium">Project by Auron Hive Tech & Harshita Bhaskaruni</p>
            <p>Effective Date: 24-09-2025</p>
          </div>

          <div className="space-y-8 text-foreground">
            <p className="text-muted-foreground">
              Auron Hive Tech, in collaboration with Harshita Bhaskaruni, developed this application as part of the Smart India Hackathon (SIH) initiative and as a contribution toward solving real-world challenges with AI-driven technology. This privacy policy explains how we handle your data and your trust when you use our platform.
            </p>

            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Ownership & Copyright</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>This application, its architecture, design, and intellectual property belong solely to Auron Hive Tech and Harshita Bhaskaruni.</li>
                <li>All rights are reserved. Unauthorized copying, distribution, modification, or commercial use of this project is strictly prohibited.</li>
                <li>The project was created under the banner of Auron Hive Tech for SIH and for real-world deployment beyond the hackathon.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Purpose of the Application</h2>
              <p className="text-muted-foreground mb-3">The application is designed to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Provide AI-powered research, knowledge assistance, and data processing tools.</li>
                <li>Support communities, institutions, and individuals in India and globally by reducing barriers in education, research, and information access.</li>
                <li>Showcase the potential of indigenous technology built by students and innovators for real-world problem-solving.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Information We Collect</h2>
              <p className="text-muted-foreground mb-3">Depending on your interaction with the app, we may collect:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Basic Account Details:</strong> Name, email ID, or login credentials (for signup & authentication).</li>
                <li><strong>User Data:</strong> Uploaded documents, chat inputs, research queries, and files (used only for AI processing).</li>
                <li><strong>Usage Data:</strong> Technical logs, error reports, and analytics for improving app performance.</li>
              </ul>
              <p className="text-muted-foreground mt-3">We do not sell or rent your information to third parties.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. How Data is Used</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>To deliver accurate AI-driven responses.</li>
                <li>To improve features such as PDF processing, research generation, and dashboard enhancements.</li>
                <li>To maintain the integrity and security of the application.</li>
                <li>For academic, research, and innovation purposes aligned with SIH goals.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Data Storage & Security</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>All stored information is protected through industry-standard encryption and secure cloud services.</li>
                <li>User data is used only during active sessions unless explicitly saved by the user.</li>
                <li>We are committed to protecting user privacy and preventing unauthorized access.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Open-Source APIs & Third-Party Tools</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Our platform may integrate open-source APIs or third-party data sources to enhance features.</li>
                <li>All external tools comply with their respective licenses.</li>
                <li>Auron Hive Tech ensures no misuse of external data and maintains transparency with users.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. User Rights</h2>
              <p className="text-muted-foreground mb-3">Users have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Access, export, or delete their data.</li>
                <li>Opt out of data collection where possible.</li>
                <li>Request clarifications about how their information is used.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Compliance with SIH & Real-World Standards</h2>
              <p className="text-muted-foreground mb-3">This project was developed as part of Smart India Hackathon (SIH) with the aim of solving real-world challenges. Our solution reflects:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>A commitment to innovation, accessibility, and inclusivity.</li>
                <li>Alignment with India's vision of Digital India and AI-driven problem solving.</li>
                <li>A sustainable model that can expand beyond SIH into real-world deployment.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Updates to Privacy Policy</h2>
              <p className="text-muted-foreground">
                We may update this policy to reflect new features, legal requirements, or project expansion. Users will be notified of major changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
              <p className="text-muted-foreground mb-3">For questions or concerns regarding privacy or data usage, please reach out to:</p>
              <div className="text-muted-foreground">
                <p><strong>Auron Hive Tech</strong></p>
                <p>Email: <a href="mailto:harshitabhaskaruni@gmail.com" className="text-accent hover:underline">harshitabhaskaruni@gmail.com</a></p>
                <p>Developers: Harshita Bhaskaruni & Team Auron</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;