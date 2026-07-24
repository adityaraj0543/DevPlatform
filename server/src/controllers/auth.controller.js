const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { signAccess, signRefresh, verifyRefresh } = require('../utils/jwt');


const cookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax'
};


const issueTokens = async (user, res) => {

  const access = signAccess(user);
  const refresh = signRefresh(user);

  user.refreshTokens.push({
    token: refresh
  });

  if (user.refreshTokens.length > 10) {
    user.refreshTokens = user.refreshTokens.slice(-10);
  }

  await user.save();


  res.cookie(
    'access_token',
    access,
    {
      ...cookieOpts,
      maxAge: 15 * 60_000
    }
  );


  res.cookie(
    'refresh_token',
    refresh,
    {
      ...cookieOpts,
      maxAge: 7 * 24 * 3600 * 1000
    }
  );


  return {
    access,
    refresh
  };
};



// ==========================
// SIGNUP
// ==========================

exports.signup = asyncHandler(async (req, res) => {

  const {
    name,
    username,
    email,
    password
  } = req.body;


  const existingUser = await User.findOne({
    $or: [
      { email },
      { username }
    ]
  });


  if (existingUser) {
    throw new ApiError(
      409,
      'Email or username already in use'
    );
  }


  const user = await User.create({

    name,
    username,
    email,
    password,

    // Email verification disabled
    emailVerified: true

  });


  const tokens = await issueTokens(user, res);


  res.status(201).json({

    ok: true,
    user,
    ...tokens

  });

});




// ==========================
// LOGIN
// ==========================

exports.login = asyncHandler(async (req, res)=>{

  const {
    email,
    password
  } = req.body;


  const user = await User.findOne({
    email
  }).select('+password');


  if(
    !user ||
    !user.password ||
    !(await user.comparePassword(password))
  ){

    throw new ApiError(
      401,
      'Invalid credentials'
    );

  }


  const tokens = await issueTokens(
    user,
    res
  );


  res.json({

    ok:true,
    user,
    ...tokens

  });

});




// ==========================
// GOOGLE LOGIN
// ==========================

exports.googleLogin = asyncHandler(async(req,res)=>{


  const {
    credential
  } = req.body;


  if(!process.env.GOOGLE_CLIENT_ID){

    throw new ApiError(
      400,
      'Google login not configured'
    );

  }


  const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
  );


  const ticket =
    await client.verifyIdToken({

      idToken:credential,

      audience:
      process.env.GOOGLE_CLIENT_ID

    });



  const p = ticket.getPayload();



  let user =
    await User.findOne({

      $or:[
        {
          googleId:p.sub
        },
        {
          email:p.email
        }
      ]

    });



  if(!user){

    user =
    await User.create({

      name:p.name,

      email:p.email,

      username:
      p.email.split('@')[0]
      +
      '-' +
      Math.random()
      .toString(36)
      .slice(2,6),


      provider:'google',

      googleId:p.sub,

      emailVerified:true,


      avatar:{
        url:p.picture
      }

    });


  }
  else if(!user.googleId){

    user.googleId=p.sub;

    user.provider='google';

    user.emailVerified=true;

    await user.save();

  }



  const tokens =
    await issueTokens(
      user,
      res
    );


  res.json({

    ok:true,

    user,

    ...tokens

  });


});





// ==========================
// REFRESH TOKEN
// ==========================

exports.refresh = asyncHandler(async(req,res)=>{


  const token =
    req.cookies?.refresh_token ||
    req.body.refreshToken;


  if(!token){

    throw new ApiError(
      401,
      'No refresh token'
    );

  }



  const decoded =
    verifyRefresh(token);



  const user =
    await User.findById(
      decoded.id
    );



  if(
    !user ||
    !user.refreshTokens.some(
      t=>t.token===token
    )
  ){

    throw new ApiError(
      401,
      'Refresh rejected'
    );

  }



  user.refreshTokens =
    user.refreshTokens.filter(
      t=>t.token!==token
    );


  const tokens =
    await issueTokens(
      user,
      res
    );


  res.json({

    ok:true,

    ...tokens

  });


});





// ==========================
// LOGOUT
// ==========================

exports.logout =
asyncHandler(async(req,res)=>{


 const token =
 req.cookies?.refresh_token;


 if(token && req.user){

   req.user.refreshTokens =
   req.user.refreshTokens.filter(
    t=>t.token!==token
   );


   await req.user.save();

 }


 res.clearCookie(
  'access_token'
 );

 res.clearCookie(
  'refresh_token'
 );


 res.json({
  ok:true
 });


});





// ==========================
// CURRENT USER
// ==========================

exports.me =
asyncHandler(async(req,res)=>{

 res.json({

  ok:true,

  user:req.user

 });

});





// ==========================
// VERIFY EMAIL
// ==========================

exports.verifyEmail =
asyncHandler(async(req,res)=>{

 res.json({

  ok:true,

  message:
  "Email verification disabled"

 });

});





// ==========================
// FORGOT PASSWORD
// ==========================

exports.forgotPassword =
asyncHandler(async(req,res)=>{


 const user =
 await User.findOne({
  email:req.body.email
 });


 if(user){

   const token =
   crypto.randomBytes(24)
   .toString('hex');


   user.resetToken=token;


   user.resetTokenExpires =
   Date.now()+60*60_000;


   await user.save();

 }


 res.json({

  ok:true,

  message:
  'Password reset token generated'

 });


});





// ==========================
// RESET PASSWORD
// ==========================

exports.resetPassword =
asyncHandler(async(req,res)=>{


 const {
  token,
  email,
  password
 } = req.body;



 const user =
 await User.findOne({
  email
 })
 .select(
  '+resetToken +resetTokenExpires +password'
 );



 if(
 !user ||
 user.resetToken!==token ||
 user.resetTokenExpires<Date.now()
 ){

 throw new ApiError(
  400,
  'Invalid or expired token'
 );

 }



 user.password=password;

 user.resetToken=undefined;

 user.resetTokenExpires=undefined;



 await user.save();



 res.json({

  ok:true

 });


});