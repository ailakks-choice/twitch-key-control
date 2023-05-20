const prompt = require('prompt-sync')();
const tmi = require('tmi.js');
const robot = require("robotjs");
const configManager = require("./config");

const config = configManager.getConfig();

const minAmount = config.settings.minimum_amount;
const time = config.settings.time;
const delay = config.settings.delay;

const channelName = config.settings.channel ?? prompt(config.language.CHANNEL_NAME_PROMPT);
const client = new tmi.Client({
    channels: [channelName]
});

const action = {
    key: [],
    mouse: [],
    time: Number,
    repeat: Number,
    delay: Number,
    cancel: Boolean
};

const actionMap = new Map();

robot.setKeyboardDelay(delay);

client.connect().then(() => console.log(config.language.CHAT_STATUS_CONNECTED));
client?.on('message', (channel, tags, message) => {
    const action = getByCommand(message);

    if (!action) {
        return;
    }

    actionMap.set(action, (actionMap.get(action) ?? 0) + 1);

    setTimeout(() => {
        actionMap.delete(action);
    }, time);

    if (actionMap.get(action) > minAmount) {
        const amount = actionMap.get(action);
        console.log(amount > 1 ? config.language.ACTION_PERFORM_PLURAL : config.language.ACTION_PERFORM_SINGULAR
            .replace("{command}", action.command).replace("{amount}", amount));

        repeatAction(() => {
            if (action.key) {
                if (action.time) {
                    action.key.forEach(action => {
                        robot.keyToggle(action, "down");
                    })

                    setTimeout(() => {
                        action.key.forEach(action => {
                            robot.keyToggle(action, "up");
                        })
                    }, action.time);

                    return;
                }

                action.key.forEach(action => {
                    robot.keyTap(action);
                })
            }

            if (action.mouse) {
                if (action.time) {
                    action.mouse.forEach(action => {
                        robot.mouseClick(action);
                    })

                    setTimeout(() => {
                        action.mouse.forEach(action => {
                            robot.mouseToggle(action);
                        })
                    }, action.time);

                    return;
                }

                action.mouse.forEach(action => {
                    robot.mouseClick(action);
                })
            }
        }, action.delay ?? 0, action.repeat ?? 1);
    }
});

function getByCommand(command) {
    for (const index in config.keys) {
        if (config.keys[index].command === command) {
            return config.keys[index];
        }
    }
    return null;
}

function repeatAction(action, delay, repetitions) {
    if (repetitions <= 0) {
        return;
    }

    action();

    setTimeout(function() {
        repeatAction(action, delay, repetitions - 1);
    }, delay);
}
