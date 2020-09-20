import request from "request";


export default (req, res) => {

  const urlList = req.query.url.split(",") || ["https://trnck.dev", "https://blog.trnck.dev"];

  function getStatus(url) {
    return new Promise((resolve, _reject) => {
      request(url, (error, response, _body) => {
              resolve({
                  site: url,
                  status: !error && response.statusCode === 200
                      ? "OK"
                      : "Down: " + error.message,
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
