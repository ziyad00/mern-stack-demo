import express from 'express';
const router = express.Router();

import ArticleController from '../controllers/article.js';
import checkAuth from '../middleware/check-auth.js'

router.get("/", checkAuth, ArticleController.article_get_all);

router.post("/", checkAuth, ArticleController.articles_create_article);

router.get("/:articleId", ArticleController.articles_get_article);

router.patch("/:articleId", checkAuth, ArticleController.articles_update_article);

router.delete("/:articleId", checkAuth, ArticleController.article_delete);


export default router
