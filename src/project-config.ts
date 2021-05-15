import { IProjectConfig } from '.';

/**
 * Project config class to store configurations of project
 */
export class ProjectConfig {
  private static configsData: IProjectConfig;

  /**
   * Initialize and store configuration
   * @param configs - Project configs
   */
  static init(configs: IProjectConfig) {
    if (!ProjectConfig.configsData) {
      ProjectConfig.configsData = configs;
    }
  }
  /**
   * Get configurations
   */
  static get configs() {
    return this.configsData;
  }
}
