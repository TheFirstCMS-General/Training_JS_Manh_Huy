import { NODEJS_HOST } from "../constant.js";

selectFee();

function displayStudent(data) {
  let outputStudent = document.getElementById('student-list');
  outputStudent.innerHTML = "";
  for (let i = 0; i < data.length; i++) {
    let paymentStatus, completedStatus;
    if (data[i].payment_status == 4) {
      paymentStatus = 'bg-danger';
      completedStatus = "Chưa hoàn thành";
    } else if (data[i].payment_status == 3) {
      paymentStatus = 'bg-warning';
      completedStatus = "Chưa hoàn thành";
    } else if (data[i].payment_status == 2) {
      paymentStatus = 'bg-info';
      completedStatus = "Chưa hoàn thành";
    }
    else {
      paymentStatus = 'bg-success';
      completedStatus = "Hoàn thành";
    }
    outputStudent.innerHTML +=
      `<tr>
    <th class="${paymentStatus}" scope="row">${i + 1}</th>
    <td >${data[i].name}</td>
    <td>${data[i].gender}</td>
    <td>${new Date(data[i].date_of_birth).toLocaleDateString('en-GB')}</td>
    <td>${data[i].address}</td>
    <td>${data[i].paid_amount.toLocaleString('vi-VN')}</td>
    <td>${completedStatus}</td>
    <td><button type="button" onclick="updateY(${data[i].id})" class="btn btn-warning">Chỉnh Sửa</button> 
    <button id="buttonDeleteId" onclick="handleDelete(${data[i].id})" type="button" class="btn btn-danger button-delete">Xóa</button> <td/>
    </tr>`;
  }
}

function fetchDataStudent(keyword, feeId) {
  let conditionSearch = {};
  const feeIdSelected = document.getElementById('select-fee').value;
  conditionSearch.fee_id = feeId != null ? feeId : feeIdSelected;
  conditionSearch.keyword = keyword;
  fetch(NODEJS_HOST + '/student', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(conditionSearch)
  })
    .then(
      function (response) {
        if (response.status !== 200) {
          console.log('Lỗi, mã lỗi ' + response.status);
          return;
        }
        response.json().then(data => {
          displayStudent(data);
        })
      }
    )
    .catch(err => {
      console.log('Error : ', err)
    });
}

function selectFee() {
  fetch(NODEJS_HOST + '/fee')
    .then(
      function (response) {
        if (response.status !== 200) {
          console.log('Lỗi, mã lỗi ' + response.status);
          return;
        }
        response.json().then(data => {
          const selectElement = document.getElementById('select-fee');
          const options = data;

          for (let i = 0; i < options.length; i++) {
            const option = document.createElement('option');
            option.value = options[i].id;
            option.textContent = options[i].name;
            selectElement.appendChild(option);
          }

          selectElement.value = options[0].id;

          let keyword = document.getElementById('search-keyword').value;
          fetchDataStudent(keyword, selectElement.value);
        })
      }
    )
    .catch(err => {
      console.log('Error : ', err)
    });
}

export function handleSearch() {
  let keyword = document.getElementById('search-keyword').value;
  const feeIdSelected = document.getElementById('select-fee').value;
  fetchDataStudent(keyword.trim(), feeIdSelected)
}

export function importExcel() {
  let importExcel = document.getElementById('import-student')
  let file = importExcel.files[0];
  readXlsxFile(file).then(function (rows) {
    let keyExcel = rows[0];
    let arrayData = [];
    for (let i = 1; i < rows.length; i++) {
      const arrayRecord = { "id": null };
      keyExcel.forEach((key, index) => {
        arrayRecord[key] = rows[i][index];
      });
      arrayRecord["deleted"] = 0;
      arrayData.push(arrayRecord);
    }
    fetch(NODEJS_HOST + '/student/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(arrayData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(arrayData => {
        console.log('Success:', arrayData);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }).catch(error => {
    console.error('Error reading the Excel file:', error);
  });
}

export function exportExcel() {
  console.log(1);
  const feeIdSelected = document.getElementById('select-fee').value;
  let conditionExportExcel = {}
  conditionExportExcel.fee_id = feeIdSelected;
  fetch(NODEJS_HOST + '/student/dowload/xlsx', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(conditionExportExcel)
  })
    .then(response => {
      if (response.ok) {
        return response.blob();
      }
      throw new Error('Network response was not ok.');
    })
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'fee.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    })
    .catch(err => {
      console.error('Fetch error:', err);
    });

}


