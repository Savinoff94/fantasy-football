const db = require('../modules/db').db;
const axios = require("axios").default;

const handleUpdatePlayers = (req,res,next) => {
  const today = new Date(Date.now());
  
  const hour = today.getHours()

  db.select('*')
  .from('players')
  .then(data => {
    data.forEach((row) =>{
      const gameDay = new Date(row.next_fixure_date * 1000)
      const gameHour = gameDay.getHours();
      // console.log('today.getDate',today.getDate())
      // console.log('gameDay.getDate()',gameDay.getDate())
      // console.log('hour',hour)
      // console.log('gameHour',gameHour)
      if((today >= gameDay && hour-gameHour >= 3) || ((today >= gameDay) && today.getDate() > gameDay.getDate())){
        
        console.log('im inside time')
        const options = {
          method: 'GET',
          url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures/players',
          params: {fixture: row.next_fixure_id, team: row.team_id},
          headers: {
            'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
            'x-rapidapi-key': KEY
          }
        };
        
        axios.request(options).then(playersData => {
          // console.log('playersData.data.response[0].players',playersData.data.response[0].players)
          let obj = playersData.data.response[0].players.filter((item) => {
            console.log(`${row.player_id}   ${item.player.id}`)
            return row.player_id === item.player.id && item.statistics[0].games.rating
          })
          console.log('obj',obj);

          if(obj.length === 0){
            const optionsNext = {
              method: 'GET',
              url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
              params: {league: '39', season: '2021', team: row.team_id, next: '1'},
              headers: {
                'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
                'x-rapidapi-key': KEY
              }
            }

            axios.request(optionsNext)
            .then( fixureData => {
              console.log('row.player_id',row.player_id)
              console.log('fixureData.data.response[0].fixture.id',fixureData.data.response[0].fixture.id)
              console.log('fixureData.data.response[0].fixture.timestamp',fixureData.data.response[0].fixture.timestamp)
              db('players')
              .where({
                email:row.email,
                player_id:row.player_id,
                player_index:row.player_index
              })
              .update({
                  next_fixure_id:fixureData.data.response[0].fixture.id,
                  next_fixure_date:fixureData.data.response[0].fixture.timestamp,
              })
              .returning('*')
              .then(data => console.log("input when obj 0:",data))
              .catch(e => console.log(e))
            }
            ).catch(e => {
                console.log(e)
            });
            return null
          }else{
            console.log('#######################################')
            console.log('ebanina',obj[0].statistics)
            db('players')
            .where({
              email:row.email,
              player_id:row.player_id,
              player_index:row.player_index
            })
            .update({
              earned_points:row.earned_points + obj[0].statistics[0].games.rating
            })
            .returning('*')
            .then(tmp => console.log('updating earned points',tmp))
            .catch((e) => {
              console.log(e);
              return null;
            })

            const optionsNext = {
              method: 'GET',
              url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
              params: {league: '39', season: '2021', team: row.team_id, next: '1'},
              headers: {
                'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
                'x-rapidapi-key': KEY
              }
            }

              axios.request(optionsNext)
              .then( fixureData => {
                console.log(fixureData)
                console.log('fixureData.data.response[0].fixture.id',fixureData.data.response[0].fixture.id)
                console.log('fixureData.data.response[0].fixture.timestamp',fixureData.data.response[0].fixture.timestamp)
                db('players')
                .where({
                  email:row.email,
                  player_id:row.player_id,
                  player_index:row.player_index
                })
                .update({
                    next_fixure_id:fixureData.data.response[0].fixture.id,
                    next_fixure_date:fixureData.data.response[0].fixture.timestamp,
                })
                .returning('*')
                .then(data => console.log("input when obj not null:",data))
                .catch(e => console.log(e))
              }
              ).catch(e => {
                  console.log(e)
              });
          }

        }
        ).catch(function (error) {
            console.error(error);
            next();
        });
      }
    })
    next(); 
  })
}


module.exports = {
  handleUpdatePlayers
}
