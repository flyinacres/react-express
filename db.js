const { Pool } = require('pg');
const dotenv = require('dotenv');
const uuidv4 = require('uuid/v4');
const moment = require('moment');



dotenv.config();


// User postgres, password same  (-U postgres)
// Don't know the difference between Pool and Client in pg...
// Not sure why I had to hardcode the password in .env
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    password: 'postgres',
})


/**
 * Create Tables
 *  id: 1, name:"a", age:29, qualification:"B.Com",rating:3,gender:"male",
 *            city:"Kerala",skills:["reactjs","angular","vuejs"]},
 * Because of the fact that this only returns values instead of throwing an error,
 * it will never cause a reject handler (a catch) to be called.
 */
async function createTable() {
    const queryText = `CREATE TABLE IF NOT EXISTS
        candidates(
          id UUID PRIMARY KEY,
          name VARCHAR(128) NOT NULL,
          age INTEGER NOT NULL,
          gender VARCHAR(32) NOT NULL,
          qualification VARCHAR(128) NOT NULL,
          city VARCHAR(64) NOT NULL,
          skills VARCHAR(128) NOT NULL,
          created_date TIMESTAMP,
          modified_date TIMESTAMP
        )`;
  
    await pool.query(queryText)
      .then((res) => {
        console.log(res); 
        console.log("In creatTable, query to create table is done.");
        return res;
      })
      .catch((err) => {
        console.log(err);
        console.log("In createTable, error encountered creating table with query");
        return err;
      });
  }
  
  /**
   * Drop Tables
   */
async function dropTable() {
    const queryText = 'DROP TABLE IF EXISTS candidates';
    await pool.query(queryText)
      .then((res) => {
        console.log(res);
        return res;
      })
      .catch((err) => {
        console.log(err);
        return err
      });
  
  
    pool.on('remove', () => {
        console.log('client removed');
  });
}
  


async function addOne(req) {
    const text = `INSERT INTO
    candidates(id, name, age, gender, qualification, city, skills, created_date, modified_date)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
        returning *`;
    const values = [
        uuidv4(),
        req.name,
        req.age,
        req.gender,
        req.qualification,
        req.city,
        req.skills,
        moment(new Date()),
        moment(new Date())
    ];
  
      try {
        const { rows } = await pool.query(text, values);
        return rows[0];
      } catch(error) {
        return error;
      }
    }

    /**
     * Get All Candidates
     * @returns {object} candidates array
     */
async function getAll() {
      const findAllQuery = 'SELECT * FROM candidates';
      try {
        const { rows, rowCount } = await pool.query(findAllQuery);
        return { rows, rowCount };
      } catch(error) {
        return error;
      }
    }

    /**
     * Get A Candidate
     * @param {object} req 
     * @param {object} res
     * @returns {object} candidates object
     */
async function getOne(id) {
      const text = 'SELECT * FROM candidates WHERE id = $1';
      try {
        const { rows } = await pool.query(text, [id]);
        if (!rows[0]) {
          return "Candidate not found for id " + id;
        }
        return rows[0];
      } catch(error) {
        return error;
      }
    }

    /**
     * Update A Candidate
     * @param {object} req 
     */
async function update(req) {
      const findOneQuery = 'SELECT * FROM candidates WHERE id=$1';
      const updateOneQuery =`UPDATE candidates
        SET name=$1,age=$2,gender=$3,qualification=$4,city=$5,skills=$6,modified_date=$7
        WHERE id=$8 returning *`;
      try {
        const { rows } = await pool.query(findOneQuery, [req.id]);
        if(!rows[0]) {
          return "Candidate not found for id " + id;
        }
        const values = [
          req.id,
          req.name,
          req.age,
          req.gender,
          req.qualification,
          req.city,
          req.skills,
          moment(new Date())
      ];
        const response = await pool.query(updateOneQuery, values.slice(1));
        return response.rows[0];
      } catch(err) {
        return err;
      }
    }

    /**
     * Delete A Candidate
     * @param {object} id 
     */
async function deleteOne(id) {
      const deleteQuery = 'DELETE FROM candidates WHERE id=$1 returning *';
      try {
        const { rows } = await pool.query(deleteQuery, [id]);
        if(!rows[0]) {
          return "Candidate not found for id " + id;
        }
        return "deleted";
      } catch(error) {
        return error;
      }
    }

      /**
     * Close the pools
     */
async function closePool(id) {
  const deleteQuery = 'DELETE FROM candidates WHERE id=$1 returning *';
  pool.end();
}


  
module.exports = {createTable, dropTable, addOne, getAll, getOne, update, deleteOne, closePool};