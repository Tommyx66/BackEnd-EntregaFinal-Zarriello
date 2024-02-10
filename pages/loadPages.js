const fs = require ('fs');
const path = require ('path');

function readHtmlLFile(htmlFile) {        
    const fileData =  fs.readFileSync(`${path.join(__dirname, `${htmlFile}.html`)}`, 'utf-8');
    return fileData;
}

const mainPage = readHtmlLFile('mainPage');
const adminPage = readHtmlLFile('adminPage');

module.exports = { mainPage, adminPage };
