
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
    const {
        projectServerAddress,
        onlyMaster
    } = Utils.urlInfo(url)

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

            res.end('ok')
        } catch (e) {
            Utils.log(e.message, 2)
            res.end('error')
        }
    });
})
.listen(10010)