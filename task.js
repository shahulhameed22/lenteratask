var express = require('express');
var router = express.Router();
var dbConn  = require('./connection');
 

router.get('/', function(req, res, next) {      
    dbConn.query('SELECT * FROM task ORDER BY id desc',function(err,rows)     {
        if(err) {
            req.flash('error', err);
            res.render('task',{data:''});   
        } else {
            
            res.render('task',{data:rows});
        }
    });
});


router.get('/add', function(req, res, next) {    
    
    res.render('task/add', {
        name: '',
        startdate: '',
        enddate:'',
        assign:'',
        description:''
    })
})


router.post('/add', function(req, res, next) {    

    let name = req.body.name;
    let startdate = req.body.startdate;
    let enddate = req.body.enddate;
    let assign = req.body.assign;
    let description = req.body.description;
    let errors = false;

    if(name.length === 0 || startdate.length === 0 || enddate.length === 0 || assign.length === 0 || description.length === 0) {
        errors = true;

        
        req.flash('error', "Please enter name and startdate and enddate and assign and description");
        
        res.render('task/add', {
            name: name,
            startdate: startdate,
            enddate: enddate,
            assign: assign,
            description:description
        })
    }

    
    if(!errors) {

        var form_data = {
            name: name,
            startdate: startdate,
            enddate: enddate,
            assign: assign,
            description:description
        }
        
        
        dbConn.query('INSERT INTO task SET ?', form_data, function(err, result) {
            
            if (err) {
                req.flash('error', err)
                 

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


router.get('/edit/:id', function(req, res, next) {

    let id = req.params.id;
   
    dbConn.query('SELECT * FROM task WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        
        if (rows.length <= 0) {
            req.flash('error', 'User not found with id = ' + id)
            res.redirect('/task')
        }
        
        else {
            
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
        
        
        req.flash('error', "Please enter name and email and position");
        
        res.render('task/edit', {
            id: req.params.id,
            name: name,
            startdate: startdate,
            enddate: enddate,
            assign: assign,
            description:description
        })
    }

    
    if( !errors ) {   
 
        var form_data = {
            name: name,
            startdate: startdate,
            enddate: enddate,
            assign: assign,
            description:description
        }
        
        dbConn.query('UPDATE task SET ? WHERE id = ' + id, form_data, function(err, result) {
            
            if (err) {
                
                req.flash('error', err)
                
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
   

router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    dbConn.query('DELETE FROM task WHERE id = ' + id, function(err, result) {
        
        if (err) {
            
            req.flash('error', err)
            
            res.redirect('/task')
        } else {
            
            req.flash('success', 'Tasksuccessfully deleted! ID = ' + id)
            
            res.redirect('/task')
        }
    })
})

module.exports = router;
