const express = require('express');
const fs = require("fs")
const app = express();
const cors = require('cors');
const filePath = "./../Database/count.json"
const filePath0 = "./../Database/count0.json"
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
        res.send(parseInt(JSON.parse(data).MAC[req.body.MAC]).toString())

    });
});

app.post('/setvalue', (req, res) => {
    if (req.body != null || req.body != {}) {
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

app.post('/clear', (req, res) => {


    if (fs.existsSync(filePath0)) {
        fs.readFile(filePath0, 'utf8', function (err, data) {
            if (err) {
                console.error(err);
                res.status(500).send('Errore nella lettura del file JSON');
                return;
            }
            obj = JSON.parse(data)
            if (obj.MAC[req.body.MAC]) {
                obj.MAC[req.body.MAC].log = [];
                obj.MAC[req.body.MAC].events.clear.push(req.body.time);
                fs.writeFileSync(filePath0, JSON.stringify(obj, null, 2))
            }
            res.sendStatus(200)
        });

    }






});


app.post('/addvalue', (req, res) => {
    if (req.body.MAC) {

        const bodyrequest = {
            MAC: {
                [req.body.MAC]: {
                    "events": { "write": [req.body.time], "clear": [] },
                    "log": [req.body.time]
                }
            }
        }
        if (fs.existsSync(filePath0)) {
            fs.readFile(filePath0, 'utf8', function (err, data) {
                if (err) {
                    console.error(err);
                    res.status(500).send('Errore nella lettura del file JSON');
                    return;
                }
                obj = JSON.parse(data);
                if (obj.MAC[req.body.MAC]) {
                    obj.MAC[req.body.MAC].log.push(req.body.time)
                    obj.MAC[req.body.MAC].events.write.push(req.body.time)
                } else {
                    obj.MAC[req.body.MAC] = bodyrequest.MAC[req.body.MAC]
                }
                fs.writeFileSync(filePath0, JSON.stringify(obj, null, 2))
            });

        } else {
            fs.writeFileSync(filePath0, JSON.stringify(bodyrequest, null, 2))
        }

        res.sendStatus(200)
    } else {
        console.log("Errore il body è vuoto non è valida")
        res.sendStatus(400)
    }


});


app.post('/newgetvalu', (req, res) => {

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Errore nella lettura del file JSON');
            return;
        }
        res.setHeader('Content-Type', 'application/json');
        res.send(parseInt(JSON.parse(data).MAC[req.body.MAC].log.size).toString())

    });
});

app.listen(PORT, () => {
    console.log(`Il server è in esecuzione sulla porta ${PORT}`);
});