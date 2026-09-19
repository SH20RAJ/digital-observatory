import Link from "next/link";

export function Pagination({currentPage,totalPages,basePath}:{currentPage:number;totalPages:number;basePath:string}){
  if(totalPages<=1)return null;
  const href=(page:number)=>page===1?basePath:basePath+"/page/"+page;
  return <nav className="pagination" aria-label="Pagination">
    <div className="pagination-side">{currentPage>1?<Link href={href(currentPage-1)}>← Newer</Link>:<span aria-hidden="true">← Newer</span>}</div>
    <div className="pagination-pages">{Array.from({length:totalPages},(_,i)=>i+1).map(page=><Link key={page} href={href(page)} aria-current={page===currentPage?"page":undefined} className={page===currentPage?"pagination-current":""}>{page}</Link>)}</div>
    <div className="pagination-side">{currentPage<totalPages?<Link href={href(currentPage+1)}>Older →</Link>:<span aria-hidden="true">Older →</span>}</div>
  </nav>;
}
