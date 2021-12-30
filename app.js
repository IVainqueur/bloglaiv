require('dotenv').config()
const express = require('express')
const path = require('path')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const fs = require("file-system")
const cloudinary = require('cloudinary').v2
const eUpload = require('express-fileupload')
const mongo = require('mongoose')

mongo.connect('mongodb+srv://iv_mongodb_1:kungfupanda1@nodeiv.umn7l.mongodb.net/myBlog?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }, (err)=>{
    if(err) return console.log('#FailedConnectionToDB')
    console.log('#ConnectedToDB')
})

//setting up cloudinary info
cloudinary.config({
    cloud_name: process.env.cname,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
    secure: true
})



//middleware
app.use('/public', express.static('public'))
app.use(cors())
app.use(eUpload())
app.use(bodyParser.urlencoded({extended: true, limit: "10mb"}))
app.use(bodyParser.json())




app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, "/index.html"))
})
app.get('/compose', (req, res)=>{
    res.sendFile(path.join(__dirname, "/public/compose.html"))
})
app.post('/uploadBlog', async (req, res)=>{

    let file = req.files.file
    fs.writeFile(file.name, file.data, (err)=>{
        if(err) return res.send('#Error')
        console.log('DONE')
        cloudinary.uploader.upload(file.name, (err, result)=>{
            if(err) return res.send('#Error')
            const newPost = require('./models/ml-post')({
                title: req.body.title,
                content: req.body.content,
                profileLink: result.url,
                date: req.body.date
            })
            newPost.save((err, doc)=>{
                if(err) return res.send('#NotSaved')
                res.send('#Saved')
            })
            fs.unlink(`./${file.name}`, (err)=>{
                if(err) return res.send('#Error')
                
            })
        })
        
    })
})

app.get('/getPosts', (req, res)=>{
    require('./models/ml-post').find({}, (err, result)=>{
        if(err) return res.send('#Error')
        res.send(result)
    })
})
app.get('/post/:id', (req, res)=>{
    res.sendFile(path.join(__dirname, '/public/post.html'))
})
app.post('/post/:id', (req, res)=>{
    require('./models/ml-post').findOne({_id: req.params.id}, (err, result)=>{
        if(err) return res.send('#Error')
        res.send(result)
    })
    // res.send(`you are looking for ${req.params.id}`)
})
app.listen(process.env.PORT, (err)=>{
    console.log("#ServerUpAndRunning")
})

const testUpload = async (file)=>{
    fs.writeFile(file.name, file.data, (err)=>{
        if(err) return console.log(err)
        console.log('DONE')
        // testUpload(file.name)
        // cloudinary.uploader.upload(file.name, (err, result)=>{
        //     if(err) return "#Error"
        //     // console.log(result)
        //     fs.unlink(`./${file.name}`, (err)=>{
        //         if(err) return "#Error"
        //         // console.log(result.url)
        //         return result.url
        //     })
        // })
        let hi = "What ever"
        return hi
    })
    
}

// testUpload()