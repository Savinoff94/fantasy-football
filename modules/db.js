const knex =require('knex');

module.exports = {
  db: knex({
    client:'pg',
    connection:{
      host:'127.0.0.1',
      user:'postgres',
      password:'bioshock908',
      database:'fantasy_football'
    }
  })
}
