const mongoose = require('mongoose');
const url = 'mongodb://localhost/Nienluannganh';
const Companies = require('../models/Companies');
const Infor_Companies = require('../models/Infor_Companies')
module.exports.editprofile_companies = function(data,id){
        mongoose.connect(url,async function(err){
            if (err) throw err;
            if(data.uplogo){
            await Companies.update({_id:id},{$set:{'image.logo':"/public/image/company/"+data.uplogo}})
            }
            if(data.upbg){
            await Companies.findByIdAndUpdate(id,{$set:{'image.background':"/public/image/company/"+data.upbg}})
            }
            await Companies.findByIdAndUpdate(id,{$set:
            {
                Address:{
                    linkwebsite:data.link,
                    city: data.city,
                    country: data.country,
                    address:data.address,
                },
                title: data.title,
                work: data.work,
                member:data.member,
                workday: data.workday,
            }
        })
           
        })
}
module.exports.loadprofile_companies = function(id){
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,function(err){
            if(err) throw reject(err);
            let profile = Companies.findById(id);
            resolve(profile)
        })
    })
}
module.exports.loadInfor_companies = function(id){
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,function(err){
            if(err) throw reject(err);
            let Infor = Infor_Companies.findOne({companies:id});
            resolve(Infor)
        })
    })
}