var express = require('express')
var app = express()
var port = 3000
var fs = require('fs');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var bodyParser = require('body-parser')
var template = require('./lib/14.1_template.js');
var compression = require('compression')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(compression())
app.get('*', function(request, response, next){
    fs.readdir('./data', 'utf8', (error, filelist)=>{
        request.list = filelist;
        next();
    })
})

app.get('/', function(request, response){
    var title = 'Welcome';
    var description = 'Welcome';
    var list = template.list(request.list);
    var html = template.html(title, list, 
        `<p><h2>${title}</h2><img src="/images/coding.jpg" style="width:500px; display:block;">${description}</p>`,
        `<a href="/create">create</a>`
    );
    response.send(html);
});

// 기존 '/page/:pageId'를 아래 쪽으로 내려서 'topic/create, update, delete'가 먼저 수행되도록 함(안그러면 data파일에서 create,update, delete 파일을 찾아서 불러오는 함수가 먼저 실행되어버림).
app.get('/topic/create', (request, response) => {
    var title = 'Web create';
    var list = template.list(request.list);
    var html = template.html(title, list, `
    <form action="/topic/create_process" method="post">
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

app.post('/topic/create_process', (request, response)=>{
    var post = request.body;
    var title = post.title;
    var description = post.description;
    fs.writeFile(`data/${title}`, description, 'utf8', function(err){
        response.redirect(302, `/topic/${title}`);
    })
})

app.get('/topic/update/:pageId', (request, response) => {
    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
        var title = request.params.pageId;
        var list = template.list(request.list);
        var html = template.html(title, list,
            `
            <form action="/topic/update_process" method="post">
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
            `<a href="/topic/create">create</a> <a href="/topic/update/${title}">update</a>`
        );
        response.send(html);
    });
})

app.post('/topic/update_process', (request, response) => {
    var post = request.body;
    var id = post.id;
    var title = post.title;
    var description = post.description;
    fs.rename(`data/${id}`, `data/${title}`, function(err){
        fs.writeFile(`data/${title}`, description, 'utf8', function(err){
            response.redirect(302, `/topic/${title}`);
        })
    });
})

app.post('/topic/delete_process', (request, response) => {
    var post = request.body
    var id = post.id;
    var filteredId = path.parse(id).base;
    fs.unlink(`data/${filteredId}`, function(err){
        response.redirect(302, `/`);
    })
})

app.get('/topic/:pageId', function(request, response, next){
    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
        if(err){
            next(err);
        }
        else{
            var title = request.params.pageId;
            var sanitizedTitle = sanitizeHtml(title);
            var sanitizedDescription = sanitizeHtml(description);
            var list = template.list(request.list);
            var html = template.html(title, list, `<p><h2>${sanitizedTitle}</h2>${sanitizedDescription}</p>`, `<a href="/topic/create">create</a>
            <a href="/topic/update/${sanitizedTitle}">update</a>
            <form action=
            "/topic/delete_process" method="post" onsubmit="return confirm('Do you want to delete?')">
                <input type="hidden" name="id" value="${sanitizedTitle}"><input type="submit" value="delete">
            </form>
            `);
            response.send(html);
        }
    });

})

app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
})

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))


// 라우터 - 주소체계 변경