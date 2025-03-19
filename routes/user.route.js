const { Router } = require("express")
const { sendOtp, verifyOtp, register, uploadImage, refreshToken } = require("../controller/user.controller")
const upload = require("../multer/user.multer")

const router = Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/register', register);
router.post("/upload-image", upload.single("userImage"), uploadImage);
router.post("/refresh", refreshToken);


module.exports = router;