<!--
 Copyright (c) 2023 Anthony Mugendi

 This software is released under the MIT License.
 https://opensource.org/licenses/MIT
-->

# rollup-plugin-reloadsite

> Rollup HMR plugin that leverages the power ans simplicity of [ReloadSite](https://www.npmjs.com/package/reloadsite) to provide true HMR capability for your development.

## Using rollup-plugin-reloadsite

```javascript
// import
import hmr from 'rollup-plugin-reloadsite';

module.exports = {
  // add to your plugins array
  plugins: [
    hmr({
      // directories to watch
      dirs: ['./public'],
      //the main file within which the hmr code is added
      // This is optional but highly recommended
      filter: '**/main.js',
      //  the port that ReloadSite uses
      // defaults tp 35729
      port: 35729,
    }),
  ],
};
```

## How it works

1. The plugin uses the `process.env.ROLLUP_WATCH` to ensure it only runs and adds HMR only on developer mode. Once you get to production, this plugin should silently remove itself from your code.

2. The plugin uses [tcp-port-used](https://www.npmjs.com/package/tcp-port-used) to create only one `ReloadSite` server instance using the `port` provided in the options.

3. Then the plugin appends special javascript ([Check The Code](./src/plugin-append-script.js) ) to the files that rollup outputs. This code then appends a script tag that connects to the ReloadSite server created.
    - If you output multiple files, then this code may be repeated in each file but the `if condition` guards it to run only once.
    - This is precisely why the `filter` option exists and why you should use it to limit the HMR code to only one file or a few files as you see fit. For example, if your [rollup](https://www.npmjs.com/package/rollup) is configured to build different js files for each page, you might want to let the HMR code to be on every page. It is all up to you! Please note that `filtering` uses [picomatch](https://github.com/micromatch/picomatch) [`isMatch`](https://github.com/micromatch/picomatch#ismatch) function and thus you can pass a string or array of patterns.

4. Once the code in the directories you entered changes, then your application will `hot reload`. ReloadSite supports HMR as follows:
    - Images and styles are reloaded without refreshing the page by appending a timestamp to the url. Example `?ts=254653476`.
    - Javascript files and other code-based files will cause the page to reload. Please see [RealoadSite Extensions](https://github.com/mugendi/reloadsite#file-extensions)



**Enjoy!**