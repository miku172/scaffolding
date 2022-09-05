// 登录控制器
const namespace = '/api/system.login/';
export const LoginController = (app: KoaType.RequestMethodsType)=>{
    app.get(`${namespace}login`, async(ctx: any, next: () => any)=>{
        // 查询数据库请求
        const data = await ctx.exec(`SELECT * FROM 人员信息 where 姓名=''`);
        console.log(data);

        
        await next();
    });
}