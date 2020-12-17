import { createWorker } from 'tesseract.js';
import { NowRequest, NowResponse } from '@vercel/node'

export default (request: NowRequest, response: NowResponse) => {
    const { url = 'https://tesseract.projectnaptha.com/img/eng_bw.png'} : any  = request.query

    const worker = createWorker({
        logger: m => console.log(`${m.status}: ${m.progress * 100}%`)
    });

    (async () => {
        await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        const { data: { text}} = await worker.recognize(url);
        response.status(200).send({status: "success", result: text})
        await worker.terminate();
    })();
}
