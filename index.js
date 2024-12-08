const express = require('express');
const syncDatabase = require('./config/syncDatabase');
const app = express();
app.use(express.json());
const userRoute = require('./routes/userRoute');
const cors = require('cors');
const cron = require('node-cron');
const { removeExpiredUsers } = require('./services/handlerService');

app
    .use(cors({origin: '*'}))
    .use('/user', userRoute);
    
syncDatabase();
cron.schedule('0 0 * * *', () => {
  removeExpiredUsers();
  console.log("Job de limpeza de usuários executado.");
});
app.listen(3000, () => {
    console.log('Server runnin on http://localhost:3000');
});
