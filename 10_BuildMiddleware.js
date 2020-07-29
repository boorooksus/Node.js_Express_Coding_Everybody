var express = require('express')
var app = express()
var port = 3000
var fs = require('fs');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var bodyParser = require('body-parser')
var template = require('./lib/5.2_template.js');
var compression = require('compression')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(compression())
// 'fs.readdir' 함수를 middleware로 만들기
//app.use 대신 app.get('*', ~ )을 이용하면 get 방식의 요청에 대해서만 실행
app.get('*', function(request, response, next){
    fs.readdir('./data', 'utf8', (error, filelist)=>{
        request.list = filelist;
        next();
    })
})

app.get('/', function(request, response){
    // 직접 만든 middleware를 이용하여 아래 코드와 같은 코드 구현
    var title = 'Welcome';
    var description = 'Welcome';
    var list = template.list(request.list);
    var html = template.html(title, list, 
        `<p><h2>${title}</h2>${description}</p>`,
        `<a href="/create">create</a>`
    );
    response.send(html);

    // fs.readdir('./data', 'utf8', (error, filelist)=>{
    //     var title = 'Welcome';
    //     var description = 'Welcome';
    //     var list = template.list(filelist);
    //     var html = template.html(title, list, 
    //         `<p><h2>${title}</h2>${description}</p>`,
    //         `<a href="/create">create</a>`
    //     );
    //     response.send(html);
    // })
});

app.get('/page/:pageId', function(request, response){
    // 직접 만든 middleware를 이용하여 readdir 수정
    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
        var title = request.params.pageId;
        var sanitizedTitle = sanitizeHtml(title);
        var sanitizedDescription = sanitizeHtml(description);
        var list = template.list(request.list);
        var html = template.html(title, list, `<p><h2>${sanitizedTitle}</h2>${sanitizedDescription}</p>`, `<a href="/create">create</a>
        <a href="/update/${sanitizedTitle}">update</a>
        <form action=
        "/delete_process" method="post" onsubmit="return confirm('Do you want to delete?')">
            <input type="hidden" name="id" value="${sanitizedTitle}"><input type="submit" value="delete">
        </form>
        `);
        response.send(html);
    });

})

app.get('/create', (request, response) => {
    // 직접 만든 middleware를 이용하여 readdir 수정
    var title = 'Web create';
    var list = template.list(request.list);
    var html = template.html(title, list, `
    <form action="/create_process" method="post">
        <p></p><input type="text" name="title" placeholder="Title"></p>
        <p>
            <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
            <input type="submit">
        </p>
    </form>
    `, '');
    response.send(html);
})

app.post('/create_process', (request, response)=>{
    var post = request.body;
    var title = post.title;
    var description = post.description;
    fs.writeFile(`data/${title}`, description, 'utf8', function(err){
        response.redirect(302, `/page/${title}`);
    })
})

app.get('/update/:pageId', (request, response) => {
    // 직접 만든 middleware를 이용하여 readdir 수정
    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
        var title = request.params.pageId;
        var list = template.list(request.list);
        var html = template.html(title, list,
            `
            <form action="/update_process" method="post">
                <input type="hidden" name="id" placeholder="title" value="${title}">
                <p></p><input type="text" name="title" placeholder="Title" value="${title}"></p>
                <p>
                    <textarea name="description" placeholder="description">${description}</textarea>
                </p>
                <p>
                    <input type="submit">
                </p>
            </form>
            `,
            `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
        );
        response.send(html);
    });
})

app.post('/update_process', (request, response) => {
    var post = request.body;
    var id = post.id;
    var title = post.title;
    var description = post.description;
    fs.rename(`data/${id}`, `data/${title}`, function(err){
        fs.writeFile(`data/${title}`, description, 'utf8', function(err){
            response.redirect(302, `/page/${title}`);
        })
    });
})

app.post('/delete_process', (request, response) => {
    var post = request.body
    var id = post.id;
    var filteredId = path.parse(id).base;
    fs.unlink(`data/${filteredId}`, function(err){
        response.redirect(302, `/`);
    })
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))


// middleware 만들기

