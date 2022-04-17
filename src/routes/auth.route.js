const express = require('express');
const validate = require('../middlewares/validate');
const authValidator = require('../validations/auth.validator');
const authController = require('../controllers/auth.controller');
const authorize = require('../middlewares/authorize');

const router = express.Router();

router.post('/register', validate(authValidator.register), authController.signup);
router.post('/login', validate(authValidator.login), authController.signin);
router.get('/logout', authorize(), authController.signout);
router.put('/upload-avatar', authorize(), validate(authValidator.uploadAvatar), authController.updateAvatar);

module.exports = router;
