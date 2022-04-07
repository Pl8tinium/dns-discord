const Telegram = require('node-telegram-bot-api');
const { EventEmitter } = require("stream");

botToken = ''
botName = ''

class TempUserAccess {
    constructor(dnsUserId, accessTime, accessCode) {
        this.dnsUserId = dnsUserId;
        this.accessCode = accessCode
        this.accessTime = accessTime;
    }

    dnsUserId = null;
    accessTime = 0;    
    accessCode = null;
}

class TelegramBot {    
    #client = null
    #tmpLoginDb = null

    // emits when user accesses the bot and the access code is valid 
    newLogin = new EventEmitter()

    // how long an access code should be valid in minutes
    #accessCodeValidLength = 5

    // literally how long the access code will be
    #accessCodeLength = 10

    constructor() {
        this.#tmpLoginDb = []
        this.#client = new Telegram(botToken, {polling: true});
        this.#client.on('message',(msg, type) => this.#userAccessedBot(msg, type))
    }

    #generateRandomString(length=6){
        return Math.random().toString(20).substr(2, length)
    }

    #isAccessCodeValid(user) {
        return user.accessTime + this.#accessCodeValidLength * 60 * 1000 > this.#currentTimeUnixInSeconds()
    }

    #currentTimeUnixInSeconds() {
        return Math.floor(Date.now() / 1000)
    }

    #userAccessedBot(msg, type) {  
        try {
            if (type['type'] === 'text') {
                const accessCode = msg['text'].substr(7)
                if (accessCode != '') {
                    for (const user of this.#tmpLoginDb) {
                        if (user.accessCode === accessCode && this.#isAccessCodeValid(user)) {
                            console.log('received bot login request for user', user.dnsUserId)
                            this.newLogin.emit('NewLogin', { dnsUserId: user.dnsUserId, chatId: msg['chat']['id'] })
                            break                 
                        }
                    }
                }
            }    
        }    
        catch(e) {
            console.log('Error while handling message', e)
        }
    }

    generateAccessUrlForUser(dnsUserId) {
        const user = new TempUserAccess(dnsUserId, this.#currentTimeUnixInSeconds(), this.#generateRandomString(this.#accessCodeLength))
        // not that memory efficient to keep the user in the tmpLoginDb, better way would be to have an additional "garbage collector" 
        // that removes entries after their expiration time, but its not a lot of data so it probably wont grow too much
        const idxOfExisting = this.#tmpLoginDb.findIndex(user => user.dnsUserId == dnsUserId)
        if (idxOfExisting != -1) {
            this.#tmpLoginDb.splice(idxOfExisting, 1)
        }
        this.#tmpLoginDb.push(user)

        return `http://t.me/${botName}?start=${user.accessCode}`
    }

    sendNotificationToUsers(chatIds, message) {
        console.log(`Sending message to ${chatIds.length} users`, message)
        chatIds.forEach(chatId => {            
            this.#client.sendMessage(chatId, message)
        })     
    }
}

// debug
bot = new TelegramBot()
exampleMsg = 'testmeee'
console.log(bot.generateAccessUrlForUser(5))
bot.newLogin.on('NewLogin', (newLogin) => {
    // map the dnsUserId with the chatId in the database!    
    console.log(newLogin.dnsUserId, newLogin.chatId)
    bot.sendNotificationToUsers([newLogin.chatId], exampleMsg)
})

module.exports.TelegramBot = TelegramBot