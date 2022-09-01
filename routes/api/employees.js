const express = require('express')
const router = express.Router()
const verifyJWT = require('../../middleware/verifyJWT')

const {
    getAllEmployees,
    addNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
} = require('../../controllers/employeesController')

router.route('/')
    .get(verifyJWT, getAllEmployees)
    .post(addNewEmployee)
    .put(updateEmployee)
    .delete(deleteEmployee)

router.route('/:id')
    .get(getEmployee)

module.exports = router