const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  likeProduct,
  resetLikes
} = require('../controllers/productController'); // controllers 폴더 안에 있는 productController에서 각 함수 불러옴

// server.js에서 app.use('/api/products', productRoutes)로 기본 경로가 설정

router.post('/', productController.createProduct); // 상품 등록 /api/products
router.get('/', productController.getProducts); // 상품 목록 조회 /api/products
router.get('/:id', productController.getProductById); // 상품 상세 조회 /api/products/:id
router.patch('/:id', productController.updateProduct); // 상품 수정 /api/products/:id
router.delete('/:id', productController.deleteProduct); // 상품 삭제 /api/products/:id
router.patch('/:id/like', productController.likeProduct); // 좋아요 수 증가 /api/products/:id/like
router.patch('/reset-likes', productController.resetLikes); // 모든 상품의 좋아요 수 초기화 /api/products/reset-likes
router.patch('/:id/reset-like', productController.resetProductLikes); // 특정 상품의 좋아요 수 초기화 /api/products/:id/reset-like

module.exports = router;

