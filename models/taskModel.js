import mongoose from 'mongoose'  

const taskSchema = new mongoose.Schema({
    title: {
        type: String, required: true, maxlength: 100,
    },
    description: {
        type: String, 
        default: '',
    },
    status: {
        type: String, 
        enum: ['TODO', 'IN_PROGRESS', 'COMPLETED'],
        default: 'TODO',
    },
    priority: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH'],
        default: 'MEDIUM',
    },
    dueDate: {
        type: Date,
        default: null,
    },
}, {timestamps: true})

const taskModal = mongoose.model('Task', taskSchema)


export default taskModal 