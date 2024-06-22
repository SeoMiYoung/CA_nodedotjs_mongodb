// 환경변수 사용 위해
require('dotenv').config()

const DB_URL = process.env.DB_URL
const PORT = process.env.PORT

// express 라이브러리를 사용하겠다는 의미
const express = require('express')
const app = express()

// 정적 폴더 등록
app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs')

// 서버와 mongoDB연결 코드
const { MongoClient } = require('mongodb')


let db
const url = DB_URL
new MongoClient(url).connect().then((client)=>{ // 몽고디비 접속
  console.log('DB연결성공')
  db = client.db('forum') // forum이라는 데이터베이스에 연결

  app.listen(PORT, () => {
    console.log('http://localhost:'+ PORT +' 에서 서버 실행중')
  })

}).catch((err)=>{ // 에러나면 이거 띄우기
  console.log(err)
})


app.get('/', (요청, 응답) => {
    응답.send('기본 페이지에요~')
})

// 누군가 /shop에 접속하면 DB에 뭔가 저장해보자
app.get('/shop', (요청, 응답) => {
    db.collection('shopData').insertOne({ // forum의 shopData에 저장됨
        name: 'seo',
        item: 'shirts',
        num: 1
    })
})

// 누가 /list로 접속하면 DB의 게시물들 가져오자
app.get('/list', async (요청, 응답) => {
    let result = await db.collection('shopData').find().toArray()
    // 어짜피 기본 경로는 view폴더로 되어있음 자동으로
    응답.render('list.ejs', { 글목록 : result })
})