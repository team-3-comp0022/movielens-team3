const { Pool } = require('pg');

const pool = new Pool({
    user: 'root',
    host: 'localhost',
    database: 'films',
    password: 'example',
    port: 8080,
})

pool.on('error', (err, client) => {
    console.error('Error:', err)
})


const query = `
CREATE TABLE ratings (
    userId int,
    movieId int,
    rating int,
    timestamp int
)
`;

(async () => {
    try {
        console.log("HI! Hello!!");
        const client = await pool.connect();
        console.log("Hello!!");
        const res = await client.query(query);
        

        // for (let row of res.rows) {
        //     console.log(row)
        // }
    } catch (err) {
        console.error(err);
    }
})();