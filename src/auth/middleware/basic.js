'use strict';

const bcrypt = require('bcrypt');
const User = require('../models/users');
const base64 = require('base-64');

module.exports = async (req, res, next) => {

  if (!req.headers.authorization) { return _authError(); }

  let basic = req.headers.authorization.split(' ').pop();
  let [username, password] = base64.decode(basic).split(':');

  try {
    req.user = await User.authenticateBasic(username, password)
    next();
  } catch (e) {
    _authError()
  }

  function _authError() {
    res.status(403).send('Invalid Login');
  }

}

// 'use strict';
// const base64 = require('base-64');
// const bcrypt = require('bcrypt');
// const Users = require('../models/users-model');


// module.exports = async ( req,res,next ) =>{
    
//   let basicHeaderParts = req.headers.authorization.split(' ');  // ['Basic', 'sdkjdsljd=']
//   let encodedString = basicHeaderParts.pop();  // sdkjdsljd=
//   let decodedString = base64.decode(encodedString); // "username:password"
//   let [username, password] = decodedString.split(':'); // username, password
  
//   try {
//     const user = await Users.findOne({ username: username });
//     const valid = await bcrypt.compare(password, user.password);
//     if (valid) {
//       req.user = user;
//       next();
//     }
//     else {
//       throw new Error('Invalid User');
//     }
//   } catch (error) { res.status(403).send('Invalid Login');
//     next(error);
//   }
  
// };
