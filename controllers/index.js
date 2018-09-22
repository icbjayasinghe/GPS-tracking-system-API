var express = require('express');
var router = express.Router();
var user  = require('./userController.js');
var auth = require('./auth.js');
var vehicle = require('./vehicleController.js');
var checkPointLocation = require('./checkPointLocation');


router.post('/login', auth.login);
router.post('/signup', user.register);
router.get('/api/v1/users', user.getAll);
router.get('/api/v1/user/:id', user.getOne);
router.get('/userByName/:name', user.findByName);

//access to the CheckPoint routes
router.use('/CheckPointLocation', checkPointLocation);

//vehicle related routes
router.post('/addVehicle',vehicle.addVehicle);
router.get('/viewVehicles',vehicle.viewAllVehicles);
router.put('/updateVehicle/:id',vehicle.vehicleUpdate);
router.delete('/deleteVehicle/:id',vehicle.vehicleDelete);


module.exports = router;