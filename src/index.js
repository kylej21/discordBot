/*
*
*       MUST DO'S TO START CODE:
*       - Add User ID from discord and discord bot api token to a .env file 
*       - type nodemon in the terminal and hit enter
*
*       TO DO:
*       - Add SQL database 
*       - create supercell API to update weekly results to SQL db
*/
require('dotenv').config();
const {Client,IntentsBitField} = require("discord.js");


//create sleep function
const sleep = ms => new Promise(r => setTimeout(r, ms));   



const client = new Client({
    intents : [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildScheduledEvents
    ],
});
var token = process.env.BRAWLAPI
const BrawlStars = require("brawlstars.js")
const brawlClient = new BrawlStars.Client(token);

var nameMatches = {};
var backNames = {}

async function iam(msg, brawlUser){
    (async() => {
        //nameMatches[msg.author]=brawlUser;
        const club= await brawlClient.getClub("#8YYRLYUG");
        for(var i=0; i <club.memberCount;i++){            
            if(club.members[i].name==brawlUser){
                nameMatches[brawlUser]=msg.author.username;
                backNames[msg.author.username]=brawlUser;
                msg.reply("success");
                return;
            }
        }
        msg.reply("Your username is not in the club. Check for correct spelling");
    })()
}


async function whois(msg,playerName){
    (async() => {
        var temp = backNames[playerName];
        if (temp==undefined){
            msg.channel.send("User: " + playerName + " has not yet registered their brawl name, or is not in the club. Make sure to type username not display name.")
            return;
        }
        msg.channel.send(playerName + " is " + temp);        
    })()
}



async function getMembers(msg){

    (async() => {
        const playerClub = await brawlClient.getClub("#8YYRLYUG");
        var ret = "";
        for(var i=0; i <playerClub.memberCount;i++){
            ret += "#" + (i+1) + ": " + playerClub.members[i].name + "  Trophies: " + playerClub.members[i].trophies +" - role: " + 
            playerClub.members[i].role + '\n';
        }
        msg.channel.send(ret);
    })()
}

async function getBest(msg,playerName){

    (async() => {
        const playerClub = await brawlClient.getClub("#8YYRLYUG");
        for(var i=0; i <playerClub.memberCount;i++){
            if(playerClub.members[i].name==playerName){
                const returnVal = await brawlClient.getPlayer(playerClub.members[i].tag);
                var maxTroph=0;
                var maxBrawl="";
                for(var j=0;j<returnVal.brawlerCount;j++){
                    if(returnVal.brawlers[j].trophies > maxTroph){
                        maxTroph= returnVal.brawlers[j].trophies;
                        maxBrawl = returnVal.brawlers[j].name;
                    }
                } 

            }
        }
        ret = ""
        ret += playerName +"'s highest brawler is " + maxBrawl +" with " + maxTroph + " trophies.";
        msg.channel.send(ret);
    })()
}


async function runDate(msg){
    var date = new Date();
    while(true){
        if((date.getDay()==7&&date.getHours()==18)){
            msg.channel.send("@everyone Mega Pig ends soon. Get your attack in or risk being kicked.");
            //sleep for 5 days
            await sleep(432000000);
            date = new Date();
            console.log("Day: " + date.getDate() + " Hour: " + date.getHours());
        }
        else if((date.getDay()==5&&date.getHours()==18)){
            msg.channel.send("@everyone Mega Pig is about to start. \n Number on contributer will get a promotion \n People who do not use all attacks might be kicked");
            //sleep for 2 days
            await sleep(86400000);
            date = new Date();
            console.log("Day: " + date.getDate() + " Hour: " + date.getHours());
        }
        else{
            console.log("Day: " + date.getDate() + " Hour: " + date.getHours());
            //sleep for one hour
            await sleep(3600000);
            date = new Date();
            console.log("Day: " + date.getDate() + " Hour: " + date.getHours());
        }
    }
}




client.on('messageCreate',(msg) =>{    
    //make sure bots don't run the command
    if(msg.content.substring(0,4)=="/iam"){
        iam(msg,msg.content.substring(5));
    }
    if(msg.content.substring(0,6)=="/whois"){
        whois(msg,msg.content.substring(7));
    }
    if(msg.author.bot){
        return;
    }
    //check if message is the command
    if(msg.content=="/beginTime"){
        //check if the author is the admin president
        //if yes begin mega pig notis
        if(msg.author.id==process.env.OWNERID){
            msg.channel.send("Beginning mega pig countdown reminders.")
            runDate(msg);
        }
        //if not reply so
        else{
            msg.channel.send("Only Kyle can run that command")
        }
    }
    if(msg.content == "/getMembers"){
        getMembers(msg);
    }
    if(msg.content.substring(0,8)=="/getBest"){
        getBest(msg, msg.content.substring(9))
    }
});




//Update your discord token to .env file to make the login work
client.login(process.env.TOKEN);