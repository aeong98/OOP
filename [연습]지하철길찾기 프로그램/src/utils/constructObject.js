export const constructObject = (Fn, initialArgs)=>{
    const fn = new Fn();
    fn.init(initialArgs);
    return fn;
}