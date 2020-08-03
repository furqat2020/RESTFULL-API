const express = require('express'),
mongoose = require('mongoose'),
bodyParser = require('body-parser'),
app = express()

let router = new express.Router()

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.set('port', process.env.PORT || 3400)

app.use('/', router)

mongoose.connect('mongodb://localhost/myAPI', {useNewUrlParser: true, useUnifiedTopology:true})
mongoose.connection.on('open', (err) => {
    if(err) throw err

    console.log("Bazaga ulandi...")
})

let Users = new mongoose.Schema({
    name: {type:String},
    surname: {type:String},
    age: {type:Number},
    occupation: {type:String},
    salary: {type:Number} 
})

let userModel = mongoose.model('userAPI', Users)

router.get('/', (req, res) => {
    userModel.find({}, (err, data) => {
        if(err) throw err

        res.json(data)
    })
})

router.post('/joylash', (req, res) => {
    if(req.body.name && req.body.surname && req.body.occupation && req.body.age && req.body.salary){
        let newUser = new userModel({
            name: req.body.name,
            surname: req.body.surname,
            age: req.body.age,
            occupation: req.body.occupation,
            salary: req.body.salary
        })

        newUser.save().then(() => { console.log("Ma'lumot qo'shildi") }).catch((error) => { console.log(error) })

        res.json("Ma'lumot qo'shildi...")

    } else {
        res.status(500).json({error: "Ma'lumot qo'shishda hatolik..."})
    }
})

router.put('/yangilash/:id', (req, res) => {
    if(req.params.id && req.body.name && req.body.surname && req.body.age && req.body.occupation && req.body.salary){
        let updUser = {}

        updUser.name = req.body.name
        updUser.surname = req.body.surname
        updUser.age = req.body.age
        updUser.occupation = req.body.occupation
        updUser.salary = req.body.salary

        userModel.findOneAndReplace({_id: req.params.id}, updUser).then(() => {res.json(`ID: ${req.params.id} ma'lumot yangilandi...`)}).catch((err) => {console.error(err)})
    }
})

router.delete('/delete/:id', (req, res) => {
    if(req.params.id){
        userModel.findOneAndDelete({_id: req.params.id}).then(() => {res.json(`ID: ${req.params.id} ma'lumot o'chirildi...`)}).catch((err) => {console.error(err)})
    }
})

app.listen(app.get('port'), () => {
    console.log(`Server ${app.get('port')} da ishga tushdi...`)
})