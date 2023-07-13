const User = require('../models/user')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const register = async (req, res) => {
    const user = await User.create({ ...req.body })
    res.status(StatusCodes.CREATED).json({user})
}

const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new BadRequestError('Please provide email and password')
    }
    const user = await User.findOne({ email })
    if (!user) {
        throw new UnauthenticatedError('Invalid Credentials')
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid Credentials')
    }
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({ user: user, token: token })
}

const getUserById = async (req, res) => {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
        throw new CustomError.NotFoundError(`No user with id : ${req.params.id}`);
    }
    res.status(StatusCodes.OK).json({ user });
};

const updateUser = async (req, res) => {
    const { email, name } = req.body;
    if (req.body.password){
        throw new CustomError.BadRequestError('Cannot change password at this endpoint');
    }
    if (!email || !name) {
        throw new CustomError.BadRequestError('Please provide all values');
    }
    if (req.user != req.params.id){
        throw new UnauthenticatedError('Not authorised to edit another user');
    }
    const user = await User.findOne({ _id: req.params.id });
    user.email = email;
    user.name = name;
    await user.save();
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({user: user, token: token});
};

module.exports = {
    register,
    login,
    getUserById,
    updateUser
}