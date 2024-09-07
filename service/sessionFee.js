const fs = require("fs");

const getAll = (req, res) => {
    fs.readFile('./data/sessionFee.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Lỗi đọc file:', err);
            res.status(500).json({ message: 'Lỗi đọc file', error: err });
            return;
        }
        try {
            let jsonData = JSON.parse(data);
            let feeId = req.body.fee_id;
            let outputData = [];
            for (let i = 0; i < jsonData.length; i++) {
                if (jsonData[i].fee_id == feeId) {
                    outputData.push(jsonData[i]);
                }
            }
            console.log(outputData);
            
            res.json(outputData);
        } catch (err) {
            console.error('Lỗi parse JSON:', err);
            res.status(500).json({ message: 'Lỗi parse JSON', error: err });
        }
    });
};

module.exports = {
    getAll
};