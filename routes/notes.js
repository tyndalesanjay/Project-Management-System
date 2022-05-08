var express = require('express');
const conn = require('../lib/db');
var router = express.Router();

/* GET notes listing. */
router.get('/project_notes', function(req, res, next) {
  conn.query(`SELECT pn.id, pn.project_id, pn.project_notes, pl.project_start_date FROM projects.project_notes pn,
   projects.project_list pl WHERE pn.project_id = pl.id;`, (err, rows) => {
    if (err) throw err;
    res.render('notes/index', {notes: rows, title: 'Project Notes', header: 'Project Management System' })                   
  });
});

// Creating Notes List

router.get('/add', (req, res) => {
	  res.render('notes/add', 
      {title: 'Add New Notes', header: 'Project Management System'})
})



// Add Projects
router.post('/add', (req, res) => {

  const data = {
    project_id: req.body.project_id,
    active_date: req.body.active_date,
    project_notes: req.body.project_notes
  }

  conn.query(`INSERT INTO project_notes SET ?`, data, (err, results) => {
		if (err) throw err
    // console.log('Project Added')
        res.redirect('/notes/project_notes')
	})
});

// Get Notes
router.get('/update/:id', (req, res) => {
	const id = Number(req.params.id)
	if (id == NaN) error(res, 'use a number for the id', 422)

	conn.query(`SELECT project_id as project_id, active_date as active_date, project_notes as project_notes FROM projects.project_notes WHERE id = ${id};`, (err, results) => {
		if (err) throw err;
		res.render('notes/update.ejs', { notes: results[0], title: 'Update Notes' })
	})
})

// Post Update
router.post('/update/:id', (req, res, next) => {

  let sqlQuery = "UPDATE project_notes SET project_id ='" + req.body.project_id + 
  "', active_date ='" + req.body.active_date + 
  "', project_notes ='" + req.body.project_notes + 
  "' WHERE id = " + req.body.id;
//   project_id ='" + req.body.project_id + 
//                                         "', active_date ='" + req.body.active_date + 
//                                         "', project_notes ='" +  req.body.project_notes + 
//                                         "' WHERE id = " + req.body.id;

  conn.query(sqlQuery, function(err, rows)  {
    if (err) throw err;
    res.redirect('/notes/project_notes');  
    next();                
  });
});

router.get('/delete/:id', function(req, res, next) {
  conn.query('DELETE FROM project_notes WHERE id=' + req.params.id, function(err, row) {
    if (err) throw err;
    res.redirect('/notes/project_notes')
    next();
  });
});



function success(response, data = [], message = 'success', status = 200) {
	response.send({ status, message, data })
}

function error(response, message = 'error', status = 500, data = []) {
	response.send({ status, message, data })
}

module.exports = router;