const fs = require('fs');
const path = require('path');

// This script replaces the backend URL placeholder in config.js
// with the actual backend URL from environment variables

const configPath = path.join(__dirname, 'public', 'config.js');
const backendUrl = process.env.BACKEND_URL || 'https://chinese-tutor-backend.onrender.com';

if (fs.existsSync(configPath)) {
  let configContent = fs.readFileSync(configPath, 'utf8');
  
  // Replace the placeholder with the actual backend URL
  configContent = configContent.replace(
    /BACKEND_URL = 'https:\/\/chinese-tutor-backend\.onrender\.com'/g,
    `BACKEND_URL = '${backendUrl}'`
  );
  
  fs.writeFileSync(configPath, configContent);
  console.log(`✅ Updated config.js with backend URL: ${backendUrl}`);
} else {
  console.log('⚠️  config.js not found in public directory');
}

console.log('\n🚀 Frontend ready for deployment!');
console.log(`📡 Backend URL: ${backendUrl}`);
console.log('\nNext steps:');
console.log('1. Commit and push your changes');
console.log('2. Deploy on Render.com');
console.log('3. Set BACKEND_URL environment variable in Render');
