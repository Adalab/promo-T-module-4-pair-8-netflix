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
    password: 'dev23.',
    database: 'netflix',
  });
  connection.connect();
  return connection;
}

// endpoints
server.get('/movies', async (req, res) => {
  const genreFilterParam = req.query.genre;
  const sortFilterParam = req.query.sort;
  console.log(req.query);
  if (genreFilterParam && genreFilterParam !== '') {
    const selectMovies = `SELECT * FROM movies WHERE genre=? ORDER BY title ${sortFilterParam}`;
    const conn = await getConnection();
    const [results, cols] = await conn.query(selectMovies, [genreFilterParam]);
    console.log('results ' + results);
    conn.end();
    res.json({ success: true, movies: results });
  } else {
    const selectMovies =
    `SELECT * FROM movies ORDER BY title ${sortFilterParam}`;
    const conn = await getConnection();
    const [results, cols] = await conn.query(selectMovies);
    console.log('results ' + results);
    conn.end();
    res.json({ success: true, movies: results });
  }


});

// static
server.use(express.static('./src/public-react'));
server.use(express.static('./src/public-movies-images'));
