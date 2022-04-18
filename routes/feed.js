const router = require("express").Router()
const multer = require("multer")
const feedController = require("../controllers/feedControllers")
const authMiddleware = require('../middlewares/users/auth-middleware');
const fs = require('fs');
try {
    fs.readdirSync('uploads'); // 폴더 확인
} catch (err) {
    console.error('uploads 폴더가 없습니다. 폴더를 생성합니다.');
    fs.mkdirSync('uploads'); // 폴더 생성
}
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/');
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    }),
    limiuts: { fileSize: 10 * 1024 * 1024 }
});

// 'image'라는 이름은 multipart.html의 <input type="file" name="image"> 에서 폼데이터 이름으로 온 것이다.
router.post("/", authMiddleware, upload.single('feedImage'), feedController.postFeeds)
router.get('/', authMiddleware, feedController.getFeeds)
router.delete('/:feedCode', authMiddleware, feedController.deleteFeeds)
router.put("/:feedCode", authMiddleware, upload.single('feedImage'), feedController.updateFeeds)

module.exports = router
