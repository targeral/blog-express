document.onreadystatechange = function() {
    if(document.readyState == 'complete') {
        /*
        *点击博客“阅读全文”，全文出现，“阅读全文”变为收起全文.
         */
        var blog_content = document.getElementsByClassName("blog-btn");
            for(var i in blog_content) {
                blog_content[i].onclick = BlogContent;
            }
            function BlogContent() {
                var dataOff = this.getAttribute("data-off");
                console.log(typeof dataOff);
                if(dataOff == "true") {
                    showBlog(this);
                    this.setAttribute("data-off", "false");
                }else{
                    hideBlog(this);
                    this.setAttribute("data-off", "true");
                }
                return false;
            }
            function showBlog(node) {
                var blogContent = node.parentNode.getElementsByClassName("blog-content")[0];
                var opacity =  0;
                var show = setInterval(function(){
                    opacity = Show_opacity(opacity);
                }, 100);
                blogContent.style.display = "block";
                node.firstChild.nodeValue = "收起全文";
                function Show_opacity(opacity) {
                    opacity += 0.1;
                    blogContent.style.opacity = opacity;
                    if(opacity >= 1) {
                        blogContent.style.opacity = 1;
                        clearInterval(show);
                    }
                    return opacity;
                }
            }
            function hideBlog(node) {
                var blogContent = node.parentNode.getElementsByClassName("blog-content")[0];
                var opacity = 1;
                var hide = setInterval(function() {
                    opacity = Hide_opacity(opacity);
                },100);

                function Hide_opacity(opacity) {
                    opacity -= 0.1;
                    blogContent.style.opacity = opacity;
                    if(opacity <= 0) {
                        blogContent.style.opacity = 0;
                        clearInterval(hide);
                        blogContent.style.display = "none";
                        node.firstChild.nodeValue = "阅读全文";
                    }
                    return opacity;
                }
            }
    }
}