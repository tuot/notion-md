# notion-md

> Convert and download notion pages command tool.

## Notion token
 - Create a [notion token](https://www.notion.so/my-integrations)
 - Share your page to the integration
 - Then save token as your os environment variable

    ```bash
    export NOTION_TOKEN="{your integration token key}"
    ```

## Install 

 - Use npm or yarn

    ```bash
    $ npm install -g notion-md
    ```


## Usage

- Download pages

    ```
    notion-md download <your notion page url>

    notion-md download <database id>

    notion-md download <page id>

    ```
- Specify the output directory

    ```
    notion-md download <your notion page url> --path <output directory>

    notion-md download <database id> --path <output directory>

    notion-md download <page id> --path <output directory>

    ```