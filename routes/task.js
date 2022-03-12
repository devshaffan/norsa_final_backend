
const express = require('express');
const router = express.Router();
const task = require('../controllers/task');


router.get('/getAll', task.getAllTasks);
router.get('/getById/:id', task.getTaskById);
router.post('/create', task.create);
router.post('/update', task.upsertTask);
router.delete('/delete/:id', task.deleteTask);

module.exports = router;