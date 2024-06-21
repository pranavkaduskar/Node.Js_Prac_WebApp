const { log } = require('console');
const fs = require('fs');
const http = require('http');
const path = require('path');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');
const slugify = require('slugify');


/////////////
// blocking, Syncronous way.


// const text = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(text);

// const textOut = `this is what we know about the folder ${text}. \nCreated on ${Date.now()}`;

// fs.writeFileSync('./txt/output.text', textOut);
// console.log("fileWriten");



//Non-Blocking, asynchronous way.
// fs.readFile('./txt/start.txt','utf-8' ,(err,data1) =>{
//     fs.readFile(`./txt/${data1}.txt`,'utf-8' ,(err,data2) =>{
//         console.log(data2);
//         fs.readFile(`./txt/append.txt`,'utf-8' ,(err,data3) =>{
//             console.log(data3);

//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, err =>{
//                 log("Your file is created..");
//             });
//         });
//     });
// });
// log("Will read file");


/////////////////
//SERVER

const tempOvrview = fs.readFileSync( `${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync( `${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync( `${__dirname}/templates/template-product.html` ,'utf-8');

const data = fs.readFileSync( `${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map(el => slugify(el.productName, {lower:true}));
// console.log(slugs);
const  server = http.createServer((req,resp)=>{
   
    const {query, pathname} = url.parse(req.url, true);
    



    // Oerview page.
    if(pathname === '/' || pathname === '/overview'){
        resp.writeHead(200, {'Content-type':"text/html"});

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOvrview.replace('{%PRODUCT_CARDS%}',cardsHtml);

        resp.end(output);
    
        //Product  page.
    }else if(pathname === '/product'){
        resp.writeHead(200, {'Content-type':'text/html'});

        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        resp.end(output);

        //API.
    }else if(pathname === '/api'){
        
        resp.writeHead(200,{'Content-type': 'application/json'});
        resp.end(data);

        //NOT Found.
    }else{
        resp.writeHead(404);
        resp.end("Hello from the Server! page Not found");
    }
    
});

server.listen(8000, '127.0.0.1' , () =>{
    log("Listning response from server");
})