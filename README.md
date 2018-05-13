# Aware-Server

Server side data logging app fro Aware-Client

# Install Guide

1. Install node.js and mysql in your installation system.
2. Clone this repository -

      `git clone https://github.com/rabbihossain/Aware-Server.git`

3. go to the cloned directory - `cd Aware-Server`
4. change the datastore settings in `config/datastore.js` file with your mysql user,password and databse information. Here is the dummy configuration code on `config/datastore.js`

    `url: 'mysql://USER:PASSWORD@DB_HOST_IP:PORT/DB_NAME',`

5. Also install pm2 to moitor this apps usage using

  `npm install -g pm2`

5. now run `npm install` in your terminal on that same `Aware-Server` directory.
6. Now start the app using

  `pm2 start app.js -x`

### Links

+ [Sails framework documentation](https://sailsjs.com/documentation)
+ [Version notes / upgrading](https://sailsjs.com/documentation/upgrading)
+ [Deployment tips](https://sailsjs.com/documentation/concepts/deployment)
+ [Community support options](https://sailsjs.com/support)
+ [Professional / enterprise options](https://sailsjs.com/enterprise)
