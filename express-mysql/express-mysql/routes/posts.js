
var express = require('express');
var router = express.Router();

// import db
var connection = require('../library/database'); //import db

router.get('/', function(req, res, next) {
    connection.query('SELECT * FROM tbl_42_post ORDER BY id desc', function (err, rows) {
        if (err) {
            req.flash('error', err);
            res.render('posts', {
                data: ''

            });
        } else {
            res.render('posts/index', {
            data: rows
            });
        }
    });
});

// Create Post
router.get('/create', function(req, res, next) {
    res.render('posts/create', {
        title: '',
        content: ''
    })
})
router.post('/store', function (req, res, next) {
    let title = req.body.title;
    let content = req.body.content;
    let errors = false;

    if(title.length === 0) {
        errors = true;

        req.flash('error', "Please enter title");
        // render to views/posts/create.ejs
        res.render('posts/create', {
            title: title,
            content: content
        })
    }

    if(content.length === 0) {
        errors = true;
        req.flash('error', "Please enter content");
        res.render('posts/create', {
            title: title,
            content: content
        })
    }

    if(!errors) {

        let formData = {
            title: title,
            content: content
        }

        // insert query
        connection.query('INSERT INTO tbl_42_post SET ?', formData, function(err, result) {
            if (err) {
                req.flash('error', err);
                // render to views/posts/create.ejs
                res.render('posts/create', {
                    title: formData.title,
                    content: formData.content
                })
            } else {
                req.flash('success', 'Data added successfully!');
                res.redirect('/posts');
            }
        })
    }
})

// Edit Post
router.get('/edit/(:id)', function(req, res, next) {
    let id = req.params.id;

    connection.query('SELECT * FROM tbl_42_post WHERE id = ' + id, function(err, rows, fields) {
        if (err) throw err

            // if post not found
            if (rows.length <= 0) {
                req.flash('error', 'Data Post Dengan ID ' + id + ' Tidak Ditemukan');
                res.redirect('/posts');
            } else {
                // if post found
                res.render('posts/edit', {
                    title: rows[0].title,
                    content: rows[0].content,
                    id: rows[0].id
                })
            }
    })
})


// Update Post

router.post('/update/:id', function(req, res, next) {
    let id = req.params.id;
    let title = req.body.title;
    let content = req.body.content;
    let errors = false;

    if(title.length === 0) {
        errors = true;

        req.flash('error', "Silahkan Masukkan Title");
        // render to views/posts/edit.ejs
        res.render('posts/edit', {
            id: id,
            title: title,
            content: content

        })
    }

    if(content.length === 0) {
        errors = true;
        req.flash('error', "Please enter content");
        res.render('posts/edit', {
            id: id,
            title: title,
            content: content
            
        })
    }

    if(!errors) {

        let formData = {
            title: title,
            content: content
        }

        // update query
        connection.query('UPDATE       SET ? WHERE id = ' + id, formData, function(err, result) {
            if (err) {
                req.flash('error', err);
                // render to views/posts/edit.ejs
                res.render('posts/edit', {
                    id:      req.params.id,
                    title:   formData.name,
                    content: formData.author
                    
                })
            } else {
                req.flash('success', 'Data updated successfully!');
                res.redirect('/posts');
            }
        })
    }
})

module.exports = router;


