const { promisify } = require('util');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');
const Cart = require('./../models/cartModel');
const Favorite = require('./../models/favoriteModel');

// assigning a token to user
const asignToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  }); // jwt payload
};

exports.signup = catchAsync(async (req, res, next) => {
  if (req.body.email.includes('@edge')) {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      role: 'admin',
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      passwordChangedAt: req.body.passwordChangedAt,
    });
    const token = asignToken(newUser._id);
    const newFavorite = await Favorite.create({
      owner: newUser._id,
      items: [],
    });
    const newCart = await Cart.create({
      owner: newUser._id,
      items: [],
    });
    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
  } else {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      passwordChangedAt: req.body.passwordChangedAt,
    });
    const token = asignToken(newUser._id);
    const newFavorite = await Favorite.create({
      owner: newUser._id,
      items: [],
    });
    const newCart = await Cart.create({
      owner: newUser._id,
      items: [],
    });
    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
  }

  //user has a favorite list and a cart once he signs in
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1)check if email & password exist
  if (!email || !password) {
    return next(
      new AppError('Please provide email and password correctly!', 400)
    );
  }
  // 2)check if the user exist && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3)If everything is ok, send token to client

  const token = asignToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) getting the token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! please log in to get access', 401)
    );
  }
  // 2) verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exist
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The User associated with this token is no longer exist',
        401
      )
    );
  }
  // 4) Check if user changed password after JWT was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! PLease login again.', 401)
    );
  }

  // Grant access to protected route
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};
