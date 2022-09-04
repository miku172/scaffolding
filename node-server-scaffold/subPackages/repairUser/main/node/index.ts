
export default function run(app: any){
    console.log(' repair user controller');
    app.get('/a', function (ctx: { body: string; }) { 
        ctx.body="Hello world a"; 
    })
}