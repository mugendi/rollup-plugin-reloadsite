/**
 * Copyright (c) 2023 Anthony Mugendi
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const fs = require('fs');
const path = require('path');
const reloadSite = require('reloadsite');
const tcpPortUsed = require('tcp-port-used');

let scriptJSStr = fs.readFileSync(
  path.join(__dirname, './src/plugin-append-script.js'),
  'utf8'
);

const production = !process.env.ROLLUP_WATCH;

const ReloadSite = (options = {}) => {
  let { dirs = [], port = 35729, delay=1000 } = options;

  //   console.log(options);
  return {
    name: 'reloadsite-plugin',

    async generateBundle(options, bundle, isWrite) {
      // start server
      try {
        // do not run in production
        if (production) return;

        // add watcher script to js code
        for (let id in bundle) {
          if (/.+\.[cm]?js$/.test(id)) {
            // Add script
            scriptJSStr = scriptJSStr.replace('{PORT}', port);
            bundle[id].code += '\n\n' + scriptJSStr;
            scriptJSAdded = true;
          }
        }

        // start server
        const portUsed = await tcpPortUsed.check(port, '127.0.0.1');
        // by using portUsed, we ensure we start server only once
        if (!portUsed) {
          startReloadSiteServer({ port, dirs, delay });
        }
      } catch (error) {
        throw error;
      }
    },
  };
};

async function startReloadSiteServer({ port, delay =1000, dirs = [] }) {
  // start server
  const serverOptions = { port };
  const reloader = reloadSite(serverOptions);
  // start watching directories
  let reloadOptions = { delay };
  reloader.watch(dirs, reloadOptions);
}

module.exports = ReloadSite;
