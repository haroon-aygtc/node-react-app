const { spawn } = require('child_process');
const path = require('path');

// Change to the backend directory
process.chdir(path.join(__dirname, 'backend'));

// Start the server using tsx
const server = spawn('npx', ['tsx', 'src/server.ts'], {
  stdio: 'inherit',
  shell: true
});

server.on('error', (error) => {
  console.error(`Failed to start server: ${error.message}`);
});

console.log('Server starting...');
