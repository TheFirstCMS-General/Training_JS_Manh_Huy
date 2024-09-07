const fs = require('fs');
const express = require('express');
const router = express.Router();
const feeService = require('../service/feeService');
const sessionFeeService = require('../service/sessionFee');

router.get('/', (req, res) => {
    try {
        feeService.getAll(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra', error });
    }
});

router.post('/new', (req, res) => {
    try {
        feeService.insertRecord(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra', error });
    }
});

router.delete('/delete/:id', (req, res) => {
    try {
        feeService.deleteRecord(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra', error });
    }
});

router.post('/session', (req, res) => {
    try {
        sessionFeeService.getAll(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra', error });
    }
});

module.exports = router;
