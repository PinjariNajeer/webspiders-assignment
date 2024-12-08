import express from 'express'
import { addTask, deletedTaskByIds, getAllTasks, getTaskById, updatedTaskById } from '../controllers/taskController.js'

const taskRouter = express.Router()

taskRouter.post('/tasks',  addTask)
taskRouter.get('/tasks', getAllTasks)
taskRouter.get('/tasks/:id', getTaskById)
taskRouter.put('/tasks/:id', updatedTaskById)
taskRouter.delete('/tasks/:id', deletedTaskByIds);
export default taskRouter 
