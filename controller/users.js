const successHandler = require('../service/successHandler')
const errorHandler =require('../service/errorHandler')
const User = require("../model/userModel")

const opts = { runValidators: true }
const users = {
    async getAllUsers(req, res) {
        const allUsers = await User.find();
        successHandler(res, allUsers);
    },
    async createdUser(req, res) {
        try {
            const { body } = req
            if(body.content) {
                const newUser = await User.create({
                    name: body.name,
                    email: body.email,
                    avatar: body.avatar,
                    gender: body.gender,
                })
                successHandler(res, newUser);
            } else {
                errorHandler(res)
            }
        } catch (error) {
            errorHandler(res,error);
            }
    },
    async delSigleUser(req, res) {
        const id = req.params.id;
        try {
            const deleteResult = await Post.findByIdAndDelete(id);
                if(deleteResult) {
                    successHandler(res, deleteResult)
                } else {
                    errorHandler(res, deleteResult)
                }
            } catch(error){
                errorHandler(res, error)
            }
    },
    async editUser(req, res) {
        const data = req.body;
        const id = req.params.id;
        try {
            if (
                Object.keys(data).length === 0 ||
                data.name === '' || data.email === ''
            ) {
                errorHandler(res)
            } else {
                const updateResult = await Post.findByIdAndUpdate(id,
                    {...data},
                    opts
                    )
                if (updateResult === null) {
                    errorHandler(res, "No such ID, please check again") 
                }
            successHandler(res, updateResult)        
            }
        }catch(error){
            errorHandler(res, error)
        }
    }
}

module.exports = users