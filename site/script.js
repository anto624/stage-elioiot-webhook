function getvalu() {
    var valoreContatore = 0
    setInterval(() => {
        fetch('http://localhost:3000/getvalue', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ MAC: obj.mac })
        })
            .then(response =>

                response.json()
            )
            .then(data => {
                console.log(data)
                document.getElementById('valoreContatore').innerText = data;
            })
            .catch(error => console.error('Errore:', error));
    }, 1000)
}