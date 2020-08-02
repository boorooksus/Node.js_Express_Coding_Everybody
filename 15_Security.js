var express = require('express')
var app = express()
var port = 3000
var fs = require('fs');
var bodyParser = require('body-parser')
var compression = require('compression');
var topicRouter = require('./routes/14.2_topic.js');
var indexRouter = require('./routes/14.3_index.js');
// helmet 사용
var helmet = require('helmet');

app.use(helmet());
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(compression())
app.get('*', function(request, response, next){
    fs.readdir('./data', 'utf8', (error, filelist)=>{
        request.list = filelist;
        next();
    })
})

app.use('/topic', topicRouter);
app.use('/', indexRouter);

app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
})

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))


// 보안
// express.com -> advanced topics -> security best practices
// npm에서 helmet, nsp(-g) install
// nsp: npm에서 취약점 있는지 조사
// 추가 - nsp는 더이상 사용 안됨. 대신 audit 사용