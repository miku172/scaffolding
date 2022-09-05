import path from 'path';
import * as fs from 'fs';
import Colors from 'colors';
import Koa from 'koa';
const app = new Koa();
import Router from 'koa-router';
import Log4jUtils from './log4j.utils';
import {exec} from './mysql.utils';

const router = new Router();
const string = `[ 当前进程：${process.pid} 系统平台：${process.platform} 进程名：${process.title} ] `
const args = process.argv;
const nodeEnv = args?.find((e:string) => e.match(/--node-env=(.*)/));
const isDevelopment = nodeEnv?.match(/--node-env=(.*)/) ? nodeEnv?.match(/--node-env=(.*)/)?.[1] === 'development' : false;
const _path_ = isDevelopment ? path.resolve(__dirname, 'subPackages') : path.resolve(__dirname);
const dirs = fs.readdirSync(_path_);
for(let i in dirs){
    if('logs' === dirs[i]) continue;
    const __path__ = isDevelopment ? path.resolve(_path_, dirs[i], 'main', 'node') : path.resolve(_path_, dirs[i]);
    const fileStat = fs.statSync(__path__);
    if(fileStat.isDirectory()){
        const module = path.resolve(__path__, 'index').replace(/\\/g, new Array(2).fill('\\').join(''));
        eval(`require('${module}').default.call({}, router)`);
    }
}

// read my.ini
const myIniExsists = fs.existsSync(path.resolve(__dirname, 'my.ini'));
let port = '3000';
if(myIniExsists){
    const file = fs.readFileSync(path.resolve(__dirname, 'my.ini'),{encoding: 'utf-8', flag: 'r'});
    const match = file.match(/server\.port=(\d+)\s*#?/);
    if(match && !Number.isNaN(Number(match[1]))) port=match[1];
}
app.listen(port, ()=>{
    console.info(string, Colors.green(`loading this router plugin`));
    app.use(router.routes()); 
    app.use(router.allowedMethods()); 
    console.info(string, Colors.green(`this router plugin is loaded`));
    console.info(string, Colors.green(`loading this log plugin`));
    app.use(Log4jUtils());
    app.use(async (ctx, next) => {
        const start = new Date();
        // @ts-ignore
        let ms = new Date() - start;
        await next();
        try {
          if (ctx.status === 404) {
            ctx.throw(404);
          }
          // @ts-ignore
          ms = new Date() - start;
          ctx.logger.logResponse(ctx, ms);
        } catch (error) {
            // @ts-ignore
          ms = new Date() - start;
          ctx.logger.logError(ctx, error, ms);
        }
      });
    console.info(string, Colors.green(`this log plugin is loaded`));
    console.info(string, Colors.green(`loading this SQL plugin`));
    app.use(async (ctx, next)=>{
        ctx.exec = exec;
        await next();
    });
    console.info(string, Colors.green(`this SQL plugin is loaded`));
    console.info(string, Colors.green(`the server is started`));
    console.info(string, Colors.green(`start port is ${port}`));
});


