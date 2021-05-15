
# cloud-config-utils

A [util](https://github.com/mdrajibul/cloud-config-utils) library for cloud configuration. The main purpose of this library is to externalize the project's configuration. Helpful when a project has various environments like dev, qa, staging, production etc. Each environment should have a diffrent project specific configuration. While build or deploy, the user should pass the profile name, and this library should produce env specific configuration from yml file to json file.

## Installation

```bash
# using npm
npm install @mdrajibul/cloud-config-utils
```

## Directory structure 

In project root, please add below folder and files as example. If you created like this then use --profile=dev or --profile=qa as command line argument. If not then need to pass as --profilePath=<YOUR ABSOLUTE PATH>

```base
setup 
  - profile.dev.yml
  - profile.qa.yml
````

## Usage

In your package.json, if you use webpack then write a javascript script and add a scripts property in package,.json

```bash

"build:profile": "node ./generate-profile.js --profile=dev",

```

### <u>generate-profile.js</u>

```js

const { loadConfigs } = require('@mdrajibul/cloud-config-utils');
const fs = require('fs');
const path = require('path');

async function generateProfile() {
  let configData = await loadConfigs(); //
  if (configData) {
  // save into a json file after getting config data
    fs.writeFileSync(path.join(process.cwd(), `/src/profile.json`), JSON.stringify(configData));
  }
}

generateProfile();

```

### Options
Below are the available options which need to pass as command line args

<ul>
  <li><b>profile(f)</b>: profile name as dev, prod, qa etc. Make sure you should have a folder under root name setup and some yml file as profile.dev.yml, qa.dev.yml etc. Alias `f` and default value `dev`</li>
<li><b>profilePath(a)</b>: Absolute path. when profilePath set then profile should be ignored</li>
<li><b>remoteConfigUrl(r)</b>: A hosted config url. If set then it will fetch and return data</li>
<li><b>port(p)</b>: user specific port to run nodeJs application</li>
</ul>

<b>Usage:</b> 

```base 
add as a command-line argument as below

--profile=dev

or 

-f=dev

```

## Usage in application to store and get configuration

Sometimes application or module needs to fetch config data, store it in memory and access it from everywhere in an application or module. To do so please follow the below code. Just keep in mind `loadConfigs` is an async function. So, you have to wait to fetch data.

```js
import { loadConfigs, ProjectConfig } from '@mdrajibul/cloud-config-utils';

// Storing into a global cache class ProjectConfig
loadConfigs().then(data => {
      if (data) {
        ProjectConfig.init(data);
      }
    });

// To access stored config call below getter to get all configs data

ProjectConfig.configs

```