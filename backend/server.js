const app = require('./app');
const { connectDatabase } = require('./config/database');
const PORT = process.env.PORT || 4000;
const walletChecker = require('./utils/walletChecker');

connectDatabase();

app.listen(PORT, () => {
  console.log(`Server Running On Port: ${PORT}`);

  setInterval(() => {
    walletChecker();
  }, 1000 * 60 * 5); //  every 5 minutes
});
