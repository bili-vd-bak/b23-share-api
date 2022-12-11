import fetch from "node-fetch";
import sstore from "@beetcb/sstore";
import request from "../utils/tiny-request";

const {
  client_id = "",
  client_secret = "",
  redirect_uri = "http://localhost:3000",
  auth_endpoint = "https://login.microsoftonline.com/common/oauth2/v2.0",
} = process.env;

const timestamp = () => (Date.now() / 1000) | 0;
const checkExpired = (expires_at: number) => {
  if (timestamp() > expires_at) {
    console.info("Token expired.");
    return true;
  }
};

/**
 * 返回参数：\
 * {t: number时间, r: [][]}\
 * r下4个string\
 * [分享链接，组织sharepoint域名，token，本次请求api]
 * @returns {*}
 */

export async function getAccessTokens(): Promise<{
  t: number;
  r: [string, string, string, string][];
}> {
  //sstore.clear();
  if (!sstore.get("refresh")) {
    sstore.set("refresh", JSON.stringify({ t: 0, r: [] }));
    sstore.close;
  }
  if (!sstore.get("access")) {
    sstore.set("access", JSON.stringify({ t: 0, r: [] }));
    sstore.close;
  }
  let refresh: { t: number; r: [string, string, string, string][] } =
    JSON.parse(sstore.get("refresh"));
  let access: { t: number; r: [string, string, string, string][] } = JSON.parse(
    sstore.get("access")
  );
  if (checkExpired(refresh.t)) {
    await fetch(
      "https://cdn.jsdelivr.net/gh/bili-vd-bak/b23-share@main/linklist.json"
    )
      .then((res) => res.json())
      .then(async (res) => {
        let arr1: [string, string][] = [];
        for (const sharelink of res) {
          await fetch(sharelink, {
            headers: {
              cookie: "",
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:69.0) Gecko/20100101 Firefox/69.0",
            },
            redirect: "manual",
          }).then((res) => {
            const cookie = res.headers.get("set-cookie") || "";
            /*const real_cookie = cookie
              .replace(/expires=(.+?);\s/gi, "")
              .replace(/path=\/(,?)(\s?)/gi, "")
              .trim();*/
            arr1.push([sharelink, cookie]);
          });
        }
        let arr2: [string, string, string, string][] = [];
        for (const CookieWithLink of arr1) {
          const sl = new URL(CookieWithLink[0]);
          const pathnames = sl.pathname.split("/");
          const path = `/${pathnames[3]}/${pathnames[4]}/`;
          arr2.push([CookieWithLink[0], sl.origin, path, CookieWithLink[1]]);
        }
        sstore.set(
          "refresh",
          JSON.stringify({ t: timestamp() + 86400, r: arr2 })
        );
        sstore.close();
        refresh = JSON.parse(sstore.get("refresh"));
      })
      .catch((err) => console.error(err));
  }
  if (checkExpired(access.t)) {
    let arr3: [string, string, string, string][] = [];
    for (const Links of refresh.r) {
      const url = `${Links[1]}${Links[2]}_api/web/GetListUsingPath(DecodedUrl=@a1)/RenderListDataAsStream`;
      const config = {
        headers: {
          origin: Links[1],
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:69.0) Gecko/20100101 Firefox/69.0",
          Cookie: Links[3],
        },
        params: {
          "@a1": `'${Links[2]}Documents'`,
          RootFolder: `${Links[2]}Documents/`,
          TryNewExperienceSingle: "TRUE",
        },
      };
      const data = {
        parameters: {
          ViewXml: `<View ><Query><OrderBy><FieldRef Name="LinkFilename" Ascending="true"></FieldRef></OrderBy></Query><ViewFields>
<FieldRef Name="CurrentFolderSpItemUrl"/>
<FieldRef Name="FileLeafRef"/>
<FieldRef Name="FSObjType"/>
<FieldRef Name="SMLastModifiedDate"/>
<FieldRef Name="SMTotalFileStreamSize"/>
<FieldRef Name="SMTotalFileCount"/>
</ViewFields><RowLimit Paged="TRUE">20</RowLimit></View>`,
          RenderOptions: 136967,
          AllowMultipleValueFilterForTaxonomyFields: true,
          AddRequiredFields: true,
        },
      };
      const res = await request.post(url, data, config);
      arr3.push([
        Links[0],
        Links[1],
        res.data?.ListSchema[".driveAccessToken"].slice(13),
        res.data?.ListSchema[".driveUrl"],
      ]);
    }
    sstore.set("access", JSON.stringify({ t: timestamp() + 3600, r: arr3 }));
    sstore.close();
    access = JSON.parse(sstore.get("access"));
  }
  return access;
}
