const { Client, Intents } = require("discord.js");
const { EventEmitter } = require("stream");


botToken = 'OTYxNjEwMTg4MjMyNzI4NTc2.Yk7fRg.5zAIeonz343eVU5wEGPXhZtlcpA'

class DiscordBot {    
    #client = null
    #loggedIn = false
    loginSuccessful = new EventEmitter()

    constructor() {
        this.#client = new Client({ intents: [Intents.FLAGS.GUILDS] })

        this.#client.on("ready", () => {
            console.log(`Logged in as ${this.#client.user.tag}!`)
            this.#loggedIn = true
            this.loginSuccessful.emit('');            
        })

        this.#client.login(botToken)
    }

    sendNotificationToUsers(userIds, message) {
        if (this.#loggedIn) {
            console.log(`Sending message to ${userIds.length} users`, message)
            userIds.forEach(userId => {
                this.#client.users.fetch(userId).then(user => {
                    user.send(message)
                })
            })
        } else {
            console.log('Not logged in, yet')
        }        
    }
}

// debug
bot = new DiscordBot()
testIds = ['368485242073513994', '368485242073513994']
propagatedMessage = 'testmeee'
bot.loginSuccessful.on('', () => {
    bot.sendNotificationToUsers(testIds, propagatedMessage)
});

module.exports.DiscordBot = DiscordBot