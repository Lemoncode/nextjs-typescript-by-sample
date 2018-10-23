# Enabling debugging in NextJS with Visual Studio Code

In this sample, we will be covering the basics to debug your application using NextJS and VSCode.

# Steps to enable server-side debugging

- The starting point for this tutorial will be the final code from sample 07 (open a copy of it on a new VSCode window to start working). First of all, let's download the dependencies we need.

```bash
npm install
```

- We do not really need to add new lines of code to our app this time. Instead, we are going to work on VSCode debug configuration files. Open the sample in VSCode and click on the ```Debug``` menu from the left-side icon panel (or alternatively press ```Ctrl``` + ```Shift``` + ```D```). From there, in the top-side of the left column we should be able to find a dropdown menu currently displaying ```No Configuration```, just to the right of the green play button. Click on this menu to unfold the options (it should be empty at this point, with no configurations available) and click on ```Àdd configuration...```. This will in turn open a new dropdown menu at the top-side, center part of the VSCode view. This menu allows us to select the type of debugger configuration we want to use. For now, it should only display the built-in ````Node.js``` configuration type that the VSCode framework comes bundled with. Click on it. This will create a ```launch.json``` file inside a ```.vscode``` folder located at the root of the folder currently opened by VSCode. The contents of the JSON file should read as follows:
```json
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "program": "${workspaceFolder}\\index.js"
    }
  ]
}
```

- Now we are going to make the following modifications to this file in order to set up VSCode debugger so that it attaches itself to the server-side NodeJS part of our NextJS app, so to speak. Change the contents of the file to the following:
```diff
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
-      "request": "launch",
-      "name": "Launch Program",
-      "program": "${workspaceFolder}\\index.js"
+      "request": "attach",
+      "name": "NextJS - Node",
+      "port": 9229,
    }
  ]
}
```

- The port value we are specifying has to match the one used for debugging NodeJS applications. We can normally set this when we start our app, but nonetheless the default value is 9229. We also need to run our app in a way that said port is opened, so that VSCode can attach its debugger correctly. For the purposes of this sampple, we are going to create a new NPM script that already has the needed params hardcoded. Let's open our ```package.json``` file and add the following script.
```diff
 "scripts": {
    "dev": "node server.js",
+   "debug": "node server.js --inspect",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```
- If, for some reason, we cannot use the default port 9229, we can always define a different one on the inspect flag (```---inspect=12345```). If we run our app now using the new script, i.e. ```npm run debug```, we will get a message in the console terminal that confirms that the debug websocket is available. We can further check that everything is working as intended by using our browser and accessing localhost on port 9229. For instance, browsing to ```localhost:9229/json/version``` should display a short JSON on our browser indicating the NodeJS version we are currently using.

- Since the port 9229 is now open for the debugger, we can run our previously defined configuration to attach VSCode debugger to our NextJS Node process. Let's go back to the debug menu (click on the debug icon on the left side panel). By default, the dropdown menu should have selected the configuration we had defined in our ```launch.json``` file (going by the name ```NextJS - Node```). If we click on the play button to its left, we should see that VSCode debugger successfully attaches to our node process.

- Now let's add a breakpoint somewhere in the code. For example, line 12 of _pages/index.ts_. Normally the breakpoint should be displayed as a red dot, although most likely you will see a blank circle of sorts. If we navigate to ```localhost:3000```, we should expect the execution to break at the line we have just marked. Most likely, though, that will not be the case. This is due to an issue with how sourcemaps are being detected by our debugger (see this [issue for further details](https://github.com/Microsoft/vscode-recipes/issues/103)). In order to fix this, we need to modify our ```launch.json``` file slightly. Add the following lines:
```diff
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "name": "NextJS - Node",
      "port": 9229,
+     "sourceMapPathOverrides": {
+       "webpack:///*": "${workspaceRoot}/*",
+     }
    }
  ]
}
```

- After this change, if we save and reattach our debugger, we should now see that the breakpoints display their usual red color, and, indeed, if we refresh the main page containing the list of users, we will stop the execution on line 12, as expected.

- Also notice the following: if we add a breakpoint on line 11 of _pages/user-info.tsx_, and we click on any of the user details links on the table, we will not trigger the corresponding breakpoint. However, if we click on refresh in the browser while visiting one of the details pages, the breakpoint will indeed trigger and the execution will be stopped.


# Steps to launch a debugging instance of Chrome from VSCode
- So far, we have attached VSCode debugger to the NodeJS part of our NextJS-powered app that is rendered at the server. However, if we were to debug the parts of the app that are being rendered at the client, we would need to resort to the usual debugging console from the browser. We are now going to cover the steps to launch a Chrome browser from VSCode so that VSCode debugger is already attached by default to this instance of Chrome. First of all, we need to install the ```Debugger for Chrome``` plugin into our VSCode suite.

- Once we have the debugger for Chrome installed, we are going to create a new debug configuration. In order to do this, let's modify our ````launch.json``` file by adding the lines below:
```diff
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "name": "NextJS - Node",
      "port": 9229,
      "sourceMapPathOverrides": {
        "webpack:///*": "${workspaceRoot}/*",
      }
-   }
+   },
+   {
+     "type": "chrome",
+     "request": "launch",
+     "name": "NextJS - Chrome",
+     "url": "http://localhost:3000",
+     "webRoot": "${workspaceFolder}",
+     "sourceMapPathOverrides": {
+       "webpack:///*": "${webRoot}/*",
+     },
+   },
  ]
```

- Now let's launch our new ```NextJS - Chrome``` debug configuration from the dropdowm menu in the debug panel. This will in turn open a new Chrome instance and load the url we have specified in our ```launch.json```. Notice that, in this case, if we have the same two breakpoints we had enabled before, the execution will stop on them without the need of refreshing our app, i.e. if we navigate from the main page with the users collection to the details page of a specific user and viceversa, the app will indeed stop at the designated breakpoints. This is happening now because our debugger is working from the client side, so it is triggered pretty much in the same way as the browser's debugger would, instead of only on the first load of the app when it is being rendered server-side.


# Putting it all together
- Finally, let's wrap up this tutorial by combining both of our debug configurations into a single one so that we can debug the frontend code coming from both server and client using the same environment. In order to achieve this, we have to modify the ```launch.json``` by adding the following lines at the ```compounds``` property, just after ```configurations```:
```diff
  "configurations": [
    ...
  ],
+ "compounds": [
+   {
+     "name": "NextJS - Full",
+     "configurations": ["NextJS - Node", "NextJS - Chrome"],
+   }
+ ],
```

- This will create a new configuration by the name of ```NextJS - Full```, which will in turn launch both of our previously defined configurations at the same time.
