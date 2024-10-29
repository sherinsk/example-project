const express=require('express');
const morgan=require('morgan');
const http=require('http')

const app=express();
const server=http.createServer(app);

app.use(express.json());
app.use(morgan('dev'))

app.use('/api/users',require('./src/routes/userRoutes'));


// Global error-handling middleware
app.use((error, req, res, next) => {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  });

  
const PORT=3000;
server.listen(PORT,()=>{
    console.log("Server is running on port",PORT)
})
