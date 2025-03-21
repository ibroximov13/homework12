const { Router } = require("express");
const { sendOtp, verifyOtp, register, uploadImage, refreshToken, loginUser, createSuperAdmin, getAllUsers, updateUser, deleteUser } = require("../controller/user.controller");
const upload = require("../multer/user.multer");
const verifyRole = require("../middlewares/verifyRole");

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /users/send-otp:
 *   post:
 *     summary: Send OTP to user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "+998910128133"
 *               email:
 *                 type: string
 *                 example: "ilyosbekibroximov23@gmail.com"
 *     responses:
 *       200:
 *         description: OTP sent successfully.
 */
router.post('/send-otp', sendOtp);

/**
 * @swagger
 * /users/verify-otp:
 *   post:
 *     summary: Verify OTP
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "+998910128133"
 *               email:
 *                 type: string
 *                 example: "ilyosbekibroximov23@gmail.com"
 *               otp:
 *                 type: string
 *                 example: "1234"
 *     responses:
 *       200:
 *         description: OTP verified successfully.
 */
router.post('/verify-otp', verifyOtp);

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "Kimdir"
 *               year:
 *                 type: integer
 *                 example: 2000
 *               password:
 *                 type: string
 *                 example: "123456"
 *               phone:
 *                 type: string
 *                 example: "+998910128133"
 *               email:
 *                 type: string
 *                 example: "ilyosbekibroximov23@gmail.com"
 *               region_id:
 *                 type: integer
 *                 example: 1
 *               photo:
 *                 type: string
 *                 example: "image.png"
 *               role: 
 *                 type: string
 *                 example: "ADMIN"
 *     responses:
 *       201:
 *         description: User registered successfully.
 */
router.post('/register', register);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "+998901234567"
 *               email:
 *                 type: string
 *                 example: "admin@example.com"
 *               password:
 *                 type: string
 *                 example: "admin123"
 *     responses:
 *       200:
 *         description: User logged in successfully.
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /users/upload-image:
 *   post:
 *     summary: Upload user image
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               userImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully.
 */
router.post("/upload-image", upload.single("userImage"), uploadImage);

/**
 * @swagger
 * /users/refresh:
 *   post:
 *     summary: Refresh authentication token
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Token refreshed successfully.
 */
router.post("/refresh", refreshToken);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users.
 */
router.get("/", getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update user details
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully.
 */
router.patch("/:id", updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully.
 */
router.delete("/:id", deleteUser);

/**
 * @swagger
 * /users/create-superadmin:
 *   post:
 *     summary: Create a super admin
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Super admin created successfully.
 */
router.post("/create-superadmin", verifyRole(['ADMIN']), createSuperAdmin);

module.exports = router;
