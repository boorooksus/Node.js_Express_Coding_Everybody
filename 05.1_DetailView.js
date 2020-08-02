var express = require('express')
var app = express()
var port = 3000
var fs = require('fs');
var template = require('./lib/00_template.js');

app.get('/', function(reqest, response){
    fs.readdir('./data', 'utf8', (error, filelist)=>{
        var title = 'Welcome';
        var description = 'Welcome';
        var list = template.list(filelist);
        var html = template.html(title, list, 
            `<p><h2>${title}</h2>${description}</p>`,
            `<a href="/create">create</a>`
        );
        response.send(html);
        })
});

// URL의 path를 통해 parameter를 전달하는 방법
// 기존 queryString을 통해 전달하는 방법과 좀 다름

app.get('/page/:pageId', function(request, response){
    response.send(request.params);
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))



// var http = require('http');
// var fs = require('fs');
// var url = require('url')
// var qs = require('querystring');
// var template = require('./lib/00_template.js');
// var path = require('path');
// var sanitizeHtml = require('sanitize-html');


// var app = http.createServer(function(request,response){
//     var _url = request.url; 
//     var queryData = url.parse(_url, true).query;
//     var pathname = url.parse(_url, true).pathname;

//     if(pathname ==='/'){
//         if(queryData.id === undefined){
//             fs.readdir('./data', 'utf8', function(error, filelist){
//                 var title = 'Welcome';
//                 var description = 'Welcome';
//                 var list = template.list(filelist);
//                 var html = template.html(title, list, `<p><h2>${title}</h2>${description}</p>`, `<a href="/create">create</a>`);
//                 response.writeHead(200);
//                 response.end(html);
//             })
//         }
//         else{
//             fs.readdir('./data', 'utf8', function(error, filelist){
//                 var filteredId = path.parse(queryData.id).base;
//                 fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
//                     var title = queryData.id;
//                     var sanitizedTitle = sanitizeHtml(title);
//                     var sanitizedDescription = sanitizeHtml(description);
//                     var list = template.list(filelist);
//                     var html = template.html(title, list, `<p><h2>${sanitizedTitle}</h2>${sanitizedDescription}</p>`, `<a href="/create">create</a>
//                     <a href="/update?id=${sanitizedTitle}">update</a>
//                     <form action=
//                     "delete_process" method="post" onsubmit="return confirm('Do you want to delete?')">
//                         <input type="hidden" name="id" value="${sanitizedTitle}"><input type="submit" value="delete">
//                     </form>
//                     `);
//                     response.writeHead(200);
//                     response.end(html);
//                 });
//             });
//         }
//     }
//     else if(pathname === '/create'){
//         fs.readdir('./data', 'utf8', function(error, filelist){
//             var title = 'Web create';
//             var list = template.list(filelist);
//             var html = template.html(title, list, `
//             <form action="/create_process" method="post">
//                 <p></p><input type="text" name="title" placeholder="Title"></p>
//                 <p>
//                     <textarea name="description" placeholder="description"></textarea>
//                 </p>
//                 <p>
//                     <input type="submit">
//                 </p>
//             </form>
//             `, '');
//             response.writeHead(200);
//             response.end(html);
//         })
//     }
//     else if(pathname === '/create_process'){
//         var body = '';
//         request.on('data',function(data){
//             body = body + data;
//         });
//         request.on('end', function(){
//             var post = qs.parse(body);
//             var title = post.title;
//             var description = post.description;
//             fs.writeFile(`data/${title}`, description, 'utf8', function(err){
//                 response.writeHead(302, {Location: `/?id=${qs.escape(title)}`});
//                 response.end('success');
//             })
//         });
//     }
//     else if(pathname === '/update'){
//         fs.readdir('./data', 'utf8', function(error, filelist){
//             var filteredId = path.parse(queryData.id).base;
//             fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
//                 var title = queryData.id;
//                 var list = template.list(filelist);
//                 var html = template.html(title, list,
//                     `
//                     <form action="/update_process" method="post">
//                         <input type="hidden" name="id" placeholder="title" value="${title}">
//                         <p></p><input type="text" name="title" placeholder="Title" value="${title}"></p>
//                         <p>
//                             <textarea name="description" placeholder="description">${description}</textarea>
//                         </p>
//                         <p>
//                             <input type="submit">
//                         </p>
//                     </form>
//                     `,
//                     `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
//                 );
//                 response.writeHead(200);
//                 response.end(html);
//             });
//         });
//     }
//     else if (pathname ==='/update_process'){
//         var body = '';
//         request.on('data',function(data){
//             body = body + data;
//         });
//         request.on('end', function(){
//             var post = qs.parse(body);
//             var id = post.id;
//             var title = post.title;
//             var description = post.description;
//             fs.rename(`data/${id}`, `data/${title}`, function(err){
//                 fs.writeFile(`data/${title}`, description, 'utf8', function(err){
//                     response.writeHead(302, {Location: `/?id=${qs.escape(title)}`});
//                     response.end('success');
//                 })
//             });
//         });
//     }
//     else if (pathname ==='/delete_process'){
//         var body = '';
//         request.on('data',function(data){
//             body = body + data;
//         });
//         request.on('end', function(){
//             var post = qs.parse(body);
//             var id = post.id;
//             var filteredId = path.parse(id).base;
//             fs.unlink(`data/${filteredId}`, function(err){
//                 response.writeHead(302, {Location: `/`});
//                 response.end('success');
//             })
//         });
//     }
//     else{
//         response.writeHead(404);
//         response.end('Not found')
//     }
// });
// app.listen(3000);

