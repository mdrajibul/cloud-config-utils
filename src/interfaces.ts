export interface IProjectConfig {
  port?: number;
  version?: string;
  api?: IApi;
  apiPath?: IApi;
  [key: string]: any;
}

export interface IApi {
  [key: string]: {
    baseUrl?: string;
    endPoints: any;
    [key: string]: any;
  };
}
