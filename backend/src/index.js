import ConnectDB from './db/index.js';
import app from './app.js';
import dotenv from 'dotenv';

const result = dotenv.config({ path: 'backend/.env' });
if (result.error) {
  console.error('error at result: ', result.error);
  process.exit(1);
}

ConnectDB()
  .then(() => {
    const PORT = process.env.PORT || 3001;
    const HOST = process.env.HOST || 'localhost';
    app.listen(PORT, HOST, () => {
      console.log(`⚙️  Server is listening on http://${HOST}:${PORT}`);
    });
  })
  .catch((err) => {
    console.log('Error Occurs: ', err);
  });
