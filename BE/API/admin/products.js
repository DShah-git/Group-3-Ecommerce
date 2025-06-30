const express = require('express');
const Product = require('../../Models/product.model');    
   
const router = express.Router();

//create product
router.post('/create', async (req, res) => {
    try {
        const { name, images, description, price, category, stock } = req.body;
        const createdBy = req.user.userId;

        if(!name || !description || !price || !category || !stock) {
            return res.status(400).json({ message: 'Required fields - name, description, price, category, stock' });
        }

        // Create and save the product
        const newProduct = new Product({
            name,
            images,
            description,
            price,
            category,
            stock,
            createdBy
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


//create multiple products
router.post('/create-multiple', async (req, res) => {
    try {
        let products = req.body.products;
        const createdBy = req.user.userId;

       

        products = products.map(item => {
            return {
                "name":item.name,
                "images":item.images,
                "description":   item.description,
                "price":    item.price,
                "category":    item.category,
                "stock":    item.stock,
                "createdBy" :createdBy
            };
        });
        
        let saved = Product.insertMany(products)
        
        res.status(201).json({ message: 'All Products created successfully', "products":saved });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


//update product
router.post('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, images, description, price, category, stock } = req.body;

        // Find the product by ID
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: 'Product not found' });


        // Update product fields
        product.name = name || product.name;
        product.images = images || product.images;
        product.description = description || product.description;
        product.price = price || product.price;
        product.category = category || product.category;
        product.stock = stock || product.stock;

        await product.save();
        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//delete product
router.post('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find the product by ID
        const product = await Product.findByIdAndDelete(id);
        if (!product) return res.status(404).json({ message: 'Product not found' });


        
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//get all products
router.get('/all', async (req, res) => {
    try {
        if(!req.query.page) {return res.status(400).json({"message":"Page is required"})}
        const { page = 1, limit = 20 } = req.query;
        
        const products = await Product.find()
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        const totalCount = await Product.countDocuments();
        const pageCount = Math.ceil(totalCount / limit);
        res.status(200).json({ products, totalCount, pageCount });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


//get product by id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find the product by ID
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: 'Product not found' });            

        // Check if the user is authorized to view this product
        if(req.user.userId.toString() !== product.createdBy.toString()) {
            return res.status(403).json({ message: 'You are not authorized to view this product' });
        }
        res.status(200).json(product);
    } catch (err) {

        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
