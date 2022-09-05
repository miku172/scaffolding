declare namespace KoaType{
    interface RequestMethodsType{
        get?:(T: string, callback: Function)=>void;
        post?:(T: string, callback: Function)=>void;
    }
}