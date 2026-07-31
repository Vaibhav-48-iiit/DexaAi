require('dotenv').config(); // MUST be first — loads .env before any module reads process.env
const app = require('./src/app');
const connectDB = require('./src/config/Database');

connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});