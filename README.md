# Machine-Learning-JS
Machine Learning algorithms experiments using Node.js as server, client-side JavaScript operations and and MongoDB as data source.

../data/ folder contains the example database.

## Implemented algorithms
* Simple C4.5
* Simple PRISM
* Cross Validation

## To do (at least)
* Simulated Annealing
* Genetic algorithm
* k-means

***

##Installation
To test the code simply open a terminal and run this command with the the project folder as current directory:
```bash
npm install
```
It has to be done only the first time in order to install the required modules.

Then you should run one of those commands in a terminal (depending on your OS):
```bash
#(Unix)
/your/path/to/mongod --dbpath /your/path/to/Machine-Learning/data/"
```
```command
::(Windows)
"Drive:\your\path\to\mongod.exe" --dbpath "Drive:\your\path\to\Machine-Learning\data\"
```
And this one in another terminal to start the server (of course current directory has to be the project folder again):
```bash
npm start
```
Then go to [localhost:3000](http://localhost:3000) in your browser and wait for the data to be loaded (it may take a while depending on your hardware).

Of course you should download and install [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.org/).

