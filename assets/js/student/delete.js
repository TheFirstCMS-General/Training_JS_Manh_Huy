const hostNode = "http://localhost:3000";

function handleDelete(id) {
    console.log(id);
    fetch(hostNode + '/student/delete/' + id, {
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
  };

function updateY(id){
    window.location.href = "http://127.0.0.1:5500/pages/student/update.html?id=" + id;
}
