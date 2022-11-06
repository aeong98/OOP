export const constructObject = (Fn, initialArgs)=>{
    const fn = new Fn();
    fn.init(initialArgs);
    return fn;
}

export const extractTotalValuesOfObjects= (objects, keys)=>{
    return objects.reduce((cur, object)=>[...cur, ...extractValuesOfObject(object, keys)],[])
}

export const extractValuesOfObject= (object, keys)=> {
    return keys.reduce((cur, key) => [...cur, object[key]], [])
}