const successHandler = require('../service/successHandler')
const errorHandler =require('../service/errorHandler')
const Post = require('../model/post')

const opts = { runValidators: true }
const posts = {
    async getPosts(req, res) {
        const allPosts = await Post.find()
        successHandler(res, allPosts);
    },
    async createdPosts(req, res) {
        try {
            const { body } = req
            if(body.content) {
                const newPost = await Post.create({
                    name: body.name,
                    tags: body.tags,
                    type: body.type,
                    image: body.image,
                    content: body.content,
                    likes: body.likes,
                    comments: body.comments
                })
                successHandler(res, newPost);
            } else {
                errorHandler(res)
            }
        } catch (error) {
            errorHandler(res,error);
            }
    },
    async delAllPost(req, res) {
        const delPosts = await Post.deleteMany({})
        successHandler(res);
    },
    async delSiglePost(req, res) {
        const id = req.params.id;
        console.log(id)
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
    async editPost(req, res) {
        const data = req.body;
        const id = req.params.id;
        try {
            if (
                Object.keys(data).length === 0 ||
                (data.hasOwnProperty('content') && data.content === '') ||
                data.tags.length === 0
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

module.exports = posts