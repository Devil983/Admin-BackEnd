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


/////////////////////////////////////////////////////////////////////////////
/////////////////////////////// LOGIN //////////////////////////////
////////////////////////////////////////////////////////////////////////////


router.post('/login',(request,response)=>{
    // const { email , password }= request.body
     const { email, password } = request.body
      console.log(`EMAIL::${email}`)
      console.log(`PASSWORD::${password}`)
   
      const encryptedPassword = cryptojs.MD5(password)
    const statement = `select * from admin where email = '${email}' and password = '${encryptedPassword}'`
    db.query(statement, (error, users) =>  {
   
             if(error)
             {
   
                 response.send({status :'error',error:error})
             }
   
             else{
   
                 if(users.length ==0)
                 {
                     response.send({status :'error',error:error})
                    // response.send(`user doesnot exit`)
                 }
                 else{
                    // response.send(`login Successfull`)
                    const user= users[0]
                    //console.log(user.u_id)                
                     const data ={id:user['id']}
                    // console.log(data)
                    const token=jwt.sign(data,'12344ksdfflkmklmf')
                    console.log(token)
                    response.send({status:'success',data:token})
                 }
             }
         })
   })
   

   /////////////////////////////////////////////////////////////////////////////
/////////////////////////////// PROFILE //////////////////////////////
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
     const Id=data['id']
     //console.log(userId)
     const statement=`select id,firstname, lastname, email, password, address, mobileno  from admin where id=${Id}`
     
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
/////////////////////////////// SIGNUP //////////////////////////////
////////////////////////////////////////////////////////////////////////////

   


     router.post('/signup', (request, response) => {
        const { address, email,  firstname, lastname,mobileno,password} = request.body
      
        const encryptedPassword = cryptojs.MD5(password)
        const statement = `insert into admin (address, email, firstname,lastname,mobileno,password) values (
          '${address}', '${email}','${firstname}','${lastname}','${mobileno}','${encryptedPassword}'
        )`
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
            <h1>Welcome to Bikeclinc ${firstname}</h1>
            <h2>this is a welcome mesage</h2>
            `
            mailer.sendEmail(email, subject, body, (emailError, info) => {
      
              // // no error: everything looks Okay
              // console.log(`result: `, result)
              // result['status'] = 'success'
              // result['data'] = dbResult
              response.send(util.sendSuccess(dbResult))
            })
          }
      
        })
      })

module.exports = router
