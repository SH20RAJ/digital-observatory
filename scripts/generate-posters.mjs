import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const postsDir=path.join(process.cwd(),"content","posts");
const publicDir=path.join(process.cwd(),"public");
const ogDir=path.join(publicDir,"og");
const apiDir=path.join(publicDir,"api");
fs.mkdirSync(ogDir,{recursive:true});
fs.mkdirSync(apiDir,{recursive:true});

const esc=(value)=>String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&apos;");
const wrap=(text,max=42)=>{
  const lines=[]; let line="";
  for(const word of String(text).split(/\s+/)){
    if((line+" "+word).trim().length>max&&line){lines.push(line);line=word;}else{line=(line+" "+word).trim();}
  }
  if(line) lines.push(line);
  return lines.slice(0,4);
};
const hash=(value)=>{
  let result=0;
  for(let index=0;index<value.length;index+=1) result=((result<<5)-result+value.charCodeAt(index))|0;
  return Math.abs(result);
};
const palettes=[
  {bg:"#101317",bg2:"#20364a",accent:"#8fb5ff",accent2:"#f6d58b"},
  {bg:"#101711",bg2:"#244a2e",accent:"#9fe3a8",accent2:"#f1db91"},
  {bg:"#161019",bg2:"#402448",accent:"#e8a7ff",accent2:"#ffd59a"},
  {bg:"#18110f",bg2:"#4a2b20",accent:"#ffb798",accent2:"#ffe2a0"},
  {bg:"#0f1718",bg2:"#1e4547",accent:"#8ee2d5",accent2:"#f6d77e"},
  {bg:"#101225",bg2:"#2d3c78",accent:"#a7baff",accent2:"#ffd879"}
];
const files=fs.existsSync(postsDir)?fs.readdirSync(postsDir).filter((file)=>file.endsWith(".md")):[];
const posts=[];

for(const file of files){
  const raw=fs.readFileSync(path.join(postsDir,file),"utf8");
  const {data,content}=matter(raw);
  if(data.status!=="published") continue;

  const slug=file.replace(/\.md$/,"");
  posts.push({slug,title:String(data.title||""),description:String(data.description||""),excerpt:String(data.excerpt||""),publishedAt:String(data.publishedAt||""),updatedAt:String(data.updatedAt||data.publishedAt||""),category:String(data.category||""),tags:Array.isArray(data.tags)?data.tags.map(String):[],author:String(data.author||""),readingTime:String(data.readingTime||""),content});

  const palette=palettes[hash(slug)%palettes.length];
  const titleLines=wrap(data.title);
  const titleSvg=titleLines.map((line,index)=>'<text x="80" y="'+(222+index*64)+'" font-family="Arial,sans-serif" font-size="54" font-weight="800" fill="#ffffff">'+esc(line)+"</text>").join("");
  const nodes=Array.from({length:9},(_,index)=>{
    const x=820+(index%3)*120; const y=120+Math.floor(index/3)*150; const r=index===4?26:8; const opacity=index===4?"0.98":"0.6";
    return '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+palette.accent+'" opacity="'+opacity+'"/>';
  }).join("");

  const svg='<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">'+
    '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="'+palette.bg+'"/><stop offset="1" stop-color="'+palette.bg2+'"/></linearGradient></defs>'+
    '<rect width="1200" height="630" fill="url(#g)"/>'+
    '<path d="M720 120L1080 120M720 270L1080 270M720 420L1080 420M840 80L840 540M960 80L960 540" stroke="#ffffff" stroke-width="1" opacity=".08"/>'+
    '<circle cx="960" cy="270" r="162" fill="none" stroke="'+palette.accent2+'" stroke-width="1.5" opacity=".22"/>'+
    '<circle cx="960" cy="270" r="86" fill="none" stroke="'+palette.accent+'" stroke-width="2" opacity=".35"/>'+
    nodes+
    '<text x="80" y="72" font-family="Arial,sans-serif" font-size="18" font-weight="800" letter-spacing="4" fill="'+palette.accent+'">DIGITAL OBSERVATORY</text>'+
    '<text x="80" y="108" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="#c5ced8">'+esc(data.category||"Observation")+"</text>"+
    titleSvg+
    '<text x="80" y="526" font-family="Arial,sans-serif" font-size="20" fill="#c9d0d8">'+esc(String(data.description||"").slice(0,118))+"</text>"+
    '<text x="80" y="574" font-family="Arial,sans-serif" font-size="15" fill="#94a0ad">'+esc(data.publishedAt||"")+" · Source-backed observation</text></svg>";

  fs.writeFileSync(path.join(ogDir,slug+".svg"),svg);
}

