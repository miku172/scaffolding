import { conn } from "./mysql.config";

function exec(sql: string = ''){
    return new Promise((resolve: any, reject: any)=>{
        return conn.getConnection((error, connection)=>{
            if(error) return reject(error);
            connection.query(sql, (error, results, fields)=>{
                connection.release();
                if(error) return reject(error);
                return resolve(results, fields);
            });
        })
    })
}

export {conn as default}
export {exec}