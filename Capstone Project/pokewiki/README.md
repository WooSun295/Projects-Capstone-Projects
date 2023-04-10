# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

This app primarily uses [PokeApi](https://pokeapi.co/) for all the information on pokemons and uses postgreSQL for user data and favorited pokemons

## Starting the App

In the project directory, run:

### `npm start` starts both the Front End and Back End servers

Runs the app in the development mode.\
Front End on [http://localhost:3000](http://localhost:3000)
Back End on [http://localhost:5000](http://localhost:5000)

### `npm run start-fe` starts the Front End

### `npm run start-be` starts the Back End

## Notes

### Config.js

Must create a config.js files in both the backend and src folders.

-  Inside /backend/config.js, contains:
   -  Secret Key to bcrypt user's passwords
      -  Which port to run the backend servers on
   -  Bcrypt work factor - Inside /src/config.js
      -  Secret Key to bcrypt user's passwords

## BackEnd

### Routes

`/`: Gives a general overview on all the routes and what they do

`/pokewiki`

-  `/pokewiki/:category`: Retrieves all elements from the specified categories. Implemented [pokemon, ability, item, berry]
-  `/pokewiki/:category/:id`: Retrieves a specified element from the specified category by its id. Implemented [pokemon, ability item, berry]

`/auth`

-  `/auth/login`: Logs in a user and returns their token
-  `/auth/signup`: Signs up a user and returns their token

`/users` (all routes in `/users` require token to be passed in as headers : {authorization: Bearer {token}})

-  `/:username`: Get info on user, update info on user, delete user from db
-  `/:username/favs`: Gets user's favorited pokemon(s)
-  `/:username/favs/:id`: Post user's favorited pokemon, delete user's favorited pokemon

## FrontEnd

### Routes

`/`: General blank welcome page, navbar is always present

`/[pokemon, ability, item, berry]`: Shows a list, with pictures of applicable, of all things in the category
