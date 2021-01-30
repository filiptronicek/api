import { NowResponse } from '@vercel/node';
import fetch from "node-fetch";

export default (req: any, res: NowResponse) => {

    const start = Date.now();
    fetch(req.query.url).then((responce => {
        const statusCode: number = responce.status;
        res.send({status: "success", result: {miliseconds: (Date.now() - start), code: statusCode }})
    })).catch((err) => {
        res.send({status: "error", result: err })
    });
}