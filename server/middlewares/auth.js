const jwt = require('jsonwebtoken');
module.exports = {
  isAuth: (req, res, next) => {
    const sessionUser = req.session.user;
    if (!sessionUser)
      return res.status(401).json({ msg: 'Please Log in first' });
    const authHeader = req.headers['authorization'];
    if (!authHeader)
      return res
        .status(401)
        .json({ msg: 'Authorization Header Must be Provided' });
    const token = authHeader && authHeader.split('Bearer ')[1];
    if (!token)
      return res
        .status(401)
        .json({ msg: 'Authentication Token Must be "Bearer [token]"' });
    jwt.verify(token, process.env.JWT_SECRET, err => {
      if (err) return res.status(403).json({ msg: 'Invalid/Expired token' });
      next();
    });
  },
  isAdmin: role => {
    return (req, res, next) => {
      if (req.session.user.role !== role) {
        return res.status(401).json({ msg: 'Not Allowed. Admin Only Area' });
      }
      next();
    };
  },
};
