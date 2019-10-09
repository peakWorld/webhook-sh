const path = require('path')
const githubSsh = `https://github.com/peakWorld/`

class Utils {

    static isWebhookRequest(url, method, headers) {
        let isWebhookRequest = false
        const { ["user-agent"]: userAgent } = headers

        if (method.toLowerCase() === 'post'
            && userAgent.includes('GitHub-Hookshot')
            && /^\/webhook\?/.test(url)
        ) {
            isWebhookRequest = true
        }

        return isWebhookRequest
    }

    static checkUrl(url) {
        let msg = ''
        if (!url.includes('projectPath')) msg = '请求路径中必须包含 ?projectPath=xx , 且projectPath的值为项目在服务器中的地址'
        return msg
    }

    static urlInfo(url) {
        // 只有主分支提交代码才重新发布
        const onlyMaster = url.includes('&onlyMaster')
        let projectServerAddress = ''
        if (onlyMaster) {
            projectServerAddress = url.split('&')[0].split('=')[1]
        } else {
            projectServerAddress = url.split('=')[1]
        }
         
        return {
            onlyMaster,
            projectServerAddress
        }
    }

    static commitInfo(commitInfo, projectServerAddress) {
        const {
            ref,
            head_commit,
            before,
            after,
            repository,
        }  = commitInfo

        const { 
            message, 
            timestamp, 
            committer, 
            // added, 
            // modified 
        } = head_commit

        const projectName = path.basename(projectServerAddress)

        return {
            projectName,
            projectDesc: repository.description,
            projectHooksUrl: repository.hooks_url,

            commitPrevId: before,
            commitId: after,
            commitUserName: committer.name,
            commitTime: new Date(timestamp).toLocaleString(),
            commitMsg: message,

            // addedFiles: added,
            // modifiedFiles: modified,

            branchName: ref.split('/')[2],

            githubSsh: `${githubSsh}${projectName}.git`
        }
    }

    static log(info, level = 0) {
        const time = new Date().toLocaleString(); 
        let msg = `${time} => ${info}`

        switch(level) {
            case 0:
                console.log(msg)
                break
            case 1:
                console.warn(msg)
                break
            case 2:
                console.error(msg)
                break
        }
    }
}

module.exports = Utils