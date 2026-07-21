require('dotenv').config()
const { Sequelize, QueryTypes } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  //when ssl:true with a local docker Postgres => Unable to connect to the database: ConnectionError [SequelizeConnectionError]: The server does not support SSL connections
  /*dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }*/
})

const main = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
    const blogs = await sequelize.query("SELECT * FROM blogs", { type: QueryTypes.SELECT })    
    //console.log(blogs)
    for(const b of blogs){
      console.log(`${b.author}: '${b.title}', ${b.likes} likes`)
    }
    sequelize.close()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

main()