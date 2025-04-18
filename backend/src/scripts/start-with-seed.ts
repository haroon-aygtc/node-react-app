import { runSeeders } from '../seeders/permissionSeeder.js';
import { logger } from '../utils/logger.js';

// Run seeders and then start the server
runSeeders()
  .then(() => {
    logger.info('Seeders completed successfully, starting server...');
    // Import and run the server
    import('../server.js')
      .then(() => {
        logger.info('Server started successfully');
      })
      .catch((error) => {
        logger.error('Error starting server:', error);
        process.exit(1);
      });
  })
  .catch(error => {
    logger.error('Error running seeders:', error);
    process.exit(1);
  });
