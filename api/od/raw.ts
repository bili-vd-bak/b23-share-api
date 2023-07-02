import type { VercelApiHandler } from "@vercel/node";
import { onedrive_raw } from "../utils/onedrive/raw";

const main: VercelApiHandler = async (req, res) => {
  const { drive, path, raw } = req.body;
  let s = Number(req.query.s) || 0;
  const raws = await onedrive_raw({ drive, path });
  if (raws.errors) res.status(404).json(raws);
  else {
    if (!raw) res.status(200).json(raws);
    else {
      if (s > raws.dlinks.length) s = 0;
      res.status(200).redirect(raws.dlinks[s].dlink);
    }
  }
};

export default main;
