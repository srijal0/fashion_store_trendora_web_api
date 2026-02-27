"use client";
import { useState } from "react";

// ============================================
// 🎨 CUSTOMIZATION SETTINGS - TRENDORA
// ============================================

const SETTINGS = {
  // Company Information
  company: {
    name: "Trendora",
    tagline: "Fashion at Your Fingertips",
  },

  // Contact Details
  contact: {
    address: {
      street: "456 Fashion Avenue",
      city: "Style City",
      state: "SC",
      zip: "67890",
      country: "United States"
    },
    phone: {
      main: "+1 (555) 987-6543",
      whatsapp: "+1 (555) 321-0987"
    },
    email: {
      info: "info@trendora.com",
      support: "support@trendora.com"
    },
    hours: {
      weekday: "10:00 AM - 8:00 PM",
      saturday: "11:00 AM - 7:00 PM",
      sunday: "11:00 AM - 6:00 PM"
    }
  },

  // Social Media Links
  social: {
    facebook: "https://facebook.com/trendora",
    instagram: "https://instagram.com/trendora",
    twitter: "https://twitter.com/trendora",
    pinterest: "https://pinterest.com/trendora"
  },

  // Colors (Fashion Theme - Soft Pastel)
  colors: {
    primary: "pink-400",        // Main brand pink
    primaryHover: "pink-500",   // Hover pink
    secondary: "violet-200",    // Soft violet accent
    accent: "pink-50",          // Very light pink background
    text: "gray-900",           // Dark text for fashion elegance
    lightBg: "pink-50",         // Light background
  }
};

// ============================================
// 📋 TRENDORA CONTACT PAGE COMPONENT
// ============================================

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log("Form submitted:", formData);
    setSubmitted(true);
    setLoading(false);
    
    // Reset form after 4 seconds
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Contact Form */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-6 md:p-8">
            <h2 className={`text-2xl md:text-3xl font-bold text-${SETTINGS.colors.text} mb-3`}>
              Contact Trendora
            </h2>
            <p className="text-gray-600 mb-8">
              Have a fashion question or custom request? We'll get back to you within 24 hours.
            </p>

            {submitted && (
              <div className="bg-green-50 border-l-4 border-green-400 text-green-800 px-5 py-4 rounded-lg mb-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold">Message sent successfully!</p>
                    <p className="text-sm">We'll respond to you shortly.</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className={`block text-sm font-semibold text-${SETTINGS.colors.text} mb-2`}>
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-${SETTINGS.colors.primary} focus:outline-none transition bg-white`}
                    placeholder="Jane Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className={`block text-sm font-semibold text-${SETTINGS.colors.text} mb-2`}>
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-${SETTINGS.colors.primary} focus:outline-none transition bg-white`}
                    placeholder="jane@example.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className={`block text-sm font-semibold text-${SETTINGS.colors.text} mb-2`}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-${SETTINGS.colors.primary} focus:outline-none transition bg-white`}
                    placeholder="+1 (555) 987-6543"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className={`block text-sm font-semibold text-${SETTINGS.colors.text} mb-2`}>
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-${SETTINGS.colors.primary} focus:outline-none transition bg-white`}
                  >
                    <option value="">Select a topic</option>
                    <option value="general">General Inquiry</option>
                    <option value="order">Order Question</option>
                    <option value="custom">Custom Outfit</option>
                    <option value="event">Fashion Event</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className={`block text-sm font-semibold text-${SETTINGS.colors.text} mb-2`}>
                  Your Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-${SETTINGS.colors.primary} focus:outline-none transition resize-none bg-white`}
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-${SETTINGS.colors.primary} hover:bg-${SETTINGS.colors.primaryHover} text-white font-semibold py-4 px-6 rounded-xl transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Contact Info Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Quick Contact */}
          <div className={`bg-gradient-to-br from-${SETTINGS.colors.primary} to-${SETTINGS.colors.secondary} rounded-2xl p-6 text-white shadow-md`}>
            <h3 className="text-2xl font-bold mb-4">Quick Contact</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm opacity-90">Main Line</p>
                  <p className="font-semibold">{SETTINGS.contact.phone.main}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm opacity-90">Email Us</p>
                  <p className="font-semibold">{SETTINGS.contact.email.info}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visit Us */}
          <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className={`bg-${SETTINGS.colors.accent} p-3 rounded-lg`}>
                <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className={`font-bold text-${SETTINGS.colors.text} text-lg mb-2`}>Visit Our Store</h3>
                <p className="text-gray-600">{SETTINGS.contact.address.street}</p>
                <p className="text-gray-600">
                  {SETTINGS.contact.address.city}, {SETTINGS.contact.address.state} {SETTINGS.contact.address.zip}
                </p>
                <p className="text-gray-600">{SETTINGS.contact.address.country}</p>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className={`bg-${SETTINGS.colors.accent} p-3 rounded-lg`}>
                <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className={`font-bold text-${SETTINGS.colors.text} text-lg mb-3`}>Business Hours</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className={`font-semibold text-${SETTINGS.colors.text}`}>
                      {SETTINGS.contact.hours.weekday}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday</span>
                    <span className={`font-semibold text-${SETTINGS.colors.text}`}>
                      {SETTINGS.contact.hours.saturday}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday</span>
                    <span className={`font-semibold text-${SETTINGS.colors.text}`}>
                      {SETTINGS.contact.hours.sunday}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-6">
            <h3 className={`font-bold text-${SETTINGS.colors.text} text-lg mb-4`}>Follow Trendora</h3>
            <div className="grid grid-cols-4 gap-3">
              {Object.entries(SETTINGS.social).map(([key, url]) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`bg-${SETTINGS.colors.accent} hover:bg-${SETTINGS.colors.primary} p-3 rounded-xl transition flex items-center justify-center group`}
                  title={key.charAt(0).toUpperCase() + key.slice(1)}
                >
                  <svg className="w-6 h-6 text-pink-500 group-hover:text-white transition" fill="currentColor" viewBox="0 0 24 24">
                    {/* Replace with appropriate icon if needed */}
                    <circle cx="12" cy="12" r="10"/>
                  </svg>
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
