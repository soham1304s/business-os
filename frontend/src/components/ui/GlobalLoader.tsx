import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function GlobalLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let activeRequests = 0;
    let progressInterval: ReturnType<typeof setInterval>;

    const startLoading = () => {
      if (activeRequests === 0) {
        setIsLoading(true);
        setProgress(0);
        
        // Simulate progress moving up to 90%
        progressInterval = setInterval(() => {
          setProgress((prev) => {
            const increment = (90 - prev) * 0.1;
            return prev + increment;
          });
        }, 100);
      }
      activeRequests++;
    };

    const stopLoading = () => {
      activeRequests--;
      if (activeRequests <= 0) {
        activeRequests = 0;
        setProgress(100);
        
        setTimeout(() => {
          clearInterval(progressInterval);
          setIsLoading(false);
          setTimeout(() => setProgress(0), 200); // reset after fade out
        }, 400); // Wait for the 100% animation to finish
      }
    };

    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      startLoading();
      try {
        const response = await originalFetch(...args);
        return response;
      } catch (error) {
        throw error;
      } finally {
        stopLoading();
      }
    };

    return () => {
      window.fetch = originalFetch;
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[10000] pointer-events-none"
        >
          <motion.div
            className="h-1 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)]"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut', duration: 0.1 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
