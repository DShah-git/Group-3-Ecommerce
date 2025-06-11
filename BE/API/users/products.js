const express = require('express');
const Product = require('../../Models/product.model');    
      
const router = express.Router();

//paginated product list along with total count
router.get('/list', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const products = await Product.find()
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        const totalCount = await Product.countDocuments();
        res.status(200).json({ products, totalCount });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//filter products by category and search term, create paginated list
router.get('/filter', async (req, res) => {
    try {
        let { category  , searchTerm, page = 1, limit = 10 } = req.query;

        

        if(!category ) {
            category = [];
        }else{
            category = category.split(',')
        }

        if(!searchTerm) {   
            return res.status(400).json({ message: 'Search term is required' });
        }

        let filter = {};



        if (category.length == 0) {
            filter = {
                name: { $regex: searchTerm, $options: 'i' }
            };
        }else{
            
            filter = {
                $and: [
                    { name: { $regex: searchTerm, $options: 'i' } },
                    { category: { $in: category } }
                ]
            };
        }

        const products = await Product.find(filter).sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        const totalCount = await Product.countDocuments(filter);
        res.status(200).json({ products, totalCount });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


//get product by id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;