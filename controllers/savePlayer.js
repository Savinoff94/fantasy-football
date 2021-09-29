const db = require('../modules/db').db;
var axios = require("axios").default;

const handleSavePlayer = (req,res) => {
    const {email,player_index,player_id,team_id} = req.body;
    console.log('req.body',req.body)
    if(!email || !player_index || !player_id || !team_id){
        
        return res.status(404).json('cant save player')
    }
    db.select('*')
    .from('players')
    .where({
        email:email,
        player_index:player_index
    })
    .then(data => {
        if(data.length != 0){
            console.log('indelete branch')
            db('players')
            .where({
                email:email,
                player_index:player_index
            })
            .del()
            .returning('*')
            .then(data => console.log("del:",data))
        }
        const options = {
            method: 'GET',
            url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
            params: {league: '39', season: '2021', team: team_id, next: '1'},
            headers: {
              'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
              'x-rapidapi-key': '50969f14d2msh82dec1198045588p14141ajsnb8e0ca0d164b'
            }
        };
          
        axios.request(options)
        .then( fixureData => {
            console.log(fixureData)
            console.log('fixureData.data.response[0].fixture.id',fixureData.data.response[0].fixture.id)
            console.log('fixureData.data.response[0].fixture.timestamp',fixureData.data.response[0].fixture.timestamp)
            db('players')
            .insert({
                email:email,
                player_index:player_index,
                player_id:player_id,
                team_id:team_id,
                next_fixure_id:fixureData.data.response[0].fixture.id,
                next_fixure_date:fixureData.data.response[0].fixture.timestamp,
            })
            .returning('*')
            .then(data => console.log("input:",data))
            .catch(e => console.log(e))
        }
        ).catch(e => {
            console.log(e)
        });

        // db('players')
        // .insert({
        //     email:email,
        //     player_index:player_index,
        //     player_id:player_id
        // })
        // .returning('*')
        // .then(data => console.log("input:",data))
        
    })
    .catch(err => {
        console.log(err);
        res.status(404).json('unable to save player')
    })
}   

module.exports = {
    handleSavePlayer
}
  