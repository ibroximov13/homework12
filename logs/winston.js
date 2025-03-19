const { createLogger, transports, format } = require('winston');
require('winston-mongodb');
require('dotenv').config()

const logger = createLogger({
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log' }),
        new transports.MongoDB({
            level: 'info', 
            db: process.env.MONGO_URI,  
            options: {
                useUnifiedTopology: true
            },
            collection: 'logs',  
            format: format.combine(
                format.timestamp(),
                format.json()
            )
        })
    ]
});

module.exports = logger;