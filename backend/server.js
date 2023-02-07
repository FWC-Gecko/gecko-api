const app = require('./app');
const connectDatabase = require('./config/database');
const PORT = process.env.PORT || 4000;

connectDatabase();

app.listen(PORT, () => {
  console.log(`Server Running On Port: ${PORT}`);
});
