const express=require("express");
const app=express();
const cors=require("cors");

const poll=require("./db.js");


//middleware
app.use(cors());
app.use(express.json()); //req.body
app.use(express.urlencoded({extended:true}));

//ROUTES//

//create a todo
app.post("/todos", async(req,res)=>{
    try {

        
    } catch (error) {
        console.error(err.message);
    }
})


//get all todos 

// get a todo 

// update a todo 



app.listen(5000,()=>{
    console.log("Server has started on port 5000");
});