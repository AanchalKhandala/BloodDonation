const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware')
const { createInventoryController, getInventoryController, getDonarsController } = require('../controllers/inventoryController')

const router= express.Router()

//routes
//ADD INVENTORY ||POST
router.post('/create-inventory', authMiddleware,createInventoryController)

//GET ALL BLOOD RECORDS
router.get('/get-inventory', authMiddleware, getInventoryController)

//GET ALL Donar RECORDS
router.get('/get-donar', authMiddleware, getDonarsController)

module.exports = router