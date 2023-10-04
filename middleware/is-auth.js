module.exports = (req, res, next) => {
    if (!req.session.isisVerified) {
        return res.redirect('/verify');
    }
    next();
}