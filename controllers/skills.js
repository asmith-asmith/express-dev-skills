const skillsDB = require('../models/skills');

module.exports = {
    index,
    showStuff,
    new: newSkill,
    create,
    delete: deleteSkill,
    edit,
    // update
};

function index(req, res, next) {
    res.render('skills/index', {
        skills: skillsDB.getAll()
    })
};

function showStuff (req,res, next){
    res.render('skills/show', {
        skill: skillsDB.getOne(req.params.id)
    });
};

function newSkill(req, res){
    res.render('skills/new')
}

function create(req, res){
    skillsDB.create(req.body)
    res.redirect('/skills');
}

function deleteSkill(req,res){
    skillsDB.deleteOne(req.params.id);
    res.redirect('/skills');
}

function edit(req, res){
    console.log(req.params)
    const skill = skillsDB.getOne(req.params.id);
    res.render('skills/edit', {skill})
}

function update(req,res){
    skillsDB.update(req.params.id, req.body); // must send old id and new body (body of http request which is new skill)
    res.redirect(`skills/${req.params.id}`);
}