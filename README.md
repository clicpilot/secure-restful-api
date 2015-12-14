This is a template project equipped with

* Security with JWT
* Testing with mocha and chai
* Versioning


# Guides

## Run the server

To run locally, you should first install node modules by

> npm install

After installing modules, start API in local environment by

> npm start


## Testing

This tests are integration tests.

You should install mocha globally first

> npm install -g mocha

You should install MongoDB and run

> ./bin/mongod --dbpath \<Project-Folder\>/test/db

Then create a database named **api-test** by first open ./bin/mongo and type

> \> use api-test

The default db folder for the db should be located in test folder

You will just start by typing

> npm test

## Code Coverage
Run istanbul for code coverage

> \> ./node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha

or

> \> npm run coverage 