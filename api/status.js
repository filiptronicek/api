import request from "request";

const successCodes = [200, 201, 202, 204, 301, 302, 307, 308];

export default (req, res) => {

  const urlList = req.query.url.split(",") || ["https://trnck.dev", "https://blog.trnck.dev"];

  function getStatus(url) {
    return new Promise((resolve, _reject) => {
      request(url, (error, response, _body) => {
              resolve({
                  site: url,
                  status: !error && successCodes.includes(response.statusCode)
                      ? "OK"
                      : "Down: " + error.message,
                  code: response.statusCode
              });
          });
    });
  }

  const promiseList = urlList.map((url) => getStatus(url));

  Promise.all(promiseList).then((resultList) => {
    const jsonString = ({status: "success", result: resultList });
    res.send((jsonString));
  });
};
