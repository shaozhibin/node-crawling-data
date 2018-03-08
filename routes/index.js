var express = require('express');
var router = express.Router();

// 加载http模块
var http = require('http');
// Cheerio 是一个Node.js的库， 它可以从html的片断中构建DOM结构，然后提供像jquery一样的css选择器查询
var cheerio = require('cheerio');

// 定义网络爬虫的目标地址：小猪短租的主页
var url = 'http://www.xiaozhu.com/'
var listData = [];

http.get(url, function(res) {
	var html = '';
    // 获取页面数据
    res.on('data', function(data) {
        html += data;
        // console.log('html:', html)
    });
    // 数据获取结束
    res.on('end', function() {s
        // 过滤html的信息
        listData = filterList(html);
        console.log('抓取数据成功！')
    });
}).on('error', function() {
    console.log('获取数据出错！');
});

/* 过滤页面信息 */
function filterList(html) {
    if (html) {
        // 沿用JQuery风格，定义$
        var $ = cheerio.load(html);
        // 根据class获取轮播图列表信息
        var rooms_show_ul = $('.rooms_show_ul');
        var data = [];

        /* 列表信息遍历 */
        rooms_show_ul.find('li').each(function(item) {
            var bgImg = $(this).find('.img_room').attr('lazy_src') || '';
            var avatar = $(this).find('.rooms_intro').find('img').attr('lazy_src') || '';
            var position = $(this).find('.img_room').attr('alt') || '';
            var room_name = $(this).find('.room_name').text() || '';

            data.push({
                bgImg: bgImg,
                avatar: avatar,
                position: position,
                room_name: room_name
            });
        });
        console.log("data:", data)
        return data;
    } else {
        console.log('无数据传入！');
    }
}


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '小猪短租', listData: listData });
});

module.exports = router;
