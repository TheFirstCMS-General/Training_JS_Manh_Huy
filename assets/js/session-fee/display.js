const hostNode = "http://localhost:3000";
const hostJs = "http://127.0.0.1:5500";
const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
const id = params.get('id');

function displaySessionFee(dataSessionFee) {
  let outputFee = document.getElementById('session-fee-list');
  outputFee.innerHTML = "";

  for (let i = 0; i < dataSessionFee.length; i++) {
    outputFee.innerHTML +=
      `<tr>
      <th scope="row">${i + 1}</th>
      <td>Đợt ${i + 1}</td>
      <td>${dataSessionFee[i].amount.toLocaleString('vi-VN')}</td>
      <td>${new Date(dataSessionFee[i].deadline).toLocaleDateString('en-GB')}</td>
      </tr>`;
  }
}

function fetchDataSessionFee() {
  let dataCondition = {};
  dataCondition.fee_id = id;
  fetch(hostNode + '/fee/session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataCondition)

  })
    .then(
      function (response) {
        if (response.status !== 200) {
          console.log('Lỗi, mã lỗi ' + response.status);
          return;
        }
        response.json().then(data => {
          displaySessionFee(data);
          console.log(data);

        })
      }
    )
    .catch(err => {
      console.log('Error : ', err)
    });
}

fetchDataSessionFee();