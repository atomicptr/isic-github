module.exports = function(request) {
    const action = request.body.action

    const commits = request.body.commits

    if(commits.length > 0) {
        return {
            url: request.body.compare,
            user: request.body.sender,
            repository: request.body.repository,
            content: `* ${commits.map(c => c.message).join("\n* ")}`,
            timestamp: new Date(request.body.head_commit.timestamp),
            title: `${commits.length} commit${commits.length > 1 ? "s" : ""} pushed to ${request.body.repository.full_name}`
        }
    }
}