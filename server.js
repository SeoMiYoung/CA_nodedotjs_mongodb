// express 라이브러리를 사용하겠다는 의미
const express = require('express')
const app = express()

// 서버를 띄우는 코드임
// 하나의 포트를 오픈하는 코드
app.listen(8080, () => {
    console.log('http://localhost:8080 에서 서버 실행중')
})

// 누가 main페이지에 접속 시, '반갑다'를 user에게 응답하시오.
app.get('/', (요청, 응답) => {
    응답.send('반갑다')
})

app.get('/news', (요청, 응답) => {
    응답.send('오늘의 뉴스입니다~')
})
