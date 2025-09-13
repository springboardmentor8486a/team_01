require("dotenv").config();
const express = require("express");
const homeRoutes = require('./router/homeRoutes');
const adminRoutes = require('./router/adminRoutes');
const volunteerRoutes = require('./router/volunteerRoutes');
const authRoutes = require('./router/authRoutes');
const app = express();
const connectToDb = require('./database/db');
// middleware
app.use(express.json());

// connect the db
connectToDb();
app.get("/",()=>{
   res.status(200).json({
        success:"true",
        message:"welcome hari"
   })
});

// routes
app.use("/api/auth",authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/volunteer', volunteerRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
   console.log(`server is running on port:${PORT}`);
});

