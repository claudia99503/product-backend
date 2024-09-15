const Product = require("../models/product");

// 상품 등록
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, tags } = req.body;
    const product = new Product({ name, description, price, tags });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 상품 목록 조회
exports.getProducts = async (req, res) => {
  try {
    const { orderBy, page = 1, pageSize = 10, keyword = "" } = req.query;
    const sort = orderBy === "recent" ? { createdAt: -1 } : {};
    const query = { name: new RegExp(keyword, "i") };

    const products = await Product.find(query)
      .sort(sort)
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize, 10));

    res.status(200).json({ list: products });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 상품 상세 조회
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 상품 수정
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 상품 삭제
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 좋아요 수 증가
exports.likeProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    product.favoriteCount += 1;
    await product.save();

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 모든 상품의 좋아요 수 초기화
exports.resetLikes = async (req, res) => {
  try {
    await Product.updateMany({}, { $set: { favoriteCount: 0 } });
    res.status(200).json({ message: "All likes reset to 0" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 특정 상품의 좋아요 수 초기화
exports.resetProductLikes = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    product.favoriteCount = 0; // 특정 상품의 좋아요 수를 0으로 설정
    await product.save(); // 데이터베이스에 저장

    res
      .status(200)
      .json({
        message: `Likes for product ${req.params.id} reset to 0`,
        product,
      });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

