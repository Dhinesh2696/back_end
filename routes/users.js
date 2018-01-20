var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')
var db = require('../config/db_connection')
var passwordHash = require('password-hash');

/* GET users listing. */
var con = db.connection();
router.get('/:name', function (req, res, next) {
    var id = req.params['name'];
    //console.log(id + "hi");
    con.query("select name from hotel where city_id=(select id from city where name='" + id + "');", function (err, rows, fields) {
        if (err) throw err
       // console.log('The solution is: ', rows);
        res.send(rows);

    })

});
router.get('/desc/:name', function (req, res, next) {
    var id = req.params['name'];
    //console.log(id);
    con.query("select description,id from hotel where name='" +id +"';", function (err, rows, fields) {
        if (err) throw err
        //console.log('The solution is: ', rows);
        res.send(rows);

    })

});
router.get('/review/:name', function (req, res, next) {
    console.log(req.params['name']);
    var name=req.params['name']
    con.query("select users.name,review.content,review.time_stamp,review.id from( review inner join users on users.id=review.user_id) inner join hotel on review.hotel_id=hotel.id where hotel.name='"+name+"';", function (err, rows, fields) {
        if (err) throw err
        console.log('The solution is: ', rows);
        res.send(rows);

    })

});
router.get('/', function (req, res, next) {

    con.query('SELECT * from city', function (err, rows, fields) {
        if (err) throw err
        console.log('The solution is: ', rows);
        res.send(rows);

    })

});

router.post('/login', function (req, res, next) {
        var count = 0;
        var mob = req.body.mobile;
        var pwd = req.body.password;
        console.log(req);
        con.query("select count(*) as valid from users where mobile=" + mob + " and password= '" + pwd + "';", function (err, rows, fields) {
            if (err) throw err
            Object.keys(rows).forEach(function (key) {
                row = rows[key];
                count = row.valid;
                if (count === 1){
                    var response = {
                        "status": "success",
                        "mobile" :mob,
                    }
                    res.send(response)
                }

                else {
                    var response = {
                        "status": "failed",
                    }
                    res.send(response)
                }
            });
        })

    }
)
router.post('/post', function (req, res, next) {

    var mob = req.body.mobile;
    var name = req.body.name;
    var content = req.body.content+"  ";
    console.log(mob,name);
    var id,hid;
    con.query("select id from users where mobile="+mob+";", function (err, rows, fields) {
        if (err) throw err
        Object.keys(rows).forEach(function (key) {
            row = rows[key];
            id=row.id
        });
        con.query("select id from hotel where name='"+name+"';", function (err, rows, fields) {
            if (err) throw err
            Object.keys(rows).forEach(function (key) {
                row = rows[key];
                hid = row.id
                console.log(hid);
            });
            var created = new Date();
            var newDate=created.toString();

            con.query("Insert into review(user_id,hotel_id,content,time_stamp) values("+id+","+hid+",'"+content+"','"+created.toString()+"');", function (err, rows, fields) {
                if (err) throw err
                console.log('The solution is: ', rows);

            })
        })

    })
    //console.log(hashedPassword);
    //console.log(passwordHash.verify(pwd, hashedPassword));
    next();
}, function (req, res) {
    res.send("successfull")
})

router.post('/sign', function (req, res, next) {

    var mob = req.body.mobile;
    var name = req.body.name;
    var pwd = req.body.password;

    con.query("insert into users(name,mobile,password) values('" + name + "'," + mob + ",'" + pwd + "');", function (err, rows, fields) {
        if (err) throw err

    })
    //console.log(hashedPassword);
    //console.log(passwordHash.verify(pwd, hashedPassword));
    next();
}, function (req, res) {
    res.send("successfull")
})

module.exports = router;
