const successHandler = require('../service/successHandler')
const errorHandler =require('../service/errorHandler')
const Post = require('../model/postModel')
// const User = require("../model/userModel")
const appError = require("../service/appError");

const opts = { runValidators: true, new: true }
const posts = {
    async getPosts(req, res) {
        const timeSort = req.query.timeSort == "asc" ? "-createdAt":"createdAt"
        const q = req.query.keyword !== undefined ? {content: new RegExp(req.query.keyword)} : {};
        console.log(q)
        const allPosts = await Post.find(q).populate({
            path: 'user', // refer to Schema item
            select: 'name avatar'
        }).sort(timeSort)
        successHandler(res, allPosts);
    },
    async createdPosts(req, res, next) {
        // try {
            const { body } = req
            if(body.content) {
                const newPost = await Post.create({
                    user: body.user,
                    tags: body.tags,
                    type: body.type,
                    image: body.image,
                    content: body.content,
                    likes: body.likes,
                    comments: body.comments
                })
                successHandler(res, newPost);
            } else {
                return next(appError(400,"You can't leave the 'content' field empty",next))
            }
        // } catch (error) {
        //     errorHandler(res,error);
        //     }
    },
    async delAllPost(req, res) {
        console.log(req.originalUrl)
        const delPosts = await Post.deleteMany({})
        successHandler(res);
    },
    async delSiglePost(req, res) {
        const id = req.params.id;
        console.log(id)
        // try {
            const deleteResult = await Post.findByIdAndDelete(id);
                if(deleteResult) {
                    successHandler(res, deleteResult)
                } else {
                    errorHandler(res, deleteResult)
                }
            // } catch(error){
            //     errorHandler(res, error)
            // }
    },
    async editPost(req, res, next) {
        const data = req.body;
        const id = req.params.id;
        // try {
            if (
                Object.keys(data).length === 0 ||
                (data.hasOwnProperty('content') && data.content === '') ||
                data.tags.length === 0) 
            {
                return next(appError(400,err,next))
            } else {
                const updateResult = await Post.findByIdAndUpdate(id,
                    {...data},
                    opts
                    )
                if (updateResult === null) {
                    // errorHandler(res, { message:"No such ID, please check again"})
                    return next(appError(400,"No such ID, please check again",next))
                    // return
                }
            successHandler(res, updateResult)        
            }
        // }catch(error){
        //     errorHandler(res, error)
        // }
    }
}

module.exports = posts