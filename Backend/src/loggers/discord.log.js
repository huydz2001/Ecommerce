'use strict'

const { TOKEN_DISCORD, CHANNEL_BOT_ID } = process.env
const { Client, GatewayIntentBits } = require('discord.js')

class LoggerService {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.MessageContent
            ]
        })

        // add channel id
        this.channelId = CHANNEL_BOT_ID

        this.client.on('ready', () => {
            console.log(`Logged in as ${this.client.user.tag}`)
        })

        this.client.login(TOKEN_DISCORD)
    }

    sendToFormatCode(logData) {
        console.log(logData)
        const { code, message = 'This is some additional information about code.', title = 'Code excample' } = logData

        const codeMessage = {
            content: message,
            embeds: [
                {
                    color: parseInt('00ff00', 16),
                    title,
                    description: '```json\n' + JSON.stringify(code, null, 2) + '\n```'
                }
            ]
        }
        this.sendToMessage(codeMessage)
    }

    sendToMessage(message = 'message') {
        const channel = this.client.channels.cache.get(this.channelId)
        if (!channel) {
            console.error(`Couldn't find the channel ...`, this.channelId)
            return
        }
        channel.send(message).catch(e => console.error(e))
    }
}

module.exports = new LoggerService()