
import taskModal from '../models/taskModel.js';

import Joi from 'joi'

export const addTask = async (req, res) => {
    const taskValidation = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().optional(),
        status: Joi.string().valid('TODO', 'IN_PROGRESS', 'COMPLETED').optional(),
        priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH'),
        dueDate: Joi.date().optional(),
    })
    try {
        // validate request 
        const { error, value } = taskValidation.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message});
        }

        // Created a new task with validated data
        const newTask = new taskModal(value);

        // Save task to the database 
        const savedTask = await newTask.save();
        return res.status(200).json(savedTask);
    } catch (error) {
        console.error('Error Creating new task:');
        res.status(500).json({error: "Internal Server Error"})
    }
}

export const getAllTasks = async (req, res) => {
    try {
        const { status, priority, sort, limit, skip } = req.query;

        // Build the query object 
        const query = {};
        if (status) query.status = status;
        if (priority) query.priority = priority;

        // Set sorting options 
        const sortOptions = {};
        if (sort) {
            const [field, order] = sort.split(':');
            sortOptions[field] = order === 'desc' ? -1 : 1;
        }

        // Pagination options
        const limitValue = parseInt(limit, 10) || 10;
        const skipValue = parseInt(skip, 10) || 0;

        // Execute the query 
        const tasks = await taskModal.find(query)
        .sort(sortOptions)
        .limit(limitValue)
        .skip(skipValue);

        res.status(200).json(tasks)
    } catch (error) {
        console.error(error.message);
        res.status(500).json({error: error.message})
    }
}


export const getTaskById = async (req, res) => {
    try {
        const {id} = req.params;

        // Find task by ID 
        const task = await taskModal.findById(id);

        if (!task) {
            return res.status(404).json({error: 'Task not found'})
        }
        
        // Return the task if found 
        res.status(200).json(task);

    } catch (error) {
        console.error(error.message);

        if (error.kind === 'ObjectId'){
            return res.status(404).json({error: 'Invalid Task ID'});
        }

        res.status(500).json({error: 'Internal Server Error'});
    }
}


export const updatedTaskById = async (req, res) => {
    const taskUpdateValidation = Joi.object({
        title: Joi.string().max(100),
        description: Joi.string(),
        status: Joi.string().valid('TODO', 'IN_PROGRESS', 'COMPLETED'),
        priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH'),
        dueDate: Joi.date(),

    }).min(1);
    try {
        const { id } = req.params;

        // Validate request body 
        const { error, message } = taskUpdateValidation.validate(req.body);
        if (error) {
            return res.status(400).json({error: error.details[0].message});
        }

        // Update task by ID 
        const updatedTask = await taskModal.findByIdAndUpdate(id, value, {
            new: true,
            runValidators: true,
        })

        if (!updatedTask) {
            return res.status(404).json({error: 'Task not found'});
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        console.error(error);

        if (error.kind === 'ObjectId') {
            return res.status(400).json({error: 'Invalid Task ID'});
        }

        res.status(500).json({error: 'Internal Server Error'});
    }
}


export const deletedTaskByIds = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the task by ID 
        const deletedTask = await taskModal.findByIdAndDelete(id);

        if (!deletedTask) {
            return res.status(404).json({error: 'Task not found'});

        }
        res.status(200).send();
    
    } catch (error) {
        console.error('Error deleting task:', error);
        if (error.kind === 'ObjectId'){
            return res.status(400).json({error: 'Invalid Task ID'});

        }
        res.status(500).json({error: 'Invalid Server Error'})
    }
}