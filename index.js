const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const { engine } = require ('express-handlebars')

const MongoStore = require('connect-mongo')

const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }

const timeSession = 600000 //10 min --> 600000 
const app = express()

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './views')

app.use(express.static('public'))


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())
app.use(session({
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://admin:admin@cluster0.rsv9och.mongodb.net/?retryWrites=true&w=majority",
        mongoOptions: advancedOptions,

    }),
    secret: 'mi-secreto',
    resave: false,
    saveUninitialized: false,
    // cookie: {
    //     maxAge: 1000
    // }
}))

app.get('/', (req, res) => {
    // console.log(req.session.cookie)
    if (!req.session.user) {
        res.render('home')
        return
    }
    
    if (req.session.user) {
        req.session.cookie.expires = new Date(Date.now() + timeSession)
        // console.log(typeof req.session.cookie.expires)
    }

    res.render('init', {
        user: req.session.user,
        maxAge: req.session.cookie.maxAge
    })
})

app.post('/login', async (req, res) => {
    const { user } = req.body
    req.session.user = user
    req.session.cookie.expires = new Date(Date.now() + timeSession)
    res.render('init', {
        user: req.session.user,
        maxAge: req.session.cookie.maxAge
    })
})

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (!err) {
            res.render('home')
        }else{
            res.send({status: 'Logout Error', body: err})
        }
    })
})



app.listen(8080, console.log('Corriendo en puerto 8080'))