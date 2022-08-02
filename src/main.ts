import { Request, Response } from "express";
import { Firebot, ScriptModules } from "@crowbartools/firebot-custom-scripts-types";
import { CommandCenterPage, BuildDropdownOptionList } from "./page";

interface Params {
  pageTitle: string;
  hostname: string;
}

let firebotModules: ScriptModules;

const script: Firebot.CustomScript<Params> = {
  getScriptManifest: () => {
    return {
      name: "Firebot Command Center",
      description: "A Firebot custom script that adds a command center webpage for remote command execution (WARNING: This has no authentication of any kind, so do NOT set this up to face the public internet)",
      author: "zunderscore",
      version: "1.0",
      firebotVersion: "5",
    };
  },
  getDefaultParameters: () => {
    return {
      pageTitle: {
        type: "string",
        default: "Firebot Command Center",
        description: "Page Title",
        secondaryDescription: "Enter the title for the Firebot Command Center page. Default is \"Firebot Command Center\"."
      },
      hostname: {
        type: "string",
        default: "localhost",
        description: "Hostname",
        secondaryDescription: "Enter the hostname to use when calling back to Firebot. Default is \"localhost\"."
      }
    };
  },
  run: ({ parameters, modules, firebot }) => {
    firebotModules = modules;
    const { logger, httpServer, commandManager } = firebotModules;

    logger.info(`Registering Command Center custom routes...`);
    httpServer.registerCustomRoute("commandcenter", "/status", "GET", function(req: Request, res: Response) {
      res.send({
        status: "Command Center is running"
      })
    });
    
    httpServer.registerCustomRoute("commandcenter", "/home", "GET", function(req: Request, res: Response) {
      const systemCommands = commandManager.getAllSystemCommandDefinitions().sort((c1, c2) => {
        return c1.trigger.localeCompare(c2.trigger);
      });
      const systemCommandOptions = systemCommands.map((c) => {
        return {
          displayName: c.trigger,
          id: c.id
        }
      });
      const systemCommandOptionList = BuildDropdownOptionList(systemCommandOptions);

      const customCommands = commandManager.getAllCustomCommands().sort((c1, c2) => {
        return c1.trigger.localeCompare(c2.trigger);
      });
      const customCommandOptions = customCommands.map((c) => {
        return {
          displayName: c.trigger,
          id: c.id
        }
      });
      const customCommandOptionList = BuildDropdownOptionList(customCommandOptions);

      const pageContents = CommandCenterPage
        .replace(/%%PAGETITLE%%/g, parameters.pageTitle)
        .replace(/%%HOSTNAME%%/g, parameters.hostname)
        .replace(/%%PORT%%/g, firebot.settings.getWebServerPort().toString())
        .replace(/%%SYSTEM_COMMAND_OPTIONS%%/g, systemCommandOptionList.join("\n"))
        .replace(/%%CUSTOM_COMMAND_OPTIONS%%/g, customCommandOptionList.join("\n"));

      res.send(pageContents);
    });
  },
  /** @ts-ignore */
  stop: () => {
    const { logger, httpServer } = firebotModules;

    logger.info("Unloading Command Center and unregistering custom routes...");

    const statusUnregister = httpServer.unregisterCustomRoute("commandcenter", "/status", "GET");
    const homeUnregister = httpServer.unregisterCustomRoute("commandcenter", "/home", "GET");

    if (statusUnregister === true && homeUnregister === true) {
      logger.info("Successfully unregistered Command Center custom routes");
    } else {
      logger.error("There was an error unregistering Command Center custom routes");
    }

    logger.info("Command Center unloaded");
  }
};

export default script;
