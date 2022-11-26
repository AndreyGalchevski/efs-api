import http from 'http';

import createApp from './create-app';
import dbManager from './db/db-manager';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createApp(process.env.DB_URI!).then((app) => {
  const port = Number(process.env.PORT || '8080');

  app.set('port', port);

  const server = http.createServer(app);

  const onError = async (error: NodeJS.ErrnoException): Promise<never> => {
    await dbManager.disconnect();

    if (error.syscall !== 'listen') {
      throw error;
    }

    if (error.code === 'EACCES') {
      console.error(`Port ${port} requires elevated privileges`);
      process.exit(1);
    } else if (error.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use`);
      process.exit(1);
    } else {
      throw error;
    }
  };

  const onListening = (): void => {
    console.log(`Server live on port ${port}`);
  };

  const onClose = async (): Promise<void> => {
    await dbManager.disconnect();

    console.log('Server closing');
  };

  server.listen(port);

  server.on('error', onError);
  server.on('listening', onListening);
  server.on('close', onClose);
});
