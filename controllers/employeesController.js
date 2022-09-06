const Employee = require('../modal/Employee')

const getAllEmployees = async (req, res) => {
    const employees = await Employee.find()
    if (!employees) return res.send(204).json({ 'message': 'No record to show!' })
    res.json(employees)
}

const addNewEmployee = async (req, res)=> {

    if(!req.body.firstname || !req.body.lastname ){
        return res.status(400).json({ "message": "First and last name are required." })
    }

    try {
        const newEmployee = await Employee.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname 
        })
        res.send(201).json({ 'message': `New Employee ${req.body.username} added.` })
    } catch (err) {
        console.log(err)
    }
}

const updateEmployee = async (req, res)=>{
    if (!req.body.id) return res.send(400).json({ 'message': 'Id parameter is required.' })

    const employee = await Employee.findOne({ _id: req.body.id }).exec()

    if (req.body.username) employee.username = req.body.username
    if (req.body.lastname) employee.lastname = req.body.lastname

    const result = employee.save()
    res.json(employee)
}

const deleteEmployee = async (req, res)=>{
    if (!req.body.id) return res.send(400).json({ 'message': 'Id is required.' })

    const employee = await Employee.findOne({ _id: req.body.id })
    if (!employee) return res.send(204).json({ 'message': `This Id ${req.body.id} don't have record.` })

    const result = await Employee.deleteOne({ _id: req.body.id })
    res.json(result)
}

const getEmployee = async (req, res)=>{
    if (!req.params.id) return res.send(400).json({ 'message': 'Id is required.' })

    const employee = await Employee.findOne({ _id: req.params.id })
    if(!employee){
        res.status(204).json({ "message" : `No Employee found.` })
    }
    res.json(employee)
}

module.exports = {
    getAllEmployees,
    addNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
}