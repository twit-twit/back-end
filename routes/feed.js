const router = require("express").Router()
const multer = require("multer")
const feedController = require("../controllers/feedControllers")
const fs = require('fs');
try {
    fs.readdirSync('uploads'); // 폴더 확인
} catch (err) {
    console.error('uploads 폴더가 없습니다. 폴더를 생성합니다.');
    fs.mkdirSync('uploads'); // 폴더 생성
}
const upload = multer({
    storage: multer.diskStorage({ // 저장한공간 정보 : 하드디스크에 저장
        destination(req, file, done) { // 저장 위치
            done(null, 'uploads/'); // uploads라는 폴더 안에 저장
        },
        filename(req, file, done) { // 파일명을 어떤 이름으로 올릴지
            const ext = path.extname(file.originalname); // 파일의 확장자
            done(null, path.basename(file.originalname, ext) + Date.now() + ext); // 파일이름 + 날짜 + 확장자 이름으로 저장
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 } // 5메가로 용량 제한
});

// 'image'라는 이름은 multipart.html의 <input type="file" name="image"> 에서 폼데이터 이름으로 온 것이다.
router.post("/", upload.single('image'), feedController.postFeeds)
router.get('/', feedController.getFeeds)
router.delete('/:feedCode', feedController.deleteFeeds)
router.put("/:feedCode", feedController.updateFeeds)

module.exports = router
