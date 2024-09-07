const hostNode = "http://localhost:3000";
const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
const id = params.get('id');


function infoStudent() {
    fetchDataStudent(id);
    console.log(id);
}

function fetchDataStudent(id) {
    fetch(hostNode + '/student/' + id)
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.log('Lỗi, mã lỗi ' + response.status);
                    return;
                }
                response.json().then(data => {
                    console.log(data);
                    document.getElementById('name').value = data.data.name;
                    document.getElementById('gender').value = data.data.gender;
                    document.getElementById('dob').value = data.data.date_of_birth;
                    document.getElementById('address').value = data.data.address;
                })
            }
        )
        .catch(err => {
            console.log('Error : ', err)
        });
}

function updateStudent(id) {
    const name = document.getElementById('name').value;
    const gender = document.getElementById('gender').value;
    const date_of_birth = document.getElementById('dob').value;
    const address = document.getElementById('address').value;

    const apiUrl = ' http://localhost:3000/student/update/' + id;

    const data = {
        name: name,
        gender: gender,
        date_of_birth: date_of_birth,
        address: address
    }
    fetch(apiUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            window.location.href = 'index.html'
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

}



infoStudent();


const button = document.getElementById('buttonUpdate')
button.addEventListener('click', function () {
    updateStudent(id)
});

function newStudent(id){
    window.location.href = "http://127.0.0.1:5500/pages/student/new.html?id=" + id;
}