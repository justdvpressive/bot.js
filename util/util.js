const Discord = require('discord.js');
const config = require("../config.json");
const prefix = config.settings.prefix;
const request = require("request");
const fs = require("fs");

const crash = function AntiCrash(chan, err, sendToOwner = true) {
    console.log("AntiCrash:");
    console.log(err);
    var embed = new Discord.RichEmbed();
    embed.setColor("#FF0000");
    getUsername("324622488644616195").then(juby => {
        getUsername("321665259842830336").then(hamster => {
            embed.setDescription(`${global.client.guilds.get(config.settings.emojis.guild).emojis.get(config.settings.emojis.error)} | AntiCrash\n\`${err}\`\n\nPlease report this on [support server](https://discord.gg/6bfpCCt) or dm to ${juby}, ${hamster}`);
            if(chan) chan.send(embed);
            if(!sendToOwner) return;
            embed.setDescription(`${global.client.guilds.get(config.settings.emojis.guild).emojis.get(config.settings.emojis.error)} | AntiCrash\n\`${err}\``);
            var owner = global.client.users.get(config.settings.ownerid);
            if(owner == undefined) return;
            embed.addField(err.path, err.method);
            owner.send(embed);
        });
    });
}

const ustawstatus = function ustawstatus(client = global.client) {
    try{
        if (client.guilds.size == 1) {
            client.user.setPresence({ game: {name: `${prefix}help | 1 server | ${prefix}lang`, type: 'LISTENING' }});
        } else {
            client.user.setPresence({ game: {name: `${prefix}help | ${client.guilds.size} servers | ${prefix}lang`, type: 'LISTENING' }});
        }
    } catch(err) {}
}

const req = function req(method, url) {
    return new Promise((resolve, reject) => {
        request({
            method: method,
            url: url
        }, (error, response, body) => {
            if (error) return reject(error);
            resolve(body);
        });
    }).catch(err => console.log(err));
}

const getUsername = function getUsername(id) {
    return new Promise((resolve, reject) => {
        if(global.client.users.get(id)) {
            resolve(global.client.users.get(id).tag);
        } else {
            if (id == "324622488644616195") {
                resolve("Juby210#2100");
            } else if (id == "321665259842830336") {
                resolve("hamster#0001");
            } else {
                reject("Nie znaleziono użytkownika");
            }
        }
    }).catch(err => console.log(err));
}

const formatLength = function formatLength(ms, replace = true) {
    var h = Math.floor(ms / 1000 / 60 / 60);
    var min = Math.floor(ms / 1000 / 60 - h * 60);
    var sec = Math.floor(ms / 1000 - min * 60 - h * 60 * 60);
    
    var uh = false;
    if (!h == 0) {uh = true; if(h <= 9) {h = "0" + h;}}
    if (min <= 9) min = "0" + min;
    if (sec <= 9) sec = "0" + sec;
    var time = "";
    if(uh) {if(h >= 200) {time = "LIVE";} else {time = `${h}:${min}:${sec}`;}} else {time = `${min}:${sec}`;}
    if(replace) {
        if(time == "00:00") return "LIVE";
    }
    return time;
}

const searchUser = function searchUser(message, string, returnAuthor = true) {
    return new Promise((resolve, reject) => {
        if(message.mentions.users.first() == null) {
            if(string == null) if(returnAuthor) return resolve(message.author); else return reject(message.author);
            if(message.client.users.get(string) != undefined) return resolve(message.client.users.get(string));
            var zn = false;
            message.guild.members.forEach(member => {
                if(zn) return;
                if(member.user.username.toLowerCase().includes(string)) {
                    zn = true;
                    return resolve(member.user);
                }
            });
            if(!zn) if(returnAuthor) resolve(message.author); else reject(message.author);
        } else resolve(message.mentions.users.first());
    }).catch(err => {});
}

const polskieliterytoblad = function polskieliterytoblad(string) {
    return string.replace(/ą/g, "a").replace(/ę/g, "e").replace(/ć/g, "c").replace(/ń/g, "n").replace(/ł/g, "l").replace(/ó/g, "o").replace(/ś/g, "s").replace(/ź/g, "z").replace(/ż/g, "z").replace(/Ą/g, "A").replace(/Ę/g, "E").replace(/Ć/g, "C").replace(/Ń/g, "N").replace(/Ł/g, "L").replace(/Ó/g, "O").replace(/Ś/g, "S").replace(/Ź/g, "Z").replace(/Ż/g, "Z");
}

const gban = async function gban(message) {
    const SManager = require("../strings/manager");
    const strings = await SManager.create(message.guild.id);
    let embed = new Discord.RichEmbed();
    embed.setDescription(`<:merror:489081457973919744> | ${strings.getMsg("gban")}`);
    embed.setColor("#FF0000");
    message.channel.send(embed);
}

const getLangs = function getLangs() {
    return new Promise((resolve, reject) => {
        let obj = {table: []};
        fs.readdirSync(`./strings`).filter(file => file.endsWith('.json')).forEach(fn => {
            let o = require(`../strings/${fn}`).info;
            let id = fn.replace(".json", "");
            Object.assign(o, {id});
            obj[id] = o;
            obj.table.push(o);
        });
        resolve(obj);
    });
}

module.exports.crash = crash;
module.exports.ustawstatus = ustawstatus;
module.exports.req = req;
module.exports.getUsername = getUsername;
module.exports.formatLength = formatLength;
module.exports.searchUser = searchUser;
module.exports.polskieliterytoblad = polskieliterytoblad;
module.exports.gban = gban;
module.exports.getLangs = getLangs;