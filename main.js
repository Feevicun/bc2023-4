const express = require("express");
const PORT = 8000;
const app = express();
const fs = require("fs");
const xml2js = require("xml2js");

const parser = new xml2js.Parser();

function minFunc(arr) {
    let minVal = arr[0].value;
    for (let i = 1; i < arr.length; i++) {
        if (arr[i].value < minVal)
            minVal = arr[i].value;
    }
    return minVal;
}

app.get("/", (req, res) => {
    fs.readFile("data.xml", (err, data) => {
        if (err !== null)
            res.status(400).send('Invalid XML format');
        parser.parseString(data, (err, result) => {
            if (err) {
                res.status(400).send('Invalid XML format');
            } else {
                const minVal = minFunc(result.indicators.res);
                const xmlData = {
                    data: {
                        min_value: minVal
                    }
                };
                const builder = new xml2js.Builder();
                const finalXml = builder.buildObject(xmlData);
                res.send(finalXml);
            }
        });
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущено на порті ${PORT}`);
});
