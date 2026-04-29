import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { sendContactQuote } from "@/api/services/websiteService";
import { useToast } from "@/hooks/use-toast";
const QuoteRequest = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isFromAskForProduct = searchParams.get("source") === "ask-for-product";
  const productName = searchParams.get("productName") || "";
  
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    description: isFromAskForProduct && productName ? productName : "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Don't allow editing description if it's from ask for product
    if (isFromAskForProduct && e.target.name === "description") {
      return;
    }
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      // For ask for product, send product name in description field
      // For regular contact us, send description as is
      await sendContactQuote({
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        description: isFromAskForProduct && productName ? productName : form.description,
      });
      setSuccess(true);
      toast({
        title: "Quote request sent successfully!",
        description: "We will get back to you as soon as possible.",
      });
      setForm({ 
        first_name: "", 
        last_name: "", 
        email: "", 
        description: isFromAskForProduct && productName ? productName : "" 
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#1A74BB]">
          {isFromAskForProduct ? "Contact Us" : "Request a Quote"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">First Name</label>
            <input
              type="text"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              {isFromAskForProduct && productName ? "Product Name" : "Description"}
            </label>
            {isFromAskForProduct && productName ? (
              <input
                type="text"
                name="description"
                value={form.description}
                readOnly
                className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
              />
            ) : (
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
            )}
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">Quote request sent successfully!</div>}
          <button
            type="submit"
            className="w-full bg-[#1A74BB] text-white py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
            disabled={loading}
          >
            {loading ? "Sending..." : "Submit Request"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuoteRequest;
