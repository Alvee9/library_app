var router = require('express').Router();
var auth_controller = require('../controllers/authController');

router.get('/login', auth_controller.login_get);

router.post('/login', auth_controller.login_post);

router.get('/signup', auth_controller.signup_get);

router.post('/signup', auth_controller.signup_post);

router.get('/logout', auth_controller.logout);

module.exports = router;
