import path from 'path';
import * as fs from 'fs';
import Koa from 'koa';
const app = new Koa();
import Router from 'koa-router';
const router = new Router();
const args = process.argv;
const nodeEnv = args?.find((e:string) => e.match(/--node-env=(.*)/));
const isDevelopment = nodeEnv?.match(/--node-env=(.*)/) ? nodeEnv?.match(/--node-env=(.*)/)?.[1] === 'development' : false;
const _path_ = isDevelopment ? path.resolve(__dirname, 'subPackages') : path.resolve(__dirname);
const dirs = fs.readdirSync(_path_);
for(let i in dirs){
    const __path__ = isDevelopment ? path.resolve(_path_, dirs[i], 'main', 'node') : path.resolve(_path_, dirs[i]);
    const fileStat = fs.statSync(__path__);
    if(fileStat.isDirectory()){
        const module = path.resolve(__path__, 'index').replace(/\\/g, new Array(2).fill('\\').join(''));
        eval(`require('${module}').default.call({}, router)`);
    }
}
app.use(router.routes()); 
app.use(router.allowedMethods()); 
app.listen(3000);


