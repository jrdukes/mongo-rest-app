const express = require('express');
const Student = require('../models/Student');
const router = express.Router();

// Refactoring for async/await from https://github.com/AnnaCate/jrs-mongo-rest

// /students/
router
  .route('/')
  .get(function(request, response) {
    Student.find({}).then(function(students) {
      response.json({ status: 'ok', data: students });
    });
  })
  .post(function(request, response) {
    const rawStudent = request.body;

    const newStudent = new Student(rawStudent);

    newStudent.save();

    response.json({ status: 'ok', newStudent });
  });

// /students/:studentId

router
  .route('/:studentId')
  .get(function(request, response) {
    Student.findById(request.params.studentId).then(function(foundStudent) {
      response.json(foundStudent);
    });
  })
  .put(async (req, res) => {
    await Student.findById(req.params.studentId).then(foundStudent => {
      foundStudent.name = req.body.name;
      foundStudent.age = req.body.age;
      foundStudent.photoUrl = req.body.photoUrl;
      foundStudent.bio = req.body.bio;

      foundStudent.save();

      res.json(foundStudent);
    });
  })
  .delete(async (req, response) => {
    await Student.findByIdAndDelete(req.params.studentId).then(res => {
      response.json({ status: 'ok', res: req.params.studentId });
    });
  });

module.exports = router;
