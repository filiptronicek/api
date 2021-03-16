import { NowResponse } from '@vercel/node';
import fetch from "node-fetch";

export default (_req: any, res: NowResponse) => {
   fetch("https://interclip.app/includes/size.json").then((r) => {
       if (r.ok) {
           const responce = r.json();
           return responce;
       } else {
           return null;
       }
   }).then(resp => {
       if (resp === null) {
           res.send({status: "error", result: "Error in fetching file stats"})
       } else {
            res.send(resp);
       }
   })
}