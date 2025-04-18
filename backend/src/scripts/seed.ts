import { runSeeders } from '../seeders/permissionSeeder.js';

// Run seeders
runSeeders()
  .then(() => {
    console.log('Seeders completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error running seeders:', error);
    process.exit(1);
  });
