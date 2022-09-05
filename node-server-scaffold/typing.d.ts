declare namespace KoaType{
    interface RequestType{
        get?:(T: string, callback: Function)=>void;
        post?:(T: string, callback: Function)=>void;
    }
}