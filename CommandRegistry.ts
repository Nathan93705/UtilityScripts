import { Commands, Packet, PermissionLevel } from '@serenityjs/bedrock-protocol';
import { Player, Serenity } from '@serenityjs/serenity';
import { error } from 'console';

interface CommandData {
    name: string,
    description: string,
    permissionLevel: PermissionLevel,
}
interface RegistryCommand {
    commandData: CommandData,
    callBack: (player: Player, args: string[]) => void
}

let registeredCommands: RegistryCommand[] = []
let registryStarted: boolean = false
let instance: Serenity | undefined;
/**
* The Command Registry.
*/
export default class CommandRegistry {
    
    /**
    * Starts The Command Registry.
    * @param   serenity The serenity instance.
    */
    startRegistry(serenity: Serenity) {
        if (registryStarted) {
            throw error(`Error Starting CommandRegistry; Registry Is Already Started`)
        }
        registryStarted = true
        instance = serenity
        let network = serenity.network
        network.before(Packet.CommandRequest, ({ packet, session }) => {
            let registry = new CommandRegistry()
            let commands = registry.getCommands()

            let parsedCommand = packet.rawCommand
                .slice(1)
                .trim()
                .replace(/([~^][^~^\s]*)/g, "$1 ")
                .match(/"[^"]+"|[^\s]+/g)
                .map((e) => e.replace(/"(.+)"/, "$1").toString());

            for (const RegistryCommand of commands) {
                if (RegistryCommand.commandData.name === parsedCommand[0]) {
                    RegistryCommand.callBack(session.player, parsedCommand.slice(1))
                }
            }
            return true
        })
        network.before(Packet.AvailableCommands, ({ packet, session }) => {
            let registry = new CommandRegistry()
            let commands = registry.getCommands()
            for (const RegistryCommand of commands) {
                let command: Commands = {
                    name: RegistryCommand.commandData.name,
                    description: RegistryCommand.commandData.description,
                    flags: 0,
                    permissionLevel: RegistryCommand.commandData.permissionLevel,
                    alias: 0,
                    subcommands: [],
                    overloads: []
                }
                packet.commands.push(command)
            }
            return true
        })
    }
    /**
    * Registers A Command To The Registry.
    * @param data The Command Data.
    * @param callBack The Callback That Runs When The Registered Command Is Ran
    * @example 
    * new CommandRegistry().register(
    * {permissionLevel: PermissionLevel.Member,name: "hello",description: "Basic Hello World Command"}, 
    * (player, args) => {player.sendMessage(`Hello World`)}
    * )
    */
    register(data: CommandData, callBack: (player: Player, args: string[]) => void) {
        if (!registryStarted) {
            throw error(`Error Registerying Command; Registry Is Not Started Run startRegistry() To Start It`)
        }
        if (this.commandExist(data.name)) {
            registeredCommands.push({ commandData: data, callBack: callBack })
            if (!instance) return
            instance.logger.info(`[Command Registry] Registered "${data.name}"`)
        } else {
            throw error(`Error Registerying Command; Command "${data.name}" is already registered`)
        }
    }
    /**
    * Fetches The Command Registry List.
    * @returns An Array Of The Registered Commands
    */
    getCommands(): RegistryCommand[] {
        return registeredCommands
    }
    /**
    * Checks The Command Registry If A Command Exists.
    * @returns Boolean
    */
    commandExist(commandName: string): boolean {
        return !registeredCommands.some(({ commandData }) => {
            if (commandData.name === commandName) return true
            else return false
        })
    }
}
