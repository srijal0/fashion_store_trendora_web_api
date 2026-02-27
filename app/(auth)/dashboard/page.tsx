"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { LogoutButton } from "../_components/LogoutButton";

/* ================= PRODUCT TYPE ================= */
interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  description: string;
  category: string;
  discount: number;
}

/* ================= PRODUCT DATA ================= */
const products: Product[] = [
  {
    id: 1,
    name: "American Boy T-Shirt",
    price: 1200,
    originalPrice: 1600,
    discount: 25,
    image: "/images/image1.png",
    description: "Comfortable cotton streetwear t-shirt.",
    category: "Trending",
  },
  {
    id: 2,
    name: "Classic Denim Jacket",
    price: 3500,
    originalPrice: 4200,
    discount: 16,
    image: "/images/image2.png",
    description: "Premium denim jacket for all seasons.",
    category: "Trending",
  },
  {
    id: 3,
    name: "Oversized Hoodie",
    price: 2200,
    originalPrice: 2200,
    discount: 0,
    image: "/images/image3.png",
    description: "Warm oversized hoodie with modern fit.",
    category: "Winter",
  },
  {
    id: 4,
    name: "Summer Dress",
    price: 2800,
    originalPrice: 3200,
    discount: 12,
    image: "/images/image4.png",
    description: "Lightweight dress perfect for summer.",
    category: "Women",
  },
  {
    id: 5,
    name: "Pant",
    price: 4500,
    originalPrice: 5000,
    discount: 10,
    image: "/images/image9.png",
    description: "Premium leather boots for winter.",
    category: "Winter",
  },
  {
    id: 6,
    name: "Floral Dress",
    price: 3200,
    originalPrice: 3200,
    discount: 0,
    image: "/images/image7.png",
    description: "Beautiful floral dress for any occasion.",
    category: "Women",
  },
  {
    id: 7,
    name: "Graphic Tee",
    price: 1500,
    originalPrice: 1800,
    discount: 17,
    image: "/images/image8.png",
    description: "Trendy graphic t-shirt.",
    category: "Trending",
  },
  {
    id: 8,
    name: "Winter Coat",
    price: 5500,
    originalPrice: 6500,
    discount: 15,
    image: "/images/image6.png",
    description: "Warm and stylish winter coat.",
    category: "Winter",
  },
];

/* ================= BANNER ================= */
const bannerSlides = [
  { id: 1, image: "/images/banner-1.jpg" },
  { id: 2, image: "/images/banner-2.jpg" },
];

export default function DashboardPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const categorizedProducts = useMemo(() => {
    const map: { [key: string]: Product[] } = {};
    products.forEach((p) => {
      if (!map[p.category]) map[p.category] = [];
      map[p.category].push(p);
    });
    return map;
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* ================= HERO BANNER ================= */}
      <div className="relative w-full h-[500px] overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {bannerSlides.map((slide) => (
            <div key={slide.id} className="min-w-full relative h-[500px]">
              <Image
                src={slide.image}
                alt="Banner"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="text-center text-white px-4">
                  <h1 className="text-5xl md:text-7xl font-bold mb-4">
                    Elevate Your Style
                  </h1>
                  <p className="text-xl md:text-2xl opacity-90 mb-8">
                    Discover premium fashion collections
                  </p>
                  <button className="bg-white text-black px-10 py-4 rounded-full text-lg font-semibold hover:bg-gray-200 transition">
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Slider Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
          {bannerSlides.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full cursor-pointer transition ${
                currentSlide === index ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ================= PRODUCTS ================= */}
      <div className="w-full px-6 md:px-12 lg:px-20 py-20">
        {Object.entries(categorizedProducts).map(([category, items]) => (
          <div key={category} className="mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-10">
              {category}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {items.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition duration-300 overflow-hidden group cursor-pointer"
                >
                  <div className="relative h-80 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition duration-500"
                    />
                    {product.discount > 0 && (
                      <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 text-sm font-bold rounded-full">
                        {product.discount}% OFF
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      {product.name}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4">
                      {product.description}
                    </p>

                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-black font-bold text-xl">
                        Rs {product.price}
                      </span>
                      {product.discount > 0 && (
                        <span className="line-through text-gray-400 text-sm">
                          Rs {product.originalPrice}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Trendora</h3>
              <p className="text-gray-400">
                Your destination for premium fashion and style.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition">New Arrivals</Link></li>
                <li><Link href="#" className="hover:text-white transition">Trending</Link></li>
                <li><Link href="#" className="hover:text-white transition">Sale</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-white transition">FAQs</Link></li>
                <li><Link href="#" className="hover:text-white transition">Shipping</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition">Facebook</a>
                <a href="#" className="text-gray-400 hover:text-white transition">Instagram</a>
                <a href="#" className="text-gray-400 hover:text-white transition">Twitter</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 Trendora. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* ================= MODAL ================= */}
      {selectedProduct && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full p-8 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute right-6 top-6 text-gray-500 hover:text-black text-2xl font-bold"
            >
              ✕
            </button>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative h-80 rounded-xl overflow-hidden">
                <Image
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {selectedProduct.name}
                </h2>
                <p className="text-gray-600 mb-6 text-lg">
                  {selectedProduct.description}
                </p>

                <div className="flex items-center gap-4 mb-6">
                  <span className="text-black font-bold text-3xl">
                    Rs {selectedProduct.price}
                  </span>
                  {selectedProduct.discount > 0 && (
                    <span className="line-through text-gray-400 text-xl">
                      Rs {selectedProduct.originalPrice}
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  <button className="w-full bg-black text-white py-4 rounded-lg hover:bg-gray-800 transition text-lg font-semibold">
                    Add to Cart
                  </button>
                  <button className="w-full border-2 border-black text-black py-4 rounded-lg hover:bg-gray-100 transition text-lg font-semibold">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}