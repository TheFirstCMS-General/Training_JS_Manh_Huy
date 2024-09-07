const fs = require("fs");
const XLSX = require('xlsx');
const path = require('path');
const { json } = require("express");

const getAll = (req, res) => {

    fs.readFile('./data/student.json', 'utf8', (err, std) => {
        if (err) {
            console.error('Lỗi đọc file:', err);
            res.status(500).json({ message: 'Lỗi đọc file', error: err });
            return;
        }
        try {
            let stdData = JSON.parse(std);
            fs.readFile('./data/fee.json', 'utf8', (err, fee) => {
                if (err) {
                    console.error('Lỗi đọc file:', err);
                    res.status(500).json({ message: 'Lỗi đọc file', error: err });
                    return;
                }
                try {
                    let deadline;
                    let feeData = JSON.parse(fee);
                    let currentFeeId = req.body.fee_id;

                    for (let i = 0; i < feeData.length; i++) {
                        if (currentFeeId == feeData[i].id) {
                            deadline = new Date(feeData[i].payment_deadline);
                        }
                    }
                    fs.readFile('./data/studentFee.json', 'utf8', (err, stdFee) => {
                        if (err) {
                            console.error('Lỗi đọc file:', err);
                            res.status(500).json({ message: 'Lỗi đọc file', error: err });
                            return;
                        }
                        try {
                            let today = new Date();
                            let stdFeeData = JSON.parse(stdFee);
                            for (let i = 0; i < stdData.length; i++) {
                                stdData[i].paid_amount = 0;
                                stdData[i].completed_status = 0;
                                for (let j = 0; j < stdFeeData.length; j++) {

                                    if (stdData[i].id == stdFeeData[j].user_id && stdFeeData[j].fee_id == currentFeeId) {
                                        stdData[i].paid_amount = stdFeeData[j].paid_amount;
                                        stdData[i].completed_status = stdFeeData[j].completed_status;
                                    }

                                    if (deadline.getTime() - today.getTime() < 0 && stdData[i].completed_status == 0) {
                                        stdData[i].payment_status = 4
                                    } else if (deadline.getTime() - today.getTime() > 0 && deadline.getTime() - today.getTime() < 24 * 3600 * 1000 * 3 && stdData[i].completed_status == 0) {
                                        stdData[i].payment_status = 3
                                    } else if (deadline.getTime() - today.getTime() > 24 * 3600 * 1000 * 3 && stdData[i].completed_status == 0) {
                                        stdData[i].payment_status = 2
                                    } else stdData[i].payment_status = 1
                                }
                            }

                            stdData.sort((a, b) => b.payment_status - a.payment_status);

                            let keyword = req.body.keyword;
                            let outputData = [];
                            if (keyword && keyword.trim()) {
                                outputData = stdData.filter(item =>
                                    item.name.toLowerCase().includes(keyword.toLowerCase())
                                );
                            } else {
                                outputData = stdData;
                            }

                            res.json(outputData);
                        } catch (err) {
                            console.error('Lỗi parse JSON:', err);
                            res.status(500).json({ message: 'Lỗi parse JSON', error: err });
                        }
                    });
                } catch (err) {
                    console.error('Lỗi parse JSON:', err);
                    res.status(500).json({ message: 'Lỗi parse JSON', error: err });
                }
            });
        } catch (err) {
            console.error('Lỗi parse JSON:', err);
            res.status(500).json({ message: 'Lỗi parse JSON', error: err });
        }
    });
};

