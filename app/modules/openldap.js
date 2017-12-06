var ldap = require('ldapjs');

// ldapsearch -H ldap://www.zflexldap.com:389 -LLL -x -D "cn=ro_admin,ou=sysadmins,dc=zflexsoftware,dc=com" -w zflexpass -b "ou=users,ou=guests,dc=zflexsoftware,dc=com" uid=guest1
/*const environment = {
    url: 'ldap://www.zflexldap.com:389',
    rootDN: "cn=ro_admin,ou=sysadmins,dc=zflexsoftware,dc=com",
    rootPassword: "zflexpass",
    baseDN: "ou=users,ou=guests,dc=zflexsoftware,dc=com"
};*/
const environment = {
    url: 'ldap://10.57.1.31:389',
    rootDN: "cn=ldapadm,dc=excise,dc=go,dc=th",
    rootPassword: "P@ssw0rd",
    baseDN: "ou=People,dc=excise,dc=go,dc=th"
};
/*
slappasswd -h {SSHA} -s Nattha501
{SSHA}pSwicOfZpLXwXRoSi0+22GlP+FXY8cxm

slappasswd -h {SHA} -s Nattha501
{SHA}LmIAac5WRrZRdvvsVGhNzkuJCiI=
*/

var client;

// Issue #1 - now it binds twice
var OpenLdap = function(){
  client = ldap.createClient({
    url: environment.url
  });
  console.log('constructor called');
  this.bind();
};

OpenLdap.prototype.test = function(params, done){
  var opts = {
    //filter: 'uid=' + params.uid,
    filter: '(&(uid='+ params.uid + ')(userPassword={SHA}LmIAac5WRrZRdvvsVGhNzkuJCiI=',
    scope: 'sub',
    attributes: []
  };

  client.search(environment.baseDN, opts, function(err,res){
    if(err){
      console.log('Searching error : ' + err);
      done(new Error('Connection failure'));
    }
    var tmp;
    // 1st step
    res.on('searchEntry', function(entry) {
      console.log('authenticated');
      console.log('entry: ' + JSON.stringify(entry.object));
      tmp = entry.object;
    });

    res.on('searchReference', function(referral) {
      console.log('referral: ' + referral.uris.join());
    });
    res.on('error', function(err) {
      console.error('error: ' + err.message);
      done(new Error('Connection failure'));
    });

    //2nd step
    res.on('end', function(result) {
      console.log('searched');

      if( typeof(tmp) === "undefined"){
          console.log('no user');
          done(new Error('No user found'));
      }
      else{
          done(tmp);
      }

    });
  });
};

OpenLdap.prototype.bind = function(){
  client.bind(environment.rootDN,environment.rootPassword,function(err){
    if(err) console.log('Binding with error : ' + err);

    console.log('successfully binded');
  });
};

OpenLdap.prototype.unbind = function(){
  client.unbind(function(err){
    if(err){
      console.log('Unbind error ' + err);

    }
    else{
      console.log("successfully unbinded");

    }
  });
};

OpenLdap.prototype.search = function(username, done){
  var opts = {
    filter: 'uid='+ username,
    scope: 'sub',
    attributes: []
  };

  console.log('opts : ' + opts);
  console.log('client status : ');
  console.log(client);

  client.search(environment.baseDN, opts, function(err,res){
    if(err){
      console.log('Searching error : ' + err);
    }
    var tmp;
    // 1st step
    res.on('searchEntry', function(entry) {
      console.log('authenticated');
      console.log('entry: ' + JSON.stringify(entry.object));
      tmp = entry.object;
    });

    res.on('searchReference', function(referral) {
      console.log('referral: ' + referral.uris.join());
    });
    res.on('error', function(err) {
      console.error('error: ' + err.message);
      done(new Error('Connection failure'));
    });

    //2nd step
    res.on('end', function(result) {
      console.log('searched');

      if( typeof(tmp) === "undefined"){
          console.log('no user');
          done(new Error('No user found'));
      }
      else{
          done(tmp);
      }

    });
  });
};

OpenLdap.prototype.authenticate = function(username, password, done){
  this.search(username,function(userInfo){
    console.log(userInfo);

    if(typeof(userInfo) === "undefined"){
      done(new Error('xxxx'));
    }
    else{
      //userInfo.mail === "guest1@zflexsoftware.com"
      if(userInfo.mail === password){
      //if(userInfo.userPassword === "{SSHA}fwfwefwfw"){
        console.log('')
        done(userInfo);
      }
      else{
        done(new Error('YYYY'));
      }
    }
  });
};


module.exports = OpenLdap;
