import mongoose from "mongoose";

export async function handleDatabaseOperation(operation) {
    try {
        return await operation();
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            //! Manejo de errores de validación
            throw { status: 400, message: `Validation Error: ${Object.values(error.errors).map(e => e.message).join(', ')}` };
        } else if (error instanceof mongoose.Error.CastError) {
            //! Manejo de errores de tipo de datos
            const { path, value, reason } = error;
            const message = reason
                ? `Invalid data type for field '${path}'. Expected type: ${reason.kind}, but received value: '${value}'.`
                : `Invalid data type for field '${path}'. Received value: '${value}'.`;
            throw { status: 400, message: message };
        } else {
            //! Manejo de otros errores
            throw { status: 500, message: 'Database error', details: error.message };
        }
    }
}