const mongoose = require('mongoose');

const dotenv = require('dotenv');

// uncaght exceptions
process.on('uncaughtException', (err) => {
  console.log('UNHANDELED EXCEPTION! 🔥 Shutting down');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE;
// Connectiong to the DB using mongoose, The connection returns a promise
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('database connection successful');
  });
const app = require('./app');

const port = process.env.PORT || 8080;

const server = app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});

// express unhandeled rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDELED REJECTION! 🔥 Shutting down');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1); // 1 refer to uncaught exception
  });
});
