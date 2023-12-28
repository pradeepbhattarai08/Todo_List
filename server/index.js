const express=require("express");
const app=express();
const cors=require("cors");

//middleware
app.use(cors());
app.use(express.json()); //req.body
app.use(express.urlencoded({extended:true}));

//Connecting neon database
const postgres = require('postgres');
require('dotenv').config();

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

const sql = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: 'require',
  connection: {
    options: `project=${ENDPOINT_ID}`,
  },
});

async function getPgVersion() {
  const result = await sql`select version()`;
  console.log(result);
}

getPgVersion();

//ROUTES//

//create a todo
app.post("/todos", async(req,res)=>{
    try {
        const { description }=req.body;
        const newTodo =await sql`INSERT INTO todo (description)
        VALUES (${description})
        RETURNING *`;
        res.send(newTodo[0]);
        
    } catch (error) {
        res.status(500).send({msg:error});
    }
})


//get all todos 
app.get("/todos",async(req,res)=>{
    try {
        const allTodos=await sql`SELECT * FROM todo`;
        res.send(allTodos);
        
    } catch (error) {
        res.status(500).send({msg:error.msg})
    }
})

// get a todo 
app.get("/todos/:id",async(req,res)=>{
    try {
        const {id}=req.params;
        const todo=await sql`SELECT * FROM todo WHERE todo_id = (${id})`;
        res.send(todo);
    } catch (error) {
        res.status(500).send({ msg: error.message })
    }
})

// update a todo 
app.put("/todos/:id",async(req,res)=>{
    try {
        const {id}=req.params;
        const {description}=req.body;

        const updatedTodo=await sql`
        UPDATE todo
        SET description=${description}
        WHERE todo_id=${id}
        RETURNING *
        `;
        if(!updatedTodo.length){
            res.status(404).send({msg:'Todo not found'});
        } else{
            res.json(updatedTodo[0])
        }
        
    } catch (error) {
        res.status(500).send({msg:error.message});
    }
})

//delete a todo 
app.delete("/todos/:id",async (req,res)=>{
    try {
        const {id}=req.params;
        const existingTodo=await sql`SELECT * FROM todo WHERE todo_id=${id}`;

        if(!existingTodo.length){
            res.status(404).send("Todo not found");
        } else{
            await sql`DELETE FROM todo WHERE  todo_id=${id}`;
            res.status(204).send();
        }
    } catch (error) {
        res.status(500).send({msg:error.message});
        
    }
})

app.listen(5000,()=>{
    console.log("Server has started on port 5000");
});