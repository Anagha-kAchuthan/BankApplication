const express = require('express')
const session = require('express-session')
const cors = require('cors')
const dataService = require('./services/data.service')

const app = express()

app.use(cors({

    origin:'http://localhost:4200',
    credentials:true
}))

app.use(session({
    secret: 'randomsecurestring',
    resave: false,
    saveUninitialized: false
}))

const logMiddleware = (req, res, next) => {
    console.log("Application specific Middleware");
    next()
}

//app.use(logMiddleware)

const authMiddleware = (req, res, next) => {
    if (!req.session.currentAcc) {
        res.json({
            statusCode: 422,
            status: false,
            message: "Please Log In"
        })
    }
    else {
        next()
    }
}

app.use(express.json())

app.get('/', (req, res) => {
    res.send("GET METHOD")
})

app.post('/', (req, res) => {
    res.send("POST METHOD")
})

app.put('/', (req, res) => {
    res.send("PUT METHOD")
})

app.patch('/', (req, res) => {
    res.send("PATCH METHOD")
})

app.delete('/', (req, res) => {
    res.send("DELETE METHOD")
})

app.post('/register', (req, res) => {
    //console.log(req.body);
    dataService.register(req.body.acno, req.body.username, req.body.password)
        .then(result => {
            res.status(result.statusCode).json(result)
        })
})

app.post('/login', (req, res) => {
    console.log(req.body);
    // console.log(req.sessionID);
    dataService.login(req, req.body.acno, req.body.pswd)
        .then(result => {
            res.status(result.statusCode).json(result)
        })
})

app.post('/deposit', authMiddleware, (req, res) => {
    console.log(req.body);
    console.log(req.session.currentAcc);
    dataService.deposit(req.body.acno, req.body.pswd, req.body.amount)
        .then(result => {
            res.status(result.statusCode).json(result)
        })
})

app.post('/withdraw', authMiddleware, (req, res) => {
    console.log(req.body.acno);
    dataService.withdraw(req,req.body.acno, req.body.pswd, req.body.amount)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })   
})

app.post('/getTransaction', authMiddleware, (req, res) => {
    dataService.getTransaction(req)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
   
})

app.listen(3000, () => {
    console.log("Server Started at Port Number:3000");
})