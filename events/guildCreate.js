var index = require('../index.js');
var ustaw = require("./ustaw.js");

module.exports = (guild) => {
    ustaw.status(index.client);
    queue = queuefile.getqueue;
    if (!queue.hasOwnProperty(guild.id)) queue[guild.id] = {}, queue[guild.id].playing = false, queue[guild.id].songs = [], queue[guild.id].song = {}, queue[guild.id].volume = 100;
    queuefile.update(queue);
    if (!voiceban.hasOwnProperty(guild.id)) voiceban[guild.id] = {}, voiceban[guild.id].banned = [];
}