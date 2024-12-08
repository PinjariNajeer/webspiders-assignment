import  express from 'express';
import 'dotenv/config'
import connectDB from './config/mongodb.js';
import taskRouter from './routes/taskRoute.js';
//  app config 
const app = express();
const port = process.env.PORT 
connectDB()


// middleware
app.use(express.json())

// api endpoints 
app.use('/', taskRouter);

// localhost:4000/tasks
app.get('/', (req, res) => {
    res.send("API WORKING")
})



app.listen(port, () => {
    console.log("Server is Started", port)
})