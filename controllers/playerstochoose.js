const db = require('../modules/db').db;

const handleplayerstochoose = (req,res) => {
    console.log('handlegetplayerstochoose');
    const {position} = req.body;

    if(!position){
        return res.status(404).json('no position')
    }

    db.select('data')
    .from('players_base')
    .where({
        position:position
    })
    .whereNotNull('rating')
    .then(response => {
        res.status(200).json({data:response})
    })
    .catch((e) => console.log(e))
}

module.exports = {
    handleplayerstochoose
}