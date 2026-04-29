import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const TermsAndConditions = () => {
  return (
    <>
      <Helmet>
        <title>Terms and Conditions - Hamtos Computers</title>
        <meta name="description" content="Terms and Conditions for Hamtos Computers - Read our terms of service, policies, and user agreements." />
      </Helmet>
      <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16 max-w-8xl">
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 md:p-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">Terms and Conditions</h1>
            <p className="text-sm sm:text-base text-gray-600 mb-8">Last Updated: May 2, 2025</p>

            <div className="prose prose-sm sm:prose-base max-w-none text-gray-700 space-y-6">
              <p className="leading-relaxed">
                Welcome to Hamtos Computers. These Terms and Conditions ("Terms") govern your access to and use of our website <a href="https://hamtos.com/" className="text-blue-600 hover:underline">https://hamtos.com/</a>, including any content, functionality, products, and services offered through the website. By browsing, registering, or making a purchase from our website, you acknowledge that you have read, understood, and agreed to be bound by these Terms.
              </p>
              <p className="leading-relaxed font-medium">
                If you do not agree with any part of these Terms, you must not use our website or services.
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
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">2. Definitions</h2>
                <ul className="space-y-2">
                  <li><strong>"Website"</strong> refers to <a href="https://hamtos.com/" className="text-blue-600 hover:underline">https://hamtos.com/</a> and all its subpages.</li>
                  <li><strong>"Customer", "You", "Your"</strong> refers to any user accessing or purchasing from the website.</li>
                  <li><strong>"Products"</strong> refers to IT products, computer hardware, accessories, peripherals, software, and related technology items sold by Hamtos Computers.</li>
                  <li><strong>"Order"</strong> refers to a request made by the customer to purchase products through the website.</li>
                </ul>
              </section>

              <section className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">3. Eligibility and User Responsibility</h2>
                <ul className="space-y-2">
                  <li>You must be at least 18 years old or have permission from a legal guardian to use this website.</li>
                  <li>You confirm that all information provided during account creation or checkout is accurate, complete, and up to date.</li>
                  <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                  <li>We reserve the right to suspend or terminate accounts that provide false or misleading information.</li>
                </ul>
              </section>

              <section className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">4. Use of the Website</h2>
                <p className="mb-2">You agree to use the website only for lawful purposes. You must not:</p>
                <ul className="space-y-2 list-disc pl-6">
                  <li>Violate any applicable UAE or international laws</li>
                  <li>Engage in fraudulent transactions</li>
                  <li>Attempt to gain unauthorized access to systems or data</li>
                  <li>Introduce viruses, malware, or harmful code</li>
                  <li>Copy, reproduce, or exploit website content for commercial purposes without written permission</li>
                </ul>
              </section>

              <section className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">5. Product Information and Availability</h2>
                <ul className="space-y-2">
                  <li>All product descriptions, specifications, and prices are subject to change without notice.</li>
                  <li>While we strive for accuracy, errors related to pricing, specifications, or availability may occur.</li>
                  <li>We reserve the right to correct errors and cancel affected orders.</li>
                  <li>Product images are for illustration purposes only and may differ from actual products.</li>
                </ul>
              </section>

              <section className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">6. Pricing, Taxes, and Payment</h2>
                <ul className="space-y-2">
                  <li>All prices are displayed in AED (United Arab Emirates Dirham) unless otherwise stated.</li>
                  <li>Prices may include or exclude VAT depending on the product listing.</li>
                  <li>Payment must be completed in full before order processing begins.</li>
                  <li>We use secure third-party payment gateways and do not store your card details.</li>
                  <li>Hamtos Computers reserves the right to change prices or payment methods at any time.</li>
                </ul>
              </section>

              <section className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">7. Order Confirmation and Acceptance</h2>
                <ul className="space-y-2">
                  <li>After placing an order, you will receive an order acknowledgment email.</li>
                  <li>This acknowledgment does not constitute acceptance of the order.</li>
                  <li>An order is considered accepted only once it has been processed and dispatched.</li>
                  <li>We reserve the right to cancel or limit quantities for any order at our discretion.</li>
                </ul>
              </section>

              <section className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">8. Shipping and Delivery</h2>
                <ul className="space-y-2">
                  <li>We deliver within the United Arab Emirates and to selected international destinations.</li>
                  <li>Estimated delivery times are provided for reference only and are not guaranteed.</li>
                  <li>Delays caused by courier services, customs authorities, weather conditions, or unforeseen circumstances are beyond our control.</li>
                  <li>Risk of loss passes to the customer upon delivery.</li>
                </ul>
              </section>

              <section className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">9. International Orders</h2>
                <p className="mb-2">For orders shipped outside the UAE:</p>
                <ul className="space-y-2 list-disc pl-6">
                  <li>Customers are solely responsible for customs duties, import taxes, and clearance fees.</li>
                  <li>International shipments may be subject to inspection and delays by customs authorities.</li>
                  <li>We are not responsible for orders refused or delayed by customs.</li>
                </ul>
              </section>

              <section className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">10. Returns, Refunds, and Cancellations</h2>
                <ul className="space-y-2">
                  <li>Returns and refunds are governed by our <Link to="/returns-and-refund-policy" className="text-blue-600 hover:underline">Returns and Refund Policy</Link>, which forms an integral part of these Terms.</li>
                  <li>Orders once shipped cannot be canceled.</li>
                  <li>Refunds, if approved, will be issued to the original payment method.</li>
                </ul>
              </section>

              <section className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">11. Warranty and After-Sales Support</h2>
                <ul className="space-y-2">
                  <li>Products may include manufacturer warranties where applicable.</li>
                  <li>Warranty coverage varies by brand and product.</li>
                  <li>Hamtos Computers does not provide additional warranties beyond those offered by manufacturers unless explicitly stated.</li>
                </ul>
              </section>

              <section className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">12. Intellectual Property Rights</h2>
                <p className="leading-relaxed">
                  All content on this website, including but not limited to text, graphics, logos, images, videos, software, and design, is the exclusive property of Hamtos Computers and is protected by UAE and international intellectual property laws. Unauthorized use, reproduction, or distribution is strictly prohibited.
                </p>
              </section>

              <section className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">13. Limitation of Liability</h2>
                <p className="mb-2">To the maximum extent permitted by applicable law:</p>
                <ul className="space-y-2 list-disc pl-6">
                  <li>Hamtos Computers shall not be liable for indirect, incidental, special, or consequential damages.</li>
                  <li>Our total liability shall not exceed the total amount paid for the product giving rise to the claim.</li>
                </ul>
              </section>

              <section className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">14. Indemnification</h2>
                <p className="leading-relaxed">
                  You agree to indemnify and hold harmless Hamtos Computers, its owners, employees, and affiliates from any claims, damages, liabilities, or expenses arising from your misuse of the website or violation of these Terms.
                </p>
              </section>

              <section className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">15. Force Majeure</h2>
                <p className="leading-relaxed">
                  Hamtos Computers shall not be held liable for failure or delay in performance due to events beyond reasonable control, including but not limited to natural disasters, pandemics, government actions, strikes, or technical failures.
                </p>
              </section>

              <section className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">16. Governing Law and Jurisdiction</h2>
                <p className="leading-relaxed">
                  These Terms shall be governed by and construed in accordance with the laws of the United Arab Emirates. Any disputes shall be subject to the exclusive jurisdiction of the competent courts of the UAE.
                </p>
              </section>

              <section className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">17. Changes to Terms and Conditions</h2>
                <p className="leading-relaxed">
                  We reserve the right to modify or update these Terms at any time. Continued use of the website after changes are posted constitutes acceptance of the revised Terms.
                </p>
              </section>

              <section className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">18. Contact Information</h2>
                <p className="mb-4">For any questions regarding these Terms and Conditions, please contact us:</p>
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

export default TermsAndConditions;

