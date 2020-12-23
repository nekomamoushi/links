const fs = require("fs");
const axios = require("axios");

const readMe = fs.readFileSync("README.md", "utf-8");

const link = /\[(.*?)\]\((.*?)\)/gim;

let matched_links = readMe.match(link);

matched_links = matched_links.map((link) => {
  return link.replace(/(\[.*\])\(([^\)]+)\)/i, "$2");
});

const urls = matched_links.map((url) => {
  return axios.get(url);
});

Promise.all(urls).then((result) => {
  const results = result
    .filter((r) => r.status === 404)
    .map((r) => ({ url: r.config.url, status: r.status }));
  if (results.length > 0) {
    console.table(results);
  } else {
    console.log("No broken links !!!");
  }
});
