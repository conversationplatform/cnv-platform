
const DEFAULTS = {
    'root-redirect': '/api',
    cors: 'http://localhost:1234',
    ARANGO_HOST: '',
    ARANGO_USER: '',
    ARANGO_PASSWORD: '',
    ARANGO_DATABASE: '',
    ADMIN_USER: '',
    ADMIN_PASSWORD: '',
    JWT_EXPIRATION_SECONDS: '60s',
    USE_BUNDLED_NODERED: true,
    NODERED_HOME_DIR: '',
    NODERED_WS_CONNECTION: 'ws://localhost:8080',
    NODERED_HTTP_CONNECTION: 'http://localhost:1880',
    NODERED_ENABLE_PROJECTS: false,
    NODERED_FLOW_FILE: 'flows.json',
    NODERED_ENABLE_PALLETE: false,
    TRACK_LIFETIME_MONTHS: 13,
    SESSION_COOKIE_NAME: 'cnv-platform',
    ENABLE_CUSTOM_PROPERTIES: 'true'
    
}

export {
    DEFAULTS
};