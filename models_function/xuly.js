var moment = require('moment-timezone');
module.exports.Stringdata = function(str){
    let temp = intro.split('*');
    temp.forEach(function(element,index) {
        if(element !== '\r\n'){
        //  console.log(element.trim())
        }
});
}
module.exports.Date = function(obj){
    var dateVN = moment.tz(obj, "Asia/Ho_Chi_Minh").format();
    return dateVN.toString().replace(/T/, ' ').replace(/\..+/, '').replace(/\+07:00/, ' ')
}
module.exports.Check_Login_Us = (req,res,next)=>{
    if(req.session.usid && req.session.usname){
        return next()
    }
    res.redirect('/')
}