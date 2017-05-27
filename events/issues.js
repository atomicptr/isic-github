module.exports = function(request) {
    const action = request.body.action

    if(action === "opened") {
        const issue = request.body.issue

        return {
            url: issue.html_url,
            user: issue.user,
            repository: request.body.repository,
            content: issue.body,
            timestamp: new Date(issue.created_at),
            title: `New Issue #${issue.number}: ${issue.title}`
        }
    }
}