const express = require('express');
const app = express();

const bodyParser = require('body-parser');      // Importing Body Parser
app.use(bodyParser.json());                     // using body parser

app.get("/",(req,res)=>{
    res.send("Hello World");
})

const PORT=process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log("listening to port:3000");
    
}); 