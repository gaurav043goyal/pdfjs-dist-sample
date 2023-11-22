import pdfToText from './pdf-to-text.js';

const pdfFile = "D:\\PROJECT\\ALL DATA\\New folder\\CSV Files\\3601421002_Cart\\230109_120320.pdf";

(async () => {
    const doc = await pdfToText({ file: pdfFile });
    console.log(doc);
})();



