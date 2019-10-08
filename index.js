
const http = require('http')

http.createServer((req, res) => {
    const { method, url, headers } = req
    
    console.log('*'.repeat(50))
    console.log(method)
    console.log(url)
    console.log(headers)
    console.log('*'.repeat(50))

    console.log(req)

    console.log('*'.repeat(50))
    res.end('ok')
})
.listen(10010)