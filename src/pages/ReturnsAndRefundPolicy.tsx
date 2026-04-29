import { Helmet } from 'react-helmet-async';

const ReturnsAndRefundPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Returns and Refund Policy - Hamtos Computers</title>
        <meta name="description" content="Returns and Refund Policy for Hamtos Computers - Learn about our return, exchange, and refund procedures." />
      </Helmet>
      <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16 max-w-8xl">
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 md:p-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">Returns and Refund Policy</h1>
            <p className="text-sm sm:text-base text-gray-600 mb-8">Last Updated: May 2, 2025</p>

            <div className="prose prose-sm sm:prose-base max-w-none text-gray-700 space-y-6">
              <p className="leading-relaxed">
                At Hamtos Computers, customer satisfaction is important to us. This Returns and Refund Policy explains the conditions under which products purchased from <a href="https://hamtos.com/" className="text-blue-600 hover:underline">https://hamtos.com/</a> may be returned, exchanged, or refunded. By placing an order on our Website, you agree to the terms outlined in this policy.
              </p>

              <section className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">1. Scope of This Policy</h2>
                <p className="mb-2">This policy applies to:</p>
                <ul className="space-y-2 list-disc pl-6">
                  <li>Products purchased directly from Hamtos Computers through our Website</li>
                  <li>Orders delivered within the United Arab Emirates and internationally</li>
                </ul>
                <p className="mt-2">This policy does not apply to purchases made through third-party marketplaces or resellers.</p>
              </section>

              <section className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">2. Eligibility for Returns</h2>
                <p className="mb-2">To be eligible for a return:</p>
                <ul className="space-y-2 list-disc pl-6">
                  <li>The return request must be made within 7 calendar days from the date of delivery</li>
                  <li>The product must be unused, unopened, and in its original condition</li>
                  <li>The product must be returned in its original packaging, including accessories, manuals, and any free items</li>
                  <li>Proof of purchase (invoice or order number) must be provided</li>
                </ul>
                <p className="mt-2 leading-relaxed">
                  We reserve the right to reject returns that do not meet these conditions.
                </p>
              </section>

              <section className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">3. Non-Returnable and Non-Refundable Items</h2>
                <p className="mb-2">The following items are not eligible for return or refund unless defective:</p>
                <ul className="space-y-2 list-disc pl-6">
                  <li>Software, licenses, activation keys, and downloadable products</li>
                  <li>Opened or used accessories</li>
                  <li>Clearance or discounted items marked as "Final Sale"</li>
                  <li>Products damaged due to misuse, negligence, or improper handling</li>
                </ul>
              </section>

              <section className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">4. Damaged, Defective, or Incorrect Products</h2>
                <p className="mb-2">If you receive a product that is damaged, defective, or incorrect:</p>
                <ul className="space-y-2 list-disc pl-6">
                  <li>Notify us within 48 hours of delivery</li>
                  <li>Provide clear photos or videos showing the issue</li>
                  <li>Keep the original packaging for inspection</li>
                </ul>
                <p className="mt-2 leading-relaxed">
                  Once verified, we will arrange for a replacement, repair, or refund at our discretion.
                </p>
              </section>

              <section className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">5. Order Cancellation</h2>
                <ul className="space-y-2">
                  <li>Orders may be canceled only before shipment.</li>
                  <li>Once an order has been shipped, it cannot be canceled and must follow the return process instead.</li>
                  <li>Custom or special-order items cannot be canceled once processing has begun.</li>
                </ul>
              </section>

              <section className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">6. Return Process</h2>
                <p className="mb-2">To initiate a return:</p>
                <ol className="space-y-2 list-decimal pl-6">
                  <li>Contact our customer support team at <a href="mailto:info@hamtos.com" className="text-blue-600 hover:underline">info@hamtos.com</a> or <a href="tel:+97142528481" className="text-blue-600 hover:underline">+97142528481</a></li>
                  <li>Provide your order number and reason for return</li>
                  <li>Await return approval and instructions</li>
                  <li>Ship the product back to the address provided</li>
                </ol>
                <p className="mt-2 leading-relaxed">
                  Unauthorized returns may not be accepted.
                </p>
              </section>

              <section className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">7. Return Shipping Costs</h2>
                <ul className="space-y-2">
                  <li>Customers are responsible for return shipping costs unless the return is due to our error (wrong, damaged, or defective item)</li>
                  <li>Shipping charges are non-refundable</li>
                  <li>We recommend using a trackable shipping service</li>
                </ul>
              </section>

              <section className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">8. Inspection and Approval</h2>
                <ul className="space-y-2">
                  <li>Returned products are inspected upon receipt</li>
                  <li>Approval or rejection of the return will be communicated within a reasonable timeframe</li>
                  <li>Products showing signs of use or damage may be rejected or subject to partial refund</li>
                </ul>
              </section>

              <section className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">9. Refunds</h2>
                <ul className="space-y-2">
                  <li>Approved refunds will be issued to the original payment method</li>
                  <li>Refund processing may take 7–14 business days, depending on the payment provider</li>
                  <li>Any bank or payment gateway fees may be deducted where applicable</li>
                </ul>
              </section>

              <section className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">10. Exchanges</h2>
                <ul className="space-y-2">
                  <li>Exchanges are subject to product availability</li>
                  <li>If the replacement product has a different price, the difference must be paid or refunded accordingly</li>
                </ul>
              </section>

              <section className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">11. International Returns</h2>
                <ul className="space-y-2">
                  <li>International customers are responsible for all return shipping costs, customs duties, and taxes</li>
                  <li>We are not responsible for items lost or delayed during international return transit</li>
                </ul>
              </section>

              <section className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">12. Refused or Undeliverable Shipments</h2>
                <p className="leading-relaxed">
                  Orders refused by the customer or returned due to incorrect address information may be subject to additional fees. Original shipping and return shipping costs will be deducted from any applicable refund.
                </p>
              </section>

              <section className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">13. Limitation of Liability</h2>
                <p className="leading-relaxed">
                  Hamtos Computers shall not be liable for any indirect or consequential losses arising from returned or refunded products beyond the purchase price.
                </p>
              </section>

              <section className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">14. Policy Updates</h2>
                <p className="leading-relaxed">
                  We reserve the right to modify or update this Returns and Refund Policy at any time. Changes will be effective once posted on the Website.
                </p>
              </section>

              <section className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">15. Contact Information</h2>
                <p className="mb-4">For return or refund inquiries, please contact:</p>
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

export default ReturnsAndRefundPolicy;

