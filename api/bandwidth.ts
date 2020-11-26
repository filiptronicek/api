import { NowResponse } from '@vercel/node';
import fetch from "node-fetch";
require("dotenv").config();

const CFAuth: string | undefined = process.env.CF_TOKEN;
const VCAuth: string | undefined = process.env.VC_TOKEN;

/* Config */
const listEndpoint : string = "https://api.cloudflare.com/client/v4/zones";
const vercelEndpoint : string = "https://vercel.com/api/pricing/state/usage";

const vercelToken : string = `Bearer ${VCAuth}`;
const VercelFetchConfig : object = {
  method: "GET",
  headers: {
    Authorization: vercelToken,
  },
};

const cloudflareToken : string = `Bearer ${CFAuth}`;
const CloudFlareFetchConfig : object = {
  method: "GET",
  headers: {
    Authorization: cloudflareToken,
  },
};

function formatBytes(bytes : number, decimals : number = 0) : string {
  if (bytes === 0) return "0 Bytes";
  const k : number = 1024;
  const dm : number = decimals < 0 ? 0 : decimals;
  const sizes : string[] = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i : number = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export default (_req, res: NowResponse) => {
  const CloudFlareBandwidths : number[] = [];

  fetch(vercelEndpoint, VercelFetchConfig)
    .then((responce) => responce.json())
    .then((Vresp) => {
      const VCband : number = Vresp.metrics.bandwidth.rx + Vresp.metrics.bandwidth.tx;

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
              .then((resp) =>
                CloudFlareBandwidths.push(resp.result.totals.bandwidth.all)
              )
              .then(() => {
                const CloudFlareSum : number = CloudFlareBandwidths.reduce(
                  (a, b) => a + b,
                  0
                );
                const total : number = CloudFlareSum + VCband;
                if (i++ === resp.result.length - 1) {
                  res.setHeader("Cache-Control", "s-maxage=86400");
                  res.status(200).send({
                    status: "success",
                    result: {
                      bytes: total,
                      humanReadable: formatBytes(total, 2),
                    },
                  });
                }
              });
          });
        });
    });
};
