var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/14.1_template.js');
var express = require('express')
//main에서는 'var app = express()'를 사용하지만 여기서는 'express.Router()' 메소드를 호출. -> 여기서는 app.get대신 router.get를 사용
var router = express.Router()

// main에서 router를 '/topic'으로 지정했으므로 get,post함수의 인자에서 '/topic'을 지워야함
router.get('/create', (request, response) => {
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

router.post('/create_process', (request, response)=>{
    var post = request.body;
    var title = post.title;
    var description = post.description;
    fs.writeFile(`data/${title}`, description, 'utf8', function(err){
        response.redirect(302, `/topic/${title}`);
    })
})

router.get('/update/:pageId', (request, response) => {
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

router.post('/update_process', (request, response) => {
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

router.post('/delete_process', (request, response) => {
    var post = request.body
    var id = post.id;
    var filteredId = path.parse(id).base;
    fs.unlink(`data/${filteredId}`, function(err){
        response.redirect(302, `/`);
    })
})

router.get('/:pageId', function(request, response, next){
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

});

module.exports = router;