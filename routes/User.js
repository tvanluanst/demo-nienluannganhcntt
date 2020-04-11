var express =  require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
router.get('/',function(req,res){
    if(req.session.user && req.session.pws){
       res.render('./user/user',{ title: 'Chào mừng đến với VietJob', name: req.session.user}) 
    }else res.redirect('/')
})
router.get('/user/vieclamit',async function(req,res){
    if(req.session.user && req.session.pws){
        try{
        let page = parseInt(req.query.page) || 1;
        let perPage = 5;
        let start = (page-1)*perPage;
        let end = page * perPage;
        let results = await loadjob();
        let result = results.hits;
        let numlist = results.total.value;
        res.render('vieclamit', {
        title: 'Việc làm IT',
        dsjob: result.slice(start,end) ,
        namejob: '',
        where: '',
        num: numlist,
        pages: Math.ceil(numlist / perPage),
        current: page
        });
    }catch (err){
        console.log(err);
    }
    }else res.redirect('/vieclamit')
})
router.get('/user/vieclamit/search',function(req,res){
    let planets = req.query.planets;
    let city = req.query.city;
    var output ;
    let page = parseInt(req.query.page) || 1;
    let perPage = 6;
    let start = (page-1)*perPage;
    let end = page * perPage;
    let parse = url.parse(req.url, true);
    let path = parse.search;
    if (city === "all"){
      client.search({  
        index: 'job',
        type: '_doc',
        body: {
          query: {
            multi_match : {
              query:    planets, 
              fields: [ "namejob", "skills" ] 
            }
          }
        }
      },function (error, response,status) {
          if (error){
            console.log("search error: loi 2 "+error)
          }
          else {
          const results = response.hits.hits;
          const numlist =response.hits.total.value;
          res.render('vieclamit', {
            title: 'Việc làm IT',
            dsjob: results.slice(start,end) ,
            namejob: planets,
            where: '',
            num: numlist,
            pages: Math.ceil(numlist / perPage),
            current: page
          });
          }
      });
    }else if (city === "Orthers"){
      client.search({  
        index: 'job',
        type: '_doc',
        body: {
          "query": {
            "bool" : {
              "must" : {
                 "multi_match" : {
                          "query":    planets, 
                          "fields": [ "namejob", "skills" ] 
                        }
              },
               "must_not" : [{
                    "match" : {  "address" : "Ho Chi Minh" }
                },
                {
                    "match" : {  "address" : "Ha Noi" }
                },{
                    "match" : {  "address" : "Can Tho" }
                }
                ]
            }
          }
        }
      },function (error, response,status) {
          if (error){
            console.log("search error: loi 3 "+error)
          }
          else {
          const results = response.hits.hits;
          const numlist =response.hits.total.value;
          res.render('vieclamit', {
            title: 'Việc làm IT',
            dsjob: results.slice(start,end) ,
            namejob: planets,
            where: '',
            num: numlist,
            pages: Math.ceil(numlist / perPage),
            current: page
          });
          }
      });
    }else{
        client.search({  
          index: 'job',
          type: '_doc',
          body: {
            query: {
              bool: {
                must: [{
                  bool: {
                    must: [{
                        match: {
                          address : city
                        }
                    }]
                  }
                },{
                  bool: {
                    should: [{
                        match: {
                          skills: planets
                      }
                    }, {
                      match: {
                        namejob: planets
                      }
                    }]
                  }
                }]
              }
            }
          }
        },function (error, response,status) {
            if (error){
              console.log("search error:  loi 4 "+error)
            }
            else {
            const results = response.hits.hits;
            const numlist =response.hits.total.value;
            res.render('vieclamit', {
              title: 'Việc làm IT',
              dsjob: results.slice(start,end) ,
              num: numlist,
              namejob: planets,
              where: 'tại '+city,
              pages: Math.ceil(numlist / perPage),
              current: page
            });
            }
        });
    }
})
router.get('/user/vieclamit/:val1&:val2',function(req,res){
  const name_job =req.params.val1;
  const id_job=req.params.val2;
  res.render('job',{
    title: name_job
  })
})
router.get('/user/companies/:val1',function(req,res){
  const name_company =req.params.val1;
  res.render('companies',{
    title: name_company
  })
})
router.get('/user/companies',function(req,res){
  res.render('allcompanies',{
    title: "Tất cả công ty"
  })
})
router.get('/user/top-companies/',function(req,res){
  res.render('topcompanies',{
    title: "Những công ty hàng đầu"
  })
})
router.get('/user/vieclam-theo-kynang',function(req,res){
  res.render('./elements/dsvl-kynang',{
    title : 'Việc làm theo kỹ năng'
  })
})
router.get('/user/vieclam-theo-ten',function(req,res){
  res.render('./elements/dsvl-ten',{
    title : 'Việc làm theo tên'
  })
})
router.get('/user/vieclam-theo-congty',function(req,res){
  res.render('./elements/dsvl-congty',{
    title : 'Việc làm theo kỹ năng'
  })
})
module.exports = router;