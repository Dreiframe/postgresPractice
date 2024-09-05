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
        pool.query('SELECT * FROM asiakas ORDER BY id ASC', (error, results) => {
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
        pool.query(`SELECT * FROM asiakas WHERE nimi LIKE '%${name}%'`, (error, results) => {
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
    // WHY DID I WRAP POOLQUERY IN PROMISE? WHAT WAS THE POINT???XD
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
    pool.query('SELECT * FROM asiakas WHERE id = $1', [id], (error, results) => {
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
})


app.post('/api/asiakas', async (request, response) => {
    const {nimi, puhelinnumero, katuosoite, postinumero, postitoimipaikka} = request.body

    // MORE VALIDATION NEEDED
    
    const peopleWithSameName = await getAsiakasByName(nimi)
    if (peopleWithSameName.length !== 0){
        response.status(400).send('Name already in db')
        return
    }
    
    pool.query('INSERT INTO asiakas (nimi, puhelinnumero, katuosoite, postinumero, postitoimipaikka) VALUES ($1, $2, $3, $4, $5) RETURNING *',
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


app.put('/api/asiakas/:id', (request, response) => {
    const id = parseInt(request.params.id)
    const {nimi, puhelinnumero, katuosoite, postinumero, postitoimipaikka} = request.body


    /*
        CAN SEND UNDEFINED AND QUERY WILL UPDATE TABLE WITH EMPTY.....
        VALIDATION NEEDED!
    */
    pool.query('UPDATE asiakas SET nimi = $1, puhelinnumero = $2, katuosoite = $3, postinumero = $4, postitoimipaikka = $5 WHERE id = $6',
        [nimi, puhelinnumero, katuosoite, postinumero, postitoimipaikka, id],
        (error, results) => {
            if (results.rowCount === 0){
                response.status(400).send(`no asiakas with ID: ${id}`)
                return
            }

            if (error) {
                console.log(error)
                response.status(400).json(error)
                return
            }

            response.status(200).send(`asiakas modified with ID: ${id}`)
        }
    )
    
    /* CHECK IF ID EXISTS IN ASIAKAS AND RETURNS TRUE/FALSE // USELESS??
    pool.query('SELECT EXISTS(SELECT 1 FROM asiakas WHERE id=$1)', [id], (error, results) => {
        console.log(results.rows.exists)
    })
    */
})
    

app.delete('/api/asiakas/:id', (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM asiakas WHERE id = $1', [id], (error, results) => {
        if (results.rowCount === 0){
            response.status(400).send(`no asiakas with ID: ${id}`)
            return
        }

        if (error) {
            console.log(error)
            response.status(400).json(error)
            return
        }

        response.status(200).send(`asiakas deleted with ID: ${id}`)
    })
})


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})