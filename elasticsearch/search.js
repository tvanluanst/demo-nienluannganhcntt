var client = require('./connection.js');

client.search({  
  index: 'job',
  type: '_doc',
  body: {
    query: {
      match_all: {
      }
    },
    _source: ["namejob","skills"],
  }
},function (error, response,status) {
    if (error){
      console.log("search error: "+error)
    }
    else {
     const results = response.hits.hits;
     var my_Arr;
     const mang = [];
     results.forEach(function(result){
      my_Arr =((result._source.skills).split(",").concat(result._source.namejob)); 
        for(let i = 0; i < my_Arr.length; i++) {
          if(my_Arr[i] === ' ' || my_Arr[i] === 'English' || my_Arr[i] === ' English'){
            
          } else{
              mang.push(my_Arr[i].trim())
          }
         }
      });
      const output = [...new Set(mang)]
      output.forEach(function(temp){
        console.log(temp)
      })
    }
});