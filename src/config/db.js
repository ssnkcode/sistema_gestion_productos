import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URL;
        
        await mongoose.connect(MONGO_URI);
        console.log('✅ Conectado exitosamente a MongoDB');
    } catch (error) {
        console.error('❌ Error al conectar a MongoDB:', error);
        process.exit(1);
    }
};

export default connectDB;