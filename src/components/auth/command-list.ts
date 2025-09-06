export const availableCommands = [
    { command: 'help', description: 'Displays this list of available commands.' },
    { command: 'viewitem', description: 'Opens a page with all available commands and descriptions.' },
    { command: 'blockitem', description: 'Disables the login button to prevent submission.' },
    { command: 'unblockitem', description: 'Enables the login button if it was blocked.' },
    { command: 'setquick', description: 'Opens a quick dialog to change the UI color.' },
    { command: 'swapcolor', description: 'Cycles through available UI colors.' },
    { command: 'hackeffect', description: 'Toggles a visual hacking effect on the screen.' },
    { command: 'showhidecommand', description: 'Reveals hidden special commands.' },
    { command: 'set_title [text]', description: 'Change the login form title.' },
    { command: 'set_subtitle [text]', description: 'Change the login form subtitle.' },
    { command: 'set_button [text]', description: 'Change the login button text.' },
    { command: 'theme_dark', description: 'Switch login panel to dark mode.' },
    { command: 'theme_light', description: 'Switch login panel to light mode.' },
    { command: 'set_text_color [color]', description: 'Change login panel text color (e.g., #FFFFFF).'},
    { command: 'login_shake', description: 'Shake login form (on wrong password).'},
    { command: 'login_glow [color]', description: 'Glow effect on login panel (e.g., #FFFFFF).'},
    { command: 'toast_message [text]', description: 'Show a toast notification.'},
    { command: 'confetti', description: 'Launch confetti effect.'},
    { command: 'secret_message', description: 'Show hidden Easter egg message.'},
    { command: 'matrix', description: 'Initiates matrix rain effect (not implemented).'},
    { command: 'godmode', description: 'Unlocks all features (not implemented).'},
];

export const specialCommands = [
     { command: 'matrix', description: 'Initiates matrix rain effect (not implemented).'},
     { command: 'godmode', description: 'Unlocks all features (not implemented).'},
];
