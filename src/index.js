const { fs } = require("fs");
const { Client } = require("@notionhq/client");
const { NotionToMarkdown } = require("notion-to-md");

const authToken = process.env.NOTION_KEY;

const notion = new Client({ auth: authToken });
const n2m = new NotionToMarkdown({ notionClient: notion });

const getAllPages = async (databaseId) => {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
    });
    console.log(response);
    return response.results;
  } catch (error) {
    console.error(error.body);
  }
};

const convertToMd = async (client, pageList) => {
  for (let i = 0; i < pageList.length; i++) {
    const page = pageList[i];
    const pageId = page.id;
    const pageTitle = page.properties.title.title[0].plain_text + ".md";

    console.log(pageId);
    const mdBlocks = await client.pageToMarkdown(pageId);
    const mdString = client.toMarkdownString(mdBlocks);

    fs.writeFile(pageTitle, mdString, (err) => {
      console.log(err);
    });
  }
  return;
};

module.exports = async function download(url, options) {
  console.log(url);
  console.log(options);

  // const pageList = await getAllPages(url);
  // const resp = await convertToMd(n2m, pageList);
};
