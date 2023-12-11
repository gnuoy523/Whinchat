const express = require('express');
//const bodyParser = require('body-parser');
const cors = require("cors");
const mongoose = require('mongoose');

const app = express();
const port = 3001;

const User = mongoose.model('user',{
    id: String,
    pwd: String
});


app.use(express.json()); // 수정: 함수 호출
app.use(express.urlencoded({extended: false}))
app.use(cors())

app.post('/signIn',async(req,res) => {

    // res.json({messege: "/post연결"});
    const {id,pwd} = req.body;

    console.log(req.body.id)
    console.log(req.body.pwd)
    // console.log("/post")
    const { MongoClient, ServerApiVersion } = require('mongodb');
    const uri = "mongodb://127.0.0.1:27017";

    // 데이터베이스와 컬렉션 이름
    const dbName = 'test1';
    const collectionName = 'user';

    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
    });
 
    // Connect the client to the server   (optional starting in v4.7)
    client.connect();
    console.log("connected")
    
    // var db;
    // db = client.db('test1');

    // db.collection('user').insertOne({id: 'id', pwd: 'pwd'})

    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    const data = await collection.findOne({ id: id });
    console.log('Fetched data:', data);
    

    if(data){
        if(data.pwd===pwd){
            res.json({messege: "Login suceessful! 김지영!!", cheked: true});
        }else{
            res.json({messege: "ID or PASSWORD error", cheked: false});
        }
    }else{
        res.json({messege: "ID or PASSWORD error", cheked: false});
    }
    
    // Ensures that the client will close when you finish/error
    client.close();
    console.log('Connection closed');
    
    // const user = data.find((u) => u.id === id && u.pwd === pwd);

    // if (user){
    //     res.json({messege: "Login suceessful! 이동건!!", cheked: true});
    // }
    // else{
    //     res.json({messege: "ID or PASSWORD error", cheked: false});
    //     //res.status(401).send("username or password error");
    // }
} );

app.post('/signUp', async (req, res) => {
  const { id, pwd } = req.body;

  console.log(req.body.id)
  console.log(req.body.pwd)

  const { MongoClient, ServerApiVersion } = require('mongodb');
  const uri = "mongodb://127.0.0.1:27017";

  const dbName = 'test1';  // Corrected typo here
  const collectionName = 'user';

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  client.connect();
  console.log("connected")

  const database = client.db(dbName);
  const collection = database.collection(collectionName);

  // Check if the user already exists
  const distinctId = await collection.findOne({ id });

  if (distinctId) {
    return res.json({ success: false, message: '이미 존재하는 ID입니다.' });
  } else {
    // User does not exist, create a new user and save it
    await collection.insertOne({ id, pwd });  // Create an object here, not User
    res.json({ success: true, message: '회원가입 성공' });
  }

  client.close();
  console.log('연결 해제');
});

app.listen(port,()=>(
    console.log("연결되었습니다.")
))