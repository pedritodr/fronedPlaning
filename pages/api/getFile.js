const path = require('path');
const fs = require('fs');
const appRoot = require('app-root-path');
const handler = async(req, res) => {

    const downloadPath = path.join(appRoot.path, '/template-files/', `template.csv`);
    fs.readFile(downloadPath, 'utf8', function(err, data) {
        if (err) throw err;
        res.status(200).json(data)
    });

};

export default handler;