const User = require('../models/user')
const objectId = require('mongoose').Types.ObjectId;
const { sign } = require('jsonwebtoken')
const { key } = require('../util')
const bcrypt = require("bcryptjs");
const expiresIn = 86400

class UserService {
    constructor() {
        this.userRepository = User
    }

    _generateToken(id) {
        return sign({ id }, key, {
            expiresIn: expiresIn
        });
    }

    _hideUserParams(user) {
        user.password = undefined
        user.isAdmin = undefined
        user.isActive = undefined
        return user
    }

    async authenticate(email, password) {
        const user = await this.userRepository.findOne({ email }).select("+password");
        if (!user) throw {
            code: 404,
            message: `User not found`
        }
        if (!(await bcrypt.compare(password, user.password)))
            throw {
                code: 400,
                message: `Invalid Password`
            }

        return { token: this._generateToken(user.id), user: this._hideUserParams(user), expiresIn }
    }

    async findAll() {
        const users = await this.userRepository.find();
        return users;
    }

    /**
    * Search for user id
    *
    * @param {ObjectId} id
    * @return {Promise<user>}
    */
    async findById(id) {
        if (!objectId.isValid(id))
            throw {
                code: 400,
                message: `Please provide a valid ID`
            }
        const user = await this.userRepository.findById(id)
        if (!user)
            throw {
                code: 404,
                message: `User ${id} not found`
            }
        return user;
    }

    /**
    * Search for user mail.
    * 
    * Throw error if user exists.
    *
    * @param {string} email
    * @return {Promise<user>}
    */
    async findByMail(email) {
        const user = await this.userRepository.findOne({ email })
        if (user) throw {
            code: 400,
            message: 'User already exists'
        }
    }

    /**
    * Create new user
    *
    * @param {object} params   
    * @return {Promise<user>}
    */
    async createUser(params = {}) {
        await this.findByMail(params.email)
        const user = await this.userRepository.create({ ...params, isAdmin: false })
        return { token: this._generateToken(user.id), user: this._hideUserParams(user), expiresIn }
    }

    /**
    * Create new admin
    *
    * @param {object} params   
    * @return {Promise<user>}
    */
    async createAdmin(params = {}) {
        await this.findByMail(params.email)
        const user = await this.userRepository
            .create({ ...params, isAdmin: true })
            .catch(error => {
                throw {
                    code: 400,
                    message: error.message
                }
            })
        return { token: this._generateToken(user.id), user: this._hideUserParams(user), expiresIn }
    }

    /**
    * Edit user
    *
    * @param {ObjectId} id     
    * @param {object} params   
    * @return {Promise<user>}
    */
    async update(id, params = {}) {
        const user = await this.findById(id)
        if (params.name)
            user.name = params.name
        if (params.email && params.email !== user.email) {
            await this.findByMail(params.email)
            user.email = params.email
        }
        await user.save()
        return user
    }

    /**
     * Delete user
     * 
     * @param {ObjectId} id   
     * @return {Promise<user>} 
     */
    async delete(id) {
        const user = await this.findById(id)
        user.isActive = false
        await user.save()
        return user
    }

    /**
        * Verify if some user is admin.
        * Throw error if is not admin
        *
        * @param {ObjectId} id
        */
    async isAdmin(id) {
        const user = await this.findById(id)
        if (!user.isAdmin)
            throw {
                code: 401,
                message: "Unauthorized"
            }
    }

    /**
        * Verify if some user is active.
        * Throw error if is not active
        *
        * @param {ObjectId} id
        */
    async isActive(id) {
        const user = await this.findById(id)
        if (!user.isActive)
            throw {
                code: 401,
                message: "Unauthorized"
            }
    }

    /**
        * Verify if some user is admin and active.
        * Throw error if is not admin or not active
        *
        * @param {ObjectId} id
        */
    async isActiveAdmin(id) {
        const user = await this.findById(id)
        if (!user.isActive || !user.isAdmin)
            throw {
                code: 401,
                message: "Unauthorized"
            }
    }

    /**
        * Verify if some user is user and active.
        * Throw error if is not user or not active
        *
        * @param {ObjectId} id
        */
    async isActiveUser(id) {
        const user = await this.findById(id)
        if (!user.isActive || user.isAdmin)
            throw {
                code: 401,
                message: "Unauthorized"
            }
    }
}

const userService = new UserService()

module.exports = userService