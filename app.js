if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}


const express = require('express')
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const ejsMate = require('ejs-mate');
const flash = require('connect-flash');
const ExpressError = require('./utils/expressError');
const User = require('./models/user');
const userRoutes = require('./routes/user');
const measureRoutes = require('./routes/measure');
const adminRoutes = require('./routes/admin');
const googleRoutes = require('./routes/googleRoutes')
const paypalRoutes = require('./routes/paypalRoutes')
const { ToadScheduler, SimpleIntervalJob, AsyncTask } = require('toad-scheduler')
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const Blog = require('./models/blog')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet')
const MongoStore = require('connect-mongo');

//
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/healthydiet';
const db = mongoose.connection;

const connectDB = async () => {
  try {
await mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected')
});
 } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
    "https://www.paypal.com",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com",
    "https://stackpath.bootstrapcdn.com",
    "https://api.mapbox.com",
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
    "https://cdn.jsdelivr.net"
];
const connectSrcUrls = [
    "https://events.mapbox.com",
    "https://www.sandbox.paypal.com"
];

const fontSrcUrls = [
    "https://cdn.jsdelivr.net",
    "https://fonts.gstatic.com",
];


app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            scriptSrcAttr: ["'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:", "https://www.sandbox.paypal.com/"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/de0mchrco/",
                "https://images.unsplash.com",
                "https://upload.wikimedia.org/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const secret = process.env.SECRET || 'thisshouldbeabethersecret';

const store = new MongoStore({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
})

store.on("error", function (e) {
    console.log("session store error", e)
})


const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: Date.now() + 1000 * 60 * 60 * 24 * 7
    }
}

const scheduler = new ToadScheduler()
const task = new AsyncTask('simple task', async () => {
    const current = new Date(new Date().setDate(new Date().getDate() - 1))
    await User.deleteMany({ isVerified: false, createdAt: { $lte: current } })
});
const job = new SimpleIntervalJob({ seconds: 3600, }, task)
scheduler.addSimpleIntervalJob(job)

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    //////////////////////// replace before deploying ////////////////

    ////////////// callbackURL: `http://${req.hostnam}/auth/google/callback`,
    callbackURL: "https://healthy-balanced-diet.cyclic.app/auth/google/callback",

    //////////////////////// replace before deploying ////////////////
    passReqToCallback: true
}, (request, accessToken, refreshToken, profile, done) => {
    process.nextTick(async () => {
        const user = await User.findOne({ googleId: profile.id })
        if (user) {
            return done(null, user);
        } else {
            const user = await User.findOne({ email: profile.email })
            if (!user) {
                const newUser = new User({
                    isVerified: false,
                    googleId: profile.id,
                    email: profile.email,
                    username: profile.displayName,
                    gender: profile.gender || 'male',
                    height: 1,
                    dob: profile.birthaday || new Date()
                })
                await newUser.save()
                return done(null, newUser)
            } else {
                return done(null, user);
            };
        };
    })
}));

passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (obj, done) {
    done(null, obj);
});
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next();
})





app.use('', userRoutes);
app.use('/plan/:userId', measureRoutes)
app.use('/admin9196', adminRoutes)
app.use('/auth/google', googleRoutes)
app.use('/api/orders', paypalRoutes)

app.get('/', async (req, res) => {
    const blogs = await Blog.find({}).setOptions({
        sort: {
            'createdAt': -1
        }
    });
    res.render('home', { blogs })
})

app.get('/blog', async (req, res) => {
    const blogs = await Blog.find({}).setOptions({
        sort: {
            'createdAt': -1
        }
    });
    let categories = []
    for (let i = 0; i < blogs.length; i++) {
        if (!categories.includes(blogs[i].category)) {
            categories.push(blogs[i].category)
        }
    }
    const { category = "all" } = req.query;
    res.render('blog', { blogs, categories, category })
})

app.get('/blog/:blogId', async (req, res) => {
    const { blogId } = req.params;
    const blog = await Blog.findById(blogId)
    res.render('blogPost', { blog })
})


app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    console.log(err)
    if (!err.message) err.message = 'Oh No, Something Went Wrong!';
    res.status(statusCode).render('error', { err, statusCode });
});


const port = process.env.PORT || 3000;
connectDB().then(() => {
    app.listen(port, () => {
        console.log("listening for requests");
    })
})
