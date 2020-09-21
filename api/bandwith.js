const fetch = require("node-fetch");
require("dotenv").config();

const Auth = process.env.CF_TOKEN;

/* Config */
const listEndpoint = "https://api.cloudflare.com/client/v4/zones";
const token = "Bearer " + Auth;
const fetchConfig = {
  method: "GET",
  headers: {
    Authorization: token,
  },
};

function formatBytes(bytes, decimals = 0) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

module.exports = (_req, res) => {
  global.bandwidths = [];

  /* Get all the zones */

  fetch(listEndpoint, fetchConfig)
    .then((response) => response.json())
    .then((resp) => {
      let i = 0;
      resp.result.forEach((obj) => {
        fetch(
          `https://api.cloudflare.com/client/v4/zones/${obj.id}/analytics/dashboard?since=-44640`,
          fetchConfig
        )
          .then((response) => response.json())
          .then((resp) => bandwidths.push(resp.result.totals.bandwidth.all))
          .then(() => {
            const sum = bandwidths.reduce((a, b) => a + b, 0);
            if (i++ === resp.result.length - 1) {
              res.setHeader('Cache-Control', 's-maxage=86400');
              res.status(200).send({
                status: "success",
                result: { bytes: sum, humanReadable: formatBytes(sum, 2) },
              });
            }
          });
      });
    })
    .catch((err) => console.error(err));
};
