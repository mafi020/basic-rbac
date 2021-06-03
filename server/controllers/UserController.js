const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/UserModel');
module.exports = {
  createUser: async (req, res, next) => {
    try {
      const { name, email, role, password } = req.body;
      const findUser = await User.findOne({ email: email }).lean();
      if (findUser)
        return res.status(422).json({
          msg: 'Email already exists',
        });
      const hashedPass = await bcrypt.hash(password, 12);
      const user = await User.create({
        name,
        email,
        role,
        password: hashedPass,
      });

      res.status(201).json({
        msg: 'User Created Successfully',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      throw new Error('Something went wrong. Try Again.');
    }
  },
  getAllUser: async (req, res, next) => {
    try {
      const users = await User.find(
        {},
        { name: 1, email: 1, role: 1, createdAt: 1 }
      )
        .sort({ createdAt: -1 })
        .lean();
      if (users.length > 0)
        return res
          .status(200)
          .json({ msg: 'User Fetched Successfully', data: users });
      res.json({ msg: 'No User Found', data: users });
    } catch (err) {
      throw new Error('Something went wrong. Try Again.');
    }
  },
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email }).lean();
      if (!user) return res.json({ msg: 'No user Found' });

      const passMatch = await bcrypt.compare(password, user.password);
      if (!passMatch) return res.json({ msg: 'Wrong Credential' });

      const token = jwt.sign(
        {
          email,
          password,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '1h',
        }
      );
      req.session.user = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
      res
        .status(200)
        .json({ name: user.name, email: user.email, role: user.role, token });
    } catch (err) {
      // console.log(err);
      throw new Error('Something went wrong. Try Again.');
    }
  },
  logOut: async (req, res, next) => {
    req.session.destroy(err => {
      if (err) {
        console.log(err);
      }
      return res.status(200).json({
        msg: 'Logged Out Successfully',
      });
    });
  },
};
