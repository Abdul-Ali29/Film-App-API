const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Movie = require('./models/movie')
const userRouter = require('./routers/user')
const movieRouter = require('./routers/movie')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(movieRouter)



app.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})