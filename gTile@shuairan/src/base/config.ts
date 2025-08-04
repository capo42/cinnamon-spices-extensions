import { App } from "./app";
import { GridSettingsButton } from "./ui/GridSettingsButton";

const Settings = imports.ui.settings;
const Main = imports.ui.main;

export interface Row {
    span: number;
}

export interface Column {
    span: number;
}

export class Config {
    private app: App;
    public gridSettingsButton: GridSettingsButton[] = [];
    private settings: imports.ui.settings.ExtensionSettings;

    public readonly hotkey!: string;
    public readonly animation!: boolean;
    public readonly autoclose!: boolean;
    public readonly aspectRatio!: boolean;
    public readonly useMonitorCenter!: boolean;
    public readonly showGridOnAllMonitors!: boolean;
    public readonly grid1NameOverride!: string;
    public readonly grid1x!: Row[];
    public readonly grid1y!: Column[];
    public readonly grid2NameOverride!: string;
    public readonly grid2x!: Row[];
    public readonly grid2y!: Column[];
    public readonly grid3NameOverride!: string;
    public readonly grid3x!: Row[];
    public readonly grid3y!: Column[];
    public readonly grid4NameOverride!: string;
    public readonly grid4x!: Row[];
    public readonly grid4y!: Column[];
    public nbRows!: Row[];
    public nbCols!: Column[];

    /** in seconds */
    public get AnimationTime(): number {
        return this.animation ? 0.3 : 0.1;
    }

    constructor(app: App) {
        this.app = app;

        this.settings = new Settings.ExtensionSettings(this, 'gTile@shuairan');
        //hotkey
        this.settings.bindProperty(Settings.BindingDirection.IN, 'hotkey', 'hotkey', this.EnableHotkey, null);
        //grid (nbCols and nbRows)
        this.settings.bindProperty(Settings.BindingDirection.OUT, 'lastGridRows', 'nbCols');
        this.settings.bindProperty(Settings.BindingDirection.OUT, 'lastGridCols', 'nbRows');

        // Validate
        if (this.nbCols == null || !Array.isArray(this.nbCols))
            this.nbCols = this.InitialGridItems();
        if (this.nbRows == null || !Array.isArray(this.nbRows))
            this.nbRows = this.InitialGridItems();

        this.settings.bindProperty(Settings.BindingDirection.BIDIRECTIONAL, 'animation', 'animation', this.updateSettings, null);
        this.settings.bindProperty(Settings.BindingDirection.BIDIRECTIONAL, 'autoclose', 'autoclose', this.updateSettings, null);
        this.settings.bindProperty(Settings.BindingDirection.BIDIRECTIONAL, 'aspect-ratio', 'aspectRatio', this.UpdateGridTableSize, null);
        this.settings.bindProperty(Settings.BindingDirection.BIDIRECTIONAL, 'useMonitorCenter', 'useMonitorCenter', () => this.app.OnCenteredToWindowChanged(), null);
        this.settings.bindProperty(Settings.BindingDirection.BIDIRECTIONAL, 'showGridOnAllMonitors', 'showGridOnAllMonitors', () => this.app.ReInitialize(), null);

        let basestr = 'grid';

        this.initGridSettings();

        for (let i = 1; i <= 4; i++) {
            let sgbx = basestr + i + 'x';
            let sgby = basestr + i + 'y';
            let nameOverride = basestr + i + "NameOverride";
            this.settings.bindProperty(Settings.BindingDirection.IN, sgbx, sgbx, this.updateGridSettings, null);
            this.settings.bindProperty(Settings.BindingDirection.IN, sgby, sgby, this.updateGridSettings, null);
            this.settings.bindProperty(Settings.BindingDirection.IN, nameOverride, nameOverride, this.updateGridSettings, null);
        }

        this.EnableHotkey();
    }

    public SetGridConfig(columns: Column[], rows: Row[]) {
        this.nbRows = rows;
        this.nbCols = columns;
    }

    private EnableHotkey = () => {
        this.DisableHotkey();
        Main.keybindingManager.addHotKey('gTile', this.hotkey, this.app.ToggleUI);
    }
    
    private DisableHotkey = () => {
        Main.keybindingManager.removeHotKey('gTile');
    }

    private updateSettings = () => {
        for (const grid of this.app.Grids) {
            grid.UpdateSettingsButtons();
        }  
    }
    
    private initGridSettings = () => {
        let basestr = 'grid';
        for (let i = 1; i <= 4; i++) {
            let sgbx = basestr + i + 'x';
            let sgby = basestr + i + 'y';
            let nameOverride = basestr + i + "NameOverride";
            let gbx = this.settings.getValue<Row[]>(sgbx);
            let gby = this.settings.getValue<Column[]>(sgby);
            if (gbx.length == 0 || gby.length == 0)
                continue;
            let nameOverrideVal = this.settings.getValue<string>(nameOverride);
            this.gridSettingsButton.push(new GridSettingsButton(this.app, this, nameOverrideVal || (gbx.length + 'x' + gby.length), gbx, gby));
        }
    }
    
    private updateGridSettings = () => {
        this.gridSettingsButton = [];
        this.initGridSettings();
        for (const grid of this.app.Grids) {
            grid.RebuildGridSettingsButtons();
        }  
    }

    private UpdateGridTableSize = () => {
        for (const grid of this.app.Grids) {
            const [width, height] = grid.GetTableSize();
            grid.AdjustTableSize(width, height);
        }
    }

    public destroy = () => {
        this.DisableHotkey();
    }

    private InitialGridItems(): Row[] | Column[] {
        return [
            { span: 1 },
            { span: 1 },
            { span: 1 },
            { span: 1 }
        ]
    }
}
