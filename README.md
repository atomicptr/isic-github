# isic-github

isic module that notifies chats about changes in GitHub repositories

## Usage

### How can I connect a webhook with the bot?

Firstly, you have to have **services** enabled. Secondly you have to post into the desired channel:

``!github hookurl``

The bot will send you the Webhook URL and a secret you can use for this channel. **Keep the secret, secret!**. If someone gets access to this, they can potentially
add arbitrary repository hooks to your channel.

### How to limit what the bot posts

Just limit the permissions of the webhook to whatever you need.

## Limitations

Currently not all events from Webhooks are supported (also not all of them actually make sense), here is a list of events the bot can respond to:

* commit\_comment: When someone comments on a commit
* issue\_comment: When someone comments on an issue
* issues: Whenever someone opens/closes an issue
* pull\_request\_review\_comment: When someone comments on a PRs unified diff
* pull\_request: When someone opens/closes a pull request
* push: When someone pushes commits/tags
* release: When a new release is created

## License

MIT