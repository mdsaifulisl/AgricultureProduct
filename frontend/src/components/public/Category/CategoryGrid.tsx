import React from 'react';
import { CategoryCard, type CategoryItem } from './CategoryCard';

interface CategoryGridProps {
  categories: CategoryItem[];
  onCategoryClick: (slug: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories, onCategoryClick }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-6">
      {categories.map((category) => (
        <CategoryCard 
          key={category.id} 
          category={category} 
          onClick={onCategoryClick} 
        />
      ))}
    </div>
  );
};