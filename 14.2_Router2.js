var express = require('express')
var app = express()
var port = 3000
var fs = require('fs');
var bodyParser = require('body-parser')
var template = require('./lib/14.1_template.js');
var compression = require('compression');
var topicRouter = require('./routes/14.2_topic.js');

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(compression())
app.get('*', function(request, response, next){
    fs.readdir('./data', 'utf8', (error, filelist)=>{
        request.list = filelist;
        next();
    })
})

//'/topic'을 주소로 가지면 'topicRouter' middleware 적용
app.use('/topic', topicRouter);

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

app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
})

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))


// 라우터 - 파일로 분리