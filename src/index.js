const fs = require("fs");
const path = require("path");
const { Client } = require("@notionhq/client");
const { NotionToMarkdown } = require("notion-to-md");

console.warn = function () {};
console.log = function () {};
const authToken = process.env.NOTION_TOKEN;

const notion = new Client({ auth: authToken });
const n2m = new NotionToMarkdown({ notionClient: notion });

function isNotionUrl(url) {
  return url.includes("notion.so");
}

function getUUIDFromString(str) {
  const isUrl = isNotionUrl(str);
  let uuidStr;
  if (isUrl) {
    url_parse = str.split("?")[0].split("/");
    if (url_parse.length < 4) {
      console.error("It is not a valid notion url");
      process.exit(1);
    }
    uuidStr = url_parse.slice(-1)[0];
  } else {
    uuidStr = str;
  }
  if (uuidStr.length === 32 && uuidStr.indexOf("-") === -1) {
    return uuidStr;
  } else {
    uuidArray = uuidStr.split("-");
    mayUUID = uuidArray.pop();
    if (uuidArray.length > 0 && mayUUID.length === 32) {
      return mayUUID;
    } else {
      console.error("It is not a valid notion url");
      process.exit(1);
    }
  }
}

const getAllPages = async (url) => {
  const uid = getUUIDFromString(url);

  const pageList = await notion.databases
    .query({
      database_id: uid,
    })
    .then((res) => res.results)
    .catch((err) => {
      return [];
    });
  if (pageList.length === 0) {
    page = await notion.pages
      .retrieve({
        page_id: uid,
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.error(
          `${url} is not a valid notion url or page id or database id`
        );
      });
    pageList.push(page);
  }
  return pageList;
};

const convertToMd = async (client, pageList, savePath) => {
  for (let i = 0; i < pageList.length; i++) {
    const page = pageList[i];
    const pageId = page.id;
    let pageTitle = "";
    Object.values(page.properties).forEach((item) => {
      if (item.type === "title") {
        pageTitle = item.title[0].plain_text + ".md";
      }
    });

    const mdBlocks = await client.pageToMarkdown(pageId);
    const mdString = client.toMarkdownString(mdBlocks);

    if (pageTitle === "") {
      pageTitle = mdBlocks[0].parent.split(" ").slice(-1)[0] + ".md";
    }
    pagePath = path.join(savePath, pageTitle);
    fs.writeFile(pagePath, mdString, (err) => {
      if (err) {
        console.error(err);
      }
    });
  }
};

module.exports = async function download(url, options) {
  if (!authToken) {
    console.error("Please set NOTION_TOKEN as environment variable");
    process.exit(1);
  }
  const pageList = await getAllPages(url);
  const currentPath = process.cwd();
  let savePath = options.path
    ? options.path
    : pageList.length === 1
    ? ""
    : "./posts";

  // check if the path is a absolute path
  if (!path.isAbsolute(savePath)) {
    savePath = path.join(currentPath, savePath);
  }

  if (!fs.existsSync(savePath)) {
    fs.mkdirSync(savePath);
  }

  await convertToMd(n2m, pageList, savePath);
  console.info(`Successfully converted to markdown in ${savePath}.`);
};
