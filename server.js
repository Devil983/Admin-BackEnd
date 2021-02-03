const express =require ('express')
const app =express()
const bodyParser=require('body-parser')
const cors=require('cors')
app.use(cors('*'))
const config = require('./config')

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*")
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
//   next();
// });
// list of routers
const routerUser = require('./routes/user')
const routerVendor = require('./routes/vendor')
const routerAdmin = require('./routes/admin-login')
//const routerOffer=require('./routes/offer')

//const app = express()

app.use(bodyParser.json())
// function getUserId(request, response, next) {

//   if (request.url == '/user/login' 
//       || request.url == '/user/register'
//       || request.url.startsWith('/product/image') ) {
//     // do not check for token 
//     next()
//   } else {

//     try {
//       const token = request.headers['token']
   
//       console.log(token)
//       const data = jwt.verify(token, config.secret)
//       console.log(data)

   

//       // add a new key named userId with logged in user's id
//       request.userId = data['id']

//       // go to the actual route
//       next()
      
//     } catch (ex) {
//       response.status(401)
//       response.send({status: 'error', error: 'protected api'})
//     }
//   }
// }

// app.use(getUserId)
// add the routers
app.use('/user', routerUser)
app.use('/vendor', routerVendor)
app.use('/admin-login', routerAdmin)

//app.use('/offer', routerOffer)




app.listen(6000, '0.0.0.0', () => {
  console.log('server started on port 6000')
})

