import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const dir = path.join(process.cwd(), "content", "posts");
const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".md")) : [];
const errors = [];
const required = ["title","description","publishedAt","status","category","author","authorRole","sources"];

for (const file of files) {
  const parsed = matter(fs.readFileSync(path.join(dir, file), "utf8"));
  const data = parsed.data;

  for (const field of required) {
    if (data[field] === undefined || data[field] === null || data[field] === "") errors.push(file + ": missing " + field);
  }

  if (!["draft","published"].includes(String(data.status))) errors.push(file + ": status must be draft or published");
  if (String(data.description || "").length < 40) errors.push(file + ": description is too short");
  if (!Array.isArray(data.sources) || data.sources.length < 1) errors.push(file + ": add at least one source");

  if (Array.isArray(data.sources)) {
    for (const source of data.sources) {
      try { new URL(String(source?.url || "")); }
      catch { errors.push(file + ": invalid source URL"); }
    }
  }

  if (/[\uE200-\uE20F]/.test(fs.readFileSync(path.join(dir, file), "utf8"))) {
    errors.push(file + ": contains raw AI citation unicode artifacts (\\uE200-\\uE20F). Clean them into Markdown links.");
  }
  if (parsed.content.trim().length < 500) errors.push(file + ": article body is too short");
}

if (errors.length) {
  console.error("Content validation failed:");
  for (const error of errors) console.error(" - " + error);
  process.exit(1);
}

console.log("Content validation passed for " + files.length + " article(s).");