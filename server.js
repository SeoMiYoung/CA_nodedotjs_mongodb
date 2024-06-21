// 환경변수 사용 위해
require('dotenv').config()

const DB_URL = process.env.DB_URL
const PORT = process.env.PORT

// express 라이브러리를 사용하겠다는 의미
const express = require('express')
const app = express()

// 정적 폴더 등록
app.use(express.static(__dirname + '/public'))


// 서버와 mongoDB연결 코드
const { MongoClient } = require('mongodb')


let db
const url = DB_URL
new MongoClient(url).connect().then((client)=>{
  console.log('DB연결성공')
  db = client.db('forum')

  app.listen(PORT, () => {
    console.log('http://localhost:'+ PORT +'에서 서버 실행중')
  })

}).catch((err)=>{
  console.log(err)
})
