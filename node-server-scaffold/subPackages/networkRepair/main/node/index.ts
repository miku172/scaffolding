
import {WebController} from "./controllers/controller.web";

export default function run(app: any){
    console.log('network repair controller');
    app.get('/', function (ctx: any) { 
        ctx.session.id='userid'
        console.log(ctx.session);
        ctx.body="Hello world!";     
    })
    WebController(app);
}