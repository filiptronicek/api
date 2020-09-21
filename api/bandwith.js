const fetch = require("node-fetch");
require("dotenv").config();

const CFAuth = process.env.CF_TOKEN;
const VCAuth = process.env.VC_TOKEN;

/* Config */
const listEndpoint = "https://api.cloudflare.com/client/v4/zones";
const vercelEndpoint = "https://vercel.com/api/pricing/state/usage";

const vercelToken = `Bearer ${VCAuth}`;
const VercelFetchConfig = {
  method: "GET",
  headers: {
    Authorization: vercelToken,
  },
};

const cloudflareToken = `Bearer ${CFAuth}`;
const CloudFlareFetchConfig = {
  method: "GET",
  headers: {
    Authorization: cloudflareToken,
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

  fetch(vercelEndpoint, VercelFetchConfig)
    .then((responce) => responce.json())
    .then((Vresp) => {
      const VCband = Vresp.metrics.bandwidth.rx + Vresp.metrics.bandwidth.tx;

      /* Get all the zones */

      fetch(listEndpoint, CloudFlareFetchConfig)
        .then((response) => response.json())
        .then((resp) => {
          let i = 0;
          resp.result.forEach((obj) => {
            fetch(
              `https://api.cloudflare.com/client/v4/zones/${obj.id}/analytics/dashboard?since=-44640`,
              CloudFlareFetchConfig
            )
              .then((response) => response.json())
              .then((resp) => bandwidths.push(resp.result.totals.bandwidth.all))
              .then(() => {
                const sum = bandwidths.reduce((a, b) => a + b, 0);
                const total = sum + VCband;
                if (i++ === resp.result.length - 1) {
                  res.setHeader("Cache-Control", "s-maxage=86400");
                  res.status(200).send({
                    status: "success",
                    result: { bytes: total, humanReadable: formatBytes(total, 2) },
                  });
                }
              });
          });
        })
        .catch((err) => console.error(err));
    });
};
