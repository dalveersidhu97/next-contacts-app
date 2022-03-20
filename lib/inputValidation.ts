export function anyEmpty(...params: string[]) {
    for(const p of params){
        if(!p || p.trim() == '')
            return true
    }
    return false;
}
