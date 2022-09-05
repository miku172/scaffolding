import { conn } from "./mysql.config";

function exec(sql: string = ''){
    return new Promise((resolve: any, reject: any)=>{
        return conn.getConnection((error: any, connection: { query: (arg0: string, arg1: (error: any, results: any, fields: any) => any) => void; release: () => void; })=>{
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
export const koa_exec = ()=>{
    return async (ctx: { exec: (sql?: string) => Promise<unknown>; }, next: () => any)=>{
        ctx.exec = exec;
        await next();
    }
}