const express = require('express');
const https = require('https');
const fs = require("fs")
const app = express();
const cors = require('cors');
const filePath = "./../Database/count.json"
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

app.post('/getvalue', (req, res) => {

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Errore nella lettura del file JSON');
            return;
        }
        res.setHeader('Content-Type', 'application/json');
        res.send((JSON.parse(data).MAC[req.body.MAC]) ? (JSON.parse(data).MAC[req.body.MAC]).toString() : '0')

    });
});

app.post('/setvalue', (req, res) => {
    if (req.body.MAC) {
        console.log("Ricevuta webhook da " + req.body.MAC + " con valore " + parseInt(req.body.query))

        const bodyrequest = {
            MAC: {
                [req.body.MAC]: parseInt(req.body.query)
            }
        }
        if (fs.existsSync(filePath)) {
            fs.readFile(filePath, 'utf8', function (err, data) {
                if (err) {
                    console.error(err);
                    res.status(500).send('Errore nella lettura del file JSON');
                    return;
                }
                obj = JSON.parse(data);
                obj.MAC[req.body.MAC] = parseInt(req.body.query);
                fs.writeFileSync(filePath, JSON.stringify(obj, null, 2))
            });

        } else {
            fs.writeFileSync(filePath, JSON.stringify(bodyrequest))
        }

        res.sendStatus(200)
    } else {
        console.log("Errore il body è vuoto non è valida")
    }


});

const options = {
    key: fs.readFileSync('/home/elio/certificati/server.key'),
    cert: fs.readFileSync('/home/elio/certificati/server.cert'),
};

https.createServer(options, app).listen(PORT, () => {
    console.log('Server HTTPS avviato sulla porta ' + PORT);
});
