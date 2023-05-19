const prompt = require('prompt-sync')();
const { AppTokenAuthProvider } = require("@twurple/auth");
const { ChatClient } = '@twurple/chat';

const clientId = 'YOUR_CLIENT_ID';

const clientSecret = prompt('Clave de Twitch');
const authProvider = new AppTokenAuthProvider(clientId, clientSecret);

const chatClient = new ChatClient({ authProvider, channels: ['Ailakks'] });
