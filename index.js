
const http = require('http')
const path = require('path')
const { execFileSync, execSync } = require('child_process')
const Utils = require('./utils.js')

http.createServer((req, res) => {
    const { url, headers, method } = req

    // 接口是否符合标准
    if (!Utils.isWebhookRequest(url, method, headers)) {
        Utils.log(`该${method}请求${url} 不是Github Webhooks接口!!`)
        res.end(`不是 Github Webhooks 接口!!`)
        return
    }

    // 路径是否符合标准(包含projectPath参数)
    const msg = Utils.checkUrl(url)
    if (msg) {
        Utils.log(`${method}请求${url} => ${msg}!!`)
        res.end(msg)
        return 
    }

    // 获取项目在服务器中的地址
    const projectServerAddress = Utils.projectServerAddress(url)

    req.setEncoding('utf8')
    let rawData = ''
    req.on('data', (chunk) => { rawData += chunk })

    req.on('end', () => {
        try {
            const {
                branchName,
                projectName,
                githubSsh,
                ...commitInfo
            } = Utils.commitInfo(JSON.parse(rawData), projectServerAddress)
            
            // execSync(`chmod a+x *.sh`)
            execFileSync(`./first-push.sh`, [
                projectServerAddress, 
                githubSsh,
                branchName
            ])
            
            res.end('ok')
        } catch (e) {
            Utils.log(e.message, 2)
            res.end('error')
        }
    });
})
.listen(10010)