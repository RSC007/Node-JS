const express = require('express')
const router = express.Router()

const {
    getAllEmployees,
    addNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
} = require('../../controllers/employeesController')

router.route('/')
    .get(getAllEmployees)
    .post(addNewEmployee)
    .put(updateEmployee)
    .delete(deleteEmployee)

router.route('/:id')
    .get(getEmployee)

module.exports = router