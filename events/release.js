module.exports = function(request) {
    const action = request.body.action
    const release = request.body.release

    const isPrerelease = release.prerelease

    if(action === "published" && !release.draft) {
        return {
            url: release.html_url,
            user: release.author,
            repository: request.body.repository,
            content: release.body,
            timestamp: new Date(release.created_at),
            title: `${isPrerelease ? "Pre-Release: " : ""} ${release.name || release.tag_name || "Release"} published.`
        }
    }
}