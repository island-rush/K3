# Island Rush V3

[![Build status](https://dev.azure.com/spenceradolph/IslandRushK3/_apis/build/status/IslandRushK3-CI)](https://dev.azure.com/spenceradolph/IslandRushK3/_build/latest?definitionId=7)

![FullGameboard](https://github.com/island-rush/Images/blob/master/K3/fullGameboard.PNG)

Island Rush is a military strategy teaching tool/game for use by DFMI at The United States Air Force Academy. The game is deployed as a web-app, and consists of 2 teams of 4-5 students each playing aginst each other to dominate a domain of islands. Students use lessons of strategy they have learned and put them into practice to demonstrate their knowledge.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system. Please note that Island Rush is designed and tested on Chrome, and other browsers may work but are not officially supported or recommended.

### Prerequisites

NodeJS is used on both the server and client. NPM is used for installing and dependency tracking. It should, however, be included when you install Node. MySQL is used for the database. This can be installed locally or accessed externally.

```
node
mysql
```

### Installing

These commands will get you a working copy of this repository, and set up all development dependencies.

Clone the reposority.
```
git clone https://github.com/island-rush/K3.3.git
cd K3.3
```

Install node modules for the server.
```
npm install
```

Install node modules for the client.
```
cd ./src/react-client
npm install
cd ../..
```

All dependencies should now be installed and you should be able to run the server for local development and testing.

### Database

There are many methods of running / hosting a MySQL server. Once the database exists, please create a user/password for the game to use. Set these values in the env variables on your system or use the .env file. Some defaults already exist here, simply overwrite them or add your own according to the examples.

### Development

The following are a list of commands used to control the frontend and backend. Please reference the ./package.json file for all commands, dependencies, dev dependencies, and repository configurations.

This command runs both the backend and frontend servers together.
THIS COMMAND IS TYPICALLY USED FOR ALL DEVELOPMENT.
```
npm run dev
```

Running the backend allows access to these non-game pages, and admin controls.

-   /index.html
-   /teacher.html
-   /courseDirector.html
-   /credits.html
-   /troubleshoot.html

Note there are several env variables used by the backend. These can be easily configured for local development within the .env file. The values within that file will be ignored when NODE_ENV is set to 'production', or they already exist in the environment. Some of the default values listed below are set within this file.

-   CD_SECTION = Course Director Section -> default is "CourseDirector"
-   CD_LASTNAME = Course Director Last Name -> default is "Smith"
-   CD_PASSWORD = Course Director MD5 Password Hash -> default is MD5('asdf')
-   DB_NAME = name of database -> default is 'islandrushdb'
-   DB_HOSTNAME = database host -> default is 'localhost'
-   DB_USERNAME = database user -> default is 'root'
-   DB_PASSWORD = database password -> default is ''
-   SESSION_SECRET = optional secret used by session cookies for security
-   NODE_ENV = 'production' or 'development'...this determines how the backend serves out the frontend
-   NODE_OPTIONS = options for running node. (--max_old_space_size=4096)
-   PORT = server port (typically pre-set in production environments) -> default is 80
-   GENERATE_SOURCEMAP = value used by react, this should always be false. Without this value, build times take up to an hour.

Inserting the database tables and creating/deleting games can be accomplished from the /courseDirector page. Login from the homepage 
Teacher Login form with the credentials used in the env variables. These are the only credentials used to get to this page.

-   Section: "CourseDirector" -> Env value
-   Instructor: "Smith" -> Env value
-   Password: "asdf" -> Env value

Here you can click a button to insert the database tables ("INITIALIZE DATABASE"). This action must be done before all others.

The /courseDirector page is used for creating games, deleting games, and resetting teacher passwords. You must create a game here in order to play the game. It is recommended to create a game with the default values that are always loaded in the homepage. This will prevent typing in credentials everytime the client needs to login. ('m1a1', 'adolph', 'asdf').

The password used when creating a game is the password used by teachers to login to their /teacher page. Teachers are able activate/deactivate their games, as well as reset the game to have initial pieces on the board. They can also reset team passwords, but simply leaving these as the defaults are fine when developing.

Similar to Course Director, teachers login from the homepage with:

-   Section: "m1a1" -> Whatever value was set from CourseDirector.
-   Instructor: "adolph" -> Whatever value was set from CourseDirector.
-   Password: "asdf" -> Whatever value was set from CourseDirector.

Once you have logged in as a teacher, you can click the switch at the top of the page to enable a game. 

Running the frontend allows access to the main /game.html page (localhost:3000). You can log into it from the homepage using the Player Login form. This is running a react development server. If the backend server is running, it will redirect the frontend to the homepage to enforce an authenticated session. Without the backend running, the frontend won't redirect (great for developing react components) but won't receive any game info, and will appear as if it is loading.

This command will run only the backend server (homepage(s) and backend functionality).
```
npm run devBackend
```

This command will run the frontend react server (main game page on localhost:3000).
```
npm run devFrontend
```

Please note that production environments will build the client and server, creating static files in ./dist for the server to use. If the NODE_ENV is set to 'production', the backend will server the static files instead of localhost:3000. This can also be altered manually in the ./src/server/router.ts file.

When you are ready for deployment, or wish to test with the static files (they run faster), use this command.
```
npm run build
```

When the ./dist folder has been populated with the static files and building is complete, you can run the server with this command.
```
npm start
```
Note: Without changing NODE_ENV to "production", this will still redirect the game to localhost:3000. Please update the .env file for easy changes.

## Deployment

A combination of the commands listed above can be configured inside an automated CICD pipeline, or manually executed on whatever production machine is in use. Please set env variables before executing, and ensure the database is accessible.

Note: the ./web.config is currently being used to configure the environment to run on the Azure Cloud, with the contents of the ./dist directory also being moved to the root directory. This application should run as any typical node server, for which there are plenty of guides and configurations available online to help with deploying.

## Built With

-   [node](https://nodejs.org/en/docs/) - Backend Server
-   [typescript](https://www.typescriptlang.org/) - Language
-   [mysql](https://dev.mysql.com/doc/) - Database
-   [react](https://reactjs.org/docs/getting-started.html) - Frontend Framework
-   [redux](https://redux.js.org/) - State Management

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Version

Version 3.3.0

---

Please [report](https://gitreports.com/issue/island-rush/K3) any issues.
