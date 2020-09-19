const fetch = require('node-fetch');
require('dotenv').config();

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
            res.send(`${sum / 1000000000}GB`);
          }
        });
    });
  })
  .catch((err) => console.error(err));
};