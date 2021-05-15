import axios from 'axios';
import commandLineArgs, { OptionDefinition } from 'command-line-args';
import dotObject from 'dot-object';
import fs from 'fs';
import { Agent } from 'https';
import yaml from 'js-yaml';
import path from 'path';
import { ProjectConfig } from '.';

/**
 * Load configuration. If remoteConfigUrl args provided then fetch from remote configuration server. Otherwise load form local setup file
 * Arguments are remoteConfigUrl(r), profile(f) and port(p)
 */
export const loadConfigs = async (): Promise<any> => {
  try {
    const optionDefinitions: OptionDefinition[] = [
      { name: 'profile', alias: 'f', type: String, defaultValue: 'dev' },
      { name: 'remoteConfigUrl', alias: 'r', type: String },
      { name: 'profilePath', alias: 'a', type: String },
      { name: 'port', alias: 'p', type: Number }
    ];
    const configs = commandLineArgs(optionDefinitions, { partial: true });

    if (configs.remoteConfigUrl) {
      try {
        const agent = new Agent({
          rejectUnauthorized: false
        });
        const response = await axios.get(configs.remoteConfigUrl, { httpsAgent: agent });
        if (response.data && configs.port) {
          response.data.port = configs.port;
        }
        return response.data;
      } catch (error) {
        console.log(error);
      }
      return null;
    } else {
      if (!configs.profile) {
        configs.profile = 'dev';
      }
      if (!configs.profilePath) {
        configs.profilePath = path.join(process.cwd(), `/setup/profile.${configs.profile}.yml`);
      }
      const fileContents = fs.readFileSync(configs.profilePath, 'utf8');
      const data: any = yaml.safeLoad(fileContents);
      if (data && configs.port) {
        data.port = configs.port;
      }
      return dotObject.dot(data);
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

/**
 * Use to append relative api with base api path and return full api endpoint
 * @param url - Teh api url that will append in base api path
 */
export const apiPath = (url?: string): string => {
  if (!ProjectConfig.configs) {
    loadConfigs().then(data => {
      if (data) {
        if (data.propertySources && data.propertySources.length) {
          data = data.propertySources[0].source;
        }
        ProjectConfig.init(data);
        return ProjectConfig.configs && ProjectConfig.configs.apiPath
          ? ProjectConfig.configs.apiPath + (url ?? '')
          : url;
      }
    });
  }
  return ProjectConfig.configs && ProjectConfig.configs.apiPath ? ProjectConfig.configs.apiPath + (url ?? '') : url;
};

/**
 * Make json object to dot json object
 * @param data - data that should be convert
 */
export const toDotJson = (data: any): string => {
  return dotObject.dot(data);
};
