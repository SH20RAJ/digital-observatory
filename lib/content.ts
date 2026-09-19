import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

export type Source={label:string;url:string;note?:string};
export type Post={slug:string;title:string;description:string;excerpt:string;publishedAt:string;updatedAt:string;status:"draft"|"published";category:string;tags:string[];author:string;authorRole:string;featured:boolean;coverImage?:string;coverAlt?:string;keywords:string[];canonicalUrl?:string;noIndex:boolean;sources:Source[];readingTime:string;wordCount:number;content:string;headings:{id:string;text:string;depth:number}[]};

const POSTS_DIR=path.join(process.cwd(),"content","posts");
let cachedPosts:Post[]|null=null;

function normalizeDate(value:unknown){if(!value)return "";if(value instanceof Date)return value.toISOString().slice(0,10);return String(value);}
function normalizeArray(value:unknown):string[]{if(Array.isArray(value))return value.map(String).map(x=>x.trim()).filter(Boolean);if(typeof value==="string")return value.split(",").map(x=>x.trim()).filter(Boolean);return [];}
function slugify(value:string){return value.toLowerCase().trim().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");}
function stripMarkdown(value:string){return value.replace(/\x60{3}[\s\S]*?\x60{3}/g," ").replace(/!\[[^\]]*\]\([^)]*\)/g," ").replace(/\[[^\]]*\]\([^)]*\)/g," ").replace(/[#>*_~|-]/g," ").replace(/\s+/g," ").trim();}
function makeExcerpt(content:string){const paragraphs=content.split(/\n\s*\n/).map(stripMarkdown).filter(Boolean);return paragraphs.find(x=>x.length>80)||paragraphs[0]||"";}
function makeHeadings(content:string){return content.split("\n").map(line=>{const match=line.match(/^(#{2,3})\s+(.+)$/);if(!match)return null;const text=match[2].replace(/[*_]/g,"").trim();return{id:slugify(text),text,depth:match[1].length};}).filter((x):x is {id:string;text:string;depth:number}=>Boolean(x));}
export function sanitizeMarkdown(value: string): string {
  if (!value) return "";
  return value
    .replace(/[\uE200-\uE20F]url[\uE200-\uE20F]([^\uE200-\uE20F]*?)[\uE200-\uE20F]([^\uE200-\uE20F]*?)[\uE200-\uE20F]/g, "[$1]($2)")
    .replace(/[\uE200-\uE20F]cite[\uE200-\uE20F][^\uE200-\uE20F]*?[\uE200-\uE20F]/g, "")
    .replace(/[\uE200-\uE20F]/g, "");
}

function parsePost(fileName:string):Post{
  const raw=fs.readFileSync(path.join(POSTS_DIR,fileName),"utf8"); const parsed=matter(raw); const data=parsed.data as Record<string,unknown>; const slug=fileName.replace(/\.(md|mdown|markdown)$/i,""); const content=sanitizeMarkdown(parsed.content.trim()); const stats=readingTime(content);
  const sources=Array.isArray(data.sources)?data.sources.map(rawSource=>{const source=rawSource as Record<string,unknown>;return{label:String(source.label||""),url:String(source.url||""),note:source.note?String(source.note):undefined};}).filter(source=>source.label&&source.url):[];
  return{slug,title:String(data.title||slug),description:String(data.description||data.excerpt||"").trim(),excerpt:String(data.excerpt||makeExcerpt(content)).slice(0,320),publishedAt:normalizeDate(data.publishedAt),updatedAt:normalizeDate(data.updatedAt||data.publishedAt),status:data.status==="draft"?"draft":"published",category:String(data.category||"Observatory"),tags:normalizeArray(data.tags),author:String(data.author||"Digital Observatory"),authorRole:String(data.authorRole||"Editorial & Research"),featured:Boolean(data.featured),coverImage:data.coverImage?String(data.coverImage):undefined,coverAlt:data.coverAlt?String(data.coverAlt):undefined,keywords:normalizeArray(data.keywords),canonicalUrl:data.canonicalUrl?String(data.canonicalUrl):undefined,noIndex:Boolean(data.noIndex),sources,readingTime:stats.text,wordCount:stats.words,content,headings:makeHeadings(content)};
}
function fileNames(){if(!fs.existsSync(POSTS_DIR))return[];return fs.readdirSync(POSTS_DIR).filter(f=>/\.(md|mdown|markdown)$/i.test(f));}
function parseAllPosts(){if(cachedPosts)return cachedPosts;cachedPosts=fileNames().map(parsePost).sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt)||b.slug.localeCompare(a.slug));return cachedPosts;}
export function getAllPosts(options:{includeDrafts?:boolean}={}){return parseAllPosts().filter(post=>options.includeDrafts||(post.status==="published"&&!post.noIndex));}
export function getPostBySlug(slug:string,options:{includeDrafts?:boolean}={}){const safeSlug=path.basename(slug);const post=parseAllPosts().find(item=>item.slug===safeSlug);if(!post)return null;if(!options.includeDrafts&&(post.status!=="published"||post.noIndex))return null;return post;}
export function getRelatedPosts(post:Post,limit=3){return getAllPosts().filter(item=>item.slug!==post.slug).map(item=>({item,score:(item.category===post.category?4:0)+item.tags.filter(tag=>post.tags.includes(tag)).length*2+(item.featured?1:0)})).sort((a,b)=>b.score-a.score||b.item.publishedAt.localeCompare(a.item.publishedAt)).slice(0,limit).map(entry=>entry.item);}
export function getCategories(){return[...new Set(getAllPosts().map(post=>post.category))].sort();}
export function getTags(){return[...new Set(getAllPosts().flatMap(post=>post.tags))].sort();}
export function categorySlug(category:string){return slugify(category);}
export function tagSlug(tag:string){return slugify(tag);}
export function findPosts(query:string){const q=query.trim().toLowerCase();if(!q)return getAllPosts();return getAllPosts().filter(post=>[post.title,post.description,post.excerpt,post.category,post.author,post.tags.join(" "),post.keywords.join(" "),stripMarkdown(post.content)].join(" ").toLowerCase().includes(q));}
