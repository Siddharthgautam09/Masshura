// Script to populate default categories
import { populateDefaultCategories } from './src/utils/populateDefaultCategories.js';

console.log('Starting default categories population...');

populateDefaultCategories()
  .then(() => {
    console.log('✅ Default categories populated successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error populating categories:', error);
    process.exit(1);
  });
