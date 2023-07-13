const pet = require('../models/pet')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getAllPets = async (req, res) => {
    const pets = await pet.find().sort('createdAt')
    res.status(StatusCodes.OK).json({ pets, count: jobs.length })
}

const getAllPetsByUser = async (req, res) => {
    const pets = await pet.find({donatedBy: req.user.userId}).sort('createdAt')
    res.status(StatusCodes.OK).json({ pets, count: jobs.length })
}

const getPetById = async (req, res) => {
    const {
        user: { userId },
        params: { id: petId },
    } = req
    const pet = await pet.findOne({
        _id: petId,
    })
    if (!pet) {
        throw new NotFoundError(`No pet with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({pet})
}

const donatePet = async (req, res) => {
    try {
        uploadImages(req, res, async () => {
            const imageUrls = req.uploadedImages;
            req.body.donatedBy = req.user.userId;
            req.body.images = imageUrls;
            const pet = await pet.create(req.body);
            res.status(StatusCodes.CREATED).json({ pet });
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to donate pet' });
    }
};

const updatePet = async (req, res) => {
    const {
        body: { company, position },
        user: { userId },
        params: { id: petId },
    } = req
    const pet = await pet.findByIdAndUpdate(
        { _id: petId, createdBy: userId },
        req.body,
        { new: true, runValidators: true }
    )
    if (!pet) {
        throw new NotFoundError(`No pet with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({pet})
}

const deletePet = async (req, res) => {
  const {
    user: { userId },
    params: { id: petId },
  } = req
  const pet = await pet.findByIdAndRemove({
    _id: petId,
    createdBy: userId,
  })
  if (!pet) {
    throw new NotFoundError(`No pet with id ${jobId}`)
  }
  res.status(StatusCodes.OK).json({pet})
}

module.exports = {
  donatePet,
  deletePet,
  getAllPets,
  updatePet,
  getPetById,
  getAllPetsByUser
}