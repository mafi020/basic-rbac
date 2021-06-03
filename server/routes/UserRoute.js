const userRole = {
  admin: 'admin',
  basic: 'basic',
};
const router = require('express').Router();

const auth = require('../middlewares/auth');
const UserController = require('../controllers/UserController');
const Validator = require('../middlewares/validators/UserValidator');

router.post(
  '/create',
  auth.isAuth,
  auth.isAdmin(userRole.admin),
  Validator.createUserValidator,
  UserController.createUser
);
router.get(
  '/all',
  auth.isAuth,
  auth.isAdmin(userRole.admin),
  UserController.getAllUser
);
router.post('/login', Validator.loginValidator, UserController.login);
router.get('/logout', auth.isAuth, UserController.logOut);

module.exports = router;
