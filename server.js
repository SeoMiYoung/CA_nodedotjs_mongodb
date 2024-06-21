// express 라이브러리를 사용하겠다는 의미
const express = require('express')
const app = express()

// 서버를 띄우는 코드임
// 하나의 포트를 오픈하는 코드
app.listen(8080, () => {
    console.log('http://localhost:8080 에서 서버 실행중')
})

// 간단 응답
app.get('/', (요청, 응답) => {
    응답.send('기본페이지입니다~')
})

// 페이지를 보여주려면
app.get('/shop', (요청, 응답) => {
    // __dirname은 server.js가 담긴 폴더를 의미
    응답.sendFile(__dirname + '/shop.html')
})
