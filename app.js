const APP_PORT = process.env.PORT || 8081;
const APP_HOST = process.env.HOST || "0.0.0.0";
const TODOS_API_LIMIT = process.env.TODOS_API_LIMIT || 32;
const express = require('express');
const app = express();
app.use(express.json());

// { "title" : "Make Bacon Pancakes", "completed" : true }
const todos = [];
var seq = 1;

app.get('/', function(request, response) {
    response.send(todos);
});

app.get('/:id', function(request, response) {
    todos.forEach(function(item, index, array) {
        if(request.params.id == item.id) {
            response.send(item);
        }
    });    
    response.status(404).send("Not found todo.id=" + request.params.id);
});

app.post('/', function(request, response) {
    if(todos.length < TODOS_API_LIMIT) {
        var todo = request.body;
        todo.id = seq++;
        todos.push(todo);
        response.status(201).send(todo);
    } else {
        response.status(400).send("todos.api.limit=" + TODOS_API_LIMIT + " todos.length=" + todos.length);
    }
});

app.patch('/:id', function(request, response) {
    todos.forEach(function(item, index, array) {
        if(request.params.id == item.id) {
            var todo = request.body;
            if(todo.title != null || todo.title != undefined) {
                item.title = todo.title;
            }
            if(todo.completed != null || todo.completed != undefined) {
                item.completed = todo.completed;
            }
            response.send(item);
        }
    });     
    response.status(404).send("Not found todo.id=" + request.params.id);
});

app.delete('/:id', function(request, response) {
    todos.forEach(function(item, index, array) {
        if(request.params.id == item.id) {
            todos.splice(index, 1);
            response.send(item);
        }
    }); 
});

app.listen(APP_PORT, function() {
    console.log(`Server running at ${APP_HOST}:${APP_PORT}`);
});
