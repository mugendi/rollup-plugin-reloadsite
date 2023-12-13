/**
 * Copyright (c) 2023 Anthony Mugendi
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
const MagicString = require('magic-string');
const fs = require('fs');
const path = require('path');
const picomatch = require('picomatch');
const reloadSite = require('reloadsite');
const tcpPortUsed = require('tcp-port-used');

let scriptJSStr = fs.readFileSync(
  path.join(__dirname, './src/plugn-append-script.js'),
  'utf8'
);

const production = !process.env.ROLLUP_WATCH;

const ReloadSite = (options = {}) => {
  let {
    dirs = [],
    sourcemap = true,
    filter = null,
    port = 35729,
    hook = 'buildEnd',
  } = options;
  //   console.log(options);
  return {
    name: 'reloadsite-plugin',
    transform: (source, id) => {
      // do not run in production
      if (production) return;
      // ensure js file
      if(!id.endsWith('.js')) return
      dirs = arrify(dirs);
      // nothing to do here....
      if (dirs.length == 0) return;

      //  use picomatch to filter files
      let fileMatchesFilter = !filter ? true : picomatch.isMatch(id, filter);

      if (!fileMatchesFilter) return;

      const s = new MagicString(source);

      scriptJSStr = scriptJSStr.replace('{PORT}', port);

      s.append(scriptJSStr);

      return {
        code: s.toString(),
        map: sourcemap ? s.generateMap() : null,
      };
    },
    [hook]: async () => {
      // start server
      try {
        // do not run in production
        if (production) return;

        const portUsed = await tcpPortUsed.check(port, '127.0.0.1');
        if (!portUsed) {
          startReloadSiteServer({ port, dirs });
        }
      } catch (error) {
        throw error;
      }
    },
  };
};

async function startReloadSiteServer({ port, delay = 250, dirs = [] }) {
  // start server
  const serverOptions = { port };
  const reloader = reloadSite(serverOptions);
  // start watching directories
  const reloadOptions = { delay };
  reloader.watch(dirs, reloadOptions);
}

function arrify(v) {
  if (v === undefined) return [];
  return Array.isArray(v) ? v : [v];
}

module.exports = ReloadSite;
