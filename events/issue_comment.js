module.exports = function(request) {
    const action = request.body.action

    if(action === "created") {
        const issue = request.body.issue
        const comment = request.body.comment

        return {
            url: comment.html_url,
            user: comment.user,
            repository: request.body.repository,
            content: comment.body,
            timestamp: new Date(comment.created_at),
            title: `New comment on Issue #${issue.number}: ${issue.title}`
        }
    }
}