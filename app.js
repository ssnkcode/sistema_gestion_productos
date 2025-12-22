import express from 'express';
import connectDB from './src/config/db.js';
import productsRouter from './src/routes/products.router.js';
import cors from 'cors';
import dotenv from "dotenv"

const app = express();
const PORT = 8080;
dotenv.config();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"))

app.use('/api/products', productsRouter);

app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});