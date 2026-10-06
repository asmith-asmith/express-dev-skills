const createError = require('http-errors');
const skillsDB = require('../models/skills');

module.exports = {
    index,
    showStuff,
    new: newSkill,
    create,
    delete: deleteSkill,
    edit,
    update
};

function index(req, res, next) {
    res.render('skills/index', {
        skills: skillsDB.getAll()
    })
};

function showStuff (req,res, next){
    const skill = skillsDB.getOne(req.params.id);
    if (!skill) return next(createError(404));
    res.render('skills/show', {skill});
};

function newSkill(req, res){
    res.render('skills/new')
}

function create(req, res){
    const name = (req.body.skill || '').trim();
    if (name) skillsDB.create({skill: name});
    res.redirect('/skills');
}

function deleteSkill(req,res, next){
    if (!skillsDB.deleteOne(req.params.id)) return next(createError(404));
    res.redirect('/skills');
}

function edit(req, res, next){
    const skill = skillsDB.getOne(req.params.id);
    if (!skill) return next(createError(404));
    res.render('skills/edit', {skill})
}

function update(req, res, next){
    const name = (req.body.skill || '').trim();
    if (!name) return res.redirect(`/skills/${req.params.id}/edit`);
    if (!skillsDB.update(req.params.id, {skill: name})) return next(createError(404));
    res.redirect(`/skills/${req.params.id}`);
}
