
import {WebController} from "./controllers/controller.web";

export default function run(app: any){
    console.log('network repair controller');
    app.get('/', function (ctx: { body: string; }) { 
        ctx.body="Hello world!";     
    })
    WebController(app);
}