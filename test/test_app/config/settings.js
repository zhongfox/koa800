module.exports = {
  testkey1: 'testkey1 in config/settings.js',
  testkey2: 'testkey2 in config/settings.js',
  testkey3: 'testkey3 in config/settings.js',
  testkey4: 'testkey4 in config/settings.js',

  redis: {
    master: {host: '127.0.0.1', port: 6123}
  },

  memcached: {
    'locations': ['127.0.0.1:11211'],
    'options': {
      'maxKeySize': 250,
      'poolSize': 10,
      'timeout': 2000
    }
  },

};
