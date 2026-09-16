export function errorHandler(err, req, res, next) {
    console.error(err.stack || err);

    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    //? No exponer detalles internos (mensajes de Mongo/Mongoose, etc) al cliente en producción
    const details = process.env.NODE_ENV === 'production' ? null : (err.details || null);

    res.status(status).json({
        message,
        details,
    });
}