const { execSync } = require('child_process');
const path = require('path');

try {
  console.log('Installing backend dependencies...');
  execSync('npm install', { 
    stdio: 'inherit', 
    cwd: path.join(__dirname, 'backend') 
  });
  console.log('Backend dependencies installed successfully!');
} catch (error) {
  console.error('Error installing dependencies:', error.message);
  process.exit(1);
}
