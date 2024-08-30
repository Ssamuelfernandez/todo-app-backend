import { checkDatabaseStatus } from "../mongoDB.js";

export async function getWelcome(req, res, next) {
    try {
        const dbStatus = await checkDatabaseStatus();
        res.status(200).json({
            message: 'Welcome to ToDo API',
            database: dbStatus
        });
    } catch (error) {
        next(error);
    }
}
