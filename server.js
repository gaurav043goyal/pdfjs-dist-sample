import pdfToText from './pdf-to-text.js';

const pdfFile = "./WASHER_3600001234_24_instrument.pdf";
//const pdfFile = "./Quick_0000000001.pdf";

(async () => {
    const doc = await pdfToText({ file: pdfFile });
    console.log(doc);
})();



