module.exports = function (req, res, next) {
    if(req.user.is_active !== true){
        return res.status(403).send({message:"Bu foydalanovchi active emas !"})
    }
    next()
}