const insertRecord = (req, res) => {
    fs.readFile('./data/student.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Lỗi đọc file:', err);
            res.status(500).json({ message: 'Lỗi đọc file', error: err });
            return;
        }
        try {
            let jsonData = JSON.parse(data);
            let dataLength = jsonData.length;
            let bodyReq = req.body;
            for (let i = 0; i < bodyReq.length; i++) {
                bodyReq[i].id = jsonData[dataLength - 1].id + (i + 1);
                jsonData.push(bodyReq[i]);
            }
            let jsonString = JSON.stringify(jsonData);
            fs.writeFileSync('./data/student.json', jsonString, 'utf-8', (err) => {
                if (err) throw err;
            });
            res.status(200).json({ message: 'Thêm dữ liệu file thành công' });
        } catch (err) {
            console.error('Lỗi parse JSON:', err);
            res.status(500).json({ message: 'Lỗi parse JSON', error: err });
        }
    });
}

const exportExcel = (req, res) => {
    let currentFeeId = req.body.fee_id;
    fs.readFile('./data/student.json', 'utf8', (err, std) => {
        if (err) {
            console.error('Lỗi đọc file:', err);
            res.status(500).json({ message: 'Lỗi đọc file', error: err });
            return;
        }
        try {
            let stdData = JSON.parse(std);

            fs.readFile('./data/studentFee.json', 'utf8', (err, stdFee) => {
                if (err) {
                    console.error('Lỗi đọc file:', err);
                    res.status(500).json({ message: 'Lỗi đọc file', error: err });
                    return;
                }
                try {
                    let stdFeeData = JSON.parse(stdFee);
                    for (let i = 0; i < stdData.length; i++) {
                        stdData[i].paid_amount = 0;
                        stdData[i].completed_status = 0;
                        for (let j = 0; j < stdFeeData.length; j++) {
                            if (stdData[i].id == stdFeeData[j].user_id && stdFeeData[j].fee_id == currentFeeId) {
                                stdData[i].paid_amount = stdFeeData[j].paid_amount;
                                stdData[i].completed_status = stdFeeData[j].completed_status;
                            }
                        }
                    }
                    stdData.sort((a, b) => a.completed_status - b.completed_status);
                    const dataOutput = [["Tên", "Giới tính", "Ngày sinh", "Địa chỉ", "Số tiền đã đóng", "Trạng thái"]];
                    stdData.forEach(student => {
                        const stdName = student.name;
                        const stdGender = student.gender;

                        const stdDateOfBirth = new Date(student.date_of_birth).toLocaleDateString('en-GB');
                        const stdAddress = student.address;
                        const stdPaidAmount = student.paid_amount.toLocaleString('vi-VN');
                        const stdCompletedStatus = student.completed_status == 1 ? "Hoàn thành" : "Chưa hoàn thành";
                        const dataItem = [stdName, stdGender, stdDateOfBirth, stdAddress, stdPaidAmount, stdCompletedStatus];
                        dataOutput.push(dataItem);
                    });

                    const ws = XLSX.utils.aoa_to_sheet(dataOutput);
                    const wb = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(wb, ws, "Học phí");
                    const maxLengths = dataOutput[0].map((_, colIndex) =>
                        Math.max(...dataOutput.map(row => row[colIndex] ? row[colIndex].toString().length : 0))
                    );
                    ws['!cols'] = maxLengths.map(length => ({ width: length + 2 }));

                    const filePath = path.join(__dirname, 'fee.xlsx');
                    XLSX.writeFile(wb, filePath);

                    res.download(filePath, 'fee.xlsx', (err) => {
                        if (err) {
                            if (err.code === 'ECONNABORTED') {
                                console.log('Tải xuống bị hủy bởi người dùng');
                            } else {
                                console.error('Error downloading the file:', err);
                            }
                        } else {
                            fs.unlinkSync(filePath);
                            console.log('Tải xuống tệp thành công');
                        }
                    });
                } catch (err) {
                    console.error('Lỗi parse JSON:', err);
                    res.status(500).json({ message: 'Lỗi parse JSON', error: err });
                }
            });
        } catch (err) {
            console.error('Lỗi parse JSON:', err);
            res.status(500).json({ message: 'Lỗi parse JSON', error: err });
        }
    });
}

module.exports = {
    getAll, insertRecord, exportExcel
};