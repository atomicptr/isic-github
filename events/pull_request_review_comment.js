module.exports = function(request) {
    const action = request.body.action

    if(action === "created") {
        const pull_request = request.body.pull_request
        const comment = request.body.comment

        return {
            url: comment.html_url,
            user: comment.user,
            repository: request.body.repository,
            content: comment.body,
            timestamp: new Date(comment.created_at),
            title: `New comment on Pull Request #${pull_request.number}: ${pull_request.title}`
        }
    }
}