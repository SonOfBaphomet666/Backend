const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;


// const { MongoClient } = require("mongodb");

// const client = new MongoClient(MONGO_URI);

// const db = client.db("articles");
// const coll = db.collection("detailArticle");

// const docs = [
//   { name: "Hui" },
//   { name: "Govno" }
// ];

// const result = coll.insertMany(docs);

// console.log(result.insertedIds);


app.use(cors({
  origin: 'http://localhost:5173',
}));

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    })
  } catch (e) {
    console.log(e);
  }
};
start();





const articlesPath = path.join(__dirname, 'articles.json');
let articlesData = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));


app.get('/api/articles', (req, res) => {
  // if (req.query.forceError === 'true') { // добавляем условие для имитации ошибки = /api/articles?forceError=true
  //     res.status(500).json({ message: 'Internal Server Error (simulated)' });
  //     return;
  // }
  if (articlesData && Array.isArray(articlesData)) {
    let limit = parseInt(req.query.limit) || 10;
    let offset = parseInt(req.query.offset) || 0;
    let tag = req.query.tag;
    let articles = [];

    if (tag) {
      articles = articlesData.filter((article) => article.tag === tag).slice(offset, offset + limit);
    } else {
      articles = articlesData.slice(offset, offset + limit);
    }
    // res.status(500).json({ message: 'Internal Server Error' });
    // setTimeout()
    res.json(articles);
  } else {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

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

app.post('/api/login', (res) => {
  res.send('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c')
})


// app.post('/api/article', async (req, res) => {
//   const data = req.body;
//   const path = './article.json';

//   try {
//     let articles = await fs.promises.readFile(path, 'utf8');
//     if (!articles) {
//       articles = [];
//     } else {
//       articles = JSON.parse(articles);
//     }

//     const newArticleId = Math.max(...articles.map(article => article.id), 0) + 1;
//     articles.push({ id: newArticleId, ...data });
//     await fs.promises.writeFile(path, JSON.stringify(articles, null, 2));
//     res.send(`Article created with ID ${newArticleId}`);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error creating article');
//   }
// });

app.use(express.json());

app.post('/api/article', async (req, res) => {
  const data = req.body;
  const folderPath = './news/';
  let nextId = 1;

  try {
    // read existing articles to find the next available ID
    const files = await fs.promises.readdir(folderPath);
    const articleIds = files.map(file => parseInt(file.replace('.json', '')));
    if (articleIds.length > 0) {
      nextId = Math.max(...articleIds) + 1;
    }

    const filePath = `${folderPath}${nextId}.json`;
    const articleData = { id: nextId, ...data };

    await fs.promises.writeFile(filePath, JSON.stringify(articleData, null, 2));
    res.send(`Article created with ID ${nextId}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating article');
  }
});



// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
