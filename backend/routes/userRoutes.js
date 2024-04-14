/**
 *  Routes for user
 * 
 */

const jsonschema = require("jsonschema");

const express = require('express');
const router = new express.Router();
const db = require("../db");
const User = require("../models/userModel");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");
const userUpdateSchema = require("../schemas/userUpdate.json");
const { BadRequestError } = require("../expressError");

/** GET / - get list of users. Logged in required
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 * 
 * Authorization required: login
 **/

router.get('/', ensureLoggedIn, async (req, res, next) => {
    try {
        let users = await User.all();
        return res.json({ users })
    } catch (e) {
        return next(e);
    }
});

/** GET /:username - get detail of user
 * 
 *  => {user: { username, first_name, last_name, email }}
 * 
 *  Authorization required: login
 */

router.get("/:username", ensureCorrectUser, async function (req, res, next) {
    try {
        let user = await User.get(req.params.username);
        return res.json({user});
    } catch (err) {
        return next(err);
    }
});

/** PATCH /[username] - Updates user's details
 * 
 *  => { user: { username, first_name, last_name, email }}
 * 
 *  Data can include:
 *      { first_name, last_name, password, email }
 * 
 *  Authorization required: login
 */

router.patch("/:username", ensureCorrectUser, async function (req, res, next) {
    try {
        // check if request is valid, if not throw error
        const validator = jsonschema.validate(req.body, userUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        // Once request is validated, update user details
        const user = await User.update(req.params.username, req.body);
        return res.json({ user });
    } catch (err) {
        return next(err);
    }
});

/** DELETE /[username] => { deleted: username }
 * 
 *  Only the user can delete their own account
 * 
 *  Authorization required: login
 */

router.delete("/:username", ensureCorrectUser, async function (req, res, next) {
    try {
        await User.remove(req.params.username);
        return res.json({deleted: req.params.username });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;