// Script to populate admin categories for testing
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDnGLNzAQTb3u1OEf2THrjjgwRqtw6dMLM",
  authDomain: "masshura-78c43.firebaseapp.com",
  projectId: "masshura-78c43",
  storageBucket: "masshura-78c43.firebasestorage.app",
  messagingSenderId: "244901849709",
  appId: "1:244901849709:web:f78b89a57f49de2c9c17dc",
  measurementId: "G-5LGVJM5J15"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Supply Categories Data
const supplyCategories = [
  { name: "Laptops / Computers" },
  { name: "Printers / Peripherals / Toners" },
  { name: "Network Equipment (Routers, Switches, Cables)" },
  { name: "Storage & Servers" },
  { name: "Cloud Services / Virtualization" },
  { name: "Software Support / AMC" },
  { name: "Installation & Logistics" },
  { name: "IT Security Solutions" },
  { name: "Mobile & Tablets" },
  { name: "Audio Visual Equipment" },
  { name: "Other (please specify)" }
];

// Country Codes Data
const countryCodes = [
  { name: "🇦🇪 +971 (UAE)" },
  { name: "🇸🇦 +966 (Saudi Arabia)" },
  { name: "🇰🇼 +965 (Kuwait)" },
  { name: "🇶🇦 +974 (Qatar)" },
  { name: "🇴🇲 +968 (Oman)" },
  { name: "🇧🇭 +973 (Bahrain)" },
  { name: "🇺🇸 +1 (USA)" },
  { name: "🇬🇧 +44 (UK)" },
  { name: "🇮🇳 +91 (India)" },
  { name: "🇵🇰 +92 (Pakistan)" },
  { name: "🇧🇩 +880 (Bangladesh)" },
  { name: "🇱🇰 +94 (Sri Lanka)" },
  { name: "🇳🇵 +977 (Nepal)" },
  { name: "🇵🇭 +63 (Philippines)" },
  { name: "🇮🇩 +62 (Indonesia)" },
  { name: "🇲🇾 +60 (Malaysia)" },
  { name: "🇸🇬 +65 (Singapore)" },
  { name: "🇨🇳 +86 (China)" },
  { name: "🇰🇷 +82 (South Korea)" },
  { name: "🇯🇵 +81 (Japan)" },
  { name: "🇩🇪 +49 (Germany)" },
  { name: "🇫🇷 +33 (France)" },
  { name: "🇮🇹 +39 (Italy)" },
  { name: "🇪🇸 +34 (Spain)" },
  { name: "🇳🇱 +31 (Netherlands)" },
  { name: "🇦🇺 +61 (Australia)" },
  { name: "🇨🇦 +1 (Canada)" }
];

// Countries Data
const countries = [
  { name: "United Arab Emirates" },
  { name: "Saudi Arabia" },
  { name: "Kuwait" },
  { name: "Qatar" },
  { name: "Bahrain" },
  { name: "Oman" },
  { name: "Jordan" },
  { name: "Lebanon" },
  { name: "Egypt" },
  { name: "Morocco" },
  { name: "India" },
  { name: "Pakistan" },
  { name: "Bangladesh" },
  { name: "Sri Lanka" },
  { name: "Philippines" },
  { name: "Malaysia" },
  { name: "Singapore" },
  { name: "Indonesia" }
];

// Emirates Data
const emirates = [
  { name: "Dubai" },
  { name: "Abu Dhabi" },
  { name: "Sharjah" },
  { name: "Ajman" },
  { name: "Ras Al Khaimah" },
  { name: "Fujairah" },
  { name: "Umm Al Quwain" }
];

// Years of Operation Data
const yearsOfOperation = [
  { name: "1-2 years" },
  { name: "3-5 years" },
  { name: "6-10 years" },
  { name: "11-15 years" },
  { name: "15+ years" }
];

// Employee Count Data
const employeeCount = [
  { name: "1-10" },
  { name: "11-50" },
  { name: "51-100" },
  { name: "101-500" },
  { name: "500+" }
];

async function populateCategory(categoryName, items) {
  console.log(`Populating ${categoryName}...`);
  try {
    for (const item of items) {
      const docRef = await addDoc(collection(db, 'categories', categoryName, 'items'), item);
      console.log(`Added ${item.name} with ID: ${docRef.id}`);
    }
    console.log(`✅ Successfully populated ${categoryName}`);
  } catch (error) {
    console.error(`❌ Error populating ${categoryName}:`, error);
  }
}

async function populateAllCategories() {
  console.log('🚀 Starting to populate admin categories...\n');
  
  await populateCategory('supplyCategories', supplyCategories);
  await populateCategory('countryCodes', countryCodes);
  await populateCategory('countries', countries);
  await populateCategory('emirates', emirates);
  await populateCategory('yearsOfOperation', yearsOfOperation);
  await populateCategory('employeeCount', employeeCount);
  
  console.log('\n🎉 All categories populated successfully!');
  process.exit(0);
}

populateAllCategories().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
