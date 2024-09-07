import { NODEJS_HOST, JAVASCRIPT_HOST } from "../constant.js";

export function saveFee() {
    console.log(1);

    let totalSession = document.getElementById("total-sessions").value;
    let amountToPay = document.getElementById("amount-to-pay").value;

    let sessionData = [];
    for (let i = 0; i < totalSession; i++) {
        let amountSession = parseInt(document.getElementById("amount-" + (i + 1)).value);
        let deadlineSession = document.getElementById("deadline-payment-" + (i + 1)).value;
        let sessionItem = {};
        sessionItem.id = null;
        sessionItem.fee_id = null;
        sessionItem.amount = amountSession;
        sessionItem.deadline = deadlineSession;
        sessionItem.deleted = 0;
        sessionData.push(sessionItem);
    }

    let dataSave = { "id": null };
    dataSave.name = document.getElementById("fee-name").value;
    dataSave.amount_to_pay = parseInt(amountToPay);
    dataSave.total_sessions = parseInt(totalSession);
    dataSave.payment_deadline = null;
    dataSave.session_fee = sessionData;
    dataSave.deleted = 0;

    fetch(NODEJS_HOST + '/fee/new', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataSave)
    })
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.log('Lỗi, mã lỗi ' + response.status);
                    return;
                }
                response.json().then(data => {
                    window.location.href = JAVASCRIPT_HOST + "/pages/fee/index.html"
                })
            }
        )
        .catch(err => {
            console.log('Error : ', err)
        });
}

export function renderSession() {
    let totalSession = document.getElementById("total-sessions").value;
    let amountToPay = document.getElementById("amount-to-pay").value;
    totalSession = totalSession ? parseInt(totalSession) : 0;
    amountToPay = amountToPay ? parseInt(amountToPay) : 0;

    let sessionFeeForm = document.getElementById("session-fee-form");
    let sessionFeeFormContent = `
    <form action="">
    `;
    for (let i = 0; i < totalSession; i++) {

        let valueAmount = totalSession > 0 ? amountToPay / totalSession : 0;
        sessionFeeFormContent += `<div class="form-group row margin-form">
        <label class="col-2 col-form-label">Đợt ${i + 1}</label>
        <div class="col-5">
            <input class="form-control" value="${valueAmount}" name="amount" id="amount-${i + 1}" type="number" placeholder="Số tiền" title="Số tiền"/>
        </div>
        <div class="col-5">
            <input class="form-control" name="deadline_payment" id="deadline-payment-${i + 1}" type="date" placeholder="Hạn đóng" title="Hạn đóng"/>
        </div>
    </div>`
    }
    sessionFeeFormContent +=
        `
        <button id="save-fee" type="button" class="btn btn-primary margin-form">Lưu khoản phí</button>
    </form>`;

    if (totalSession > 0) {
        sessionFeeForm.innerHTML = sessionFeeFormContent;
        // Gán sự kiện cho nút sau khi nội dung được chèn vào DOM
        document.getElementById('save-fee').addEventListener('click', saveFee);
    } else sessionFeeForm.innerHTML = ``;
}