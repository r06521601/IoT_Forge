# IoT_Forge

![thumbnail](src/www/images/image.PNG)

## Description

This project show IoT sensor data and use heatmap visualization on the Web BIM server.

IoTtoDB.py: The code is connecting sensor's data with dataBase.(So, you should have your own sensor and database server.)

src : Forge file include server. client .......

## How to Run

The first step you should give your "url"  to ./src/www/js/index.js

And you need to cd to ./src/ 

then...

if Mac OSX/Linux (Terminal)

    npm install
    export FORGE_CLIENT_ID=<<YOUR CLIENT ID FROM FORGE DEVELOPER PORTAL>>
    export FORGE_CLIENT_SECRET=<<YOUR FORGE CLIENT SECRET>>
    npm run dev

if Windows (use <b>Node.js command line</b> from Start menu)

    npm install
    set FORGE_CLIENT_ID=<<YOUR CLIENT ID FROM FORGE DEVELOPER PORTAL>>
    set FORGE_CLIENT_SECRET=<<YOUR FORGE CLIENT SECRET>>
    npm run dev

## License

That samples are licensed under the terms of the [MIT License](http://opensource.org/licenses/MIT).



## Written by

Roy Huang <br />

National Taiwan University<br />

Civil Engineering - Department of Computer-Aided Engineering<br />

## Reference
Jaime Rosales D. <br /> 
[![Twitter Follow](https://img.shields.io/twitter/follow/afrojme.svg?style=social&label=Follow)](https://twitter.com/AfroJme) <br />Forge Partner Development <br />
<a href="http://developer.autodesk.com/">Forge Developer Portal</a> <br />
