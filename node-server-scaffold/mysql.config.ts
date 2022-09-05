import path from 'path';
import * as fs from 'fs';
const MYSQL = require('mysql8.0');
// 配置mysql
const myIniExsists = fs.existsSync(path.resolve(__dirname, 'my.ini'));
if(!myIniExsists) throw new Error(`my.ini file is not found`);
const file = fs.readFileSync(path.resolve(__dirname, 'my.ini'), {encoding:'utf-8', flag: 'r'});
interface ConfigType {
    'username': string;
    'password': string;
    'host': string;
    'port':  number;
    'database': string;
}
type key = any;
const config: ConfigType = Object.assign({},{'username':'', 'password':'', 'host': '127.0.0.1', 'port': 3306, 'database': ''});
let i: key;
for(i of Object.keys(config)){
    const reg = new RegExp(`mysql\\.${i}=(\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}|\\w+|\\d+)\\s*#?`);
    const match = file.match(reg);
    if(match?.[1]){
        // @ts-ignore
        config[i] = match[1];
    }
}
if(!config.database || !config.username){
    throw new Error(`the username and database are required`);
}
const connection = MYSQL.createPool({
    connectionLimit: 100,
    host: config.host,
    port: config.port,
    password: config.password,
    user: config.username,
    database: config.database,
    charset: 'UTF8_GENERAL_CI',
    timezone: 'local',
    supportBigNumbers: false,
    dateStrings: true,
    multipleStatements: false
});
export {connection as conn};

