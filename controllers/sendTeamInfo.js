const db = require('../modules/db').db;

const handleSendTeamInfo = (req,res) => {
    const {email} = req.body;
    console.log("!!!!!!!!!!!!", email)
    if(!email){
        return res.status(404).json('incorrect form submission')
    }
    db.select('player_id','earned_points')
    .where({email:email})
    .from('players')
    .then(data => {
        console.log("TEAM INFO", data)
        res.status(200).json({data:data})})
    .catch((e) => console.log(e))
}

module.exports = {
    handleSendTeamInfo
  }
  