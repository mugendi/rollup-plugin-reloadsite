/**
 * This code is added by the rollup-plugin-reloadsite plugin
 * Naturally, this plugin is disabled as soon as you stop watching your source files via the -w flag
 * process.env.ROLLUP_WATCH is used to automatically mute the plugin and this code, as well as the actual ReloadSite server will disappear
 * However, it is better to be explicit in your code and only load the rollup-plugin-reloadsite  plugin in development mode
 *
 * Note: If you have run multiple sources, then you might find this code in multiple files.
 * However, it's effect is limited to only one time as the if condition below should stop all other instances from running
 */

// see if script tag exists
(function () {
  let scriptExists = document.querySelector('script#ReloadSite');

  if (!scriptExists) {
    // get document body
    let body = document.querySelector('body,html');

    if (body) {
      // create tag
      let tag = document.createElement('script');
      tag.src = 'http://127.0.0.1:{PORT}/reloadsite.js';
      tag.id = 'ReloadSite';
      body.append(tag);
    } else {
      console.warn('HTML document has no body or html tag!');
    }
  }
})();
