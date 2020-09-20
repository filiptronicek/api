import request from "request";

const urlList = ["https://trnck.dev", "https://blog.trnck.dev"];

export default (_req, res) => {
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

  let promiseList = urlList.map((url) => getStatus(url));

  Promise.all(promiseList).then((resultList) => {
    const jsonString = ({ ...resultList });
    res.send((jsonString));
  });
};
