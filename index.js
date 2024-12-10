const express = require('express');
const syncDatabase = require('./config/syncDatabase');
const app = express();
app.use(express.json());
const userRoute = require('./routes/userRoute');
const mapsRoute = require('./routes/mapsRoute');
const cors = require('cors');
const cron = require('node-cron');
const { removeExpiredUsers } = require('./services/handlerService');
require('dotenv').config();

app
    .use(cors({origin: '*'}))
    .use('/user', userRoute)
    .use('/maps', mapsRoute);
    
syncDatabase();
cron.schedule('0 0 * * *', () => {
  removeExpiredUsers();
  console.log("Remove Users JOB Executed.");
});
app.listen(3000, () => {
    console.log('Server runnin on http://localhost:3000');
});
