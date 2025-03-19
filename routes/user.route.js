const { Router } = require("express")
const { sendOtp, verifyOtp, register, refreshToken } = require("../controller/user.controller")
const { upload } = require("../multer/user.multer")

const router = Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/register', upload.single('photo'), register);
router.post("/refresh", refreshToken);

export default router;