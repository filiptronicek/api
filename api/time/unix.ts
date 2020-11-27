import { NowRequest, NowResponse } from '@vercel/node';

export default (_request: NowRequest, response: NowResponse) => {
  const now = new Date().getTime();
  response.status(200).send({"status": "success", "result": now});
}
