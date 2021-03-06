const Discord = require("discord.js");
const util = require("../../../util/util");
const cmd = require("../../command.js");
var Color = require('color');
var colo;
var hex;
var rgb;
var hsl;
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "color"
        });
        this.run = this.r;
    }
    async r(a = {}) {
        if (a.args[0] == null) return cmd.error(a, `${a.strings.getMsg("color_type")}`);
        let co = a.args.join(" ").slice("#");
        let c = a.args.join(" ");
        if (c[0]!="#") return cmd.error(a, `${a.strings.getMsg("color_type")}`);
        if (!/^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/.test(a.args[0])) return cmd.error(a, `${a.strings.getMsg("color_type")}`);
        hex = c;
        colo = co.replace(new RegExp("#", "g"), "");
        var color = Color(hex);
        rgb = color.rgb().string();
        hsl = color.hsl().string();
        const kk = new Discord.RichEmbed()
            kk.setDescription(`**Hex**: ${hex}\n**RGB**: ${rgb}\n**HSL**: ${hsl}`)
            kk.setColor(hex)
            kk.setThumbnail(`https://www.colorhexa.com/${colo}.png`)
        a.message.channel.send(kk);
    }
}