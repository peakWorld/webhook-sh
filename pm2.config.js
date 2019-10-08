module.exports = {
    apps : [{
      name: 'github-webhook',
      script: './index.js',
      watch: true,
      'ignore_watch': ['doc', 'test'],
      'out_file': '~/.logs/webhook-sh/out.log',
      'error_file': '~/.logs/webhook-sh/error.log',
      env: {
        NODE_ENV: 'production'
      }
    }]
  };
  