import express from 'express';
const router = express.Router();
router.get('/login', (req, res) => {
    res.send('Hheelo ');
});
router.get('/logout', (req, res) => {
    res.send('Hheelo ');
});
router.get('/signup', (req, res) => {
    res.send('Hheelo ');
});
export default router;
