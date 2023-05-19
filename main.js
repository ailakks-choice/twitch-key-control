const prompt = require('prompt-sync')();
const {RefreshingAuthProvider} = require("@twurple/auth");
const {ChatClient} = require("@twurple/chat");

const clientId = 'i6vsfdlvsarzv6b12i74rdajzs1f2k';

const clientSecret = prompt('Clave de Twitch');
const authProvider = new RefreshingAuthProvider(clientId, clientSecret,  ['chat:read']);

const chatClient = new ChatClient({ authProvider, channels: ['Ailakks']});
chatClient.connect();
