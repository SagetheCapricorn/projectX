import server_app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"
import GuidesDAO from "./api/guides.routes.js"

dotenv.config()

const MongoClient = mongodb.MongoClient

const port = process.env.PORT || 8000

MongoClient.connect(
process.env.PROJECTX_DB_URI,
{
    wtimeoutMS: 2500,
    useNewUrlParser: true
})
//lets do some error catching here
.catch(err =>{
    console.log(err.stack)
    process.exit(1)
})
//Now we can launch our webserver
.then(async client => {
    await GuidesDAO.injectDB(client)
    server_app.listen(port, ()=> {
        console.log(`listening on port ${port}`)
    })
})

