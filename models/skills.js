const skills = [
    {skill: 'HTML', prof: 'true', id: 1},
    {skill: 'CSS', prof: 'true', id: 2},
    {skill: 'JavaScript', prof: 'true', id: 3},
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
    console.log(body)
    body.id = skills.length+1;
    body.prof = false;
    skills.push(body);
}

function deleteOne(id){
    const idx = skills.findIndex(skill => skill.id === parseInt(id));
    skills.splice(idx, 1);
}

function update(id, body){
    const skillObj = skills.find(s => s.id === parseInt(id));
    Object.assign(skillsObj, body);
}