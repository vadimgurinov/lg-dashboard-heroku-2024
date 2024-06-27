// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.getElementById('edit-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent actual form submission

    const aum = document.getElementById('aum').value;
    const clients = document.getElementById('clients').value;
    const product1 = document.getElementById('product1').value;
    const product2 = document.getElementById('product2').value;

    // Send data to Firestore
    db.collection('dashboard').doc('data').set({
        aum, clients, product1, product2
    })
    .then(() => {
        alert('Data saved successfully!');
    })
    .catch(error => console.error('Error updating data:', error));
});