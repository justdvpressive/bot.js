const Discord = require('discord.js');
const client = new Discord.Client({
    clientOptions: {
        fetchAllMembers: true
    }
});
client.commands = new Discord.Collection();
const yt = require('ytdl-core');
var youtubeSearch = require('youtube-search');
var youtube = require("youtube-api");
var fs = require("fs");
let voiceban = require("./voiceban.json");
const config = require("./config.json");
const prefix = config.prefix;
var lock = false;
const DBL = require("dblapi.js");
const dbl = new DBL(config.dbl.token, client);
let reqV = config.dbl.requireVote;
const request = require('request');
let urls = require("./urls.json");
var clc = require("cli-colors");
var queuefile = require('./commands/music/f/queue.js');
require('./events/eventLoader')(client);

fs.readdir("./commands/", (err, files) => {
    if(err) console.log(err);
    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if(jsfile.length <= 0){
      console.log(clc.red("Nie znaleziono komend w /commands/"));
      return;
    }
  
    jsfile.forEach((f, i) =>{
      let props = require(`./commands/${f}`);
      console.log(clc.green(`${f} zostalo zaladowane!`));
      client.commands.set(props.help.name, props);
      client.commands.set(props.help.aliases, props);
    });
  });
fs.readdir("./commands/dev/", (err, files) => {
    if(err) console.log(err);
    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if(jsfile.length <= 0){
      console.log(clc.red("Nie znaleziono komend w /commands/dev/"));
      return;
    }
  
    jsfile.forEach((f, i) =>{
      let props = require(`./commands/dev/${f}`);
      console.log(clc.green(`${f} zostalo zaladowane!`));
      client.commands.set(props.help.name, props);
    });
});
fs.readdir("./commands/music/", (err, files) => {
    if(err) console.log(err);
    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if(jsfile.length <= 0){
      console.log(clc.red("Nie znaleziono komend w /commands/music/"));
      return;
    }
  
    jsfile.forEach((f, i) =>{
      let props = require(`./commands/music/${f}`);
      console.log(clc.green(`${f} zostalo zaladowane!`));
      client.commands.set(props.help.name, props);
      client.commands.set(props.help.aliases, props);
    });
});

module.exports.ustaw_status = async () => ustaw_status();

function ustaw_status() {
    if (client.guilds.size == 1) {
        client.user.setActivity(`testowanie na 1 serwerze | Prefix: ${prefix}`, { type: 'WATCHING' });
    } else {
        client.user.setActivity(`testowanie na ${client.guilds.size} serwerach | Prefix: ${prefix}`, { type: 'WATCHING' });
    }
}

client.on("voiceStateUpdate", (oldMem, newMem) => {
    var vChann = oldMem.voiceChannel;
    if (oldMem.guild.voiceConnection) {
        if (vChann == oldMem.guild.voiceConnection.channel) {
            if (vChann.members.size == 1) {
                setTimeout(() => {
                    if (oldMem.guild.voiceConnection.channel.members.size == 1) {
                        oldMem.guild.voiceConnection.channel.leave();
                        queuefile.setvolume(oldMem.guild.id, 100);
                    }
                }, 300000); //300000 ms = 5 min
            }
        }
    }
    if(lock) return;
    var vChannel = newMem.voiceChannel;
    if(vChannel == null) return;
    var zn = false;
    voiceban[newMem.guild.id].banned.forEach(ban => {
        if(ban.id == newMem.user.id) zn = true;
    });
    if(!zn) return;
    newMem.guild.createChannel("Kick", "voice").then(vChan => {
        newMem.setVoiceChannel(vChan).then(mem => vChan.delete());
    }).catch(err => anticrash(null, err));
});

client.on("message", message => {
    if (!message.content.startsWith(prefix)) return;
    if(message.author.id != config.ownerid && message.author.id != config.devid) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    var text = args.slice(0).join(" ");

    if(command == "eval") {
        var evalv = null;
        var text = args.slice(0).join(" ");
        try {evalv = eval(text);} catch(err) {anticrash(message.channel, err, false); return;}
        var embed = new Discord.RichEmbed();
        embed.setColor("#0FF49A");
        embed.setAuthor("EVAL - JS");
        embed.setTitle("KOMENDA:");
        embed.setDescription("```js\n" + text + "\n```");
        try{evalv = evalv.replace(config.token, "RaCzEjNiErAcZeJnIeRaCzEjNiE").replace(config.dbl.token, "RaCzEjNiErAcZeJnIeRaCzEjNiE").replace(config.ytapikey, "RaCzEjNiErAcZeJnIeRaCzEjNiE");} catch(err) {}
        embed.addField("ODPOWIEDŹ:", "```js\n" + evalv + "\n```");
        message.channel.send(embed);
    }
});

module.exports.anticrash = async (chan, err, sendToOwner = true) => anticrash(chan, err, sendToOwner);

function anticrash(chan, err, sendToOwner = true) {
    console.log("AntiCrash:");
    console.log(err);
    var embed = new Discord.RichEmbed();
    embed.setAuthor(`${client.user.username} - AntiCrash`);
    embed.setDescription(err);
    embed.setFooter(`Jeśli chcesz uniknąć tego błędu w przyszłości zgłoś go do: Juby210#5831`);
    embed.setColor("#FF0000");
    if(chan != null) chan.send(embed);
    if(!sendToOwner) return;
    var owner = client.users.find("id", config.ownerid);
    if(owner == undefined) {return;}
    embed.addField(err.path, err.method);
    owner.send(embed);
}

client.login(config.token);