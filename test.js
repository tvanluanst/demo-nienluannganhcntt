 async function call ( ){
    console.log(2)
    set()
    console.log(3)
}
function set(){
    kq = 0;
    for(i=0;i<= 1000000000;i++){
        kq++
    }
    console.log(kq)
}
// xu ly chuoi 
let temp = intro.split('*');
temp.forEach(function(element,index) {
    if(element !== '\r\n'){
      //  console.log(element.trim())
    }
});