const response = require('../helper/res');
const Employee = require('../models/employeeModels');

const employee = {
    addEmployee: async (req, res) => {
        try {
            const payload = req.body;
            const file = req.file;
            if (!file || !file.path) {
                return response.failed(res, 'File upload failed or no file provided');
            }
            const existing = await Employee.findOne({ nik: payload.nik });
            if (existing) {
                return response.failed(res, 'NIK already exist');
            }
            payload.foto = file.path
            const newEmployee = new Employee(payload);
            const data = await newEmployee.save();
            return response.success(res, data, 'Add Employee Complete');
        } catch (err) {
            return response.failed(res, err.message);
        }
    },

    allEmployee: async (req, res) => {
        try {
            const data = await Employee.find();
            response.success(res, data, 'Get all employees');
        } catch (err) {
            response.failed(res, err.message);
        }
    },

    getEmployee: async (req, res) => {
        try {
            const id_params = req.params.id
            const data = await Employee.findOne({ _id: id_params })
            if (!data) {
                return response.failed(res, 'Cannot Data Employee');
            } return response.success(res, data, 'Success Get Employee');
        } catch (err) {
            response.failed(res, err.message);
        }
    },

    updateEmployee: async (req, res) => {
        try {
            const id_params = req.params.id;
            const payload = req.body;
            const update = await Employee.findByIdAndUpdate(id_params, payload, {
                new: true,
                runValidators: true
            });
            if (!update) {
                return response.failed(res, "Cannot find Employee");
            }
            return response.success(res, update, 'Employee has been updated');
        } catch (err) {
            response.failed(res, err.message);
        }
    },

    deleteEmploye: async (req, res) => {
        try {
            const id_params = req.params.id
            const deleted = await Employee.findByIdAndDelete(id_params)
            if (!deleted) {
                return response.failed(res, "Cannot delete Employee");
            } return response.success(res, deleted, 'Employee has been deleted');
        } catch (err) {
            response.failed(res, err.message);
        }
    }

};

module.exports = employee;
