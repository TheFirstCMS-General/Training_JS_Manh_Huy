const fs = require("fs");

const getAll = (req, res) => {
    fs.readFile('./data/fee.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Lỗi đọc file:', err);
            res.status(500).json({ message: 'Lỗi đọc file', error: err });
            return;
        }
        try {
            let jsonData = JSON.parse(data);
            
            const today = new Date();

            jsonData.sort((a, b) => {
                const deadlineA = new Date(a.payment_deadline);
                const deadlineB = new Date(b.payment_deadline);

                const timeGapA = today.getTime() - deadlineA.getTime();
                const timeGapB = today.getTime() - deadlineB.getTime();

                return timeGapB - timeGapA;
            });
            res.json(jsonData);
        } catch (err) {
            console.error('Lỗi parse JSON:', err);
            res.status(500).json({ message: 'Lỗi parse JSON', error: err });
        }
    });
};

const insertRecord = (req, res) => {
    fs.readFile('./data/fee.json', 'utf8', (err, fee) => {
        if (err) {
            console.error('Lỗi đọc file:', err);
            res.status(500).json({ message: 'Lỗi đọc file', error: err });
            return;
        }
        try {
            let feeData = JSON.parse(fee);
            let feeDataLength = feeData.length;
            let bodyReq = req.body;
            let nextFeeId = feeData[feeDataLength - 1].id + 1;
            bodyReq.id = nextFeeId;

            fs.readFile('./data/sessionFee.json', 'utf8', (err, sessionFee) => {
                if (err) {
                    console.error('Lỗi đọc file:', err);
                    res.status(500).json({ message: 'Lỗi đọc file', error: err });
                    return;
                }
                try {
                    let sessionFeeData = JSON.parse(sessionFee);
                    let sessionFeeDataLength = sessionFeeData.length;

                    let sessionFeeReq = req.body.session_fee;
                    let paymentDeadline = sessionFeeReq[0].deadline;
                    let maxDate = new Date(paymentDeadline);
                    let maxDateTime = maxDate.getTime();
                    for (let i = 0; i < sessionFeeReq.length; i++) {
                        let nextSessionFeeId = sessionFeeData[sessionFeeDataLength - 1].id + (i + 1);
                        let itemDeadline = new Date(sessionFeeReq[i].deadline);
                        let itemDeadlineTime = itemDeadline.getTime();
                        if (itemDeadlineTime > maxDateTime) {
                            paymentDeadline = sessionFeeReq[i].deadline;
                        }
                        sessionFeeReq[i].id = nextSessionFeeId;
                        sessionFeeReq[i].fee_id = nextFeeId;
                        sessionFeeData.push(sessionFeeReq[i]);
                    }
                    bodyReq.payment_deadline = paymentDeadline;
                    delete bodyReq.session_fee;

                    console.log(bodyReq, paymentDeadline);

                    feeData.push(bodyReq)

                    let jsonStringFee = JSON.stringify(feeData);
                    fs.writeFileSync('./data/fee.json', jsonStringFee, 'utf-8', (err) => {
                        if (err) throw err;
                    });

                    let jsonStringSessionFee = JSON.stringify(sessionFeeData);

                    fs.writeFileSync('./data/sessionFee.json', jsonStringSessionFee, 'utf-8', (err) => {
                        if (err) throw err;
                    });
                } catch (err) {
                    console.error('Lỗi parse JSON:', err);
                    res.status(500).json({ message: 'Lỗi parse JSON', error: err });
                }
            });
            res.status(200).json({ message: 'Thêm mới khoản phí thành công' });
        } catch (err) {
            console.error('Lỗi parse JSON:', err);
            res.status(500).json({ message: 'Lỗi parse JSON', error: err });
        }
    });
}

const deleteRecord = (req, res) => {
    fs.readFile('./data/fee.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Lỗi đọc file:', err);
            res.status(500).json({ message: 'Lỗi đọc file', error: err });
            return;
        }
        try {
            let jsonData = JSON.parse(data);

            let feeId = req.params.id;
            const feeIndex = jsonData.findIndex(fee => fee.id == feeId);
            if (feeIndex !== -1) {
                jsonData.splice(feeIndex, 1);
                fs.writeFileSync('./data/fee.json', JSON.stringify(jsonData), 'utf-8');
                res.status(200).json({
                    "message": "Xóa khoản phí thành công"
                });
            } else {
                res.status(400).json({
                    "message": "Khoản phí không tồn tại"
                });
            }
        } catch (err) {
            console.error('Lỗi parse JSON:', err);
            res.status(500).json({ message: 'Lỗi parse JSON', error: err });
        }
    });
}
module.exports = {
    getAll, insertRecord, deleteRecord
};