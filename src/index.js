const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
// create and config server
const server = express();
server.use(cors());
server.use(express.json());

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

// conection to database
async function getConnection() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'LieT0M3*',
    database: 'netflix',
  });
  connection.connect();
  return connection;
}

// endpoints
server.get('/movies', async (req, res) => {
  const selectMovies = "SELECT * FROM movies";
  const conn = await getConnection();
  const [results, cols] = await conn.query(selectMovies);
  conn.end();
  res.json({ success: true, movies: results });
});

// static
server.use(express.static('./src/public-react'));
