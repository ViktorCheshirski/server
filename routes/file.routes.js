const Router = require('express')
const router = new Router()
const authMiddleware = require('../middleware/auth.middleware')
const fileController = require('../controllers/fileController')

router.post('/upload', authMiddleware, fileController.uploadFile)
router.get('/search', authMiddleware, fileController.searchFile)
router.get('/main', fileController.mainFile)
router.get('/get', authMiddleware, fileController.getFiles)

module.exports = router