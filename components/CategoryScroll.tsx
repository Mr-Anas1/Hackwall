'use client';

import { Category } from '@/types';

interface CategoryScrollProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export default function CategoryScroll({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryScrollProps) {
  const getCategoryLabel = (category: Category) => {
    if (category === 'character') return 'characters';
    if (category === 'quote') return 'quotes';
    return category;
  };

  return (
    <div className="sticky top-[120px] z-40 bg-cyber-black border-b border-cyber-border py-3 px-4 overflow-x-auto scrollbar-hide">
      <div className="flex gap-3 min-w-max">
        <button
          onClick={() => onSelectCategory(null)}
          className={`px-4 py-2 rounded font-mono text-sm whitespace-nowrap transition-all ${
            selectedCategory === null
              ? 'bg-neon-green text-black shadow-neon'
              : 'bg-cyber-gray text-neon-green/70 border border-neon-green/30 hover:border-neon-green hover:text-neon-green'
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`px-4 py-2 rounded font-mono text-sm whitespace-nowrap transition-all ${
              selectedCategory === category
                ? 'bg-neon-green text-black shadow-neon'
                : 'bg-cyber-gray text-neon-green/70 border border-neon-green/30 hover:border-neon-green hover:text-neon-green'
            }`}
          >
            {getCategoryLabel(category)}
          </button>
        ))}
      </div>
    </div>
  );
}
