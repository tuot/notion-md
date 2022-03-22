import fs from "fs"
import { Client } from "@notionhq/client";
import { config } from "./config.js";
import { NotionToMarkdown } from "notion-to-md";


const notion = new Client({ auth: config.authToken });
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

const pageList = await getAllPages(config.databaseId);
const resp = await convertToMd(n2m, pageList);
