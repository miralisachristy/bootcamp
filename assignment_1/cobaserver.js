const http = require('http');
const port = 3000;
const fs = require('fs')


const renderHTML = (path, res) =>{ 
    fs.readFile(path,(err, data)=>{
        if(err){
            res.writeHead(404);
            res.write('Error: page not found');
        }else{
            res.write(data)
        }
    res.end ();
    })
}

http
.createServer((req,res)=>{
    const url = req.url;
    console.log(url);
    
    res.writeHead(200,{
        'Content-Type': 'text/html',
    });

    if(url==='/about'){
        //res.write('<h1>this is about page</h1>'); //using html language
        //res. end ();
        renderHTML('./about.html',res);
        console.log(1);
    } else if(url==='/contact'){
        //res.write('<h2>this is contact page</h2>'); //using html language
        //res.end ();
        renderHTML('./contact.html',res);
    }    else { 
        //res.write('Hello World!');
        //res.end();
        renderHTML('./index.html',res);
    }

    // res.write('Hello World!');
    // res.end();
})

.listen(3000,()=>{
    console.log('Server is listening on port 3000');
})

