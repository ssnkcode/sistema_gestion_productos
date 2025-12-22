import mongoose from 'mongoose';

const productCollection = 'products';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, index: true },
    description: { type: String },
    code: { type: String, required: true, unique: true },
    category: { type: String, required: true, index: true },
    supplier: { type: String, required: true },
    
    price: { type: Number, required: true },
    salePrice: { type: Number, required: true },
    
    stock: { type: Number, required: true, default: 0 },
    minStock: { type: Number, default: 5 },
    maxStock: { type: Number, default: 100 },
    
    status: { 
        type: String, 
        enum: ['in-stock', 'low-stock', 'out-of-stock'],
        default: 'out-of-stock'
    },
    
    active: { type: Boolean, default: true },
    imageUrl: { type: String }

}, { 
    timestamps: true,
    versionKey: false 
});

productSchema.pre('save', function(next) {
    if (this.stock === 0) {
        this.status = 'out-of-stock';
    } else if (this.stock <= this.minStock) {
        this.status = 'low-stock';
    } else {
        this.status = 'in-stock';
    }
    next();
});

productSchema.pre('findOneAndUpdate', function(next) {
    const update = this.getUpdate();
    if (update.stock !== undefined || update.minStock !== undefined) {
        if (update.stock === 0) update.status = 'out-of-stock';
        else if (update.stock <= (update.minStock || 5)) update.status = 'low-stock';
        else update.status = 'in-stock';
    }
    next();
});

const productModel = mongoose.model(productCollection, productSchema);

export default productModel;