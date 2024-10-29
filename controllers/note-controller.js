const Note = require("../models/note-model");


// [GET] /note
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
        userId : req.cookies.tokenId,
    };

    const Notes = await Note.find(find);

    res.render("./pages/note/index", {
        pageTitle: "Note",
        Notes: Notes
    });
}

// [POST] /note/create
module.exports.create = async (req, res) => {
    if (!req.body.noteContent) {
        res.redirect("/note");
        return;
    }

    const note = new Note({
        content: req.body.noteContent,
        userId: req.cookies.tokenId
    });

    console.log(note);
    await note.save();
    res.redirect("/note");  
}

// [PATH] /note/edit/:id
module.exports.edit = async (req, res) => {
    if (!req.body.noteId) {
        res.redirect("/note");
        return;
    }

    let find = {
        deleted: false,
        _id : noteId,
    };

    await note.save();
    res.redirect("/note");
}

// [DELETE] /note/delete/:id
module.exports.delete = async (req, res) => {
    if (!req.body.noteId) {
        res.redirect("/note");
        return;
    }

    let find = {
        deleted: false,
        _id : noteId,
    };

    await note.delete();
    res.redirect("/note");
}