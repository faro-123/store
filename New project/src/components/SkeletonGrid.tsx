import { motion } from 'framer-motion';

export default function SkeletonGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <motion.div
          key={index}
          animate={{ opacity: [0.45, 0.9, 0.45] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.08 }}
          className="h-[360px] rounded-[26px] bg-white/60 shadow-sm"
        />
      ))}
    </div>
  );
}
