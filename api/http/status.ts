import { NowResponse } from '@vercel/node';

export default (req: any, res: NowResponse) => {
    const code = req.query.code;

    if (code >= 100 && code < 600) {
        res.status(code);
        res.send(`yay! Mocked HTTP ${code}`);
    } else {
        res.status(400).send("Bad format");
    }
}