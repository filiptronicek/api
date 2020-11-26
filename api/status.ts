import { NowResponse } from '@vercel/node';
import request from "request";

const successCodes = [200, 201, 202, 204, 301, 302, 307, 308];

export default (req: any, res: NowResponse) => {

  const urlList = req.query.url && req.query.url.split(",") || ["https://trnck.dev", "https://blog.trnck.dev"];

  function getStatus(url: string): any {
    return new Promise((resolve, _reject) => {
      request(url, (error: any, response: any, _body: string) => {
              resolve({
                  site: url,
                  status: !error && successCodes.includes(response.statusCode)
                      ? "OK"
                      : "Down: " + error.message,
              });
          });
    });
  }

  const promiseList = urlList.map((url: string) => getStatus(url));

  Promise.all(promiseList).then((resultList) => {
    const jsonString = ({status: "success", result: resultList });

    /* Lambda responce */

    res.setHeader('Cache-Control', 's-maxage=86400');
    res.status(200).send(jsonString);
  });
};
