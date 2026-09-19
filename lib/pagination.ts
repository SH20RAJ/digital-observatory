export const PAGE_SIZE=12;
export function getPageCount(length:number){return Math.max(1,Math.ceil(length/PAGE_SIZE));}
export function getPageItems<T>(items:T[],page:number){const start=(page-1)*PAGE_SIZE;return items.slice(start,start+PAGE_SIZE);}
export function getPageNumbers(total:number){return Array.from({length:getPageCount(total)},(_,index)=>index+1);}
