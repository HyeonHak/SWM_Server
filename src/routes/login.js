import express from 'express'
import {login} from '../controllers/login.controller'

const router = express.Router()
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./User.js');
let Pass = false;
const session = require('express-session');
const Status = require('../Model/DATA');
const machine_status = require('../Model/Machine_Status');

const UserSchema = mongoose.Schema({
    user_id: String,
    password: String
});


/* GET home page. */
router.get('/', (req, res, next) => {
    if(req.session.logined) {
        res.render('메인', { id: req.session.user_id });
    } else {
        res.render('로그인');
    }
});

router.get('/logout', (req, res, next) => {
    if(req.session.logined) {
        req.session.destroy();
    }
    Status.temp_Outer="",
    Status.temp_Inner= "",
    Status.humid_Outer= "",
    Status.humid_Inner = "",
    Status.pm10_Outer ="",
    Status.pm10_Inner = "",
    Status.pm25_Outer = "",
    Status.pm25_Inner = "",
    Status.voc_Outer ="",
    Status.voc_Inner = "",
    Status.co2_Outer = "",
    Status.co2_Inner = "",
    Status.year = "",
    Status.month = "",
    Status.date = "",
    Status.hours = "",
    Status.minute = "", 
    Status.second = "",
    Status.aircleanermode = "",
    Status.aircleanerspeed = "";

    machine_status.aircleaner_power = 0,
    machine_status.airconditioner_power = 0,
    machine_status.dehumidifier_power = 0,
    machine_status.airconditioner_mode = 0,

    machine_status.airconditioner_temp.cold_temp = 18,
    machine_status.airconditioner_temp.warm_temp = 13,
     
    machine_status.airconditioner_speed.cold_speed = 1,
    machine_status.airconditioner_speed.warm_speed = 1,
    machine_status.airconditioner_speed.dehumidity_speed = 1,
    machine_status.aircleaner_speed = 1,
    machine_status.dehumidifier_speed = 1,

    res.redirect('/');
});


router.post('/check',(req,res,next)=>{

    User.findOne({ id: req.body.id }, function(err, user) {
      if (err) throw err;
      else if(user == null) res.json({Pass});
      else{
        user.comparePassword(req.body.password, function(err, isMatch) {
            if (err) throw err;
            req.session.logined = true;
            req.session.user_id = req.body.id;
            res.json({isMatch});
        });
      }
  });


});
module.exports = router;

