const fs = require('fs');
const express = require('express');
const router = express.Router();
const studentService = require('../service/studentService');

router.post('/', (req, res) => {
    try {
        studentService.getAll(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra', error });
    }
});

router.post('/new', (req, res) => {
    try {
        studentService.insertRecord(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra', error });
    }
});

router.delete('/delete/:id', (req, res) => {
    const userId = req.params.id;
    let data = fs.readFileSync('./data/student.json', 'utf8');
    let jsonData = JSON.parse(data);
    const studentIndex = jsonData.findIndex(student => student.id == userId);
    if (studentIndex !== -1) {
        jsonData.splice(studentIndex, 1);
        fs.writeFileSync('./data/student.json', JSON.stringify(jsonData), 'utf-8');
        res.send({
            "code": 200,
            "message": "Xóa thành công"
        });
    } else {
        res.status(400).send({
            "code": 400,
            "message": "User không tồn tại"
        });
    }
});


router.get('/:id', (req, res) => {
    fs.readFile('./data/student.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return;
        }
        try {
            const jsonData = JSON.parse(data);
            let found = false; // Cờ để kiểm tra xem có tìm thấy id hay không

            for (let i = 0; i < jsonData.length; i++) {
                if (jsonData[i].id == req.params.id) {
                    console.log(req.params.id);
                    res.send({
                        "code": 200,
                        "message": "Đã hiển thị",
                        "data": jsonData[i]
                    });
                    found = true; // Đã tìm thấy id
                    break; // Dừng vòng lặp sau khi tìm thấy
                }
            }

            if (!found) {
                // Nếu không tìm thấy id sau khi đã duyệt qua tất cả các phần tử
                res.status(404).send({
                    "code": 404,
                    "message": "User không tồn tại"
                });
            }

        } catch (err) {
            console.error('Error parsing JSON:', err);
        }
    });
});


router.put('/update/:id', (req, res) => {
    const userId = req.params.id;
    let data = fs.readFileSync('./data/student.json', 'utf8');
    let jsonData = JSON.parse(data);

    const studentIndex = jsonData.findIndex(student => student.id == userId);

    if (studentIndex !== -1) {
        // Cập nhật từng thuộc tính của sinh viên với dữ liệu từ request body
        const student = jsonData[studentIndex];
        for (let key in req.body) {
            if (req.body.hasOwnProperty(key)) {
                student[key] = req.body[key];
            }
        }

        // Ghi lại file JSON với dữ liệu đã cập nhật
        fs.writeFileSync('./data/student.json', JSON.stringify(jsonData, null, 2), 'utf-8');

        res.send({
            "code": 200,
            "message": "Cập nhật thành công",
            "data": student
        });
    } else {
        res.status(400).send({
            "code": 400,
            "message": "User không tồn tại"
        });
    }
});

router.post('/dowload/xlsx', (req, res) => {
    try {
        studentService.exportExcel(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra', error });
    }
});

router.post('/add', (req, res) => {
    const newStudent = req.body;

    fs.readFile('./data/student.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            res.status(500).send({
                "code": 500,
                "message": "Lỗi khi đọc tệp"
            });
            return;
        }

        try {
            const jsonData = JSON.parse(data);

            // Tự động tăng ID cho học sinh mới
            newStudent.id = jsonData.length > 0 ? jsonData[jsonData.length - 1].id + 1 : 1;

            // Kiểm tra xem học sinh đã tồn tại chưa
            const studentExists = jsonData.some(student => student.id === newStudent.id);

            if (studentExists) {
                res.status(400).send({
                    "code": 400,
                    "message": "Học sinh với ID này đã tồn tại"
                });
            } else {
                // Thêm học sinh mới vào danh sách
                jsonData.push(newStudent);

                // Ghi dữ liệu mới vào tệp JSON
                fs.writeFile('./data/student.json', JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
                    if (err) {
                        console.error('Error writing the file:', err);
                        res.status(500).send({
                            "code": 500,
                            "message": "Lỗi khi ghi tệp"
                        });
                    } else {
                        res.send({
                            "code": 200,
                            "message": "Thêm học sinh thành công",
                            "data": newStudent
                        });
                    }
                });
            }
        } catch (err) {
            console.error('Error parsing JSON:', err);
            res.status(500).send({
                "code": 500,
                "message": "Lỗi khi phân tích JSON"
            });
        }
    });
});



module.exports = router;
