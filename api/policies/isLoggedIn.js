module.exports = function isLoggedIn(req,res,next){
	if(req.session.isLoggedIn) {
	 return next();
	}
	return res.redirect("/login");
};
