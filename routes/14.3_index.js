var express = require('express')
var router = express.Router()
var template = require('../lib/14.1_template.js');

router.get('/', function(request, response){
    var title = 'Welcome';
    var description = 'Welcome';
    var list = template.list(request.list);
    var html = template.html(title, list, 
        `<p><h2>${title}</h2><img src="/images/coding.jpg" style="width:500px; display:block;">${description}</p>`,
        `<a href="/create">create</a>`
    );
    response.send(html);
});

module.exports = router;