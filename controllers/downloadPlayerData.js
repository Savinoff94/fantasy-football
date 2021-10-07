const db = require('../modules/db').db;
const axios = require("axios").default;

const handleDownloadPlayerData = (req,res) => {
    const {email,player_index} = req.body;
    // console.log('req.body download player data', req.body)
    if(!email || !player_index){
        return res.status(404).json('cant download player')
    }
    db.select('player_id')
    .from('players')
    .where({
        email:email,
        player_index:player_index
    })
    .then((data) => {
        // console.log('data from database player downloading:', data)
        if(data.length === 0){
            res.status(404).send('no player data')
        }else{
            // console.log('data[0]',data[0])
            const options = {
                method: 'GET',
                url: 'https://api-football-v1.p.rapidapi.com/v3/players',
                params: {id: data[0].player_id, season: '2021'},
                headers: {
                  'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
                  'x-rapidapi-key': KEY
                }
              };
              
              axios.request(options).then(function (response) {
                // console.log(response.data);
                res.status(200).json({data:response.data})
              }).catch(function (error) {
                console.error(error);
              });
        }
    })
    .catch((e) => {
        console.log(e)
        res.status(404).json('wrong credentials')
    })
}



module.exports = {
    handleDownloadPlayerData
}
