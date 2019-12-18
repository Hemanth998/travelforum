const express = require('express');
const slugify = require('slugify');

const {check,validationResult} = require('express-validator');
const router = express.Router();

const auth = require('../../middleware/auth');
const Post = require('../../models/Post');
const User = require('../../models/User');


//Get all posts test route

router.get('/', async (req,res) =>{
    const posts = await Post.find()
                            .populate('user',['userName','firstName'])
                            .populate('comments.user',['userName','firstName','userType'])
                            .populate('places.place',['placeName','urlSlug','placeDescription']);

    console.log(posts[0].places[0].place.placeDescription);
    res.json(posts);
});



//Insert New Post route
router.post('/',[
    auth,
    [
        check('title','Title cannot be empty')
        .not()
        .isEmpty(),
        check('content','COntent cannot be empty')
        .not()
        .isEmpty()
    ]

],
 async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()});
    }

    try {

    const {title,content,places} = req.body;
    const user = await User.findById(req.user.id).select('-password');

    const urlSlug = slugify(title,{remove: /[*+~.(),#^'"!:@]/g,lower:true});

    const isExist = await Post.findOne({urlSlug});

    if(isExist) {
        return res.status(400).json({errors : [ {msg: "Hii!!, A post with similar or same title already exists, theres no unique slug for the title, try changing few characters for the title for now, we are working to generate unique slugs for each post, Thanks!!"}]})
    }

    const newPost = new Post({
        user : req.user.id,
        userName : user.userName,
        title,
        urlSlug,
        content,
        places
    });
  
        await newPost.save();
        res.json({ msg :'Post Saved!'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server error');
    }  
})











//edit post route, only title,content,places are editable in UI.

router.put('/:id',auth,async (req,res) => {

    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({msg : 'Post Not Found!!'});
        }
        if(post.user.toString() !== req.user.id) {
            return res.status(401).json({msg : 'You are not authorized to edit,Only who posted can edit!!'});
        }

        await post.update(req.body);

        res.status(200).json({msg : 'Post Changes Saved!!!'});
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId'){
            return res.status(404).json({msg : 'Post Not Found!!'});
        }
        res.status(500).send('Internal Server error');
    }
})





//delete post route

router.delete('/:id',auth, async (req,res) => {
    try {
        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({msg : 'Post Not Found!!'});
        }

        if(post.user.toString() !== req.user.id) {
            return res.status(401).json({msg : 'You are not authorized to delete,Only who posted can delete!!'});
        }

        await post.remove();

        res.status(200).json({msg : 'Post Removed'});

    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId'){
            return res.status(404).json({msg : 'Post Not Found!!'});
        }
        res.status(500).send('Internal Server error');
    }
    
})

module.exports = router;
