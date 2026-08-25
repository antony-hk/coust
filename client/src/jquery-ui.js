import './jquery-global';

// jQuery UI's UMD modules register through AMD or fall back to the global
// `jQuery`. Listing them explicitly, in dependency order, keeps the set from
// depending on whether the bundler resolves AMD. Rebuild it from the
// define([...]) manifests in node_modules/jquery-ui/ui when upgrading — the
// set is minor-version specific, hence the ~ range in package.json.
import 'jquery-ui/ui/version';
import 'jquery-ui/ui/keycode';
import 'jquery-ui/ui/position';
import 'jquery-ui/ui/unique-id';
import 'jquery-ui/ui/widget';
import 'jquery-ui/ui/widgets/menu';
import 'jquery-ui/ui/widgets/autocomplete';
import 'jquery-ui/ui/widgets/mouse';
import 'jquery-ui/ui/data';
import 'jquery-ui/ui/plugin';
import 'jquery-ui/ui/scroll-parent';
import 'jquery-ui/ui/widgets/draggable';
import 'jquery-ui/ui/widgets/droppable';
import 'jquery-ui/ui/widgets/tooltip';

// Patches $.ui.mouse.prototype, so it must come after the widgets.
import 'jquery-ui-touch-punch';
