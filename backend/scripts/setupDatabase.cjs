const { execSync } = require('child_process');

function run(command) {
  console.log(`\n> ${command}`);
  execSync(command, { stdio: 'inherit' });
}

console.log('--- Setting up database ---');

try {
  // Check database connection
  run('npx prisma db push');

  // Run migrations
  run('npx prisma migrate deploy');

  // Generate Prisma client
  run('npx prisma generate');

  console.log('--- Database setup complete ---');
} catch (error) {
  console.error('Database setup failed:', error);
  process.exit(1);
}
