let express = require('express');
let mongoose = require('mongoose');
let passport = require('passport');
let localStrategy = require('passport-local')
let methodOverride = require('method-override');
let session = require('express-session');
let path = require('path');
let moment = require('moment');
let flash = require('connect-flash');
let app = express();

require('dotenv').config();

let databaseUsername = process.env.DB_USERNAME;
let databasePassword = process.env.DB_PASS;

mongoose
.connect(`mongodb+srv://${databaseUsername}:${databasePassword}@jobnexus.9sdg31l.mongodb.net/?retryWrites=true&w=majority`)
.then(()=>{
    console.log('db connected');
}).catch(()=>{
     console.log('errorr');
     console.error();
});

app.use(
    session({
        secret: 'sessionpassword',
        resave:false,
        saveUninitialized: true,
        cookie:{
            httpOnly:true,
            maxAge:1000*60*60*24
        }
    })
);

let User = require('./models/user-DB');



app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(flash());
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.moment = moment;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});


// ! ROUTING LOGIC
let jobRoutes = require('./routes/home');
let notifRoutes = require('./routes/notification.js');
let authRoutes = require('./routes/auth');
let userRoutes = require('./routes/user');
let questionRoutes = require('./routes/questions');
app.use(jobRoutes);
app.use(notifRoutes);
app.use(authRoutes);
app.use(userRoutes);
app.use(questionRoutes);




// ! port 
let port = process.env.PORT;
app.listen(port,()=>{
    console.log(`server started on port ${port}`);
}); 