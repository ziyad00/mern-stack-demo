
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const user_get_all = (req, res, next) => {

    User.find()
      .exec()
      .then(docs => {
        const response = {
          count: docs.length,
          users: docs.map(doc => {
            const newDoc = {user_name: doc.user_name,counted_articles:doc.counted_articles}
            return {
              user: newDoc,
              request: {
                type: "GET",
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

const user_signup = (req, res, next) => {
  let credential = req.body.email ?? req.body.user_name;
  User.findByLogin(credential)
    .then(user => {
      if (user) {
        return res.status(409).json({
          message: "email or username exists" 
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              email: req.body.email,
              user_name: req.body.user_name,
              password: hash
            });
            user
              .save()
              .then(result => {

                console.log(result);
                User.findByLogin(credential)
    .then(user => {
      const token = jwt.sign(
        {
          credential: credential,
          userId: user._id
        },
        'secret',
        {
          expiresIn: "24d"
        }
      );
      return res.status(201).json({
        message: "User created",
        token: token,
      });
    });
              
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
    
};

const user_login = (req, res, next) => {
  let credential = req.body.email ?? req.body.user_name;
  User.findByLogin(credential)
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              credential: credential,
              userId: user._id
            },
            'secret',
            {
              expiresIn: "24d"
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token
          });
        }
        res.status(401).json({
          message: "Auth failed"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

export default {user_login,user_signup,user_get_all}