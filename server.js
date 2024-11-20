const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const { MongoClient } = require("mongodb");
const client = new MongoClient(MONGO_URI);
const dataBase = "db";
const articlesDb = "articles";
const detailArticle = "detailArticles";
// const { log } = require('console');



app.use(cors({
  origin: 'http://localhost:5173',
}));

async function start() {

  try {
    console.log("Connecting to:", process.env.MONGO_URI);
    await mongoose.connect(MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    })
  } catch (e) {
    console.log(e);
  }
};
start();

// DETAIL ARTICLES. DON'T USE THE DATA BASE.
app.get('/api/article/:id', (req, res) => {
  const articleId = req.params.id;
  const filePath = path.join(__dirname, 'article', `${articleId}.json`);

  if (fs.existsSync(filePath)) {
    const article = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    res.json(article);
  } else {
    res.status(404).json({ message: "Article not found" });
  }
});
// 

// const articlesPath = path.join(__dirname, 'articles.json');
// let articlesData = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));
// ARTICLES. USES A DATA BASE.
app.get('/api/articles', async (req, res) => {
  try {
    const db = client.db(dataBase);
    const article = db.collection(articlesDb);
    const cursor = article.find();
    res.json(cursor);
  } catch {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



app.post('/api/login', (res) => {
  res.send('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c')
})

app.use(express.json());

// METHOD POST USES A DATA BASE.
app.post('/api/article', async (req, res) => {
  const data = req.body;
  const db = client.db(dataBase);
  const article = db.collection(articlesDb);
  try {
    const articleData = { ...data };
    await article.insertOne(articleData);
    const result = db.article.find();
    console.log(result);

    // console.log(article);
    res.send('Article created successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating article');
  }
});
// 


// app.post('/api/article', async (req, res) => {
//   const data = req.body;
//   const folderPath = './news/';
//   let nextId = 1;

//   try {
//     // read existing articles to find the next available ID
//     const files = await fs.promises.readdir(folderPath);
//     const articleIds = files.map(file => parseInt(file.replace('.json', '')));
//     if (articleIds.length > 0) {
//       nextId = Math.max(...articleIds) + 1;
//     }

//     const filePath = `${folderPath}${nextId}.json`;
//     const articleData = { id: nextId, ...data };

//     await fs.promises.writeFile(filePath, JSON.stringify(articleData, null, 2));
//     res.send(`Article created with ID ${nextId}`);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error creating article');
//   }
// });



// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
