import pdfjs from 'pdfjs-dist';
import fs from 'fs/promises';
import * as pdfWorker from 'pdfjs-dist/build/pdf.worker.js';

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

const TRANSFORMS = {
    X: 4,
    Y: 5
};

const pdfToText = async function ({ file, dataBuffer, startPage = 1, endPage = Number.MAX_VALUE, columnSeparator = '', rowSeparator = '\n', renderOptions, addStartingSpace = 4 }) {
    try {
        if (file) {
            dataBuffer = Uint8Array.from(await fs.readFile(file));
        }
        const doc = await pdfjs.getDocument(dataBuffer).promise;
        const result = {
            version: pdfjs.version,
            numPages: doc.numPages,
            metaData: await doc.getMetadata(),
        }
        result.info = result.metaData.info;

        endPage = Math.min(endPage, doc.numPages);

        const text = [];

        for (let pageNumber = startPage; pageNumber <= endPage; pageNumber++) {
            const page = await doc.getPage(pageNumber);

            const textContent = await page.getTextContent({
                ...renderOptions
            });
            let lastY, row = [];
            const pageText = [];
            for (const item of textContent.items) {
                if (lastY !== item.transform[TRANSFORMS.Y]) {
                    row = [];
                    pageText.push(row);
                    lastY = item.transform[TRANSFORMS.Y];
                    if (addStartingSpace && item.transform[TRANSFORMS.X] > addStartingSpace) {
                        row.push(' ');
                    }
                }
                row.push(item.str);
            }

            text.push(...pageText.map(row => row.join(columnSeparator)));
        }
        doc.destroy();
        result.text = text.join(rowSeparator);

        return result;
    } catch (err) { console.log(`Error while extracting pdf doc ${err} : File name  ${file}`); }
}

export default pdfToText;