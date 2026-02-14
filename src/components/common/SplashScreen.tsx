import { motion } from 'framer-motion';

export const SplashScreen = () => {
    return (
        <div className="fixed inset-0 bg-[#F5F5F0] flex flex-col items-center justify-center z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex flex-col items-center gap-4"
            >
                <div className="w-24 h-24 bg-surface rounded-3xl shadow-lg flex items-center justify-center relative overflow-hidden">
                    <motion.div
                        className="absolute inset-0 bg-primary/10"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <img
                        src="logo.png"
                        alt="Kul's Pouch"
                        className="w-16 h-16 object-contain relative z-10"
                    />
                </div>
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold text-text-primary tracking-tight"
                >
                    Kul's Pouch
                </motion.h1>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: 48 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="h-1 bg-primary rounded-full mt-2"
                />
            </motion.div>
        </div>
    );
};
