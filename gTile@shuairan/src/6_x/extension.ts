import { createExtension } from "../base/extension";
import { Platform } from "../base/types";
import { get_tab_list, get_window_center, move_maximize_window, move_resize_window, reset_window, subscribe_to_focused_window_changes, unsubscribe_from_focused_window_changes } from "./utils";

const platform: Platform = {
  move_maximize_window,
  move_resize_window,
  reset_window,
  get_window_center,
  subscribe_to_focused_window_changes,
  unsubscribe_from_focused_window_changes,
  get_tab_list,
};

const { init, enable, disable } = createExtension(platform);

export { init, enable, disable };
