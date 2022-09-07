let guides

export default class GuidesDAO{
    /*This runs as soon as our server starts. First we want
      to get a reference to the database collection named
      planets. If this already exists then we want to skip. */
    static async injectDB(conn){
        if(guides){
            return
        }
        try{
            guides = await conn.db(process.env.PROJECTX_NS).collection("planets")
        }catch(e){
            console.error(
                `Unable to establish a collection handle in GuidesDAO: ${e}`,
            )
        }
    }
    //This is a method to grab a list of all the planets
    static async getPlanets({
        filters = null,
        page     = 0,
        planetsPerPage = 20,
    }={}){
        let query
        if(filters){
            if("name" in filters){
                query = { $text: {$search: filters["name"] }}
            }
            else if("orderFromSun" in filters){
                query  = {"orderFromSun" : { $eq: filters["orderFromSun"]}}
            }
            else if("hasRings" in filters){
                query = { "hasRings" : {$eq: filters["hasRings"]}}
            }  
        }
        let cursor

        try{
            cursor = await guides
                .find(query)
        }catch(e) {
            console.error(`Unable to issue find command, ${e}`)
            return{ planetList: [], totalNumPlanets: 0}
        }
        
        const displayCursor = cursor.limit(planetsPerPage).skip(planetsPerPage * page)

        try{ 
            const planetList = await displayCursor.toArray()
            const totalNumPlanets = await guides.countDocuments(query) 
            return { planetList, totalNumPlanets}
        }catch(e) {
            console.error(
                `Unable to convert cursor to array or problem counting documentsl, ${e}`
            )
            return{ planetList: [], totalNumPlanets: 0}
        }
    }

}