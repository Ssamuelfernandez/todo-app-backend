import mongoose from 'mongoose';
import { type } from 'os';

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minlength: [4, 'Title must be at least 4 characters long'],
        maxlength: [30, 'Category name must be at most 30 characters long']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [200, 'Description must be at most 200 characters long']
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending'
    },
    completed: {
        type: Boolean,
        default: false
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Low'
    },
    category: {
        type: String,
        enum: [
            'Work', 'Personal', 'Shopping', 'Health', 'Finance', 
            'Education', 'Social', 'Travel', 'Hobby', 'Errands','Others'
        ],
        default: 'Personal',
        required: [true, 'Category is required']
    },
    reminder: {
        type: Date
    },
    dueDate: {
        type: Date,
        validate: {
            validator: function(value) {
                return value >= new Date();
            },
            message: 'Due date cannot be in the past'
        }
    },
    tags: {
        type: [String],
        validate: {
            validator: function(value) {
                return value.length <= 5;
            },
            message: 'You can specify up to 5 tags'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: String,
        ref: 'User',
        required: true
    }
}, { collection: 'myTodos', versionKey: false });

const ToDo = mongoose.model('ToDo', todoSchema);

export default ToDo;
