import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './DashboardPage.css'; // Reusing styles

const PrivacyPolicyPage = () => {
  return (
    <div className="page-container">
      <div className="content-wrap">
        <div className="user-dashboard-container">
          <Header />
          <main className="user-main-content">
            <div className="user-welcome-banner" style={{ textAlign: 'left', padding: '2rem 3rem' }}>
              <h1>Privacy Policy</h1>
              <p>Effective date: October 28, 2025</p>
            </div>

            <section style={{ padding: '2rem', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', marginBottom: '2rem' }}>
              <h2>Overview</h2>
              <p>
                Clean Street ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains
                what information we collect, how we use it, and the choices you have. It applies to our web and mobile
                services, including the reporting and tracking of civic issues.
              </p>
            </section>

            <section style={{ padding: '2rem', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', marginBottom: '2rem' }}>
              <h2>Information We Collect</h2>
              <ul style={{ lineHeight: '1.7', paddingLeft: '1.25rem' }}>
                <li><strong>Account Data:</strong> name, email, password (hashed), profile details you choose to add.</li>
                <li><strong>Usage Data:</strong> app interactions, device type, browser information, and diagnostics.</li>
                <li><strong>Reports &amp; Uploads:</strong> issue descriptions, photos, comments, upvotes, and timestamps.</li>
                <li><strong>Location Data:</strong> optional precise or approximate location to help route issues to the right authority.</li>
                <li><strong>Cookies &amp; Tokens:</strong> authentication tokens and preferences stored in your browser.</li>
              </ul>
            </section>

            <section style={{ padding: '2rem', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', marginBottom: '2rem' }}>
              <h2>How We Use Your Information</h2>
              <ul style={{ lineHeight: '1.7', paddingLeft: '1.25rem' }}>
                <li>Authenticate you and maintain secure sessions.</li>
                <li>Enable core features such as reporting, tracking, and resolving civic issues.</li>
                <li>Improve our services, safety, and performance through analytics and troubleshooting.</li>
                <li>Communicate updates about your reports, account, and important service notifications.</li>
                <li>Comply with legal obligations and enforce our terms.</li>
              </ul>
            </section>

            <section style={{ padding: '2rem', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', marginBottom: '2rem' }}>
              <h2>Sharing &amp; Disclosure</h2>
              <p>
                We do not sell your personal information. We share limited data with:
              </p>
              <ul style={{ lineHeight: '1.7', paddingLeft: '1.25rem' }}>
                <li>Municipal departments and authorized partners strictly to process and resolve reported issues.</li>
                <li>Service providers who help us host, store, analyze, or deliver our services under confidentiality obligations.</li>
                <li>Law enforcement or regulators when required by applicable law.</li>
              </ul>
            </section>

            <section style={{ padding: '2rem', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', marginBottom: '2rem' }}>
              <h2>Data Retention</h2>
              <p>
                We retain your information only as long as necessary for the purposes described in this policy, to comply
                with legal requirements, and to resolve disputes. You may request deletion of your account and associated
                personal data, subject to legal exceptions.
              </p>
            </section>

            <section style={{ padding: '2rem', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', marginBottom: '2rem' }}>
              <h2>Your Rights &amp; Choices</h2>
              <ul style={{ lineHeight: '1.7', paddingLeft: '1.25rem' }}>
                <li>Access, correct, or delete your account information.</li>
                <li>Control location sharing permissions at any time in your device or browser.</li>
                <li>Opt out of non-essential communications.</li>
                <li>Request a copy of your personal data where applicable.</li>
              </ul>
            </section>

            <section style={{ padding: '2rem', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', marginBottom: '2rem' }}>
              <h2>Security</h2>
              <p>
                We apply industry-standard security measures to protect your information, including encryption in transit
                and access controls. No system is entirely secure; please use strong, unique passwords and keep your
                login credentials confidential.
              </p>
            </section>

            <section style={{ padding: '2rem', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', marginBottom: '2rem' }}>
              <h2>Children's Privacy</h2>
              <p>
                Our services are not directed to children under 13. If we learn that we have collected personal data from
                a child under 13, we will take steps to delete such information promptly.
              </p>
            </section>

            <section style={{ padding: '2rem', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', marginBottom: '2rem' }}>
              <h2>Third‑Party Services</h2>
              <p>
                Our platform may link to third‑party services (for example, maps). Their privacy practices are governed by
                their own policies. We encourage you to review those policies when you interact with those services.
              </p>
            </section>

            <section style={{ padding: '2rem', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', marginBottom: '2rem' }}>
              <h2>International Transfers</h2>
              <p>
                Depending on your location, your information may be processed in a different country with different data
                protection laws. Where required, we implement appropriate safeguards.
              </p>
            </section>

            <section style={{ padding: '2rem', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', marginBottom: '2rem' }}>
              <h2>Changes to This Policy</h2>
              <p>
                We may update this policy from time to time. When we do, we will revise the "Effective date" above and, if
                appropriate, provide additional notice.
              </p>
            </section>

            <section style={{ padding: '2rem', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', marginBottom: '2rem' }}>
              <h2>Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy or your data, contact us at
                {' '}<a href="mailto:support@cleanstreet.example">support@cleanstreet.example</a>.
              </p>
            </section>
          </main>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;