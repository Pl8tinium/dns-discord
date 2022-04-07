## How to install discord bot
- follow the [tutorial](https://www.freecodecamp.org/news/create-a-discord-bot-with-javascript-nodejs/) to create the bot account
- uncheck "public bot" at the bot creation step 
- for now the bots permissions can be restricted to only "Send Messages", set this property at the "OAuth2 -> Url Generator" tab after selecting the scope "bot"
- login with the received url and pick the server the bot should join to
- paste the token received in the menu "Bot -> Token -> Reset Token" into the js script

## How to install telegram bot
- info upfront, does only work with the 'k' web-interface or the clients (tried it with telegram desktop for windows), dno why. but who's using the legacy or the z version anyway (deep link doesnt work for those interfaces)
- https://telegram.me/botfather register new bot , with /newbot , paste secret key into js file, also paste name into js file
- grab the chatId's when received and map them in the database where the dnsUserId's reside, use them to send the notification
- didnt find anything useful regarding shortcodes yet, but i guess random generation is also fine