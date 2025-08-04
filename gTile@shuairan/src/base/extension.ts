import { App } from "./app";
import { Platform } from "./types";

export const createExtension = (platform: Platform) => {
  let metadata: any;
  let app: App;

  const init = (meta: any) => {
    metadata = meta;
    imports.gi.Gtk.IconTheme.get_default().append_search_path(metadata.path + "/../icons");
  };

  const enable = () => {
    app = new App(platform);
  };

  const disable = () => {
    app.destroy();
  };

  return { init, enable, disable };
};
