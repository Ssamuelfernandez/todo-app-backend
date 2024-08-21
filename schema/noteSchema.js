import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({

    //TODO Añadir propiedad color para almacenar colores de personalización.

    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minlength: [4, 'Title must be at least 4 character long'],
        maxlength: [20, 'Title must be at most 20 characters long']
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        trim: true,
        minlength: [4, 'Content must be at least 4 character long']
    },
    category: {
        type: String,
        enum: [
            'Personal', 'Work', 'Ideas', 'Project', 'Meeting', 'Others'
        ],
        default: 'Personal'
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
    }
}, { collection: 'myNotes', versionKey: false });

const Note = mongoose.model('Note', noteSchema);

export default Note;
