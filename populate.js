var application_root  = __dirname,
express       = require('express'),
mongoose      = require('mongoose'),
models      = require('./models');


mongoose.connect("mongodb://localhost/tau");



function user (email, name) {
    var k = new models.User({email:email, password: "cmu", name: name});
    k.save(function (e) { console.log(k);});
    return k;
}

function file (path, slug) {
    var f = new models.File({name: slug, slug: slug,
                             path: (application_root + path),
                             timestamp: new Date()});
    f.save(function (e) { console.log(f);});
    return f;
}

function handle(user, file, c) {
    var a = new models.Assignment({name: "Final Project - "+ user.name, slug: "final_project",
                                  course: c, user: user});
    a.files.push(file._id);
    user.assignments.push(a._id);
    a.save(function (e) { console.log(a);});
    user.save(function (e) { console.log(e);});
    return a;
}

console.log("asdfasdf");
var c1 = new models.Course({name:"15-110", slug:"15-110"}),
u1 = user("o1@andrew.cmu.edu", "Omer1"), f1 = file("/data/handins/derp1.py", "derp1.py"),
u2 = user("o2@andrew.cmu.edu", "Omer2"), f2 = file("/data/handins/derp2.py", "derp2.py"),
u3 = user("o3@andrew.cmu.edu", "Omer3"), f3 = file("/data/handins/derp3.py", "derp3.py"),
u4 = user("o4@andrew.cmu.edu", "Omer4"), f4 = file("/data/handins/derp4.py", "derp4.py"),
u5 = user("o5@andrew.cmu.edu", "Omer5"), f5 = file("/data/handins/derp5.py", "derp5.py"),
u6 = user("o6@andrew.cmu.edu", "Omer6"), f6 = file("/data/handins/derp6.py", "derp6.py"),
h1 = handle(u1, f1, c1),
h2 = handle(u2, f2, c1),
h3 = handle(u3, f3, c1),
h4 = handle(u4, f4, c1),
h5 = handle(u5, f5, c1),
h6 = handle(u6, f6, c1),
koz = user("kosbie@andrew.cmu.edu", "Kosbie");

c1.staff.push(koz._id);
c1.students.push(u1._id);
c1.students.push(u2._id);
c1.students.push(u3._id);
c1.students.push(u4._id);
c1.students.push(u5._id);
c1.students.push(u6._id);
c1.assignments.push("final_project");
console.log("asdfasdf");

c1.save(function(e) {console.log(c1);});
