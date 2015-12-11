const nconf = require('nconf');
const request = require('request');
const winston = require('winston');
const fs = require('fs');
const CSV = require('comma-separated-values');

const logger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            timestamp: true,
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});

nconf.argv()
  .env()
  .file({ file: './config.json' });

const domain = nconf.get('AUTH0_DOMAIN');
const token = nconf.get('AUTH0_API_TOKEN');

const users = [];
const done = function() {
  logger.info('All users have been downloaded, total: ' + users.length);

  var data = users.map(u => {
    return {
      connection: u.identities[0].connection,
      user_id: u.user_id,
      family_name: u.family_name || '',
      given_name: u.given_name || '',
      nickname: u.nickname || '',
      email: u.email || '',
      created_at: u.created_at || '',
      updated_at: u.updated_at || '',
      logins_count: u.logins_count || 0
    };
  });

  var output = new CSV(data, { header: true, cellDelimiter: '\t' }).encode();
  fs.writeFileSync('./auth0-users.csv', output);

  logger.info('File saved to: auth0-users.csv');
};

logger.info('Starting export...');

const getUsers = function(page) {
  var options = {
    url: `http://${domain}/api/v2/users`,
    headers: {
      'Authorization': `Bearer ${token}`
    },
    json: true,
    qs: {
      page: page,
      per_page: 100
    }
  };

  request.get(options, (err, res, body) => {
    if (err) {
      return logger.error('Error getting users', err);
    }

    if (body && body.length > 0) {
      body.forEach((user) => {
        users.push(user);
      });

      logger.info(`Processed ${users.length} users.`);
      setImmediate(() => getUsers(++page));
    }
    else {
      done();
    }
  });
};
getUsers(0);
