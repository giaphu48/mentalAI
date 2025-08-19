const express = require('express');
const router = express.Router();
const controller = require('../controllers/blogController');
const upload = require('../middlewares/uploadBlog');

router.post('/', upload.single('image'), controller.createBlog);
router.get('/', controller.getAllBlogs);
router.get('/:id', controller.getBlogById);
router.put('/:id', upload.single('image'), controller.editBlog);
router.delete('/:id', controller.deleteBlog);

module.exports = router;
