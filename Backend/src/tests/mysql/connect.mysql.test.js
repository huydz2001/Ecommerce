'use strict'
require('dotenv').config()
const mysql = require('mysql2')

const {
    MYSQL_HOST = 'localhost', 
    MYSQL_USER_DEV = 'userDEV', 
    MYSQL_PASS_DEV = 'p@ssw0rd', 
    MYSQL_DB_NAME_DEV = 'Ecommerce',
    MYSQL_DB_PORT_DEV = 8811
} = process.env

const pool = mysql.createPool({
    host: MYSQL_HOST,
    user: MYSQL_USER_DEV,
    password: MYSQL_PASS_DEV,
    database: MYSQL_DB_NAME_DEV,
    port: MYSQL_DB_PORT_DEV
})

const batchSize = 10
const totalSize = 1000

let currentId = 1
const insertBatch = async () => {
    const values = []
    for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
        const name = `name-${currentId}`
        const address = `address-${currentId}`
        const age = currentId
        values.push([currentId, name, age, address])
        currentId++
    }

    if (!values.length) {
        pool.end(err => {
            if (err) {
                console.log('Error occured while running batch')
            }
            else {
                console.log('Conenction pool closed successfully')
            }
        })
        return
    }

    const sql = `INSERT INTO test_table (id, name, age, address) VALUES ?`

    pool.query(sql, [values], async function (err, results) {
        if (err) {
            throw err
        }
        console.log(`Inserted ${results.affectedRows} records`)
        await insertBatch()
    })
}

insertBatch().catch(console.error)

