// src/utils/populateDefaultCategories.ts

import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '@/components/firebase';

const defaultCategories = {
  countries: [
    'United Arab Emirates',
    'Saudi Arabia',
    'Qatar',
    'Kuwait',
    'Bahrain',
    'Oman',
    'Egypt',
    'Jordan',
    'Lebanon',
    'India',
    'Pakistan',
    'Bangladesh'
  ],
  emirates: [
    'Dubai',
    'Abu Dhabi',
    'Sharjah',
    'Ajman',
    'Fujairah',
    'Ras Al Khaimah',
    'Umm Al Quwain'
  ],
  yearsOfOperation: [
    '0-1 Years',
    '1-3 Years',
    '3-5 Years',
    '5-10 Years',
    '10-20 Years',
    '20+ Years'
  ],
  businessTypes: [
    'Manufacturer',
    'Distributor',
    'Reseller',
    'Service Provider',
    'Consultant',
    'Trading Company',
    'Technology Solutions',
    'Construction & Engineering',
    'Healthcare Services',
    'Educational Services',
    'Financial Services',
    'Other'
  ]
};

export const populateDefaultCategories = async () => {
  console.log('Starting to populate default categories...');

  for (const [categoryName, items] of Object.entries(defaultCategories)) {
    console.log(`\nProcessing category: ${categoryName}`);
    
    try {
      // Check if category already has items
      const itemsCollectionRef = collection(db, 'categories', categoryName, 'items');
      const existingSnapshot = await getDocs(itemsCollectionRef);
      
      if (existingSnapshot.empty) {
        console.log(`  - Category ${categoryName} is empty, adding default items...`);
        
        // Add default items
        for (const item of items) {
          await addDoc(itemsCollectionRef, {
            name: item,
            createdAt: new Date().toISOString(),
            createdBy: 'system'
          });
          console.log(`    ✓ Added: ${item}`);
        }
        
        console.log(`  ✅ Successfully populated ${categoryName} with ${items.length} items`);
      } else {
        console.log(`  ℹ️  Category ${categoryName} already has ${existingSnapshot.size} items, skipping...`);
      }
    } catch (error) {
      console.error(`  ❌ Error populating ${categoryName}:`, error);
    }
  }
  
  console.log('\n✅ Default categories population completed!');
};

// Function to reset and repopulate all categories (use with caution)
export const resetAndPopulateCategories = async () => {
  console.log('⚠️  Resetting and repopulating ALL categories...');
  
  for (const [categoryName, items] of Object.entries(defaultCategories)) {
    try {
      const itemsCollectionRef = collection(db, 'categories', categoryName, 'items');
      
      // Add new items
      for (const item of items) {
        await addDoc(itemsCollectionRef, {
          name: item,
          createdAt: new Date().toISOString(),
          createdBy: 'system',
          isDefault: true
        });
      }
      
      console.log(`✅ Reset and populated ${categoryName} with ${items.length} items`);
    } catch (error) {
      console.error(`❌ Error resetting ${categoryName}:`, error);
    }
  }
  
  console.log('✅ All categories have been reset and repopulated!');
};
