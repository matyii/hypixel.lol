![Banner](hypixel.png)
# hypixel.lol
A node.js ShareX file uploader with multiple domains, upload keys, embeds and a pretty config generator.  
This is a great base to start a small image host.

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
- `uploadkeys` : A list of the upload keys. Format: `{username}_{key}`. The part after the underscore must be the same length as `uploadkeylength`.  
- `nodeserverport` : The port for the server.
- `upload_notify` : Get a console log about every upload.

### Progress
- [x] Page rendering cleanup
- [ ] Webhooks for uploads
- [ ] User system

### API
- **GET** `/api` : API Documentation (Soon.)
- **GET** `/api/uploads/:uploadkey` : Returns a list of uploads uploaded with the upload key.
- **GET** `/api/domains` : Returns a list of all the domains.

### Copyright
hypixel.lol is solely owned and developed by [Benny](https://github.com/bentettmar). All rights go towards the developers.