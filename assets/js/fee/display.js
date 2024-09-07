import { NODEJS_HOST, JAVASCRIPT_HOST } from "../constant.js";

function displayFee(dataFee) {
  let outputFee = document.getElementById('fee-list');
  outputFee.innerHTML = "";
  for (let i = 0; i < dataFee.length; i++) {
    const deadline = dataFee[i].payment_deadline != null ? new Date(dataFee[i].payment_deadline).toLocaleDateString('en-GB') : "------";
    outputFee.innerHTML +=
      `<tr>
      <th scope="row">${i + 1}</th>
      <td>${dataFee[i].name}</td>
      <td>${dataFee[i].amount_to_pay.toLocaleString('vi-VN')}</td>
      <td>${dataFee[i].total_sessions}</td>
      <td>${deadline}</td>
      <td>
      <a href="${JAVASCRIPT_HOST + '/pages/session-fee/index.html?id=' + dataFee[i].id}"><button type="button" class="btn btn-info">Chi tiết</button> </a>
      <button type="button" class="btn btn-warning">Chỉnh Sửa</button> 
      <button data-id="${dataFee[i].id}" type="button" class="btn btn-danger button-delete">Xóa</button>
      <td/>
      </tr>`;
  }

  const deleteButtons = document.querySelectorAll('.button-delete');
  deleteButtons.forEach(button => {
    button.addEventListener('click', function () {
      const feeId = this.getAttribute('data-id');
      deleteFee(feeId);
    });
  });
}

function fetchDataFee() {
  fetch(NODEJS_HOST + '/fee')
    .then(
      function (response) {
        if (response.status !== 200) {
          console.log('Lỗi, mã lỗi ' + response.status);
          return;
        }
        response.json().then(data => {
          displayFee(data);
        })
      }
    )
    .catch(err => {
      console.log('Error : ', err)
    });
}
fetchDataFee();


function deleteFee(feeId) {
  fetch(NODEJS_HOST + '/fee/delete/' + feeId, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Successfully deleted:', data);
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
}

