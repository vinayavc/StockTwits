const express = require('express');
const app = express();
const axios = require('axios');
const cors = require('cors');

app.get('/hey', (req, res) => res.send('ho!'))
app.use(cors())
const TOKEN='6e87e254390add4dfbe0ece81c6b88548539ccf7';

app.get('/:key', async(req,res) => {
    
    const params = {
        symbols: req.params.key,
    };
    axios.get(`https://api.stocktwits.com/api/2/streams/symbols.json?access_token=${TOKEN}`,{
        data : params
    })
    .then(response => {
        res.json(response.data)        
    })
    .catch(error => {
        console.log(error);
    });
        
    });


app.listen(8080)