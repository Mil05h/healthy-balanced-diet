const User = require('../models/user')
const Diet = require('../models/diet')
const Blog = require('../models/blog')
const { cloudinary } = require('../cloudinary');
const nodemailer = require("nodemailer");

module.exports.renderLogin = (req, res) => {
    res.render('admin/login')
}

module.exports.renderAdmin = async (req, res) => {
    const admin = await User.findById(req.user._id);
    const users = await User.find({}).populate(
        {
            path: 'diets',
            options: {
                sort: {
                    'createdAt': -1
                }
            }
        })
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
    res.render('admin/adminPage', { admin, users, categories, blogs })
}

module.exports.loginAdmin = async (req, res) => {
    req.flash('success', 'Welcome ADMIN')
    res.redirect('/admin9196')
}

module.exports.renderUser = async (req, res) => {
    const user = await User.findById(req.params.userId).populate(
        {
            path: 'measures',
            options: {
                sort: {
                    'createdAt': -1
                }
            }
        }).populate(
            {
                path: 'diets',
                options: {
                    sort: {
                        'createdAt': -1
                    }
                }
            })
    res.render('admin/userPage', { user })
}

module.exports.sendDiet = async (req, res) => {
    const { userId, dietId } = req.params;
    const diet = await Diet.findById(dietId)
    console.log(req.file, diet)
    diet.url = req.file.path;
    diet.filename = req.file.filename;
    await diet.save()
    const user = await User.findById(userId);
    console.log(user)
    const link = req.file.path
    const linkTwo = 'http://healthy-balanced-diet.cyclic.app'
    const transporter = nodemailer.createTransport({
        host: "smtp-relay.sendinblue.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.SENDINBLUE_USER,
            pass: process.env.SENDINBLUE_PASS,
        },
    });
        
await transporter.sendMail({
            from: '"Healthy Balanced Diet" <noreply@healthybalanceddiet.com>',
            to: user.email,
            subject: "Your diet plan is compleated",
            text: `Hello ${user.username},We are glad to tell that Your Diet is ready to be used. It can be accesed and downloaded here or on Your progress monitoring page of our webApp under 'My Diets'.${user.username}, make sure You update Your measures every two week so You can visualise progress and motivate youself to continue dieting. Sooner You start sooner the results will be, Best regards, Healthy Balanced Diet Team`,
            html: `<h1>Hello ${user.username},</h1><p>We are glad to tell that Your Diet is ready to be used. It can be accesed and downloaed <a href='${link}'>here</a> or on Your progress monitoring page of our <a href='${linkTwo}'>webApp</a> under 'My Diets'.<br>${user.username} make sure You update Your measures every two week so You can visualise progress and motivate youself to continue dieting.<br> Sooner You start sooner the results will be,<br>Best regards,<br> Healthy Balanced Diet Team</p>`
        });

        req.flash('success', 'Email and diet sent')
        res.redirect(`/admin9196/${userId}`)

}

module.exports.deleteDietPdf = async (req, res) => {
    const { userId, dietId } = req.params
    const diet = await Diet.findByIdAndUpdate(dietId, { url: 'ordered', filename: 'deleted' })
    await cloudinary.uploader.destroy(diet.filename)
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/admin9196/${userId}`);
}

module.exports.deleteDietOrder = async (req, res) => {
    const { userId, dietId } = req.params
    const diet = await Diet.findByIdAndDelete(dietId)
    await User.findByIdAndUpdate(userId, { $pull: { diets: dietId } });
    if (diet.url !== 'ordered') {
        await cloudinary.uploader.destroy(diet.filename)
    }
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/admin9196/${userId}`);
}

module.exports.createBlogPost = async (req, res) => {
    const blog = await new Blog(req.body);
    await blog.save()
    req.flash('success', 'Successfuly added new blog post')
    res.redirect('/admin9196')
}

module.exports.editBlogPost = async (req, res) => {
    await Blog.findByIdAndUpdate(req.params.postId, req.body);
    req.flash('success', 'Successfuly edited blog post')
    res.redirect('/admin9196')
}

module.exports.deleteBlogPost = async (req, res) => {
    await Blog.findByIdAndDelete(req.params.postId, req.body);
    req.flash('success', 'Successfuly deleted blog post')
    res.redirect('/admin9196')
}

module.exports.renderDietDetails = async (req, res) => {
    const {dietId, userId} = req.params;
    const diet = await Diet.findById(dietId);
    const user = await User.findById(userId);
    res.render('admin/dietDetails', { diet, user })
}