import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { ArrowRight, Users, Package, Brain } from 'lucide-react';

interface OnboardingCarouselProps {
  onComplete: () => void;
}

const slides = [
  {
    icon: Users,
    title: "Connect with Factories",
    description: "Bridge the gap between farmers and manufacturers with our trusted marketplace platform.",
    color: "from-green-400 to-green-600"
  },
  {
    icon: Package,
    title: "Manage Crops & Orders",
    description: "Streamline your agricultural supply chain with integrated order and inventory management.",
    color: "from-blue-400 to-blue-600"
  },
  {
    icon: Brain,
    title: "AI-Powered Smart Matching",
    description: "Let our intelligent system find the perfect matches based on your requirements and preferences.",
    color: "from-purple-400 to-purple-600"
  }
];

export function OnboardingCarousel({ onComplete }: OnboardingCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const skipToEnd = () => {
    onComplete();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-blue-50 to-white">
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <div className="flex space-x-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-green-500 w-6' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        <Button variant="ghost" onClick={skipToEnd} className="text-gray-500">
          Skip
        </Button>
      </div>

      {/* Slides */}
      <div className="flex-1 flex items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center max-w-sm"
          >
            <motion.div
              className={`w-32 h-32 mx-auto mb-8 rounded-3xl bg-gradient-to-br ${slides[currentSlide].color} flex items-center justify-center shadow-2xl`}
              initial={{ scale: 0.8, rotateY: -90 }}
              animate={{ scale: 1, rotateY: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {React.createElement(slides[currentSlide].icon, { className: "w-16 h-16 text-white" })}
            </motion.div>

            <motion.h2
              className="text-3xl mb-4 text-gray-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {slides[currentSlide].title}
            </motion.h2>

            <motion.p
              className="text-gray-600 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {slides[currentSlide].description}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Button
            onClick={nextSlide}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-xl py-4 flex items-center justify-center gap-2 shadow-lg"
          >
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}