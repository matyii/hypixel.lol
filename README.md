![Banner](hypixel.png)
# hypixel.lol
![image]({https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E})
![image]({https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white})
![image]({https://img.shields.io/badge/json-5E5C5C?style=for-the-badge&logo=json&logoColor=white})

### Features
- Easy configuration
- Config generator
- Embed support
- Discord webhooks support
- API
- Multiple domains support

### Installation
- Download / Clone the source code.
- Open a terminal and run `npm install` or `npm i` to install all dependencies.
- Configure the config in `src/data/config.json`.
- Add your keys in `src/data/keys.json`.
- Run `node .` or `npm start` to start the node.

### Setup
To add domains you need to first open `src/data/domains.json` and add the domains to the list.  
Then you need to point the domains in the list to the server hosting hypixel.lol.  
Finally, all domains pointed should update and they should be working.  

To use subdomains you need to setup a wildcard subdomain (`*`) in each domain.  
This allows anything to be put infront of the domain. Allowing custom subdomains, even ones that other people may already be using.

### Config
Here is a list of all the keys in the config with their meaning.  

- `maindomain` : This is the main domain, if a domain is not set in the config it falls back to this.  
- `uploadkeylength` : The length of characters, that are after the username in the upload key.  
- `nodeserverport` : The port for the server.
- `upload_notify` : Get a console log about every upload.
- `webhook_notify` : Get a Discord webhook log about every upload.
- `webhook_url` : The URL for the webhook.

### Progress
- [x] Page rendering cleanup
- [x] Webhooks for uploads
- [X] Endpoints cleanup
- [ ] User system

### How to make new endpoints
To make a new endpoint you need to make a file in the `routes` folder with your name of choice. Example: `example.js`
The empty version should look like this:
```js
const express=require('express')
const router=express.Router()
router.get("/",(req,res)=>{
    res.send('Hello!')
})
module.exports=router;
```

In your `server.js` you need to add two lines
- Importing the endpoint:
    `const exampleRoute = require("./routes/example")`
- Making the endpoint reachable:
    `app.use("/yourendpoint", exampleRoute)`

**Note!**
In your endpoint JS file, leave the router endpoint on `"/"`, since you will be giving the name of the route in the main `server.js` file.

### How to add new folders to check
To add new folders to the checker, you simply add a new list element containing the path of the folder in the `folders` variable in the `server.js` file. The checker (`/functions/check.js`) will run through all the list items, and checking them, if they exist, if they don't exist, it will make the specified folder.

### API
- **GET** `/api` : API Documentation
- **GET** `/api/uploads/:uploadkey` : Returns a list of uploads uploaded with the upload key.
- **GET** `/api/domains` : Returns a list of all the domains.
- **POST** `/api/upload`: This is the upload URL, and you can use other apps to upload files. In the post body you only need the `upload-key` and the `file`.

### Copyright
hypixel.lol is solely owned and developed by [Benny](https://github.com/bentettmar). All rights go towards the developers.
