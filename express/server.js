import express from "express"
import cors from "cors"
import guides from "./api/guides.routes.js"

const server_app = express()

server_app.use(cors())
server_app.use(express.json())

//specify thats its an api then the version
server_app.use("/api/v1/guides",guides)
server_app.use("*", (req,res)=> res.status(404).json({error: "not found"}))

export default server_app
 