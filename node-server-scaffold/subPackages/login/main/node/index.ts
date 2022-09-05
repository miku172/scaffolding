import { LoginController } from "./controllers/login.controller.all";

// 登录插件
export default function run(app: KoaType.RequestMethodsType){
    LoginController(app);
}