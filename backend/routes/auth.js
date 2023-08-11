const express = require("express");
const User = require("../model/User.js");
const bcrypt = require("bcrypt");

const router  = express.Router();

// register00
// router.post("/register" , async (req, res) => {
//     try {
//         const salt  = await bcrypt.genSalt(10);
//         const  hashedPass = await bcrypt.hash(req.body.password, salt);

//         const newUser = new User({
//             name: req.body.name,
//             email: req.body.email,
//             password: hashedPass,
//         });

//         const user = await newUser.save();
//         res.status(200).json(user);
//     } catch (error) {
//         console.log("error from router.post(/register",error);
//         res.status(500).json(error)
//     }
// })

// login

router.post("/register", async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email});

    if(user){
        return res.json({message:"User alreday exists!"});
    }

    const hashedPass = await bcrypt.hash(password, 9);

    const newUser = new User({email, password: hashedPass});
    await newUser.save(); 

    res.json({message:"New user registered successsfully"}); 

});

router.post("/login", async (req, res) => {
    try {
        const user  = await User.findOne({email:req.body.email});

        // if no user
        !user && res.status(400).json("No user found.");
        
        // if same user then validate password
        const validate = await bcrypt.compare(req.body.password, user.password);
        
        !validate && res.status(400).json("Wrong Cradentials");

        console.log("user=",user);
        const { password, ...other } = user._doc;
        res.status(200).json(other);

    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
});

// 

module.exports = router

// export { router as userRouter }