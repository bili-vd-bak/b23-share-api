import type { VercelApiHandler } from "@vercel/node";
import { onedrive_item } from "../utils/onedrive/item";

const main: VercelApiHandler = async (req, res) => {
  const { drive, path, nextPageToken } = req.body;
  res.json(await onedrive_item({ drive, path, nextPageToken }));
};

export default main;
