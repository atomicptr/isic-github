const commitComment = require("./events/commit_comment.js")
const issueComment = require("./events/issue_comment.js")
const issues = require("./events/issues.js")
const pullRequestReviewComment = require("./events/pull_request_review_comment.js")
const pullRequest = require("./events/pull_request.js")
const push = require("./events/push.js")
const release = require("./events/release.js")

const crypto = require("crypto")

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

    function secret(channelId, salt) {
        return bot.hash(`isic-github:${channelId}:${salt}`)
    }

    bot.command("github hookurl", (res, args) => {
        if(res.authorIsServerAdministrator) {
            bot.globalCollection("secretsalt").findOne({channelId: res.channelId}).then(salt => {
                let secretSalt = bot.uuid()

                if(salt) {
                    secretSalt = salt.salt
                }

                const mysecret = secret(res.channelId, salt)

                res.send("I've created the necessary values, you just have to follow the instructions I've sent you via PM to complete the process.")
                res.sendDirectMessage(
                    `Hello, follow these steps to setup a Webhook:\n\n` +
                    `\* Go to the repository, you plan to hook up\n` +
                    `\* Go to "Settings"\n` +
                    `\* Select "Webhooks"\n` +
                    `\* Press the "Add webhook" button\n` +
                    `\* Add this **Payload URL**: ${bot.bot.config.services.baseurl}/service/${bot.identifier}/hook/${res.channelId}\n` +
                    `\* Select the **Content type** application/json\n` +
                    `\* Add this **secret**: ${mysecret}\n` +
                    `\* Select which events should trigger the webhook\n` +
                    `\* Press "Add webhook"\n` +
                    `\* Done! :)`
                )

                bot.globalCollection("secretsalt").updateOne(
                    {channelId: res.channelId}, {
                        $set: {channelId: res.channelId},
                        $setOnInsert: {salt: secretSalt}
                    },
                    {upsert: true}
                )
            })
        } else {
            res.reply("You don't have the neccessary permissions to do this.")
        }
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

        bot.globalCollection("secretsalt").findOne({channelId}).then(salt => {
            if(!salt) {
                bot.debug(`Received message for channelId: ${channelId} but there is no salt for it, can't check if secret is valid`)
                return
            }

            const secretSalt = salt.salt

            const calculatedSignature = crypto.createHmac("sha1", secret(channelId, secretSalt)).update(JSON.stringify(req.body)).digest("hex")

            bot.debug(`Calculated SHA1-HMAC is ${calculatedSignature}, signature by GitHub is ${signature}. Equals? ${calculatedSignature === signature}`)

            if(calculatedSignature === signature) {
                let result = handleEvent(event, req)

                if(!result) {
                    res.status(400)
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
            }
        })
    })
}
