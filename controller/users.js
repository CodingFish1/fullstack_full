const successHandler = require('../service/successHandler')
const errorHandler =require('../service/errorHandler')
const User = require("../model/userModel")
const appError = require("../service/appError");

const bcrypt = require('bcryptjs')
const validator = require('validator')

const {isAuth,generateSendJWT} = require('../service/auth');

const opts = { runValidators: true }
const users = {
    async getAllUsers(req, res) {
        const allUsers = await User.find();
        successHandler(res, allUsers);
    },
    async createdUser(req, res, next) {

            let {email, password, confirmPassword, name, avatar, gender} = req.body

            if(!email||!password||!confirmPassword||!name){
                return next(appError(400,"You can't leave the field empty",next))
            }

            if(password!==confirmPassword){
                return next(appError(400,"Two Passwords Must Be Same",next))
            }

            if(!validator.isLength(password,{min:8})){
                return next(appError(400,"The password is too short",next))
            }

            
            if(!validator.isEmail(email)){
                return next(appError(400,"Invalid E-Mail",next))
            }

            password = await bcrypt.hash(req.body.password,12)
            const newUser = await User.create({
                name,
                password,
                avatar,
                gender,
                email,
            })
            generateSendJWT(newUser,201,res)
            // successHandler(res, newUser);

    },

    async signinUser(req, res, next) {
        const { email, password } = req.body;
        if (!email || !password) {
          return next(appError( 400,'帳號密碼不可為空',next));
        }
        const user = await User.findOne({ email }).select('+password');
        const auth = await bcrypt.compare(password, user.password);
        if(!auth){
          return next(appError(400,'您的密碼不正確',next));
        }
        generateSendJWT(user,200,res);
    },

    async getUserProfile(req, res) {
        res.status(200).json({
            status:'success',
            user:req.user
        })
    },

    async updateUserProfile(req, res) {
        let {email, name, avatar, gender} = req.body

        const user = await User.findByIdAndUpdate(req.user.id,{
            email,
            name,
            avatar,
            gender
        })
        successHandler(res, user);
    },

    async updatePSW(req, res, next) {
        let {password, confirmPassword} = req.body
        if(password !== confirmPassword){
            return next(appError(400,"Different passwords",next))
        }

        newPassword = await bcrypt.hash(password,12)

        const user = await User.findByIdAndUpdate(req.user.id,{
            password:newPassword
        })

        generateSendJWT(user,200,res)
    },

    async follow(req,res,next) {
        if (req.params.id === req.user.id) {
            return next(appError(401,'You can not track youtself',next));
          }
        await User.updateOne(
            {
                _id: req.user.id,
                'following.user': { $ne: req.params.id }
            },
            {
                $addToSet: { following: { user: req.params.id } }
            }
          );
        await User.updateOne(
            {
                _id: req.params.id,
                'followers.user': { $ne: req.user.id }
            },
            {
                $addToSet: { followers: { user: req.user.id } }
            })

            successHandler(res, 'Follow Success');
},

    async unfollow(req,res,next) {
        unfollow = req.params.id
        if (req.params.id === req.user.id) {
            return next(appError(401,'You can not track youtself',next));
        }

        const findUser = await User.findById(unfollow);
        if (findUser === null) {
            return next(appError(401,'Target user does not exist',next));
        }


        await User.updateOne(
            {
                _id: req.user.id,
                'following.user': { $ne: req.params.id }
            },
            {
                $addToSet: { following: { user: req.params.id } }
            }
        );

        await User.updateOne(
            {
                _id: req.params.id,
                'followers.user': { $ne: req.user.id }
            },
            {
                $addToSet: { followers: { user: req.user.id } }
            })

            successHandler(res, 'Unfollow Success');
}

    // async delSigleUser(req, res) {
    //     const id = req.params.id;
    //     try {
    //         const deleteResult = await Post.findByIdAndDelete(id);
    //             if(deleteResult) {
    //                 successHandler(res, deleteResult)
    //             } else {
    //                 errorHandler(res, deleteResult)
    //             }
    //         } catch(error){
    //             errorHandler(res, error)
    //         }
    // },
    // async editUser(req, res) {
    //     const data = req.body;
    //     const id = req.params.id;
    //     try {
    //         if (
    //             Object.keys(data).length === 0 ||
    //             data.name === '' || data.email === ''
    //         ) {
    //             errorHandler(res)
    //         } else {
    //             const updateResult = await Post.findByIdAndUpdate(id,
    //                 {...data},
    //                 opts
    //                 )
    //             if (updateResult === null) {
    //                 errorHandler(res, "No such ID, please check again")
    //                 return
    //             }
    //         successHandler(res, updateResult)        
    //         }
    //     }catch(error){
    //         errorHandler(res, error)
    //     }
    // }
}

module.exports = users