

import mongoose from 'mongoose';
import User from '../models/user.js';
import Article from '../models/article.js'

const article_get_all = (req, res, next) => {
  const user = User.findById(req.userData.userId);

console.log(user.email);
    Article.find()
    .where('user').equals(req.userData.userId)
      .exec()
      .then(docs => {
        const response = {
          count: docs.length,
          articles: docs.map(doc => {
            return {
              article: doc,
              request: {
                type: "GET",
                url: "http://localhost:3000/article/" + doc._id
              }
            };
          })
        };
        res.status(200).json(response);
    
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  };
  
const articles_create_article = (req, res, next) => {
  
 
    const article = new Article(req.body);
    article.user = req.userData.userId;
    article
      .save()
      .then(result => {
        res.status(201).json({
          message: "Created article successfully",
          createdSession: result, 
            request: {
              type: "GET",
              url: "http://localhost:3000/article/" + result._id
            }
          
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
      const user = User.findById(req.userData.userId).then(result => {
        const counted = result.counted_articles;
         User.updateOne({ _id: result.id }, { counted_articles: counted+1 }).where('_id').equals(req.userData.userId).then(doc => {
         });


      });
   


  };
  
  
const articles_get_article = (req, res, next) => {
    const id = req.params.articleId;
    Article.findById(id)
      .exec()
      .then(doc => {
        console.log("From database", doc);
        if (doc) {
          res.status(200).json({
            article: doc,
            request: {
              type: "GET",
              url: "http://localhost:3000/article"
            }
          });
        } else {
          res
            .status(404)
            .json({ message: "No valid entry found for provided ID" });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  };
  
const articles_update_article = async (req, res, next) => {
    const id = req.params.articleId;
    try {
    const result = await Article.updateOne({ _id: id }, { $set: req.body }).where('user').equals(req.userData.userId);
    const article = await Article.findById(id);
    res.status(200).json({
          message: "article updated",
          updated: article,
          request: {
            type: "GET",
            url: "http://localhost:3000/articles/" + id
          }
        });
      }
      catch(err)  {
        console.log(err);
        res.status(500).json({
          error: err
        });
      }; 
  };
  
const article_delete = (req, res, next) => {
    const id = req.params.articleId;
    Article.deleteOne({ _id: id }).where('user').equals(req.userData.userId)
      .exec()
      .then(result => {
        res.status(200).json({
          message: "article deleted",
          request: {
            type: "POST",
            url: "http://localhost:3000/articles",
          }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  };

export default {article_get_all,articles_create_article,
  articles_get_article,article_delete,articles_update_article}