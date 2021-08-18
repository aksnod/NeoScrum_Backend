const express = require("express");
const router = express.Router();
const multer = require("multer");
const userController = require("../controllers/users_controller");
const adminController = require("../controllers/admin_controller");

const userAuth = require("../middleware/user_authentication");
const adminAuth = require("../middleware/admin_authentication");

const upload = multer({
  // dest: "uploads",
  limits: {
    fileSize: 1024 * 300,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)){
      req.fileValidationError = 'plz select suitable file'
      return cb(null,false);}
    cb(undefined, true);
  },
});

router.get("/", (req, res) => {
  res.send({ message: "Home Page" });
});

router.post("/admin/sign-up", adminController.signUp);
/**
 * @openapi
 * /admin/sign-up:
 *   post:
 *    summary: Registration api!
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/adminsign_up'
 *    responses:
 *      200:
 *        description: Successfully Register.
 *      401:
 *        description: User already exist or error
 *
 *
 *components:
 *  schemas:
 *    adminsign_up:
 *      type: array
 *      properties:
 *        name:
 *          type: string
 *          required: true
 *        email:
 *          type: string
 *          required: true
 *      example:
 *
 *        name: Shyam
 *        email:  a12@gmail.com
 *
 */
router.post("/admin/create-session", adminController.createSession);

/**
 * @openapi
 * /admin/create-session:
 *   post:
 *    summary: Admin Login
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/sign_in'
 *    responses:
 *      200:
 *        description: Admin successfully register.
 *      401:
 *        description: Admin name or password is wrong
 *
 *
 *components:
 *  schemas:
 *    sign_in:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *          required: true
 *        password:
 *          type: string
 *          required: true
 *      example:
 *
 *
 *        email:  a12@gmail.com
 *        password: ase12/e3
 *
 */

////////////////////////////////////////////////////////////////////////////////////

router.post(
  "/sign-up",
  adminAuth,
  upload.single("avatar"),
  userController.signUp
);
/**
 * @openapi
 * /sign-up:
 *   post:
 *    summary: Registration api!
 *    requestBody:
 *      content:
 *        multipart/form-data:
 *          schema:
 *            $ref: '#/components/schemas/sign_up'
 *    responses:
 *      200:
 *        description: Successfully Register.
 *      401:
 *        description: User already exist or error
 *
 *
 *components:
 *  schemas:
 *    sign_up:
 *      type: array
 *      properties:
 *        name:
 *          type: string
 *          required: true
 *        email:
 *          type: string
 *          required: true
 *        avatar:
 *          type: string
 *          format: binary
 *      example:
 *
 *        name: Shyam
 *        email:  a12@gmail.com
 *        avatar: img.jpg
 *
 */
router.post("/create-session", userController.createSession);

/**
 * @openapi
 * /create-session:
 *   post:
 *    summary: User Login
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/sign_in'
 *    responses:
 *      200:
 *        description: User successfully register.
 *      401:
 *        description: username or password is wrong
 *
 *
 *components:
 *  schemas:
 *    sign_in:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *          required: true
 *        password:
 *          type: string
 *          required: true
 *      example:
 *
 *
 *        email:  a12@gmail.com
 *        password: ase12/e3
 *
 */
router.get("/dashboard", userAuth, userController.dashboard);
/**
 * @openapi
 * /dashboard:
 *   get:
 *    summary:  Returns all users
 *    description:  It is loading all user list
 *    responses:
 *      200:
 *        description:  Users listed successfully
 *        content:  #response
 *          application/json:  #response body
 *            schema:
 *              $ref: '#/components/schemas/Users'
 *
 *      401:
 *        description: Users not exists
 *      500:
 *        description:  Error
 *
 *components:
 *  schemas:
 *    Users:
 *      type: array
 *      properties:
 *        name:
 *          type: string
 *          required: true
 *        email:
 *          type: string
 *          required: true
 *        avatar:
 *          type: string
 *        feedback:
 *          type: string
 *      example:
 *
 *        name: Shyam
 *        email:  a12@gmail.com
 *        avatar: img.jpg
 *        feedback:  user feedback
 *
 */

router.post(
  "/:id/feedback",
  userAuth,

  userController.feedback
);
/**
 * @openapi
 * /{id}/feedback:
 *   post:
 *    summary:  For feedback posting
 *    description:  User can give feedback
 *    parameters:
 *    - in: query
 *      name: id
 *      schema:
 *        type: string
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/feedback'
 *    responses:
 *      200:
 *        description:  feedback posted successfully
 
 *
 *      401:
 *        description: Invalid user
 *      500:
 *        description:  Error
 *
 *components:
 *  schemas:
 *    feedback:
 *      type: object
 *      properties:
 *        feedback:
 *          type: string
 *      example:
 *        feedback:  user feedback
 *
 */
router.get(
  "/receiver-list",
  userAuth,

  userController.getReceivers
);
/**
 * @openapi
 * /receiver-list:
 *   get:
 *    summary:  Returns Receiver users
 *    description:  It is loading all receiver list
 *    responses:
 *      200:
 *        description:  Users listed successfully
 *        content:  #response
 *          application/json:  #response body
 *            schema:
 *              $ref: '#/components/schemas/Users'
 *
 *      401:
 *        description: Users not exists
 *      500:
 *        description:  Error
 *
 *components:
 *  schemas:
 *    Users:
 *      type: array
 *      properties:
 *        name:
 *          type: string
 *          required: true
 *        avatar:
 *          type: string
 *      example:
 *
 *        name: Shyam
 *        avatar: img.jpg
 *
 */

module.exports = router;
