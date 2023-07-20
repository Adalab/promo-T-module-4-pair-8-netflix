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
    password: 'LieT0M3*',
    //password:'dev23.',
    database: 'netflix',
  });
  connection.connect();
  return connection;
}

const SIZE_PAGE = 2;

// endpoints
server.get('/movies', async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const genreFilterParam = req.query.genre;
  const sortFilterParam = req.query.sort;
  if (genreFilterParam && genreFilterParam !== '') {
    const selectMovies = `SELECT * FROM movies WHERE genre=? ORDER BY title ${sortFilterParam === 'desc' ? 'desc' : 'asc'}`;
    const conn = await getConnection();
    const [results] = await conn.query(selectMovies, [genreFilterParam]);
    conn.end();
    res.json({ success: true, movies: results });
  } else {
    const conn = await getConnection();
    const allMovies = `SELECT COUNT(*) FROM movies`;
    const [allResults] = await conn.query(allMovies);
    const numResults = parseInt(allResults[0]);
    const numPages = Math.ceil(numResults / SIZE_PAGE);
    const selectMovies = `SELECT * FROM movies ORDER BY title ${sortFilterParam === 'desc' ? 'desc' : 'asc'} LIMIT ? OFFSET ?`;
    const [results] = await conn.query(selectMovies, [SIZE_PAGE, page * SIZE_PAGE]);
    conn.end();
    res.json({
      success: true,
      info: {
        page: page,
        num: numResults,
        next: page === numPages - 1 ? null : `http://localhost:4000/movies?page=${page + 1}`,
        prev: page === 0 ? null : `http://localhost:4000/movies?page=${page - 1}`,
      },
      movies: results,
    });
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
  const comprobacion = 'select*from users where email=req.body.email';

  if (comprobacion.length < 1) {
    const sql = 'INSERT INTO users (email, password) VALUES (?,?)';
    const [results] = await connect.query(sql, [req.body.email, req.body.password]);
    res.json({ success: true, userId: results.insertId });
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
