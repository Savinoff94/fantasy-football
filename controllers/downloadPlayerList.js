const db = require('../modules/db').db;
const axios = require("axios").default;

const handleDownloadPlayerList = (req,res,next) => {
    const today = new Date(Date.now());

    db.select('date_to_update')
    .from('date_to_update_player_list')
    .then(data => {
        let dateCheck = data[0].date_to_update;
        dateCheck = new Date(dateCheck);
        if((today-dateCheck)/(1000*60*60*24) >= 7){
            let currentPage = 1
            let options = {
                method: 'GET',
                url: 'https://api-football-v1.p.rapidapi.com/v3/players',
                params: {league: '39', season: '2021', page: currentPage},
                headers: {
                  'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
                  'x-rapidapi-key': process.env.KEY
                }
            };
            axios.request(options).then(response => {
                let counter = 0;
                const promiseArray = [];
                while(currentPage <= response.data.paging.total && counter < 20){
                    promiseArray.push(axios.request({
                        method: 'GET',
                        url: 'https://api-football-v1.p.rapidapi.com/v3/players',
                        params: {league: '39', season: '2021', page: ++currentPage},
                        headers: {
                        'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
                        'x-rapidapi-key': process.env.KEY
                        }
                    }))
                    ++counter;
                }
                // console.log('total:',response.data.paging.total);
                // console.log('length: ', promiseArray.length)

                Promise.all(promiseArray)
                .then(values => {
                    let players = [];
                    values.forEach(page => {
                        page.data.response.forEach(item => {
                            players.push(item)
                        })
                    })
                    // console.log('players', players);

                    db('players_base')
                    .del()
                    .then(() => console.log('players base empty'))
                    .catch((e) => console.log(e))

                    let insertPlayersPromises = [];
                    players.forEach(player =>{
                        insertPlayersPromises.push(
                        db('players_base')
                        .insert({id:player.player.id, position:player.statistics[0].games.position, rating:player.statistics[0].games.rating, data:JSON.stringify(player)}))
                    })
                    Promise.all(insertPlayersPromises)
                    .then(()=> {
                        db('date_to_update_player_list')
                        .update({date_to_update: new Date().toISOString().slice(0, 10)})
                        .whereNotNull("date_to_update")
                        .then(()=>{
                            console.log('date updated')
                            next();
                        })
                        .catch((e) => {
                            console.log(e)
                            next();
                        })
                    })
                    .catch((e) => console.log(e))
                })
                .catch(e => console.log(e))
            }).catch(function (error) {
                console.error(error);
            });


        }
        else{
            console.log('im not downloading anything')
            next();
        }
    })
    .catch(e => console.log(e))
}

module.exports = {
    handleDownloadPlayerList
  }
  