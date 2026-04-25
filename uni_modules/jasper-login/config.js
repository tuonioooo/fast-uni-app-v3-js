import baseConfig from './config/base.js';
import platformOverrides from './config/platform-overrides.js';
import { normalizeLoginConfig } from './utils/normalize-config';

const config = {
  ...baseConfig,
  ...platformOverrides,
  loginTypes: [...(baseConfig.loginTypes || []), ...(platformOverrides.loginTypes || [])],
};

export default normalizeLoginConfig(config);
