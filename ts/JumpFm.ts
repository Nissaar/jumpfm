import { JumpFm as JumpFmApi } from 'jumpfm-api'
import { Panel } from "./Panel"
import { StatusBar } from "./StatusBar"
import { PluginManager } from "./PluginManager";
import { getKeys } from "./files";

import * as keyboardjs from 'keyboardjs'

export class JumpFm implements JumpFmApi {
    private active: 0 | 1 = 0
    readonly panels: Panel[] = [new Panel(), new Panel()]
    readonly electron = require('electron')
    readonly statusBar: StatusBar = new StatusBar()
    private readonly pluginManager = new PluginManager(this)

    private passive = (): 0 | 1 => (this.active + 1) % 2 as 0 | 1

    private setActive = (i: 0 | 1) => {
        this.active = i
        this.panels[this.active].setActive(true)
        this.panels[this.passive()].setActive(false)
    }


    getPanelActive = () =>
        this.panels[this.active]

    getPanelPassive = () =>
        this.panels[this.passive()]

    panelsSwap = () => {
        throw new Error("Method not implemented.")
    }

    panelsSwitch = () =>
        this.setActive(this.passive())

    bind = (actionName: string, defaultKeys: string[], action: () => void) => {
        keyboardjs.bind(getKeys(actionName, defaultKeys), e => {
            e.preventDefault()
            action()
        })
    }

    constructor() {
        this.panels.forEach(panel => {
            document
                .getElementById('panels')
                .appendChild(panel.divPanel)
        })


        this.pluginManager.loadAndUpdatePlugins(() => {
            // saveKeyboard(keyboard)
            // this.panels.forEach(panel => panel.cd(homedir()))
            this.panels.forEach(panel => panel.cd('/home/gilad/test'))
            this.setActive(0)
        })
    }
}