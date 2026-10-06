const skills = [
    {skill: 'HTML', prof: true, id: 1},
    {skill: 'CSS', prof: true, id: 2},
    {skill: 'JavaScript', prof: true, id: 3},
];

module.exports = {
    getAll,
    getOne,
    create,
    deleteOne,
    update
}

function getAll(){
    return skills
}

function getOne(id){
    return skills.find(skill => skill.id === parseInt(id));
}

function create(body){
    // use the highest id + 1 so ids stay unique after a delete
    const id = skills.reduce((max, s) => Math.max(max, s.id), 0) + 1;
    const skill = {skill: body.skill, prof: false, id};
    skills.push(skill);
    return skill;
}

function deleteOne(id){
    const idx = skills.findIndex(skill => skill.id === parseInt(id));
    if (idx === -1) return false;
    skills.splice(idx, 1);
    return true;
}

function update(id, body){
    const skillObj = getOne(id);
    if (!skillObj) return null;
    // only the name can change, so the form cannot overwrite the id
    skillObj.skill = body.skill;
    return skillObj;
}
