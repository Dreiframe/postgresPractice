const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())

const Pool = require('pg').Pool
const pool = new Pool({
    user: 'aksu',
    host: 'localhost',
    database: 'api',
    password: '1234123qwe',
    port: 5432
})

const morgan = require('morgan')
morgan.token('body', req => {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

//----------------------------------------------------------------------------


const getAsiakasAll = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM Asiakas ORDER BY id ASC', (error, results) => {
            if (error) {
                reject(error)
                return
            }
    
            resolve(results.rows)
        })
    })
}


const getAsiakasByName = (name) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM Asiakas WHERE nimi LIKE '%${name}%'`, (error, results) => {
            if (error) {
                reject(error)
                return
            }
            resolve(results.rows)
        })
    })
}


app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})


app.get('/api/asiakas', (request, response) => {
    getAsiakasAll().then(asiakkaat => {
        if (asiakkaat === undefined){
            response.status(500).end()
            return
        }
    
        response.status(200).json(asiakkaat)
    })
})


app.get('/api/asiakas/:id', (request, response) => {
    const id = parseInt(request.params.id)
    pool.query('SELECT * FROM Asiakas WHERE id = $1', [id], (error, results) => {
        if (error) {
            response.status(500).end()
            return
        }
        if (results.rows.length == 0){
            response.status(404).end()
            return
        }

        response.status(200).json(results.rows)
    })
    //response.send(`<h1>${id}</h1>`)
})


app.post('/api/asiakas', (request, response) => {
    const {nimi, puhelinnumero, katuosoite, postinumero, postitoimipaikka} = request.body

    console.log(nimi, puhelinnumero, katuosoite, postinumero, postitoimipaikka)

    getAsiakasByName(nimi).then(asiakas => {
        if (asiakas.length !== 0){
            response.status(400).send('Name already in db')
            return
        }
    })

    
    pool.query('INSERT INTO Asiakas (nimi, puhelinnumero, katuosoite, postinumero, postitoimipaikka) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [nimi, puhelinnumero, katuosoite, postinumero, postitoimipaikka],
        (error, results) => {
            if (error) {
                console.log(error)
                response.status(400).json(error)
                return
            }

            response.status(201).json(results.rows[0])
        }
    )
})
    

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})