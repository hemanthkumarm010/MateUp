var mysql = require("mysql");
const express = require("express"); 
const app = express();

var path = require("path");
const bcrypt = require('bcrypt');
var bodyparser = require("body-parser");
const { error } = require("console");
app.use(express.json());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const session = require('express-session');

app.use(session({
    secret: 'your_secret_key', // replace with your secret key
    resave: false,
    saveUninitialized: true
}));


app.use(express.static(path.join(__dirname, "views")));
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Anju@2004",
    database: "signin"
});

con.connect(function (error) {
    if (error) throw error;
    console.log("connected successfully");
});

app.get("/sign", function (req, res) {
    res.render("indexSign");
})

app.get('/login', (req, res) => {
    res.render('indexLog');
});


app.post("/sign", async function (req, res) {
    try {
        var name = req.body.name;
        var email = req.body.email;
        var mon = req.body.mobile;
        var sem = req.body.sem;
        var username = req.body.username;
        var password = req.body.password;
        const hashedPassword = await bcrypt.hash(password, 10);

        var sql = "INSERT INTO usersign(user_name, user_mail, user_mon, user_sem, username, user_password) VALUES (?, ?, ?, ?, ?, ?)";
        con.query(sql, [name, email, mon, sem, username, hashedPassword], function (error, result) {
            if (error) throw error;
            /*res.send('User registered successfully');*/
            res.redirect('/login');
        });
    } catch (error) {
        res.status(500).send('Error registering user');
    }
});

app.get('/', (req, res) => {
    res.render('welcome');
});

app.post('/login', async function (req, res) {
    const { username, password } = req.body;
    const query = 'SELECT * FROM usersign WHERE username = ?';
    con.query(query, [username], async (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            res.status(500).send('Server error');
            return;
        }
        if (results.length > 0) {
            const user = results[0];
            const match = await bcrypt.compare(password, user.user_password);
            if (match) {
                req.session.user = user;
                console.log('Login successful for user:', username);
                con.query('SELECT * FROM usersign', function(error, results, fields) {
                    if (error) throw error;
                    res.render('find', { data2: results, currentUser: req.session.user });
                });
            } else {
                console.log('Invalid password for user:', username);
                res.send('Invalid username or password');
            }
        } else {
            console.log('No user found with username:', username);
            res.send('Invalid username or password');
        }
    });
});
app.get('/viewhistory', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const currentUser = req.session.user;
    const query = 'SELECT * FROM room WHERE username = ?';
    
    con.query(query, [currentUser.username], (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).send('Server error');
        }

        res.render('viewhistory', { posts: results, currentUser: currentUser });
    });
});


app.get('/find', (req, res) => {
    //res.render('find');
    con.query('SELECT * FROM usersign', function(error, results, fields) {
        if (error) throw error;
        res.render('find', { data2: results, currentUser: req.session.user });
    });
});
app.get('/details', (req, res) => {
    //res.render('option1');
    con.query('SELECT * FROM usersign', function(error, results, fields) {
        if (error) throw error;
        res.render('option1', { data2: results, currentUser: req.session.user });
    });
});
app.post("/details", async function (req, res) {
    try {
        var name1 = req.body.name;
        var age = req.body.age;
        var gender = req.body.gender;
        var collegename = req.body.college;
        var sem1 = req.body.semester;
        var rt = req.body.room_type;
        var no_roomates = req.body.roommates;
        var rent = req.body.rent;
        var locality = req.body.locality;
        var address=req.body.address;
        var mobile = req.body.mobile;
        var e_mail = req.body.email;
        var lookingfor = req.body.lookingfor;
        var username = req.session.user.username;
        var posted_on = new Date().toISOString().slice(0, 19).replace('T', ' ');
    

        var sql1 = "INSERT INTO room(u_name, u_age, u_gender,college_name, sem,room_type,no_of_roomates,rent,locality,address,mobile,u_email,looking_for,username,posted_on) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)";
        con.query(sql1, [name1, age, gender, collegename,sem1,rt,no_roomates,rent,locality,address,mobile,e_mail,lookingfor,username,posted_on], function (error, result) {
            if (error) throw error;
            res.redirect('/find');
        });
    } catch (error) {
        res.status(500).send('Error registering details');
    }
});
app.get("/detailsprint", function (req, res) {
    const { locality } = req.query;
    
    let query = 'SELECT * FROM room';
    let params = [];
    
    if (locality) {
        query += ' WHERE locality LIKE ?';
        params.push(`%${locality}%`);
    }

    con.query(query, params, function (error, roomResults) {
        if (error) throw error;

        con.query('SELECT * FROM usersign', function (error, userResults) {
            if (error) throw error;

            res.render('detailsdisplay', { data: roomResults, data2: userResults, currentUser: req.session.user });
        });
    });
    
});
app.post('/deletePost', (req, res) => {
    const { username, u_name, mobile } = req.body;

    const query = 'DELETE FROM room WHERE username = ? AND u_name = ? AND mobile = ?';
    con.query(query, [username, u_name, mobile], (err, result) => {
        if (err) {
            console.error('Error deleting the entry:', err);
            return res.status(500).send('Server error');
        }

        res.redirect('/viewhistory');
    });
});




app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Could not log out.');
        }
        console.log("Logged out");
        res.redirect('/');
    });
});



app.listen(4500, () => {
    console.log("Server is running on port 4500");
});
