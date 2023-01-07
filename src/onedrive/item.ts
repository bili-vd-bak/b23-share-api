import fetch from "node-fetch";
import { wrapPath } from "./pathHandler";
import { getAccessTokens } from "./getAccessToken";

/*const {
  top = 500,
  drive_api = 'https://graph.microsoft.com/v1.0/me/drive',
} = process.env*/

const top = 20;

async function getItem(
  drive_api: string,
  path: string,
  nextPageToken: string,
  access_token: any
): Promise<Object> {
  const requestUrl =
    `${drive_api}${wrapPath(
      path,
      "/children"
    )}?select=name,size,lastModifiedDateTime,file,folder&$top=${top}` +
    (nextPageToken ? `&$skiptoken=${nextPageToken}` : "");
  console.log(requestUrl);
  const res = await fetch(requestUrl, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${access_token}`,
    },
  });
  return (await res.json()) as Object;
}

function DataHandler(data: any) {
  delete data["@odata.context"];
  if (data["@odata.nextLink"]) {
    data["nextPageToken"] = new URL(data["@odata.nextLink"]).searchParams.get(
      "$skiptoken"
    );
  }
  delete data["@odata.nextLink"];
  if ("value" in data) {
    for (const i of data.value) {
      delete i["@odata.etag"];
      if ("file" in i) delete i["file"]["hashes"];
    }
  } else {
    delete data["@odata.etag"];
    if ("file" in data) delete data["file"]["hashes"];
  }
  return data;
}

export async function onedrive_item({
  drive = "",
  path = "",
  nextPageToken = "",
}): Promise<Object> {
  const access_tokens = await getAccessTokens();
  if (!access_tokens) {
    console.error("access_token is empty.");
    return {
      errors: [
        {
          message: "Access token is not available.",
        },
      ],
    };
  }

  let arr1 = [];
  for (const i of access_tokens.r) {
    const access_token = i[2];
    let data: any;
    if (drive) {
      if (i[0] === drive) {
        data = await getItem(i[3], path, nextPageToken, access_token);
        data = DataHandler(data);
      }
    } else {
      data = await getItem(i[3], path, "", access_token);
      data = DataHandler(data);
    }
    if (!data) data = { value: [] };
    arr1.push({ sharelink: i[0], folder: data });
  }
  if (arr1.length === 0)
    return {
      errors: [
        {
          message: "Drive is not available.",
        },
      ],
    };

  return { items: arr1 };
}
