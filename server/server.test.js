// requirements
const request = require("supertest");
const expect = require("expect");

const app = require("./server");
const {Todo} = require("../models");

var todos = [
  {text: "First Test Todo"},
  {text: "Second Test Todo"}
]

beforeEach(done => {
  Todo.remove()
  .then(() => Todo.insertMany(todos))
  .then((data) => {
    todos = data;
    return done();
  })
});

describe("Server", () => {
  it("should respond", done => {
    request(app)
    .get("/")
    .expect(200)
    .end(done);
  });

  it("should handle error", done => {
    request(app)
    .get("/random-route")
    .expect(404)
    .expect((req) => {
      expect(req.body).toIncludeKey("error")
    })
    .end(done);
  });
});

describe("POST /todos", () => {
  it("should create a new todo", done => {
    let text = "Test Todo";

    request(app)
    .post("/todos")
    .send({text})
    .expect(201)
    .expect(res => {
      expect(res.body.text).toBe(text);
    })
    .end(async function(err, res) {
      if(err) return done(err);

      try {
        const todos = await Todo.find({text});
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }
      catch(err) {
        done(err);
      }
    })
  });

  it("should not create a todo with invalid data", done => {
    request(app)
    .post("/todos")
    .send({})
    .expect(500)
    .expect(res => {
      expect(res.body.error).toIncludeKey("message");
    })
    .end(async function(err, res) {
      if(err) return done(err);

      try {
        const todos = await Todo.find();
        expect(todos.length).toBe(2);
        done();
      }
      catch(err) {
        done(err);
      }
    })
  })
});

describe("GET /todos", () => { 
  it("should get all todos", done => {
    request(app)
    .get("/todos")
    .expect(200)
    .expect(res => {
      expect(res.body).toIncludeKey("todos");
      expect(res.body.todos.length).toBe(2);
    })
    .end(done);
  });

  it("should get one todo", done => {
    request(app)
    .get(`/todos/${todos[0]._id}`)
    .expect(200)
    .expect(res => {
      expect(res.body.text).toBe(todos[0].text);
    })
    .end(done);
  });

  it("should not get todo with wrong ID", done=> {
    request(app)
    .get("/todos/4749402746438")
    .expect(404)
    .expect(res => {
      expect(res.body).toIncludeKey("error");
      expect(res.body.error).toIncludeKey("message");
    })
    .end(done);
  });
});

describe("PUT /todos", () => {
  it("should update existing todo", done => {
    request(app)
    .put(`/todos/${todos[0]._id}`)
    .send({completed: true})
    .expect(200)
    .expect(res => {
      expect(res.body.completed).toBe(true);
    })
    .end(done);
  });

  it("should return error if todo doesn't exist", done => {
    request(app)
    .put('/todos/43534544556')
    .expect(500)
    .expect(res => {
      expect(res.body).toIncludeKey("error");
      expect(res.body.error).toIncludeKey("message");
    })
    .end(done)
  });
});

describe("DELETE /todos", () => {
  it("should delete existing todo", done => {
    request(app)
    .delete(`/todos/${todos[0]._id}`)
    .expect(200)
    .expect(res => {
      expect(res.body).toIncludeKey("message");
      expect(res.body.message).toBe("Todo deleted!");
    })
    .end(async function(err, res) {
      if(err) return done(err);

      try {
        const todo = await Todo.findById(todos[0]._id);
        expect(todo).toNotExist();
        done();
      }
      catch(err) {
        done(err);
      }
    })
  });

  it("should return error if todo doesn't exist", done => {
    request(app)
    .delete('/todos/43534544556')
    .expect(500)
    .expect(res => {
       expect(res.body).toIncludeKey("error");
       expect(res.body.error).toIncludeKey("message");
    })
    .end(done)
  });
});