# seascape-js
Seascape SDK for the games

# installation
1. clone this repo
2. install dependencies: `npm install`
done!

# sample
You can run the sample on localhost at port 8080 :

`node index.js`

or

`cmd /C "set REMOTE_HTTP=https://rinkeby.infura.io/v3/<key> && node index.js"`

index.js + index.html is holding an example of APY of first game.

# compilation
`browserify -t brfs --standalone seascape src/seascape.js -o dist/seascape.js`
