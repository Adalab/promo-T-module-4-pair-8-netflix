const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
// create and config server
const server = express();
server.use(cors());
server.use(express.json());
server.set('view engine', 'ejs');

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
    // password: 'LieT0M3*',
    password:'dev23.',
    database: 'netflix',
  });
  connection.connect();
  return connection;
}

// endpoints
server.get('/movies', async (req, res) => {
  const genreFilterParam = req.query.genre;
  const sortFilterParam = req.query.sort;
  if (genreFilterParam && genreFilterParam !== '') {
    const selectMovies = `SELECT * FROM movies WHERE genre=? ORDER BY title ${sortFilterParam}`;
    const conn = await getConnection();
    const [results, cols] = await conn.query(selectMovies, [genreFilterParam]);
    conn.end();
    res.json({ success: true, movies: results });
  } else {
    const selectMovies = `SELECT * FROM movies ORDER BY title ${sortFilterParam}`;
    const conn = await getConnection();
    const [results, cols] = await conn.query(selectMovies);
    conn.end();
    res.json({ success: true, movies: results });
  }
});

server.get('/movie/:movieId', async (req, res) => {
  const sql = 'SELECT * FROM movies WHERE id= ?';
  const connect = await getConnection();
  const [results, cols] = await connect.query(sql, [req.params.movieId]);
  const foundMovie = results[0];
  console.log(foundMovie);
  connect.end();
  res.render('movie', foundMovie);
});

// signup

server.post('/sign-up', async (req, res) => {
  const connect = await getConnection();
  const comprobacion = 'select*from users where email=req.body.email'

  if (comprobacion.length < 1) {
  const sql = 'INSERT INTO users (email, password) VALUES (?,?)';
  const [results] = await connect.query(sql, [req.body.email, req.body.password]);
  res.json({success: true, userId: results.insertId});
  } else {
    res.json({ success: false, errorMessage: 'el email ya se encuentra en la BBDD' });
  }
  // try{
  // const sql = 'INSERT INTO users (email, password) VALUES (?,?)';

  // const connect = await getConnection();
  // const [results] = await connect.query(sql, [req.body.email, req.body.password]);
  // res.json({success: true, userId: results.insertId});
  // } catch (err){

  //   res.json({success: false, errorMessage: err.message});
  // }
 
  // if(results.insertId) {
  // } else {
  // }
  
});

// static
server.use(express.static('./src/public-react'));
server.use(express.static('./src/public-movies-images'));
