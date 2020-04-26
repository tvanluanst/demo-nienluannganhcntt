var express =  require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const Companies = require('../models/Companies');
const mongoose = require('mongoose');
const Infor_Companies = require('../models/Infor_Companies');
var client = require('../elasticsearch/connection');
const url = 'mongodb://localhost/Nienluannganh';
var formidable = require('formidable');
var fs = require('fs');
var addcompanies_elas= require('../models_function/model_elas');
router.get('/registration',function(req,res){
    if(req.session.adid && req.session.adname){
        res.redirect('/admin/home')
    }else{
        res.render('./admin/registration')
    }
   
})
router.post('/signup',function(req,res){
    var form = new formidable.IncomingForm();
    form.uploadDir="public/image/"
    form.parse(req, function (err, fields, file) {
        if(err) throw err;
        let cpnname = fields.namecpn;
        let link = fields.link;
        let title = fields.title;
        let address = fields.address;
        let country = fields.country;
        let city = fields.city;
        let work = fields.work;
        let email = fields.email;
        let password = fields.password;
        let uplogo = file.uplogo.name;
        let newpath = form.uploadDir + uplogo; 
        let oldpath  = file.uplogo.path;
        mongoose.connect(url,async function(){
            if (err) throw err;
            let newCompany = await new Companies({
                _id: new mongoose.Types.ObjectId(),
                name:cpnname,
                email:email,
                pws:password,
                Address:{
                    linkwedsite:link,
                    city:city,
                    country:country,
                    address:address
                },
                title:title,
                work:work,
                image:{
                    logo:newpath
                }
            });
            newCompany.save(async function(err){
               console.log(newCompany._id) 
                if(err) throw err;
                await client.index({
                    index: 'companies',
                    id: newCompany._id.toString(),
                    type: '_doc',
                    body:{
                        name:cpnname,
                        email:email,
                        address:{
                            linkwedsite:link,
                            city:city,
                            country:country,
                            address:address
                        },
                        title:title,
                        work:work,
                        image:{
                            logo:newpath
                        }
                    }
                },function(err,req,status){
                    if(err) console.log(err);
                })
                fs.rename(oldpath,newpath, function (err) {
                    if (err) throw err;
                });
            })
        })
    })
    return res.redirect('/admin/registration');
})
router.post('/signin',urlencodedParser,function(req,res){
    let email = req.body.emailad;
    let pws = req.body.passwdad;
    mongoose.connect(url,async function(err){
        const companiesFind =await Companies.findOne({email:email,pws:pws})
        if(email && pws){
            req.session.adid = companiesFind._id;
            req.session.adname = companiesFind.name;
            res.redirect('/admin/home')
        }else res.redirect('/admin/registration')
    })
})
router.get('/home',function(req,res){
    if(req.session.adid && req.session.adname){
       res.render('./admin/home', {
           title: 'Nhà tuyển dụng',
           name: req.session.adname,
           id: req.session.adid
       }) 
    }else res.redirect('/admin/registration')
    
})
router.get('/page-ad',function(req,res){
    if(req.session.adid && req.session.adname){
        res.render('./admin/page', {
            title: 'Nhà tuyển dụng',
            name: req.session.adname,
            id: req.session.adid
        }) 
     }else res.redirect('/admin/registration')
})
router.post('/edit',function(req,res){
    if(req.session.adid && req.session.adname){
        mongoose.connect(url,async function(err){
            const CompaniesFind =await Companies.findById(req.session.adid);
            res.render('./xuly/editadmin', {
                data: CompaniesFind
            }) 
        })
        
     }else res.redirect('/admin/registration')
})
router.post('/introcpn',function(req,res){
    if(req.session.adid && req.session.adname){
    var form = new formidable.IncomingForm();
    files = [],
    fields = [];
    let images = [];
    //form.uploadDir = "public/image/company";
    form.on('field', function(field, value) {
        fields.push([field, value]);
    })
    form.on('file', function(field, file) {
      /*  fs.rename(file.path,form.uploadDir+file.name, function (err) {
            if (err) throw err;
        });*/
        files.push([field, file]);
        images.push("public/image/company"+file.name)
    })
    form.on('end', function() {
        console.log('done');
    });
    form.parse(req, function (err, fields, file) {
        let intro = fields.intro;
      //  let skills = fields.skills.replace(/ /gi, '').split(',');
        let skills = fields.skills;
        let os_intro = fields.os_intro;
        let environ = fields.environment;
        let bonus = fields.bonus;
        let idcpn = req.session.adid;
      /*  mongoose.connect(url,async function(err){
            let Info_new = await new Infor_Companies({
                _id: new mongoose.Types.ObjectId(),
                choose_us: {
                    reason : '123',
                    image: images
                },
            })
            Info_new .save(function(err){
                if (err) throw err;
                res.redirect('/admin/home')
              })
        })*/
    })
    }else res.redirect('/admin/registration')
})
module.exports = router;