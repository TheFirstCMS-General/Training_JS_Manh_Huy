const hostNode = "http://localhost:3000";

function newStudent() {
    const name = document.getElementById('name').value;
    const gender = document.getElementById('gender').value;
    const date_of_birth = document.getElementById('dob').value;
    const address = document.getElementById('address').value;

    const apiUrl = 'http://localhost:3000/student/add';

    const data = {
        name: name,
        gender: gender,
        date_of_birth: date_of_birth,
        address: address
    };

    fetch(apiUrl, {
        method: 'POST',
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
        console.log('Student updated successfully:', data);
        
        window.location.href = 'index.html';
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
};

function newY(id){
    window.location.href = "http://127.0.0.1:5500/pages/student/update.html?id=" + id;
}

const button = document.getElementById('newAdd');
button.addEventListener('click', function () {
    newStudent(); 
});
