const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({path: './config.env'});
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
    .connect('mongodb://localhost:27017/testPost6')
    .then(() => console.log('Connected to the DB'))
    .catch(() => console.log('Error in DB connection'))