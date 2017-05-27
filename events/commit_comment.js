module.exports = function(request) {
    const action = request.body.action

    if(action === "created") {
        const comment = request.body.comment

        const {html_url, body, user, created_at} = comment

        return {
            url: html_url,
            user: user,
            repository: request.body.repository,
            content: body,
            timestamp: new Date(created_at),
            title: `${user.login} commented on ${request.body.repository.full_name}`
        }
    }
}