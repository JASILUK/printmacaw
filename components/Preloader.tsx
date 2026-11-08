'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, animate, Variants } from 'framer-motion';

const BRAND = 'PRINT MACAW';
const TAGLINE = 'We print what you want!';

export default function Preloader() {
  const [isVisible, setIsVisible] = useState(true);
  const [phase, setPhase] = useState<'loading' | 'dots' | 'exit'>('loading');
  const count = useMotionValue(0);
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    // 1. Animate the counter from 0 to 100
    const controls = animate(count, 100, {
      duration: 2.2,
      ease: [0.22, 1, 0.36, 1], // Premium easing
      onUpdate: (latest) => setDisplayCount(Math.round(latest)),
      onComplete: () => {
        // 2. When counter hits 100, switch to the 3 dots animation
        setTimeout(() => setPhase('dots'), 200);
        
        // 3. After dots finish animating, trigger the exit curtain
        setTimeout(() => {
          setPhase('exit');
          document.documentElement.classList.remove('pm-intro');
          document.documentElement.classList.add('pm-reveal');
        }, 1800); 
        
        // 4. Completely remove the preloader from DOM
        setTimeout(() => setIsVisible(false), 2800);
      },
    });

    return () => controls.stop();
  }, [count]);

  const brandLetters = BRAND.split('').map((char, i) => (
    <motion.span
      key={i}
      initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ delay: 1.2 + i * 0.04, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="inline-block"
    >
      {char === ' ' ? '\u00A0' : char}
    </motion.span>
  ));

  // 3 Dots animation variants
  // FIXED: Added Variants type and changed ease to a cubic-bezier array
  const dotVariants: Variants = {
    initial: { scale: 0, opacity: 0 },
    animate: (i: number) => ({
      scale: [0, 1.2, 1],
      opacity: 1,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1], // Used array instead of string to fix TS error
      },
    }),
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="preloader"
          className="pm-preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          animate={phase === 'exit' ? { clipPath: 'inset(0 0 100% 0)' } : {}}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'grid', placeItems: 'center' }}
        >
          <div className="pm-preloader__bg" aria-hidden="true" />

          <div className="pm-preloader__content">
            
            <div className="pm-preloader__logo-wrap">
              <motion.div
                className="pm-preloader__logo-mask"
                initial={{ clipPath: 'inset(0 100% 0 0)' }}
                animate={{ clipPath: 'inset(0 0 0 0)' }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              >
                <Image
                  src="/images/printmacaw-logo.png"
                  alt="Print Macaw"
                  width={320}
                  height={110}
                  priority
                  className="pm-preloader__logo-img"
                />
              </motion.div>
              
              <motion.div
                className="pm-preloader__draw-line"
                initial={{ left: '0%', opacity: 1 }}
                animate={{ left: '100%', opacity: 0 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              />
            </div>

            <div className="pm-preloader__brand">
              {brandLetters}
            </div>

            <motion.p
              className="pm-preloader__tagline"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.0, duration: 0.6 }}
            >
              {TAGLINE}
            </motion.p>

            <div className="pm-preloader__bottom">
              <AnimatePresence mode="wait">
                {phase === 'loading' && (
                  <motion.div
                    key="counter"
                    className="pm-preloader__counter-wrap"
                    exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="pm-preloader__count">{displayCount.toString().padStart(3, '0')}%</span>
                    <div className="pm-preloader__track">
                      <motion.div
                        className="pm-preloader__bar"
                        style={{ scaleX: count.get() / 100 }}
                      />
                    </div>
                  </motion.div>
                )}

                {phase === 'dots' && (
                  <motion.div
                    key="dots"
                    className="pm-preloader__dots"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="pm-preloader__dot"
                        custom={i}
                        variants={dotVariants}
                        initial="initial"
                        animate="animate"
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}