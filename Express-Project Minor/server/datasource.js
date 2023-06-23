const Pool = require('pg').Pool
const pool = new Pool({
  connector: 'postgresql',  
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'password',
  port: 5432,
})

// Handle connection event
pool.on('connect', () => {
    console.log('Connected to the database');
  });
  
  // Handle error event
  pool.on('error', (err) => {
    console.error('Error connecting to the database:', err);
  });
  
  // Connect to the database
  pool.connect();

const createBME = (request, response) => {
    const {
        temperature,
        humidity
    } = request.body
    console.log(request.body)
    
    pool.query('INSERT INTO datath (temperature, humidity) VALUES ($1, $2)', [temperature, humidity], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send(`T & H added`)
    })
}

const getBME = (request, response) => {
    const id = parseInt(request.params.id)
    pool.query('SELECT * FROM datath', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getT = (request, response) => {
    const id = parseInt(request.params.id)
    pool.query('SELECT created_at,temperature FROM datath', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getH = (request, response) => {
    const id = parseInt(request.params.id)
    pool.query('SELECT created_at,humidity FROM datath', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const carbon = (request, response) => {
    const {
        carbon
    } = request.body
    console.log(request.body)
    
    pool.query('INSERT INTO datac (carbon) VALUES ($1)', [carbon], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send(`co2 added`)
    })
}

const getCarbon = (request, response) => {
    const id = parseInt(request.params.id)
    pool.query('SELECT created_at,carbon FROM datac', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}



module.exports = {
    createBME,
    getBME,
    getT,
    getH,
    carbon,
    getCarbon
}