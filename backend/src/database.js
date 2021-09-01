
import mysql from 'mysql';

let connection

/**
 * 
 * This document does not repeat comments for similar operations. It is assumed that the reader is knowledgable enough to identify similar operations
 * It handles all db related matters
 */
export const db = {
    
    connect: () => {//connections
        connection = mysql.createConnection({
            host: process.env.DB_HOST,//Gets details from .env file
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            socketPath: process.env.DB_SOCKET,
            
        });
        connection.connect();
    },
    query: (queryString, escapedValues) =>
        new Promise((resolve, reject) => {
            connection.query(queryString, escapedValues, (error, results, fields) => {
                if (error) reject(error);
                resolve({ results, fields });
            })
        }),
    end: () => connection.end(),
}