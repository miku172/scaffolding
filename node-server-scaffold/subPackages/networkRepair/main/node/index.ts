
import {WebController} from "./controllers/controller.web";

export default function run(app: KoaType.RequestMethodsType){
    WebController(app);
}