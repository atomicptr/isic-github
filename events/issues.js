module.exports = function(request) {
    const action = request.body.action

    const issue = request.body.issue

    if(action === "opened") {
        return {
            url: issue.html_url,
            user: issue.user,
            repository: request.body.repository,
            content: issue.body,
            timestamp: new Date(issue.created_at),
            title: `New Issue #${issue.number}: ${issue.title}`
        }
    } else if(action === "closed") {
        return {
            url: issue.html_url,
            user: issue.user,
            repository: request.body.repository,
            content: issue.body,
            timestamp: new Date(issue.created_at),
            title: `Closed Issue #${issue.number}: ${issue.title}`
        }
    } else if(action === "reopened") {
        return {
            url: issue.html_url,
            user: issue.user,
            repository: request.body.repository,
            content: issue.body,
            timestamp: new Date(issue.created_at),
            title: `Re-Opened Issue #${issue.number}: ${issue.title}`
        }
    }
}