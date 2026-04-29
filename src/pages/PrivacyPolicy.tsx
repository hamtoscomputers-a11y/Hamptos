import { Helmet } from 'react-helmet-async';

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - Hamtos Computers</title>
        <meta name="description" content="Privacy Policy for Hamtos Computers - Learn how we collect, use, and protect your personal information." />
      </Helmet>
      <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16 max-w-8xl">
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 md:p-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
            <p className="text-sm sm:text-base text-gray-600 mb-8">Last Updated: May 2, 2025</p>

            <div className="prose prose-sm sm:prose-base max-w-none text-gray-700 space-y-6">
              <p className="leading-relaxed">
                Hamtos Computers ("we", "our", "us") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, store, and protect your information when you visit or make a purchase from <a href="https://hamtos.com/" className="text-blue-600 hover:underline">https://hamtos.com/</a> (the "Website").
              </p>
              <p className="leading-relaxed">
                By using our Website or services, you agree to the practices described in this Privacy Policy. If you do not agree, please discontinue use of our Website.
              </p>

              <section className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">1. Company Information</h2>
                <ul className="list-none space-y-2">
                  <li><strong>Business Name:</strong> Hamtos Computers</li>
                  <li><strong>Website:</strong> <a href="https://hamtos.com/" className="text-blue-600 hover:underline">https://hamtos.com/</a></li>
                  <li><strong>Address:</strong> Nahdha St - Al Souq Al Kabeer - Al Fahidi - Dubai, United Arab Emirates</li>
                  <li><strong>Email:</strong> <a href="mailto:info@hamtos.com" className="text-blue-600 hover:underline">info@hamtos.com</a></li>
                  <li><strong>Phone:</strong> <a href="tel:+97142528481" className="text-blue-600 hover:underline">+97142528481</a></li>
                </ul>
              </section>

              <section className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">2. Scope of This Privacy Policy</h2>
                <p className="mb-2">This Privacy Policy applies to:</p>
                <ul className="space-y-2 list-disc pl-6">
                  <li>Visitors to our Website</li>
                  <li>Customers who place orders through our Website</li>
                  <li>Individuals who communicate with us via email, phone, or other channels</li>
                </ul>
                <p className="mt-2">It does not apply to third-party websites or services linked from our Website.</p>
              </section>

              <section className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">3. Information We Collect</h2>
                
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 mt-4">3.1 Personal Information</h3>
                <p className="mb-2">We may collect personal information that you voluntarily provide, including but not limited to:</p>
                <ul className="space-y-2 list-disc pl-6">
                  <li>Full name</li>
                  <li>Email address</li>
                  <li>Phone number</li>
                  <li>Billing and shipping addresses</li>
                  <li>Account login details (if applicable)</li>
                  <li>Order and transaction history</li>
                </ul>

                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 mt-4">3.2 Payment Information</h3>
                <p className="leading-relaxed">
                  Payment transactions are processed securely by third-party payment gateways. We do not store or have access to your full credit or debit card details.
                </p>

                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 mt-4">3.3 Technical and Usage Information</h3>
                <p className="mb-2">When you visit our Website, we may automatically collect:</p>
                <ul className="space-y-2 list-disc pl-6">
                  <li>IP address</li>
                  <li>Browser type and version</li>
                  <li>Device information</li>
                  <li>Pages visited and time spent on the Website</li>
                  <li>Referring URLs</li>
                </ul>
              </section>

              <section className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">4. Cookies and Tracking Technologies</h2>
                <p className="mb-2">We use cookies and similar technologies to:</p>
                <ul className="space-y-2 list-disc pl-6">
                  <li>Improve Website functionality and performance</li>
                  <li>Remember user preferences</li>
                  <li>Analyze Website traffic and usage trends</li>
                </ul>
                <p className="mt-2 leading-relaxed">
                  You can manage or disable cookies through your browser settings. Please note that disabling cookies may affect certain Website features.
                </p>
              </section>

              <section className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">5. How We Use Your Information</h2>
                <p className="mb-2">We use your personal information for the following purposes:</p>
                <ul className="space-y-2 list-disc pl-6">
                  <li>To process and fulfill orders</li>
                  <li>To arrange shipping and delivery</li>
                  <li>To communicate order confirmations, updates, and customer support responses</li>
                  <li>To improve our products, services, and Website functionality</li>
                  <li>To prevent fraud and unauthorized transactions</li>
                  <li>To comply with legal and regulatory obligations</li>
                </ul>
              </section>

              <section className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">6. Legal Basis for Processing</h2>
                <p className="mb-2">We process personal data based on one or more of the following legal grounds:</p>
                <ul className="space-y-2 list-disc pl-6">
                  <li>Performance of a contract (order fulfillment)</li>
                  <li>Compliance with legal obligations under UAE law</li>
                  <li>Legitimate business interests</li>
                  <li>Your consent, where required</li>
                </ul>
              </section>

              <section className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">7. Data Sharing and Disclosure</h2>
                <p className="mb-2">We may share your information with trusted third parties, including:</p>
                <ul className="space-y-2 list-disc pl-6">
                  <li>Payment processors and banks</li>
                  <li>Shipping and courier service providers</li>
                  <li>IT service providers and hosting partners</li>
                  <li>Government authorities or regulators when required by law</li>
                </ul>
                <p className="mt-2 leading-relaxed">
                  We do not sell, rent, or trade your personal data to third parties for marketing purposes.
                </p>
              </section>

              <section className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">8. International Data Transfers</h2>
                <p className="leading-relaxed">
                  As we offer international shipping, your personal data may be transferred to and processed in countries outside the United Arab Emirates. We take reasonable steps to ensure such transfers comply with applicable data protection laws and include appropriate safeguards.
                </p>
              </section>

              <section className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">9. Data Retention</h2>
                <p className="mb-2">We retain personal information only for as long as necessary to:</p>
                <ul className="space-y-2 list-disc pl-6">
                  <li>Fulfill the purposes outlined in this Privacy Policy</li>
                  <li>Comply with legal, accounting, and regulatory requirements</li>
                  <li>Resolve disputes and enforce agreements</li>
                </ul>
                <p className="mt-2 leading-relaxed">
                  Once data is no longer required, it is securely deleted or anonymized.
                </p>
              </section>

              <section className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">10. Data Security</h2>
                <p className="leading-relaxed">
                  We implement appropriate technical and organizational security measures to protect your personal data against unauthorized access, loss, misuse, alteration, or disclosure. However, no online transmission or storage system is completely secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">11. Your Rights</h2>
                <p className="mb-2">Depending on applicable laws, you may have the right to:</p>
                <ul className="space-y-2 list-disc pl-6">
                  <li>Request access to your personal data</li>
                  <li>Request correction of inaccurate or incomplete data</li>
                  <li>Request deletion of your personal data, subject to legal obligations</li>
                  <li>Object to or restrict certain processing activities</li>
                </ul>
                <p className="mt-2 leading-relaxed">
                  To exercise your rights, please contact us using the details provided below.
                </p>
              </section>

              <section className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">12. Marketing Communications</h2>
                <p className="leading-relaxed">
                  We may send promotional or informational emails only where permitted by law. You may opt out of marketing communications at any time by following the unsubscribe instructions in our emails or contacting us directly.
                </p>
              </section>

              <section className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">13. Third-Party Links</h2>
                <p className="leading-relaxed">
                  Our Website may contain links to third-party websites. We are not responsible for the privacy practices, policies, or content of such websites. We encourage you to review their privacy policies before providing any personal information.
                </p>
              </section>

              <section className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">14. Children's Privacy</h2>
                <p className="leading-relaxed">
                  Our Website and services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children.
                </p>
              </section>

              <section className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">15. Changes to This Privacy Policy</h2>
                <p className="leading-relaxed">
                  We reserve the right to update or modify this Privacy Policy at any time. Any changes will be posted on this page with an updated revision date. Continued use of the Website constitutes acceptance of the revised policy.
                </p>
              </section>

              <section className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">16. Contact Us</h2>
                <p className="mb-4">If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6 space-y-2">
                  <p className="font-semibold text-lg">Hamtos Computers</p>
                  <p>📍 Nahdha St - Al Souq Al Kabeer - Al Fahidi - Dubai, UAE</p>
                  <p>📧 <a href="mailto:info@hamtos.com" className="text-blue-600 hover:underline">info@hamtos.com</a></p>
                  <p>📞 <a href="tel:+97142528481" className="text-blue-600 hover:underline">+97142528481</a></p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;

