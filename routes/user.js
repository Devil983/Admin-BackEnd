const express = require('express')
const router = express.Router()

//const mysql = require('mysql2')
const jwt= require('jsonwebtoken')
const cryptojs= require('crypto-js')
const db= require('../db')
const { changeUser } = require('../db')

const mailer= require('../mailer')
const util=require('../utils')
//const { route } = require('./note')
const { request, response } = require('express')


router.post('/register', (request, response) => {
    const { u_address, u_email, u_first_name, u_last_name, u_mobile ,u_password} = request.body
  
    const encryptedPassword = cryptojs.MD5(u_password)
    const statement = `insert into user ( u_address, u_email, u_first_name, u_last_name, u_mobile ,u_password) 
        values ('${u_address}', '${u_email}', '${u_first_name}', '${u_last_name}','${u_mobile}','${encryptedPassword}' )`
  
    db.query(statement, (error, dbResult) => {
      const result = {}
      if (error) {
        // error occurred
      //   console.log(`error: ${error}`)
      //   result['status'] = 'error'
      //   result['error'] = error
        response.send(util.sendError(error))
  
      } else {
  
        const subject = `'welcome to Bikeclinic'`
        const body = `
        <h1>Welcome to Bikeclinic Admin</h1>
        <h2>this is a welcome mesage from Abhilash Kamble</h2>
        `
        mailer.sendEmail(u_email, subject, body, (emailError, info) => {
  
          // // no error: everything looks Okay
          // console.log(`result: `, result)
          // result['status'] = 'success'
          // result['data'] = dbResult
          response.send(util.sendSuccess(dbResult))
        })
      }
  
    })
  })


/////////////////////////////////////////////////////////////////////////////
/////////////////////////////// LOGIN //////////////////////////////
////////////////////////////////////////////////////////////////////////////


// router.post('/login',(request,response)=>{
 // const { email , password }= request.body
  //const { u_email, u_password } = request.body
  // console.log(`EMAIL::${u_email}`)
  // console.log(`PASSWORD::${u_password}`)

   //const encryptedPassword = cryptojs.MD5(u_password)
 //const statement = `select * from user where u_email = '${u_email}' and u_password = '${encryptedPassword}'`
 //db.query(statement, (error, users) =>  {

          //if(error)
         // {

             // response.send({status :'error',error:error})
        //  }

        //  else{

           //   if(users.length ==0)
            //  {
                //  response.send({status :'error',error:error})
                 // response.send(`user doesnot exit`)
            //  }
             // else{
                 // response.send(`login Successfull`)
               //  const user= users[0]
                 //console.log(user.u_id)                
               //   const data ={id:user['u_id']}
                 // console.log(data)
                // const token=jwt.sign(data,'12344ksdfflkmklmf')
                // console.log(token)
                // response.send({status:'success',data:token})
              //}
          //}
     // })
//})

// ----------------------------------------------------
// POST
// ----------------------------------------------------
//router.post('/create', (request, response) => {
    //const ven_id = request.userId
    //const { stv_name, stv_price} = request.body
    //const statement = `insert into user (u_id,u_address, u_email, u_first_name, u_last_name, u_mobile, u_password) values (
     // '${u_id}', '${u_address}',  '${u_email}', '${u_first_name}', '${u_last_name}', '${u_mobile}', '${u_password}'
    //)`
    //db.query(statement, (error, data) => {
    //  response.send(utils.createResult(error, data))
    //})
  //})
  
  // ----------------------------------------------------
  


  // ----------------------------------------------------
// DELETE
// ----------------------------------------------------
router.delete('/:id', (request, response) => {
    const { id } = request.params
    const statement = `delete from user where u_id = '${id}'`
    db.query(statement, (error, data) => {
      response.send(util.sendResult(error, data))
    })
  })
  
  // ----------------------------------------------------
  
  


/////////////////////////////////////////////////////////////////////////////
/////////////////////////////// GET USER //////////////////////////////
////////////////////////////////////////////////////////////////////////////



router.get('/profile',(request,response) =>{

   // const {u_id}= request.params
   // console.log(`id=${u_id}`)
    const token=request.headers['token']
    //console.log(token)
    try{
   // console.log(token)
          
    const data=jwt.verify(token,'12344ksdfflkmklmf')
   // console.log(data)
    const userId=data['id']
    //console.log(userId)
    const statement=`select u_id,u_address, u_email, u_first_name, u_last_name, u_mobile  from user where u_id=${userId}`
    
    db.query(statement,(error,users)=>{
    
    if(users.length>0 )
    {      const user=users[0];
         response.send(util.sendResult(error,user))
    }
    else{
    
        response.send(util.sendError(`there is no user with this id`))
    }
    
    })
    }  catch( ex){
          response.status=401
         response.send("cannot be done")
    
    }
    
    })
    
    
    /////////////////////////////////////////////////////////////////////////////
    /////////////////////////////// UPdate Profile //////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    
    
    router.put('/profile/',(request,response) => {
    //const {id}= request.params
    const token=request.headers['token']
    
          
    const data=jwt.verify(token,'12344ksdfflkmklmf')
    const userId=data['id']
    const{ u_address, u_email, u_first_name, u_last_name, u_mobile  }=request.body
    
    const statement= `update user set 
                 u_address='${u_address}',
                 u_email='${u_email}',
                 u_first_name='${u_first_name}',
                 u_last_name='${u_last_name}',
                 u_email='${u_email}',
                 u_mobile='${u_mobile}'
                 where u_id='${userId}' `
                        
    db.query(statement,(error,result)=>{
    
    response.send(util.sendResult(error,result))
    
    
    })
    
    
    })
    
    
module.exports = router

//u_address, u_email, u_first_name, u_last_name, u_mobile