export function SearchForm({ defaultValue = "" }: { defaultValue?: string }) {
  return <form action="/search" className="search-form" role="search">
    <label htmlFor="site-search">Search the observatory</label>
    <div className="search-row"><input id="site-search" name="q" defaultValue={defaultValue} placeholder="AI, GitHub, security, internet..." /><button type="submit">Search</button></div>
  </form>;
}