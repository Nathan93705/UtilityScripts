# CommandRegistry - A SerenityJS API

CommandRegistry is an API for SerenityJS that allows you to registery slash commands to the serenity instance !

---

## Features

- Callback support

- Command Permissions

- easy to use API

#### Soon to be added

- Command Paramaters

## Installation

clone the `CommandRegistry.ts` into your own plugins `src` directory :

## Usage examples

Starting the registry and registerying a command
```ts
//Get The Registry	
let registry = new CommandRegistry();
//Start The Registry
registry.startRegistry(this.serenity)
//Register Command
registry.register(
    //Command Data
    { 
        permissionLevel: PermissionLevel.Member, 
        name: "commandName", 
        description: "commandDescription"
    },
    //Command Run Callback
    (player, args) => {
        //Do Something
    }
)
```

*everything else is handled automatically !*

You can get all registered commands and this them by doing this :

```ts
let commands = registry.getCommands()
commands.forEach(command=>{
    console.log("Command: /"+command.commandData.name)
})
```
##### Simple examples

Sends a message when a diamond is clicked :

```ts
let registry = new CommandRegistry();
registry.startRegistry(this.serenity)
registry.register(
    //Command Data
    { 
        permissionLevel: PermissionLevel.Member, 
        name: "hello", 
        description: "Basic Hello World Command"
    },
    //Command Run Callback
    (player, args) => {
        player.sendMessage(`Hello World`) 
    }
)
```

## Credits

API base by [@Nathan93705]([https://github.com/Rjlintkh/](https://github.com/Nathan93705))
