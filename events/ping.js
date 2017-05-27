module.exports = function(request) {
    console.log(request.body.zen)

    return {
        ping: true
    }
}