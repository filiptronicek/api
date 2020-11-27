import { NowRequest, NowResponse } from '@vercel/node';

export default (request: NowRequest, response: NowResponse) => {
  const now = new Date().getTime();
  const clientnow = request.query.ts;
  const clientTimeStamp = parseInt(clientnow);
  response.status(200).send({"status": "success", "result": { s: Math.round((now - clientTimeStamp) / 1000), ms: now - clientTimeStamp}});
}
