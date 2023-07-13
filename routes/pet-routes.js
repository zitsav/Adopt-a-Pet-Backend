const express = require('express');
const router = express.Router();
const petController = require('../controllers/pet-controller');
const authMiddleware = require('../middleware/authentication');

router.get('/pets', petController.getAllPets);
router.get('/pets/user', authMiddleware, petController.getAllPetsByUser);
router.get('/pets/:id', authMiddleware, petController.getPetById);

router.post('/pets', authMiddleware, petController.donatePet);
router.patch('/pets/:id', authMiddleware, petController.updatePet);
router.delete('/pets/:id', authMiddleware, petController.deletePet);

module.exports = router;