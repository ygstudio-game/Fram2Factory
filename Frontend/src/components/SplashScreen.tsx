import React from 'react';
import { motion } from 'motion/react';

export function SplashScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 via-blue-500 to-green-600 relative overflow-hidden">
      {/* Floating Orbs */}
      <motion.div
        className="absolute top-20 left-20 w-20 h-20 bg-white/20 rounded-full blur-xl"
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-32 right-16 w-16 h-16 bg-white/15 rounded-full blur-lg"
        animate={{
          y: [0, 15, 0],
          x: [0, -15, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-12 h-12 bg-white/10 rounded-full blur-lg"
        animate={{
          y: [0, -10, 0],
          x: [0, 5, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      {/* Logo and Text */}
      <motion.div
        className="text-center z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.div
          className="w-24 h-24 mx-auto mb-6 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center"
          animate={{
            rotateY: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-green-600">
              <path d="M3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7M3 7L12 2L21 7M3 7V8M21 7V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 15L12 12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </motion.div>
        
        <motion.h1
          className="text-4xl mb-2 text-white drop-shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Farm2Factory
        </motion.h1>
        
        <motion.p
          className="text-white/90 text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          Connecting Agriculture to Industry
        </motion.p>

        <motion.div
          className="mt-8 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <div className="w-8 h-8 border-2 border-white/50 border-t-white rounded-full animate-spin" />
        </motion.div>
      </motion.div>
    </div>
  );
}