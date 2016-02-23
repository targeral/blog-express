var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;

 function checkLogin(req, res, next) {
    if(!req.session.user) {
      req.flash('error', '未登录');
      res.redirect('/login');
    }
    next();
  }
  function checkNotLogin(req, res, next) {
    if(req.session.user) {
      req.flash('error', '已登录');
      res.redirect('back');
    }
    next();
  }

   var OP = {
      op1:"HTML/CSS",
      op2:"CSS3/HTML5",
      op3:"javascript",
      op4:"design",
      op5:"nodejs",
      op6:"项目",
      op7:"随笔"
  };

app.get('/login', checkNotLogin);
  app.get('/login', function(req, res){
    res.render('login', {
      success:req.flash('success').toString(),
      error:req.flash('error').toString()
    });
  });
  app.post('/login', checkNotLogin);
  app.post('/login', function(req, res) {
    var md5 = crypto.createHash('md5');
    password = md5.update(req.body.pwd).digest('hex');
    console.log("alala");
    User.get(req.body.username, function(err, user) {
      console.log(u);
      if(!user) {
        req.flash('error', '亲，木有酱紫的人！');
        return res.redirect('/login');
      }
      if(user.password != password) {
        console.log(user);
        req.flash('error', '密码错误!');
        return res.redirect('/login');
      }
      console.log(user);
      req.session.user = user;
      req.flash('success', '登录成功!');
      res.redirect('/dashboard');
    });
  });
  app.get('/reg', checkNotLogin);
  app.get('/reg', function(req, res) {
    res.render('reg');
  });
  app.post('/reg', checkNotLogin);
  app.post('/reg', function(req, res) {
    var name = req.body.username,
    password = req.body.pwd,
    password_re = req.body['pwd-repeat'];
    if(password_re != password) {
      req.flash('error', '两次输入的密码不一致');
      return res.redirect('/reg');
    }
    var md5 = crypto.createHash('md5'),
    password = md5.update(req.body.pwd).digest('hex');
    var newUser = new User({
      name:name,
      password:password
    });
    User.get(newUser.name, function(err, user) {
      if(err) {
        req.flash('error', err);
        return res.redirect('/');
      }
      if(user) {
        req.flash('error', '用户已经存在');
        return res.redirect('/targeral');
      }
      newUser.save(function(err, user) {
        if(err) {
          req.flash('error', err);
          return res.redirect('/reg');
        }
        req.session.user = user;
        req.flash('success', '注册成功');
        res.redirect('/');
      });
    });
  });
  app.get('/logout', checkLogin);
  app.get('/logout', function(req, res) {
    req.session.user = null;
    req.flash('success', '登出成功');
    res.redirect('/');
  });

  app.get('/dashboard', checkLogin);
  app.get('/dashboard', function(req,res) {
    res.render('dashboard');
  });


app.get('/targeral', function (req, res) {
    var page = req.query.p ? parseInt(req.query.p) : 1;
    Blog.getTen(null, page, function(err,blogs, total){
      if(err) {
        blogs = [];
      }
      res.render('./blog/blog', {
        blogs:blogs,
        page:page,
        isFirstPage:(page-1) == 0,
        isLastPage:((page-1) * 5 + blogs.length) == total,
        Home_page:true
      });
    });
  });

app.get('/read', function(req,res) {
    Blog.get(null, function(err, blogs) {
      if(err) {
        posts = [];
      }
      res.render('read', {
        blogs:blogs
      })
    })
  });

 app.get('/blog-post', checkLogin);
  app.get('/blog-post', function(req, res) {
     Blog.getAll(null, function(err, blogs) {
        res.render('./blog/post', {
          blogs:blogs
        });
      });
  });

   app.post('/blog-post', checkLogin);
  app.post('/blog-post',function(req, res) {
    var author = "targeral";
    var blog = new Blog(req.body.title, author, req.body.content, OP[req.body.op]);
    blog.save(function(err) {
      if(err) {
       return res.redirect('/targeral');
     }
     res.redirect('/OK');
   });
  });

  app.get('/OK', function(req,res) {
    res.render('./blog/OK');
  });

  app.get('/upload', checkLogin);
  app.get('/upload', function(req, res){
    res.render('upload', {
      title:'文件上传',
      user: 'targeral',
    });
  });

  app.post('/upload', checkLogin);
  app.post('/upload', function(req, res) {
    res.redirect('/upload');
  });

   app.get('/:label', function(req, res) {
    var page = req.query.p ? parseInt(req.query.p) : 1;
    Blog.getLabel(OP[req.params.label], page, function(err, blogs, total) {
      if(err) {
        req.flash('error', err);
        return res.redirect('/targeral');
      }
      res.render('./blog/blog', {
        blogs:blogs,
        page:page,
        isFirstPage:(page-1) == 0,
        isLastPage:((page-1) * 5 + blogs.length) == total,
        Home_page:false
      });
    });
  });

    app.post('/search', function(req, res) {
    Blog.search(req.query.keyword, function(err, blogs) {
      if(err) {
        req.flash('error', err);
        return res.redirect('/targeral');
      }
      res.render('./blog/search', {
        title:"搜索结果" + req.query.keyword,
        blogs:blogs,
      });
    });
  });