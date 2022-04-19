const router = require('express').Router();
const refresh = require('../lib/jwt-refresh');

const multer = require('multer');

const fileFilter = (req, file, callback) => {
    const typeArray = file.mimetype.split('/');
    const fileType = typeArray[1];

    if(fileType === 'jpg' || fileType === 'jpeg' || fileType === 'png'){
        callback(null, true);
    }else{
        return callback({message: 'jpg, jpeg, png만 업로드 가능.'}, false)
    }
}

const limits = {
    fieldNameSize: 200, // 필드명 사이즈 최대값 (기본값 100bytes)
    filedSize: 10 * 1024 * 1024, // 필드 사이즈 값 설정 (기본값 10MB)
    // fields: 2, // 파일 형식이 아닌 필드의 최대 개수 (기본 값 무제한)
    fileSize : 16777216, //multipart 형식 폼에서 최대 파일 사이즈(bytes) "16MB 설정" (기본 값 무제한)
    // files : 10, //multipart 형식 폼에서 파일 필드 최대 개수 (기본 값 무제한)
}

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+'-'+file.originalname);
    }
  }),
  limits: limits,
  fileFilter: fileFilter,
  
});

// Controller
const userController = require('../controllers/userControllers');

// Middleware
const authMiddleware = require('../middlewares/users/auth-middleware');

router.post('/', upload.single('image'), userController.postSignUp);
router.post('/login', userController.postLogin);
router.get('/dup', userController.getDuplicateUserId);
router.get('/auth', userController.getValidAuthCheck);
router.get('/refresh', refresh);

module.exports = router;