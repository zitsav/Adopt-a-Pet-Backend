const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')
const rescueCenter = require('../models/rescuecenter')

const rescueRegister = async (req, res) => {
    const user = await rescueCenter.create({ ...req.body })
    res.status(StatusCodes.CREATED).json({user})
}

const rescueLogin = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new BadRequestError('Please provide email and password')
    }
    const rescueCenter = await rescueCenter.findOne({ email })
    if (!rescueCenter) {
        throw new UnauthenticatedError('Invalid Credentials')
    }
    const isPasswordCorrect = await rescueCenter.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid Credentials')
    }
    const token = rescueCenter.createJWT()
    res.status(StatusCodes.OK).json({ user: rescueCenter, token: token })
}

const getUserById = async (req, res) => {
    const rescueCenter = await rescueCenter.findOne({ _id: req.params.id });
    if (!rescueCenter) {
        throw new CustomError.NotFoundError(`No user with id : ${req.params.id}`);
    }
    res.status(StatusCodes.OK).json({rescueCenter});
};

const updateRescueCenter = async (req, res) => {
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
    const rescueCenter = await rescueCenter.findOne({ _id: req.params.id });
    user.email = email;
    user.name = name;
    await rescueCenter.save();
    const token = rescueCenter.createJWT()
    res.status(StatusCodes.OK).json({user: rescueCenter, token: token});
};

module.exports = {
    rescueRegister,
    rescueLogin,
    getUserById,
    updateRescueCenter
}