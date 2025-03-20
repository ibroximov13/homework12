const { Router } = require("express")
const { sendOtp, verifyOtp, register, uploadImage, refreshToken, loginUser,createSuperAdmin } = require("../controller/user.controller")
const upload = require("../multer/user.multer");
const verifyRole = require("../middlewares/verifyRole");

const router = Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/register', register);
router.post("/login", loginUser);
router.post("/upload-image", upload.single("userImage"), uploadImage);
router.post("/refresh", refreshToken);
router.post("/create-superadmin", verifyRole(['ADMIN']), createSuperAdmin);


module.exports = router;