import mongoose from 'mongoose';
import express from 'express';
import morgan from 'morgan';
import checkAuth from './middleware/check-auth.js'

import userRoutes from './routes/user.js';
import articleRoutes from './routes/article.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from "swagger-ui-express"

import models, { connectDb } from './models/index.js';
import cors from 'cors';


// express app
const app = express();



  
connectDb().then(async () => {
    app.listen(8000, () =>
      console.log(`app running`),
    );
  });  


const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "article api",
      description: "api for articles",
      contact: {
        name: "ziyad alotaibi"
      },
      servers: ['http://localhost:3000']

    }
  },
  apis: ["app.js","./routes/*.js"]
};

const swaggerDoc = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

// middleware & static files
app.use(cors())
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization,true"
  );
  res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");

  if (req.method === "OPTIONS") {

    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});


app.use("/users", userRoutes);
app.use("/articles", articleRoutes);

app.get("/",checkAuth, (req, res, next)=>{
  console.log(req.userData.userId)
  return res.json({message : "testing"});

});

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});


