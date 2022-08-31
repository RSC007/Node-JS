const data = {
    employees: require('../modal/employees.json'),
    setEmployee: function (data) { this.employees = data }
}

const getAllEmployees = (req, res) => {
    res.json(data.employees)
}

const addNewEmployee = (req, res)=> {
    const newEmployee = {
        id: [data.employees.length - 1].id + 1 || 1,
        firstname: req.body.firstname,
        lastname: req.body.lastname 
    }

    if(!req.body.firstname || !req.body.lastname ){
        return res.status(400).json({ "message": "First and last name are required." })
    }

    data.setEmployee([...data.employees, newEmployee])
    res.status(201).json(data.employees)
}

const updateEmployee = (req, res)=>{
    const employee = data.employees.map((data) => data.id === req.body.id ? ({...data, ...req.body}) : data )
    res.json(employee)
}

const deleteEmployee = (req, res)=>{
    const employee = data.employees.filter(({ id }) => id !== parseInt(req.body.id))
    res.json(employee)
}

const getEmployee = (req, res)=>{
    const employee = data.employees.find(( {id} )=> parseInt(req.params.id) === id)
    if(!employee){
        res.status(400).json({ "message" : `Employee Id ${req.params.id} not found` })
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