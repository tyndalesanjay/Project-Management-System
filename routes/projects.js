var express = require('express');
const conn = require('../lib/db');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  conn.query('SELECT * FROM projects.project_list;', (err, rows) => {
    if (err) throw err;
    res.render('projects/index', {projects: rows, title: 'Project Management System' })                   
  });
});

// Creating Projects List

router.get('/new_project', (req, res) => {
	  res.render('projects/add_projects', {title: 'Add New Project', header: 'Project Management System'})
})



// Add Projects
router.post('/add', (req, res) => {

  const data = {
    project_start_date: req.body.project_start_date,
    project_due_date: req.body.project_due_date,
    project_name: req.body.project_name,
    project_description: req.body.project_description
  }

  conn.query(`INSERT INTO project_list SET ?`, data, (err, results) => {
		if (err) throw err
    // console.log('Project Added')
    res.redirect('/projects')
	})

});

// Update Project
router.get('/update/:id', (req, res) => {
	const id = Number(req.params.id)
	if (id == NaN) error(res, 'use a number for the trainer id', 422)

	conn.query(`SELECT id, project_start_date as project_start_date, project_due_date as project_due_date, project_name as project_name, project_description as project_description FROM projects.project_list WHERE id = ${id};`, (err, results) => {
		if (err) throw err;

		res.render('projects/edit.ejs', { projects: results[0], title: 'Update Project', header:'Project Management System' })
	})
})

// Post Update
router.post('/update/:id', (req, res, next) => {

  let sqlQuery = "UPDATE project_list SET project_start_date ='" + req.body.project_start_date + 
                                        "', project_due_date ='" + req.body.project_due_date + 
                                        "', project_name ='" + req.body.project_name + 
                                        "', project_description ='" + req.body.project_description + 
                                        "' WHERE id = " + req.body.id;
                                
                                        // project_id ='" + req.body.project_id + "',
                                        // active_date ='" + req.body.active_date + "',
                                        // project_notes ='" + req.body.project_notes +"' WHERE id = " + rqq.body.id;
                                        

  conn.query(sqlQuery, function(err, rows)  {
    if (err) throw err;
    res.redirect('/projects');  
    next();                
  });
});



router.get('/delete/:id', function(req, res, next) {
  conn.query('DELETE FROM project_list WHERE id=' + req.params.id, function(err, row) {
    if (err) throw err;
    res.redirect('/projects')
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
