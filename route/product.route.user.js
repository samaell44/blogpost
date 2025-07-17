const express = require('express');
const router = express.Router();
const {getAllUsers, getUser, getUserById,createUser,updateUser,deleteUser, authorizeUser, authenticateToken } = require('../controller/product.controller.user.js');

// Place fixed routes BEFORE parameterized routes
router.post('/logins', authorizeUser);
router.post('/token', authenticateToken);
router.get('/logins', authenticateToken, getUser);

router.get('/', getAllUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.get('/:id', getUserById); // <-- parameterized route LAST

module.exports = router;
