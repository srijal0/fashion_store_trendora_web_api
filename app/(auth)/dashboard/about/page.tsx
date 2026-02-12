"use client";
import Image from "next/image";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[400px] bg-gradient-to-r from-pink-100 to-rose-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-6xl font-bold text-gray-800 mb-4">About Trendora</h1>
            <p className="text-xl text-gray-600">
              Redefining Online Fashion Shopping
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* Our Story Section */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">Our Story</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                Trendora was created with a vision to make fashion accessible,
                convenient, and enjoyable for everyone. Our platform brings together
                modern technology and the latest fashion trends to provide users with
                a seamless online shopping experience.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                What started as an academic project has evolved into a complete
                e-commerce solution where users can explore stylish collections,
                discover personalized recommendations, and shop securely from
                anywhere.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                At Trendora, we believe fashion is more than clothing — it's a way
                to express individuality. Our goal is to connect people with styles
                that match their personality while ensuring a smooth digital
                shopping journey.
              </p>
            </div>

            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-200 to-rose-200 flex items-center justify-center">
                <span className="text-6xl">👗</span>
              </div>
            </div>
          </div>
        </div>

        {/* Our Values Section */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-pink-50 hover:shadow-lg transition">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Innovation</h3>
              <p className="text-gray-600">
                We integrate modern technologies to create a smart and seamless
                fashion shopping experience.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-rose-50 hover:shadow-lg transition">
              <div className="text-5xl mb-4">🛍️</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Customer Focus</h3>
              <p className="text-gray-600">
                Our platform is designed to provide convenience, security, and
                satisfaction for every user.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-pink-50 hover:shadow-lg transition">
              <div className="text-5xl mb-4">🌍</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Accessibility</h3>
              <p className="text-gray-600">
                We aim to make fashion available to everyone through an easy-to-use
                digital platform.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">Why Choose Trendora</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-6 bg-white rounded-xl border-2 border-pink-100">
              <div className="text-3xl">🛒</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Easy Online Shopping</h3>
                <p className="text-gray-600">
                  Browse, select, and purchase fashion items with a smooth and
                  user-friendly interface.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white rounded-xl border-2 border-pink-100">
              <div className="text-3xl">🔐</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Secure Payments</h3>
                <p className="text-gray-600">
                  Integrated payment gateway ensures safe and reliable transactions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white rounded-xl border-2 border-pink-100">
              <div className="text-3xl">🎯</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Personalized Experience</h3>
                <p className="text-gray-600">
                  Smart recommendations help users discover styles tailored to them.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white rounded-xl border-2 border-pink-100">
              <div className="text-3xl">⚡</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Fast & Responsive</h3>
                <p className="text-gray-600">
                  Built using modern technologies for speed, reliability, and
                  scalability.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-12 text-white mb-16">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">Modern</div>
              <div className="text-xl">UI/UX Design</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">Secure</div>
              <div className="text-xl">Payment System</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">Smart</div>
              <div className="text-xl">Recommendations</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">24/7</div>
              <div className="text-xl">Accessibility</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Discover Your Style with Trendora
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Explore the latest trends, find your perfect outfit, and enjoy a
            seamless fashion shopping experience — all in one place.
          </p>
        </div>

      </div>
    </div>
  );
}
