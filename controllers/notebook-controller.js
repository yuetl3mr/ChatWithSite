module.exports.index = async (req, res) => {
    res.render("./pages/notebook/index", {
        pageTitle: "Notebook",
    });
}