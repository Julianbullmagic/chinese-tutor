const fs = require('fs');
const path = require('path');

// Create public directory if it doesn't exist
if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
  console.log('✅ Created public directory');
}

// Move index.html to public directory
if (fs.existsSync('index.html')) {
  const htmlContent = fs.readFileSync('index.html', 'utf8');
  fs.writeFileSync('public/index.html', htmlContent);
  console.log('✅ Moved index.html to public/');
} else {
  console.log('⚠️  index.html not found in current directory');
}

console.log('\n🎉 Ready to deploy!');
console.log('\nNext steps:');
console.log('1. Run: git init');
console.log('2. Run: git add .');
console.log('3. Run: git commit -m "Initial commit"');
console.log('4. Create GitHub repo and push your code');
console.log('5. Deploy on Render.com using the DEPLOYMENT.md guide');
