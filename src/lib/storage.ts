export function readStorage<T>(Key:string, fallback:T):T{
    try{
        const raw = localStorage.getItem(Key);
        if(!raw) return fallback;

        const parsed = JSON.parse(raw);
        if(parsed === null || parsed === undefined) return fallback;
        return parsed as T;
    }
    catch(err){
        console.warn("Error reading storage",err);
        return fallback;
    }
}

export function writeStorage<T>(Key:string, value:T):void{
    try{
        localStorage.setItem(Key, JSON.stringify(value));
    }
    catch(err){
        console.warn(`writeStrorage failed`, err);
    }
}

export function removeStorage(Key:string):void{
    try{
        localStorage.removeItem(Key);
    }
    catch(err){
        console.warn(`removeStorage failed`, err);
    }
}