const express = require('express');
const router = express.Router();
const {getAllUsers, getUser, getUserById,createUser,updateUser,deleteUser, authorizeUser, authenticateToken, authorizeByRole} = require('../controller/product.controller.user.js');

// Place fixed routes BEFORE parameterized routes
router.post('/logins', authorizeUser);
router.post('/token', authenticateToken);
router.get('/logins', authenticateToken, getUser);

router.get('/', getAllUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', authenticateToken, authorizeByRole('admin'), deleteUser);
router.put('/logins/:id', authenticateToken, authorizeByRole('admin'), updateUser);
router.get('/:id', getUserById); // <-- parameterized route LAST

module.exports = router;
