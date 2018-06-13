var express=require("express"),
    app=express(),
    bodyparser=require("body-parser"),
    mongoose=require("mongoose"),
    methodOverride=require("method-override"),
    expressSanitizer=require("express-sanitizer");
    
//mongoose.connect("mongodb://localhost/blog-app");
//mongoose.connect(process.env.DATABASEURL);
mongoose.connect("mongodb://kk:kundankumar26@ds159020.mlab.com:59020/blogapp");
app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

var blogSchema=new mongoose.Schema({
    title: "string",
    image: "string",
    body: "string",
    created: {type: Date, default: Date.now}
});
var blog=mongoose.model("blog",blogSchema);

app.get("/",function(req, res) {
    res.redirect("/blog");
});
app.get("/blog", function(req, res){
    blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        } else{
            res.render("index", {blogs: blogs});
        }
    });
});
//new route
app.get("/blog/new", function(req, res){
    res.render("new");
});
//new post
app.post("/blog", function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    blog.create(req.body.blog, function(err, newblog){
        if(err){
            res.render("new");
        } else{
            res.redirect("/blog");
        }
    });
});
app.get("/blog/:id/edit",function(req, res) {
    blog.findById(req.params.id, function(err, foundblog){
        if(err){
            res.redirect("/blog");
        } else{
            res.render("edit",{blogs: foundblog});
        }
    });
});
app.get("/blog/:id",function(req, res){
    blog.findById(req.params.id, function(err, foundblog){
        if(err){
            console.log(err);
        } else{
            res.render("show",{blog: foundblog});
        }
    });
});
//upadte
app.put("/blog/:id",function(req, res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedblog){
       if(err){
           res.redirect("/blog");
       } else{
           res.redirect("/blog/"+ req.params.id);
       }
   });
});
//delete route
app.delete("/blog/:id", function(req, res){
    blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blog");
        }else{
            res.redirect("/blog");
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(error, response, body){
   console.log("server started"); 
});
    