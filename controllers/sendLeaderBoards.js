const db = require('../modules/db').db;

const handlesendLeaderBoards = (req,res) => {
    // console.log('huipizdadgigurda')
    db('users')
    .select('email', 'points')
    .orderBy('points', 'desc')
    .then(data => {
        // console.log(data);
        res.status(200).json({data:data})
    })
    .catch(e => console.log(e))

}

module.exports = {
    handlesendLeaderBoards
}
