const express = require ('express')
const path = require('path')
const app = express()
const port = 3000

const dataDir = path.join(__dirname, 'data');

app.set('view engine', 'ejs')

//app.get('/', (req,res)=>{
//    res.sendFile(path.join(__dirname, 'index.html'))
//})

app.get('/', (req,res)=>{
    //res.render('index')
    res.render('index', {nama : 'Lisa', title : 'Belajar Js'})
})

app.get('/about', (req,res)=>{
    // res.send('test')
    //res.sendFile(path.join(__dirname, 'about'))
    res.render('about')
})

app.get('/contact', (req,res)=>{
    // res.send('test')
    //res.sendFile(path.join(__dirname, 'contact'))
    const listContact = [
        {
            name:'AKW',
            email:'abc@gmail.com',
        },
        {
            name:'Lisa',
            email:'def@gmail.com',
        },
        {
            name:'Icha',
            email:'xyz@gmail.com',
        },
    ]
    res.render('contact', { listContact })
})

app.get('/product/:id/category/:idCat', (req,res)=>{
    //res.send('product id :' + req.params.id + '<br><br/>' + 'category id : ' + req params.idcat)
    //const idProduct = req.params.id
    //const idCategory = req.params.idCat
    //const price = req.query.price
    //res.send('product id : ${req.params.id} <br>category id : ${req.params.idCat}')
    res.send('product id : ${req.params.id} <br>category id : ${req.query.category}')
})

//nge test
app.get('/random', (req,res)=>{
    // res.send('test')
    res.sendFile(path.join(dataDir, 'random'))
})


app.use("/",(req,res)=>{
    res.status(404).send("404 not found")

})

app.listen(port, ()=> {
    console.log('example app listening on port ${port}')
})