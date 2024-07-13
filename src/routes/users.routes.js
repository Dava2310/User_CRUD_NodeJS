import {Router} from 'express'
import pool from '../database.js'
import {hashSync} from 'bcrypt'

const router = Router();

router.get('/add', (req, res) => {
    res.render('users/add');
})

router.post('/add', async(req, res) => {
    try {
        const {name, last_name, username, email, password} = req.body;

        const new_password = hashSync(password, 10);

        const newUser = {
            name,
            last_name,
            username,
            email,
            password: new_password
        }

        await pool.query('INSERT INTO users SET ?', [newUser]);
        res.redirect('/list')
    } catch (err) {
        res.status(500).json({message: err.message});
    }
})

router.get('/list', async(req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM users');
        res.render('users/list', {users: result});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.get('/edit/:id', async(req, res) => {
    try {

        const {id} = req.params;
        const [user] = await pool.query('SELECT * FROM users WHERE id =?', [id]);
        const userEdit = user[0];

        res.render('users/edit', {user: userEdit});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
})

router.post('/edit/:id', async(req, res) => {
    try {
        
        // Separating the data
        const {name, last_name, username, email} = req.body;
        const {id} = req.params;

        const updatedUser = {
            name,
            last_name,
            username,
            email
        }

        // Updating the user provided
        await pool.query('UPDATE users SET ? WHERE id =?', [updatedUser, id]);
        res.redirect('/list')
        
    } catch (err) {
        res.status(500).json({message: err.message});
    }

})

router.get('/delete/:id', async(req, res) => {
    try {
        const {id} = req.params;
        await pool.query('DELETE FROM users WHERE id =?', [id]);
        res.redirect('/list')
    } 
    catch (err) {
        res.status(500).json({message: err.message});
    }
})

export default router;