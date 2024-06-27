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
// 요청.body쓰기 위해서
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// 서버와 mongoDB연결 코드
const { MongoClient, ObjectId } = require('mongodb')


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
    응답.render('main.ejs')
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

app.get('/write', async (요청, 응답) => {
    응답.render('write.ejs')
})

app.post('/add', async (요청, 응답) => {
    // user가 입력한 데이터를 출력하기 위해
    console.log(요청.body)

    try {
        // 제목이 비어있을 경우에는 db에 저장하지 마세요.
        if (요청.body.title == '' ) {
            응답.send('제목입력 안했는데?')
        }
        else {
            await db.collection('shopData').insertOne({
                title: 요청.body.title,
                content: 요청.body.content
            })
        
            // 데이터를 DB에 저장하고 나서, redirect로 다른 페이지 이동
            응답.redirect('/list')
        } 
    } catch(e) {
        // 어떤 에러인지 출력해보고 싶다면?
        console.log(e)

        // [센스] 그냥 응답.send해도 되는데, 500이거 적어주면, 서버 잘못이라고 명시해주는거임
        응답.status(500).send('서버 자체에 에러났다구요~')
    }
})


app.get('/detail/:id', async(요청, 응답) => {
    // collection에 있는 조건에 맞는 가장 첫번째 document만 가져와주세요.
    let result = await db.collection('shopData').findOne({ _id : new ObjectId(요청.params.id)})
    console.log(result)
    응답.render('detail.ejs', {result: result})
})