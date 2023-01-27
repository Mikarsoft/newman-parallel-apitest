
module.exports.generateReport = function (collectionsResult){
    if(collectionsResult)
    collectionsResult.forEach(element => {
        element.items.members.forEach(name =>{
            console.log(name.name);
        });
        
    });
}