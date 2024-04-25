//imports
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

//API middleware
// app.use(express.json());
// app.use(express.urlencoded());


//static files
app.use(express.static(`public`))
app.use(`/css`, express.static(__dirname + `public/css`))
app.use(`/js`, express.static(__dirname + `public/js`))
app.use(`/files`, express.static(__dirname + `public/files`))

//Call html file
app.get(``, (req, res) => {
    res.sendFile(__dirname + `/src/index.html`)
})


//listen on port 
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
})