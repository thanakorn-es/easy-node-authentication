var Account = require('./models/account');
var OpenLdap = require('./modules/openldap');


//console.log(Account.id);
//console.log(Account.test1(Account.email));
/*Account.findOne({email: Account.email}, function(err,user){
  console.log('Find One');
});
*/

var openldap = new OpenLdap();
/*openldap.search('guest1', function(entry){
  console.log('serach getback');
  if( entry instanceof Error){
    console.log('Error');
    return;
  }

  console.log(entry);
});*/
