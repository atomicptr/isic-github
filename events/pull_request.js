module.exports = function(request) {
    const action = request.body.action

    const pull_request = request.body.pull_request

    if(action === "opened") {
        return {
            url: pull_request.html_url,
            user: pull_request.user,
            repository: request.body.repository,
            content: pull_request.body,
            timestamp: new Date(pull_request.created_at),
            title: `New Pull Request #${pull_request.number}: ${pull_request.title}`
        }
    } else if(action === "closed" && pull_request.merged) {
        return {
            url: pull_request.html_url,
            user: pull_request.user,
            repository: request.body.repository,
            content: pull_request.body,
            timestamp: new Date(pull_request.created_at),
            title: `Merged Pull Request #${pull_request.number}: ${pull_request.title}`
        }
    } else if(action === "closed") {
        return {
            url: pull_request.html_url,
            user: pull_request.user,
            repository: request.body.repository,
            content: pull_request.body,
            timestamp: new Date(pull_request.created_at),
            title: `Closed Pull Request #${pull_request.number}: ${pull_request.title}`
        }
    }
}