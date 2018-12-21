import express from 'express';
import checkauth from '../middlewar/check-auth';

const router = express.Router();

/* GET home page. */
router.get('/check-auth',checkauth, function(req, res) {
     return res.status(200).json({"auth":"success"})
  });

export default router; 