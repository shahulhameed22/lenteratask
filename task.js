var express = require('express');
var router = express.Router();
var dbConn  = require('./connection');
 
// display user page
router.get('/', function(req, res, next) {      
    dbConn.query('SELECT * FROM task ORDER BY id desc',function(err,rows)     {
        if(err) {
            req.flash('error', err);
            // render to views/users/index.ejs
            res.render('task',{data:''});   
        } else {
            // render to views/users/index.ejs
            res.render('task',{data:rows});
        }
    });
});

// display add user page
router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('task/add', {
        name: '',
        startdate: '',
        enddate:'',
        assign:'',
        description:''
    })
})

// add a new user
router.post('/add', function(req, res, next) {    

    let name = req.body.name;
    let startdate = req.body.startdate;
    let enddate = req.body.enddate;
    let assign = req.body.assign;
    let description = req.body.description;
    let errors = false;

    if(name.length === 0 || startdate.length === 0 || enddate.length === 0 || assign.length === 0 || description.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter name and startdate and enddate and assign and description");
        // render to add.ejs with flash message
        res.render('task/add', {
            name: name,
            startdate: startdate,
            enddate: enddate,
            assign: assign,
            description:description
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            name: name,
            startdate: startdate,
            enddate: enddate,
            assign: assign,
            description:description
        }
        
        // insert query
        dbConn.query('INSERT INTO task SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('task/add', {
                    name: form_data.name,
                    startdate: form_data.startdate,
                    enddate: form_data.enddate,
                    assign: form_data.assign,
                    description: form_data.description
                })
            } else {                
                req.flash('success', 'task successfully added');
                res.redirect('/task');
            }
        })
    }
})

// display edit user page
router.get('/edit/:id', function(req, res, next) {

    let id = req.params.id;
   
    dbConn.query('SELECT * FROM task WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'User not found with id = ' + id)
            res.redirect('/task')
        }
        // if user found
        else {
            // render to edit.ejs
            res.render('task/edit/:id', {
                title: 'Edit task', 
                id: rows[0].id,
                name: rows[0].name,
                startdate: rows[0].startdate,
                enddate: rows[0].enddate,
                assign: rows[0].assign,
                description: rows[0].description
            })
        }
    })
})

// update user data
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let name = req.body.name;
    let startdate = req.body.startdate;
    let enddate = req.body.enddate;
    let assign = req.body.assign;
    let description = req.body.description;
    let errors = false;

    if(name.length === 0 || startdate.length === 0 || enddate.length === 0 || assign.length === 0 || description.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Please enter name and email and position");
        // render to add.ejs with flash message
        res.render('task/edit', {
            id: req.params.id,
            name: name,
            startdate: startdate,
            enddate: enddate,
            assign: assign,
            description:description
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            name: name,
            startdate: startdate,
            enddate: enddate,
            assign: assign,
            description:description
        }
        // update query
        dbConn.query('UPDATE task SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('task/edit', {
                    id: req.params.id,
                    name: form_data.name,
                    startdate: form_data.startdate,
                    enddate: form_data.enddate,
                    assign: form_data.assign,
                    description: form_data.description
                })
            } else {
                req.flash('success', 'task successfully updated');
                res.redirect('/task');
            }
        })
    }
})
   
// delete user
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    dbConn.query('DELETE FROM task WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to user page
            res.redirect('/task')
        } else {
            // set flash message
            req.flash('success', 'Tasksuccessfully deleted! ID = ' + id)
            // redirect to user page
            res.redirect('/task')
        }
    })
})

module.exports = router;