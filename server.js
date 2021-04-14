const express = require('express');
const app = express();

const PORT = process.env.PORT || 9000;



app.get("/", (request, response) => {
    response.send("Hello");
});

app.listen(PORT, () => {
    console.log( `server running on port ${PORT}`);
});