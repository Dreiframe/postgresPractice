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


const getAllAsiakas = (request, response) => {
    // WHY DID I WRAP POOLQUERY IN PROMISE? WHAT WAS THE POINT???XD
    getAsiakasAll().then(asiakkaat => {
        if (asiakkaat === undefined){
            response.status(500).end()
            return
        }
    
        response.status(200).json(asiakkaat)
    })
}


const getAsiakasByID = (request, response) => {
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
}


const createAsiakas = async (request, response) => {
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
}


const updateAsiakasById = (request, response) => {
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
}
    

const deleteAsiakasById = (request, response) => {
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
}