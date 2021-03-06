const express = require('express');
const app = express();
const path = require('path');

const recordingController = require('./database/controller/recordingController.js')
const frameController = require('./database/controller/frameController.js')
const logController = require('./database/controller/logController')
const feedBackController = require('./database/controller/feedBackController')
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
let mongoURI = 'mongodb://localhost:27017/mydb';

mongoose.connect(mongoURI);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/', express.static(__dirname + './../'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
})

app.get('/logo.png', (req, res) => {
    res.sendFile(path.join(__dirname, 'logo.png'));
})

app.get('/websiteicon.png', (req, res) => {
    res.sendFile(path.join(__dirname, 'websiteicon.png'));
})

app.get('/databaseicon.png', (req, res) => {
    res.sendFile(path.join(__dirname, 'databaseicon.png'))
})

app.get('/machinelearningicon.png', (req, res) => {
    res.sendFile(path.join(__dirname, 'machinelearningicon.png'))
})

// user icon pictures
app.get('/public/1.png', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/1.png'))
})

app.get('/public/2.png', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/2.png'))
})

app.get('/public/3.png', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/3.png'))
})

app.get('/public/4.png', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/4.png'))
})

app.get('/public/5.png', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/5.png'))
})

app.get('/public/6.png', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/6.png'))
})

app.get('/public/7.png', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/7.png'))
})

app.get('/public/8.png', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/8.png'))
})

app.get('/public/9.png', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/9.png'))
})

app.get('/public/linkedin.png', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/linkedin.png'))
})

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
})

app.get('/dashboard/:recordingID', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
})

app.get('/dashboard/:recordingID/feedback', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'))
})

app.get('*/build/bundle.js', (req, res, next) => {
    res.sendfile('./build/bundle.js');
})

app.get('/recordings', recordingController.findAll)
app.get('/recordings/:recordingID', recordingController.findRecording)


// app.get('/frames',frameController.findAll)
app.get('/frames/:recordingID',frameController.findFrame)

// websocket connection
io.on('connection', (client) => { 
    client.on('join', (data) => {
        console.log(data);
        client.emit('messages', 'Hello from server');
    });
    client.on('html', (data) => {
        recordingController.createRecording(data)
            .then((Response) => {
                frameController.createFrame(data)
                    .then((Response) => {
                        logController.createLog(data)
                            .then((Response) => {
                                console.log("created")
                            })
                            .catch((err) => {
                                console.log(err);
                            })
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            }).catch((err) => {
                console.log(err);
            })
    })
    client.on('recording', (id, data) => {
        let result = data.map(function (element) {
            return Object.values(element)[0]
        });
        console.log('RECORDING', result);
        frameController.updateFrameBulk(id, result)
            .then((Response) => {
                console.log("Response", Response)
            }).catch((err) => {
                console.log(err)
            })
    });
    client.on('unload', (id, data) => {
        console.log('INLOAD');
        let result = data.map(function (element) {
            return Object.values(element)[0]
        });
        console.log(result);
        frameController.updateFrameBulk(id, result)
            .then((Response) => {
                console.log("Unload", Response)
            }).catch((err) => {
                console.log(err)
            })
    })
    client.on('event', (data) => {
        console.log('EVENT', data);
    })

    client.on('log', (id, data) => {
        logController.updateLog(id, data)
            .then((response) => {
                console.log(response)
            })
            .catch((err) => {
                console.log(err)
            })
    })
    client.on('inactive', (id, data) => {
        frameController.updateSingle(id, data)
            .then((response) => {
                console.log("Response",
                    response)
            }).catch((err) => {
                if (err) throw err
            })
    })
    client.on('active', (id, data) => {
        frameController.updateSingle(id, data)
            .then((response) => {
                console.log("Response", response)
            }).catch((err) => {
                console.log("Err", err)
            })
    })

    client.on('createFeedback', (data) => {
        feedBackController.createfeedBack(data)
            .then((response) => {
                console.log("Created Feedback", response)
            })
            .catch((err) => {
                console.log(err)
            })
    })
})


server.listen(3000);
