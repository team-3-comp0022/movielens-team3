// const { Pool } = require('pg')
// // pools will use environment variables
// // for connection information

// const pool = new Pool({
//     user: 'root',
//     host: 'localhost:8080',
//     database: 'mysql',
//     password: 'example',
//     port: 8080,
//     })

// pool.query('SELECT NOW()', (err, res) => {
//   console.log(err, res)
//   pool.end()
// })

// // you can also use async/await

// const res = await pool.query('SELECT NOW()')
// await pool.end()

// const query

// const fs = require("fs");
// const Pool = require("pg").Pool;
// const fastcsv = require("fast-csv");
// let stream = fs.createReadStream("ml-latest-small\\ratings.csv");
// let csvData = [];
// let csvStream = fastcsv
//   .parse()
//   .on("data", function(data) {
//     csvData.push(data);
//   })
//   .on("end", function() {
//     // remove the first line: header
//     csvData.shift();
//     // create a new connection to the database
//     const pool = new Pool({
//       host: "localhost:8080",
//       user: "root",
//       database: "mysql",
//       password: "example",
//       port: 8080
//     });
//     const query =
//       "INSERT INTO category (id, name, description, created_at) VALUES ($1, $2, $3, $4)";
//     pool.connect((err, client, done) => {
//       if (err) throw err;
//       try {
//         csvData.forEach(row => {
//           client.query(query, row, (err, res) => {
//             if (err) {
//               console.log(err.stack);
//             } else {
//               console.log("inserted " + res.rowCount + " row:", row);
//             }
//           });
//         });
//       } finally {
//         done();
//       }
//     });
//   });
// stream.pipe(csvStream);

var pgtools = require("pgtools");
const config = {
  user: "root",
  host: '0.0.0.0',
  password: "example",
  port: 8080
};
pgtools.createdb(config, "films", function(err, res) {
  if (err) {
    console.error(err);
    process.exit(-1);
  }
  console.log(res);
});