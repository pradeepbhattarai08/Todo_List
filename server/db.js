const Pool = require("pg").Poll;

const dotenv=require('dotenv');
dotenv.config();



const poll=new Pool({
    connectionString:process.env.DATABASE_URL,
    ssl:{
        require:true,
    },
});

module.exports=poll;


// async function getPostgresVersion(){
//     const response =await sql`select version()`;
//     console.log(response);
// }

// getPostbresVersion();