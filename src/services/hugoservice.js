const YAML = require("yaml");
const TOML = require("toml");

const FileRepo = require("./filerepo");

/**
 * Interface for interacting with a Hugo project.
 *
 * {@link https://gohugo.io/getting-started/configuration/}
 */
class HugoService {
  // Possible Hugo configuration filenames (i.e., "<filename>.<extension>"); in-order of preference
  static ConfigFilenames = ["hugo", "config"];

  // Supported Hugo configuration file extensions; in-order of preference
  static ConfigExtensions = ["toml", "yaml", "json"];

  constructor(fileRepo = new FileRepo()) {
    this.fileRepo = fileRepo;
  }

  /**
   * Get the Hugo configuration object. If an override is provided, it will be used instead of the
   * default ordering (i.e., 'hugo's before 'config's, and TOML before YAML before JSON)
   *
   * @param {string} override a Hugo config file to use instead of the default
   * @returns {object | null} the Hugo config object, or null if not found or other error
   */
  getConfig(override) {
    // Find the first configuration file that exists in the project
    const configFile = this.getConfigFile(override);
    if (!configFile) {
      return null;
    }

    try {
      const config = this.fileRepo.loadFile(configFile);
      const extension = this.getExtension(configFile);

      // Try to return the parsed config object, based on the extension
      return this.parseConfig(config, extension);
    } catch (e) {
      // eslint-disable-next-line
      console.error(`Error: could not load or parse ${configFile}.`);
      return null;
    }
  }

  getConfigFile(override) {
    if (override && this.fileRepo.exists(override)) {
      return override;
    }
    if (override) {
      // eslint-disable-next-line no-console
      console.error(`Override provided but ${override} does not exist.`);
      return null;
    }

    for (const filename of HugoService.ConfigFilenames) {
      for (const extension of HugoService.ConfigExtensions) {
        const config = `${filename}.${extension}`;
        if (this.fileRepo.exists(config)) {
          return config;
        }
      }
    }

    // eslint-disable-next-line no-console
    console.error(`No Hugo config file found.`);
    return null;
  }

  parseConfig(config, extension) {
    switch (extension) {
      case "toml":
        return TOML.parse(config);
      case "yaml":
        return YAML.parse(config);
      case "json":
        return JSON.parse(config);
      default:
        // eslint-disable-next-line no-console
        console.error("Invalid extension for Hugo config file.");
        return null;
    }
  }

  /**
   * Generic helper to get the extension of a filename.
   *
   * @param {string} filename
   * @returns {string} the extension of the file
   */
  getExtension(filename) {
    return filename.split(".").pop();
  }
}

module.exports = HugoService;
