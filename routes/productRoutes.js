const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// 상품 등록 API
router.post('/products', async (req, res) => {
  try {
    const { name, description, price, tags } = req.body;
    const product = new Product({ name, description, price, tags });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 상품 목록 조회 API
router.get('/products', async (req, res) => {
  try {
    const { orderBy, page = 1, pageSize = 10, keyword = '' } = req.query;
    const sort = orderBy === 'recent' ? { createdAt: -1 } : {};
    const query = { name: new RegExp(keyword, 'i') };

    const products = await Product.find(query)
      .sort(sort)
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize, 10));

    res.status(200).json({ list: products });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 상품 상세 조회 API
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 상품 수정 API
router.patch('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 상품 삭제 API
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 좋아요 수 증가 API
router.patch('/products/:id/like', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    product.favoriteCount += 1; // 좋아요 수 1 증가
    await product.save(); // 데이터베이스에 저장

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 모든 상품의 좋아요 수를 0으로 초기화
router.patch('/products/reset-likes', async (req, res) => {
  try {
    await Product.updateMany({}, { $set: { favoriteCount: 0 } }); // 모든 상품의 좋아요 수를 0으로 설정
    res.status(200).json({ message: 'All likes reset to 0' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

