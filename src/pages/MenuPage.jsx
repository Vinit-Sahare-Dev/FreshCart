import React from 'react';
import Veg from '../components/Veg';
import NonVeg from '../components/NonVeg';
import Dairy from '../components/Dairy';

function MenuPage() {
  return (
    <div className="space-y-8">
      <Veg />
      <NonVeg />
      <Dairy />
    </div>
  );
}

export default MenuPage;
