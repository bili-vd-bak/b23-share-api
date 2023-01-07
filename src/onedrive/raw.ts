import fetch from "node-fetch";
import { getAccessTokens } from "./getAccessToken";
import { wrapPath } from "./pathHandler";

/*const {
  drive_api = 'https://graph.microsoft.com/v1.0/me/drive',
} = process.env*/

async function getRaw(drive_api: string, path: string, access_token: any) {
  // const requestUrl = `${drive_api}${wrapPath(path, '/children')}?select=@microsoft.graph.downloadUrl,name,size,lastModifiedDateTime,file&$top=${top}`
  const requestUrl = `${drive_api}${wrapPath(
    path,
    "/children"
  )}?select=@microsoft.graph.downloadUrl`;
  console.log(requestUrl);
  const res = await fetch(requestUrl, {
    headers: {
      Authorization: `bearer ${access_token}`,
    },
  });
  return await res.json();
}

export async function onedrive_raw({ path = "", drive = "" }) {
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
    if (drive) {
      if (i[0] === drive) {
        const data = await getRaw(i[3], path, access_token);
        if (data["@content.downloadUrl"]) {
          const downloadUrl = data["@content.downloadUrl"];
          arr1.push({ sharelink: i[0], dlink: downloadUrl });
        }
      }
    } else {
      const data = await getRaw(i[3], path, access_token);
      if (data["@content.downloadUrl"]) {
        const downloadUrl = data["@content.downloadUrl"];
        arr1.push({ sharelink: i[0], dlink: downloadUrl });
      }
    }
  }
  if (arr1.length === 0)
    return {
      errors: [
        {
          message: "Drive is not available.",
        },
      ],
    };
  return { dlinks: arr1 };
}
