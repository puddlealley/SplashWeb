import * as winston from 'winston';
import DailyRotateFile = require("winston-daily-rotate-file")

const transport = new DailyRotateFile({
    filename: 'generator-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    dirname: __dirname + "/../logs"
});

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.timestamp(), winston.format.prettyPrint()),
    transports: [transport],
    exceptionHandlers: [transport, new winston.transports.Console({
        format: winston.format.simple()
    })],
});


logger.exitOnError = false;
