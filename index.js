
const http = require('http')
const path = require('path')
const { execFileSync, execSync } = require('child_process')
const Utils = require('./utils.js')

http.createServer((req, res) => {
    let { url, headers, method } = req

    Utils.log(`*`.repeat(100))

    url = decodeURIComponent(url)

    // 接口是否符合标准
    Utils.log(`检查接口是否为github-webhook请求${'-'.repeat(5)}`)
    if (!Utils.isWebhookRequest(url, method, headers)) {
        Utils.log(`该${method}请求${url} 不是Github Webhooks接口!!`)
        Utils.log(`*`.repeat(100))
        res.end(`不是 Github Webhooks 接口!!`)
        return
    }
    Utils.log(`接口符合标准${'-'.repeat(5)}`)

    // 路径是否符合标准(包含projectPath参数)
    Utils.log(`检查路径是否符合标准${'-'.repeat(10)}`)
    const msg = Utils.checkUrl(url)
    if (msg) {
        Utils.log(`${method}请求${url} => ${msg}!!`)
        Utils.log(`*`.repeat(100))
        res.end(msg)
        return 
    }

    // 获取项目在服务器中的地址
    const {
        projectServerAddress,
        onlyMaster
    } = Utils.urlInfo(url)

    Utils.log(`路径中包含参数projectPath=${projectServerAddress}${'-'.repeat(10)}`)

    Utils.log(`接受payload数据${'-'.repeat(15)}`)

    req.setEncoding('utf8')
    let rawData = ''
    req.on('data', (chunk) => { rawData += chunk })

    req.on('end', () => {
        try {
            Utils.log(`已完成接受payload数据, 开始解析数据${'.'.repeat(15)}`)
            const {
                branchName,
                projectName,
                githubSsh,
                ...commitInfo
            } = Utils.commitInfo(JSON.parse(rawData), projectServerAddress)
            Utils.log(`解析数据已完成${'.'.repeat(15)}`)

            const {
                projectDesc,
                commitUserName,
                commitTime,
                commitMsg
            } = commitInfo

            Utils.log(`自动发布开始: 项目${projectName}(${projectDesc}) 被开发者 ${commitUserName} 于 ${commitTime} 提交分支(${branchName})代码(提交注释: ${commitMsg})`)

            // execSync(`chmod a+x *.sh`)
            execFileSync(`./auto-publish.sh`, [
                projectServerAddress, 
                githubSsh,
                branchName,
                onlyMaster
            ])
            
            Utils.log(`自动发布结束: 项目${projectName}(${projectDesc}) 被开发者 ${commitUserName} 于 ${commitTime} 提交分支(${branchName})代码(提交注释: ${commitMsg})`)

            Utils.log(`*`.repeat(50))
            res.end('ok')
        } catch (e) {
            Utils.log(e.message, 2)
            Utils.log(`*`.repeat(100))
            res.end('error')
        }
    });
})
.listen(10010)