import { VercelRequest, VercelResponse } from "@vercel/node";
import { getAccessTokens } from "../onedrive/getAccessToken";
import { onedrive_item } from "../onedrive/item";
import { onedrive_raw } from "../onedrive/raw";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  //res.send(await getAccessTokens());
  res.send(await onedrive_item({drive:"https://xrzcloud-my.sharepoint.com/:f:/g/personal/repository_xrzyun_ml/Egzw0ugxHrpCkFUA9CMyFDsB-3WxRaYj_E46k4Scn8BHkQ?e=AqGU4p",path:"/index/",nextPageToken:"UGFnZWQ9VFJVRSZwX1NvcnRCZWhhdmlvcj0wJnBfRmlsZUxlYWZSZWY9YW5pbWFkLmpzb24uMyZwX0lEPTQ4NjA"}));
  //res.send(await onedrive_raw({ path: "/index/bangumi.db" }));
}
