// 页面中所有的dom元素都加载完成再实现事件函数（index.js文件）
window.onload = function () {
    let bimgImgIndex = 0;

    //在前面调用在后面调用都可以，在前面调用是因为函数有预解析的功能
    navPathDataBind();
    //为了避免全局变量污染问题，根据功能划分为各种函数
    //路径导航的数据渲染
    function navPathDataBind() {
        /**
         * 思路：
         * 1. 先获取路径导航的页面元素（navPath）
         * 2.再获取所需要的数据（data.js-》gooddata.path）
         * 3.由于数据需要动态产生，那么对应的DOM元素也应该动态产生，含义需要根据数据的数量来进行创建DOM元素
         * 在遍历数据创建DOM元素的最后一条，只创建a标签，而不创建i标签
         */

        //1.获取页面导航的元素对象
        var navPath = document.querySelector('#wrapper #content .contentMain .navPath');

        //2.获取数据
        var path = goodData.path;

        //3.遍历数据
        for (var i = 0; i < path.length; i++) {

            if (i < path.length - 1) {
                //4.创建a标签
                var aNodes = document.createElement("a");
                aNodes.href = path[i].url;
                aNodes.innerText = path[i].title;

                //5.创建i标签
                var iNode = document.createElement('i');
                iNode.innerText = '/'

                //6.让navPath元素来追加a、i
                navPath.appendChild(aNodes);
                navPath.appendChild(iNode);
            } else {
                //7.只创建a标签
                var aNodes = document.createElement("a");
                aNodes.href = path[i].url;
                aNodes.innerText = path[i].title;

                //8.让navPath元素来追加a
                navPath.appendChild(aNodes);
            }

        }
    }

    bigClassBind()
    //放大镜的移入移出效果
    function bigClassBind() {
        /**
         * 思路：
         * 1. 获取小图框元素对象，并且设置移入事件（onmouseoover、onmouseenter）
         * onmouseoover与onmouseenter区别：前者有冒泡，影响父元素，后者没有。在这里鼠标移入不需要改变父元素
         * 2. 动态创建蒙版元素以及大图框和大图片元素
         * 3.移出时需要移除蒙版元素和大图框
         */
        // 1.获取小图框元素
        var smallPic = document.querySelector('#wrapper #content .contentMain #center #left #leftTop #smallPic');
        var leftTop = document.querySelector('#wrapper #content .contentMain #center #left #leftTop')

        //获取图片数据
        let imgagessrc = goodData.imagessrc;

        //2.设置移入事件
        smallPic.onmouseenter = function () {
            // 3.创建蒙版元素
            var maskDiv = document.createElement('div');
            //设置maskDiv属性class 但是class也是关键字 所以设置classname
            maskDiv.className = "mask";

            //4.创建大图框元素
            var bigPic = document.createElement('div');
            bigPic.id = "bigPic"

            //5.创建大图片元素
            var bigImg = document.createElement('img');
            bigImg.src = imgagessrc[bimgImgIndex].b;

            //6.大图框绑定大图片
            bigPic.appendChild(bigImg);
            //7.小图框追加蒙版元素
            smallPic.appendChild(maskDiv);
            //8.leftTop追加大图框
            leftTop.appendChild(bigPic);

            //移动事件
            smallPic.onmousemove = function (event) {
                //event.clientX: 鼠标点距离浏览器左侧x轴的值
                //getBoundingClientReact().left:小图框元素距离浏览器左侧可视left值
                //maskDiv.offsetWidth是蒙版元素宽度
                //蒙版到小图框左侧距离为=鼠标距离浏览器左侧x轴的值 - 小图框距离浏览器可视距离 - 蒙版元素宽度的一半
                var left = event.clientX - smallPic.getBoundingClientRect().left - maskDiv.offsetWidth / 2;
                var top = event.clientY - smallPic.getBoundingClientRect().top - maskDiv.offsetHeight / 2;

                //判断：小图框元素的宽度
                if (left < 0) { //左边值小于0
                    left = 0;
                } else if (left > smallPic.clientWidth - maskDiv.offsetWidth) { //右边的值 > 小图框元素的宽度 - 蒙版元素宽度 （等于小图框元素-蒙版元素的宽度之差）
                    left = smallPic.clientWidth - maskDiv.offsetWidth;
                }
                if (top < 0) { //上边值小于0
                    top = 0;
                } else if (top > smallPic.clientHeight - maskDiv.offsetHeight) { //上边的值 > 小图框元素的高度 - 蒙版元素高度 （等于小图框元素-蒙版元素的高度之差）
                    top = smallPic.clientHeight - maskDiv.offsetHeight;
                }
                //设置left和top属性
                maskDiv.style.top = top + "px";
                maskDiv.style.left = left + "px";

                //移动比 = 蒙版元素移动的距离 / 大图片元素移动的距离
                //蒙版元素移动的距离 = 小图框宽度 - 蒙版元素的宽度
                //大图片元素移动的距离 = 大图片宽度 - 大图框元素的宽度
                var scale = (smallPic.clientWidth - maskDiv.offsetWidth) / (bigImg.offsetWidth - bigPic.clientWidth);
                // console.log(scale); //0.495

                //设置大图框移动
                bigImg.style.left = -left / scale + "px";
                bigImg.style.top = -top / scale + "px";

            }

            //移出事件
            smallPic.onmouseleave = function () {
                //删除小图下的蒙版元素
                smallPic.removeChild(maskDiv);
                //删除leftTop下的大图元素
                leftTop.removeChild(bigPic);
            }
        }
    }


    thunbailData();
    //动态渲染放大镜缩略图的数据
    function thunbailData() {
        /**
         * 1.先获取picList元素下的ul
         * 2.在获取data.js文件下的goodData-》imagessrc
         * 3.遍历数组，根据数组的长度来创建li元素
         * 4.让ul遍历追加li
         */
        // 获取piclist下的ul
        var ul = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom #picList ul');

        //2.获取imagessrc数据
        var imagessrc = goodData.imagessrc;

        //3.遍历数组，根据数组的长度来创建li元素
        for (i = 0; i < imagessrc.length; i++) {
            //4.创建img标签
            var img = document.createElement('img');
            img.src = imagessrc[i].s;

            //5.创建li元素
            var li = document.createElement('li');

            //6.让li追加img元素
            li.appendChild(img);

            //7.让ul追加li元素
            ul.appendChild(li);
        }
    }

    thumbnailClick();
    //点击缩略图的效果
    function thumbnailClick() {
        /**
         * 思路：
         * 1.获取所有的li元素，并且循环发生点击事件
         * 2.点击缩略图需要确定其下标位置来找到对应小图路径和大图路径替换现有的src值
         */

        //1.获取所有的li元素
        var liNode = document.querySelectorAll('#wrapper #content .contentMain #center #left #leftBottom #picList ul li');
        // console.log(liNode);
        //获取小图元素
        var smallImg = document.querySelector("#wrapper #content .contentMain #center #left #leftTop #smallPic img");

        //获取图片
        var imagessrc = goodData.imagessrc;

        //2.循环点击缩略图 注册事件
        for (let i = 0; i < liNode.length; i++) {
            //在点击事件之前，给每个元素都添加上自定义的下标
            liNode[i].index = i;
            // 事件函数中的this永远指向的是实际发生事件的目标源对象
            liNode[i].onclick = function () {
                let idx = this.index;
                //变化小图路径
                smallImg.src = imagessrc[idx].b;
            }


        }
    }

    //点击缩略图左右箭头的效果
    thumbnailRightClick()
    function thumbnailRightClick() {
        /**
         * 思路：
         * 1.先获取左右两端的箭头按钮
         * 2.在获取可视的div以及ul元素和所有的li元素
         * 3.计算（发生起点、步长、总体运动的距离值）
         * 4.然后再发生点击事件
         */

        //获取左右两端的箭头元素
        // !!!坑 此处有一个class 用法为a.class
        let rightClick = document.querySelector("#wrapper #content .contentMain #center #left #leftBottom a.next");
        let leftClick = document.querySelector("#wrapper #content .contentMain #center #left #leftBottom a.prev")

        //在获取可视的div以及ul元素和所有的li元素
        let picList = document.querySelector("#wrapper #content .contentMain #center #left #leftBottom #picList")
        let ulNode = document.querySelector("#wrapper #content .contentMain #center #left #leftBottom #picList ul")
        let liNode = document.querySelectorAll("#wrapper #content .contentMain #center #left #leftBottom #picList ul li")

        //3.计算
        //起始
        let start = 0;
        //步长
        let step = (liNode[0].offsetWidth + 20) * 2;
        //总体的距离值=ul宽度-div框宽度=（图片的总数 - div中下显示的数量） * （li的宽度+20）
        let endPos = (liNode.length - 5) * (liNode[0].offsetWidth + 20);

        //4.发生点击事件
        leftClick.onclick = function () {
            start -= step;
            if (start < 0) {
                start = 0;
            }
            ulNode.style.left = -start + "px";
        }

        rightClick.onclick = function () {
            //每次点击start向右移
            start += step;
            //到了边界就不动
            if (start > endPos) {
                start = endPos;
            }
            //而图片条要向左移
            ulNode.style.left = -start + "px";
            //点击按钮不动 而且不打印x 可能是ul没有绝对定位 这里用的单位是px所以要绝对定位
            // console.log("x")
        }
    }
}