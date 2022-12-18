const Measure = require('../models/measure');
const User = require('../models/user');
const { cloudinary } = require('../cloudinary');


module.exports.renderEditMeasure = async (req, res) => {
    const user = await User.findById(req.params.userId);
    const measure = await Measure.findById(req.params.measureId)
    if (!measure) {
        req.flash('error', 'Cannot find that campground')
        return res.redirect('/campgrounds')
    }
    res.render('measureForms/editMeasure', { user, measure })
}

module.exports.createNewMeasure = async (req, res) => {
    const user = await User.findById(req.params.userId);
    const measure = new Measure(req.body.measure);
    measure.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    measure.user = req.params.userId;
    user.measures.push(measure);
    await measure.save()
    await user.save()
    res.redirect(`/plan/${user._id}`)
}

module.exports.editMeasure = async (req, res) => {
    const { userId, measureId } = req.params;
    const user = await User.findById(userId);
    const measure = await Measure.findByIdAndUpdate(measureId, req.body.measure);
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    measure.images.push(...imgs)
    await measure.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await measure.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated');
    res.redirect(`/plan/${user._id}`)
}

module.exports.deleteMeasure = async (req, res) => {
    const { userId, measureId } = req.params;
    await User.findByIdAndUpdate(userId, { $pull: { measures: measureId } });
    const measure = await Measure.findByIdAndDelete(measureId);
    for (let f of measure.images) {
        await cloudinary.uploader.destroy(f.filename)
    }
    req.flash('success', 'Successfully deleted')
    res.redirect(`/plan/${userId}`);
}

module.exports.renderNewMeasure = async (req, res) => {
    const { userId } = req.params;
    const user = await User.findById(userId);
    res.render('measureForms/addMeasures', { user })
}

module.exports.renderAllMeasurements = async (req, res) => {
    const { userId } = req.params;
    const user = await User.findById(userId).populate('measures');
    res.render('user/allMeasurements', { user })
}
