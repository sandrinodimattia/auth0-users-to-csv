# Auth0 users to CSV

Small tool to export all of your Auth0 users to a CSV file. This is useful if you need to import them somewhere else (like marketing campaigns) or if you need to do some reporting on number of (new) users per connection.

## Getting your account information

 1. Go to Auth0's API explorer: https://auth0.com/docs/api/v2
 2. In the left menu, generate a token with the `read:users` scope.
 4. Save this information in the config.json file

## Exporting your users

 1. Install Node.js 4.0 or higher: https://nodejs.org/en/download/
 2. Clone/Download this repository
 3. Run `npm start` from the repository's directory

After a few seconds a CSV file will be available containing all of your users. Use Excel to open the file, use the Text-to-Columns feature (with TAB as a delimiter) and convert everything to a table. This will allow you to filter data, hide columns, ...

The following fields are available by default:

```
connection
user_id
family_name
given_name
nickname
email
created_at
updated_at
logins_count
last_login
last_ip
```