const basePath=process.env.NEXT_PUBLIC_BASE_PATH||"";
const siteUrl=(process.env.NEXT_PUBLIC_SITE_URL||"https://digital-observatory.dev").replace(/\/$/,"");
const publicBase=siteUrl+basePath;
const articleUrl=(slug)=>publicBase+"/blog/"+slug;
const apiPosts=posts.map(({content,...post})=>({...post,url:articleUrl(post.slug)}));
fs.writeFileSync(path.join(apiDir,"posts.json"),JSON.stringify({count:apiPosts.length,posts:apiPosts},null,2));

const xmlEscape=(value)=>String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&apos;");
const feedItems=posts.slice(0,30).map((post)=>"<item><title>"+xmlEscape(post.title)+"</title><link>"+articleUrl(post.slug)+"</link><guid isPermaLink=\"true\">"+articleUrl(post.slug)+"</guid><description>"+xmlEscape(post.description)+"</description><pubDate>"+new Date(post.publishedAt).toUTCString()+"</pubDate></item>").join("");
fs.writeFileSync(path.join(publicDir,"feed.xml"),'<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Digital Observatory</title><link>'+xmlEscape(publicBase)+'</link><description>Source-backed digital research.</description>'+feedItems+"</channel></rss>");

const llms=["# Digital Observatory",""," > An open-source digital observatory for tracking public signals across AI, open source, developers, startups, internet infrastructure, security, and digital culture.","","## Canonical pages","","- Home: "+publicBase,"- Journal: "+publicBase+"/blog","- About: "+publicBase+"/about","- RSS: "+publicBase+"/feed.xml","- Full index: "+publicBase+"/llms-full.txt","","## Articles",""];
for(const post of posts) llms.push("- ["+post.title+"]("+articleUrl(post.slug)+") — "+post.description.replace(/\n/g," "));
fs.writeFileSync(path.join(publicDir,"llms.txt"),llms.join("\n"));

const full=["# Digital Observatory","","Canonical site: "+publicBase,"","## Articles"];
for(const post of posts) full.push("","### "+post.title,"","URL: "+articleUrl(post.slug),"Category: "+post.category,"Published: "+post.publishedAt,"Author: "+post.author,"",post.content);
fs.writeFileSync(path.join(publicDir,"llms-full.txt"),full.join("\n"));

const urls=new Set(["/","/blog","/about","/search"]);
for(const post of posts){
  urls.add("/blog/"+post.slug);
  urls.add("/category/"+post.category.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""));
  for(const tag of post.tags) urls.add("/tag/"+tag.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""));
  urls.add("/author/"+encodeURIComponent(post.author));
}
const sitemap='<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+[...urls].map((url)=>"<url><loc>"+xmlEscape(publicBase+url)+"</loc></url>").join("")+"</urlset>";
fs.writeFileSync(path.join(publicDir,"sitemap.xml"),sitemap);
fs.writeFileSync(path.join(publicDir,"robots.txt"),"User-agent: *\nAllow: /\nDisallow: /search\n\nSitemap: "+publicBase+"/sitemap.xml\n");
console.log("Generated distinct article posters, machine indexes, RSS, sitemap, robots, and API index.");
