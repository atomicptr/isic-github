const commitComment = require("./events/commit_comment.js")
const issueComment = require("./events/issue_comment.js")
const issues = require("./events/issues.js")
const pullRequestReviewComment = require("./events/pull_request_review_comment.js")
const pullRequest = require("./events/pull_request.js")
const push = require("./events/push.js")
const release = require("./events/release.js")

function handleEvent(eventType, request) {
    switch(eventType) {
        case "commit_comment": return commitComment(request)
        case "issue_comment": return issueComment(request)
        case "issues": return issues(request)
        case "pull_request_review_comment": return pullRequestReviewComment(request)
        case "pull_request": return pullRequest(request)
        case "push": return push(request)
        case "release": return release(request)
    }

    return null
}

module.exports = function(bot) {

    bot.command("github hookurl", (res, args) => {
        res.reply("???/service/ident/hook") // need to get url, probaby via setting

        // TODO: check if has permissions, if yes send person url and secret in PM
    })

    bot.service.post("/hook/:channelId", (req, res) => {
        function dig(obj, ident) {
            let item = Object.keys(obj).filter(n => n.toLowerCase() === ident.toLowerCase())
            if(item.length > 0) return obj[item[0]]
            return null
        }

        const event = dig(req.headers, "X-GitHub-Event")
        const signature = dig(req.headers, "X-Hub-Signature")
        const deliveryId = dig(req.headers, "X-Github-Delivery")
        const channelId = req.params.channelId

        // TODO: check if signature is valid

        let result = handleEvent(event, req)

        if(!result) {
            res.json({success: false})
            return
        }

        bot.debug(`isic-github hook called: ${result.title}, user: ${result.user.login}, repo: ${result.repository.full_name}`)

        bot.sendEmbedToChannel(bot.discord.findChannel(channelId), "", embed => {
            embed.addField("Username", result.user.login)
            embed.addField("Repository", result.repository.full_name)
            embed.setDescription(result.content || "")
            embed.setTitle(result.title)
            embed.setFooter("Powered by isic-github", "https://assets-cdn.github.com/favicon.ico")
            embed.setURL(result.url)
            embed.setTimestamp(result.timestamp)
            embed.setThumbnail(result.user.avatar_url)
        })

        res.json({success: true})
    })
}
