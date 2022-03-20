import { NextApiRequest, NextApiResponse } from "next";
import { removeTokenCookie } from "../../lib/tokenlib";

const handler = (req: NextApiRequest, res: NextApiResponse) => {

    let response = {status: 'failed'}

    removeTokenCookie(res)

    res.status(200).json(response);
}

export default handler;