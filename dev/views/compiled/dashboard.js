window.templates = {};
templates["dashboard"] = function anonymous(locals, filters, escape, rethrow
/**/) {
escape = escape || function (html){
  return String(html)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/'/g, '&#39;')
    .replace(/"/g, '&quot;');
};
var __stack = { lineno: 1, input: "<!-- views/3d/header.ejs -->\r\n<% include ./header.ejs %>\r\n\r\n<div class=\"container\">\r\n\t<div class=\"row\">\r\n\t\t<nav class=\"navbar navbar-inverse\">\r\n\t\t\t<ul class=\"nav navbar-nav\">\r\n\t\t\t\t<li role=\"presentation\" class=\"active\"><a href=\"/dashboard\">Dashboard</a></li>\r\n\t\t\t\t<!-- <li role=\"presentation\"><a href=\"#\" id=\"find_game\">Find Game (1x1)</a></li> -->\r\n\t\t\t\t<!-- <li role=\"presentation\"><a href=\"/createGame\">Create Game</a></li> -->\r\n\t\t\t</ul>\r\n\r\n\t\t\t<ul class=\"nav navbar-nav pull-right\">\r\n\t\t\t\t<li role=\"presentation\"><a href=\"/logout\">Logout</a></li>\r\n\t\t\t</ul>\r\n\t\t</nav>\r\n\t</div>\r\n\r\n\t<div class=\"row\">\r\n\r\n\t\t<div class=\"col-md-9\">\r\n\t\t\t<div class=\"row\">\r\n\r\n\t\t\t\t<!-- chat -->\r\n\t\t\t\t<div class=\"col-lg-12 shadow-box\">\r\n\t\t\t\t\t<% include ./chat.ejs %>\r\n\t\t\t\t</div>\r\n\t\t\t\t<!-- end chat -->\r\n\r\n\t\t\t\t<!-- pers info -->\r\n\t\t\t\t<div class=\"col-lg-12 shadow-box padding-box dashboard-box\">\r\n\t\t\t\t\t<div class=\"row\">\r\n\t\t\t\t\t\t<div class=\"col-sm-2 text-center\">\r\n\t\t\t\t\t\t\t<span class=\"name\" id=\"ch-name\"></span>\r\n\t\t\t\t\t\t\t<img src=\"/images/characters/butterfly.jpg\" width=\"100%\">\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t<div class=\"col-sm-2\">\r\n\t\t\t\t\t\t\t<span class=\"title\">Statistics</span>\r\n\t\t\t\t\t\t\t<ul class=\"statistics\" id=\"ch-statistics\"></ul>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t<div class=\"col-sm-6\">\r\n\t\t\t\t\t\t\t<span class=\"title\">Skills</span>\r\n\t\t\t\t\t\t\t&nbsp; <a href=\"#\" class=\"btn btn-dark btn-xs\" id=\"skills-tree\">[skills-tree]</a>\r\n\t\t\t\t\t\t\t<ul class=\"skills\" id=\"user-skills\"></ul>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t<div class=\"col-sm-12 text-right\">\r\n\t\t\t\t\t\t\t<a href=\"/3dscene\" class=\"btn btn-dark btn-dark-red\">Single Game</a>\r\n\t\t\t\t\t\t\t<a href=\"#\" class=\"btn btn-dark btn-dark-red\" id=\"find_game\">Find Game (1x1)</a>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</div>\r\n\r\n\t\t\t\t</div>\r\n\t\t\t\t<!-- end pers info -->\r\n\r\n\t\t\t</div>\r\n\t\t</div>\r\n\r\n\t\t<!-- users list -->\r\n\t\t<div class=\"col-md-3 shadow-box\">\r\n\t\t\t<ul class=\"tabs\">\r\n\t\t\t\t<li class=\"active\">All</li>\r\n\t\t\t\t<li>Friends</li>\r\n\t\t\t\t<li>Party</li>\r\n\t\t\t</ul>\r\n\t\t\t<div class=\"users-list mrScrollbar\" id=\"users-list\" data-mcs-theme=\"dark\">\r\n\t\t\t\t<ul>\r\n\t\t\t\t\t<li>\r\n\t\t\t\t\t\t<span class=\"avatar\"><img src=\"/images/characters/butterfly.jpg\" width=\"100%\"></span>\r\n\t\t\t\t\t\t<span class=\"name\">sgvcoder</span>\r\n\t\t\t\t\t</li>\r\n\t\t\t\t\t<li>\r\n\t\t\t\t\t\t<span class=\"avatar\"><img src=\"/images/characters/butterfly.jpg\" width=\"100%\"></span>\r\n\t\t\t\t\t\t<span class=\"name\">sgvcoder</span>\r\n\t\t\t\t\t</li>\r\n\t\t\t\t\t<li>\r\n\t\t\t\t\t\t<span class=\"avatar\"><img src=\"/images/characters/butterfly.jpg\" width=\"100%\"></span>\r\n\t\t\t\t\t\t<span class=\"name\">sgvcoder</span>\r\n\t\t\t\t\t</li>\r\n\t\t\t\t\t<li>\r\n\t\t\t\t\t\t<span class=\"avatar\"><img src=\"/images/characters/butterfly.jpg\" width=\"100%\"></span>\r\n\t\t\t\t\t\t<span class=\"name\">sgvcoder</span>\r\n\t\t\t\t\t</li>\r\n\t\t\t\t\t<li>\r\n\t\t\t\t\t\t<span class=\"avatar\"><img src=\"/images/characters/butterfly.jpg\" width=\"100%\"></span>\r\n\t\t\t\t\t\t<span class=\"name\">sgvcoder</span>\r\n\t\t\t\t\t</li>\r\n\t\t\t\t\t<li>\r\n\t\t\t\t\t\t<span class=\"avatar\"><img src=\"/images/characters/butterfly.jpg\" width=\"100%\"></span>\r\n\t\t\t\t\t\t<span class=\"name\">sgvcoder</span>\r\n\t\t\t\t\t</li>\r\n\t\t\t\t\t<li>\r\n\t\t\t\t\t\t<span class=\"avatar\"><img src=\"/images/characters/butterfly.jpg\" width=\"100%\"></span>\r\n\t\t\t\t\t\t<span class=\"name\">sgvcoder</span>\r\n\t\t\t\t\t</li>\r\n\t\t\t\t\t<li>\r\n\t\t\t\t\t\t<span class=\"avatar\"><img src=\"/images/characters/butterfly.jpg\" width=\"100%\"></span>\r\n\t\t\t\t\t\t<span class=\"name\">sgvcoder</span>\r\n\t\t\t\t\t</li>\r\n\t\t\t\t\t<li>\r\n\t\t\t\t\t\t<span class=\"avatar\"><img src=\"/images/characters/butterfly.jpg\" width=\"100%\"></span>\r\n\t\t\t\t\t\t<span class=\"name\">sgvcoder</span>\r\n\t\t\t\t\t</li>\r\n\t\t\t\t\t<li>\r\n\t\t\t\t\t\t<span class=\"avatar\"><img src=\"/images/characters/butterfly.jpg\" width=\"100%\"></span>\r\n\t\t\t\t\t\t<span class=\"name\">sgvcoder</span>\r\n\t\t\t\t\t</li>\r\n\t\t\t\t\t<li>\r\n\t\t\t\t\t\t<span class=\"avatar\"><img src=\"/images/characters/butterfly.jpg\" width=\"100%\"></span>\r\n\t\t\t\t\t\t<span class=\"name\">sgvcoder</span>\r\n\t\t\t\t\t</li>\r\n\t\t\t\t\t<li>\r\n\t\t\t\t\t\t<span class=\"avatar\"><img src=\"/images/characters/butterfly.jpg\" width=\"100%\"></span>\r\n\t\t\t\t\t\t<span class=\"name\">sgvcoder</span>\r\n\t\t\t\t\t</li>\r\n\t\t\t\t</ul>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t<!-- end users list -->\r\n\r\n\t</div>\r\n\r\n\t<!-- <div class=\"row hidden\">\r\n\t\t<div class=\"col-lg-12 shadow-box upgrade-box\">\r\n\r\n\t\t\t<span class=\"title\">Upgrade Page</span>\r\n\r\n\t\t\t<div class=\"row\">\r\n\t\t\t\t<div class=\"col-md-6\">\r\n\t\t\t\t\t<div class=\"item-box\">\r\n\t\t\t\t\t\t<img src=\"../../public/images/items/crystal_1.png\">\r\n\t\t\t\t\t\t<span>[name 1]</span>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<div class=\"item-box\">\r\n\t\t\t\t\t\t<img src=\"../../public/images/items/crystal_2.png\">\r\n\t\t\t\t\t\t<span>[name 2]</span>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\r\n\t\t\t<br>\r\n\r\n\t\t\t<div class=\"row\">\r\n\t\t\t\t<div class=\"col-lg-12\">\r\n\t\t\t\t\t<div class=\"tree\">\r\n\t\t\t\t\t\t<ul>\r\n\t\t\t\t\t\t\t<li>\r\n\t\t\t\t\t\t\t\t<div class=\"energy fire\">\r\n\t\t\t\t\t\t\t\t\t<img src=\"../../public/images/items/fire.png\">\r\n\t\t\t\t\t\t\t\t\t<div>\r\n\t\t\t\t\t\t\t\t\t\t<span>fire</span>\r\n\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t<ul>\r\n\t\t\t\t\t\t\t\t\t<li>\r\n\t\t\t\t\t\t\t\t\t\t<div class=\"energy fire\">\r\n\t\t\t\t\t\t\t\t\t\t\t<img src=\"../../public/images/items/fire.png\">\r\n\t\t\t\t\t\t\t\t\t\t\t<div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<span>fire</span>\r\n\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t<ul>\r\n\t\t\t\t\t\t\t\t\t\t\t<li>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"energy fire\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t<img src=\"../../public/images/items/fire.png\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t<div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span>fire</span>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t\t\t\t\t\t<li>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"energy fire\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t<img src=\"../../public/images/items/fire.png\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t<div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span>fire</span>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t\t\t\t\t</ul>\r\n\t\t\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t\t\t</ul>\r\n\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t\t<li>\r\n\t\t\t\t\t\t\t\t<div class=\"energy water\">\r\n\t\t\t\t\t\t\t\t\t<img src=\"../../public/images/items/water.png\">\r\n\t\t\t\t\t\t\t\t\t<div>\r\n\t\t\t\t\t\t\t\t\t\t<span>water</span>\r\n\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t<ul>\r\n\t\t\t\t\t\t\t\t\t<li>\r\n\t\t\t\t\t\t\t\t\t\t<div class=\"energy water\">\r\n\t\t\t\t\t\t\t\t\t\t\t<img src=\"../../public/images/items/water.png\">\r\n\t\t\t\t\t\t\t\t\t\t\t<div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<span>water</span>\r\n\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t<ul>\r\n\t\t\t\t\t\t\t\t\t\t\t<li>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"energy water\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t<img src=\"../../public/images/items/water.png\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t<div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span>water</span>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t\t\t\t\t\t<li>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"energy water\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t<img src=\"../../public/images/items/water.png\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t<div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span>water</span>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t\t\t\t\t</ul>\r\n\t\t\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t\t\t</ul>\r\n\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t\t<li>\r\n\t\t\t\t\t\t\t\t<div class=\"energy earth\">\r\n\t\t\t\t\t\t\t\t\t<img src=\"../../public/images/items/earth.png\">\r\n\t\t\t\t\t\t\t\t\t<div>\r\n\t\t\t\t\t\t\t\t\t\t<span>water</span>\r\n\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t<ul>\r\n\t\t\t\t\t\t\t\t\t<li>\r\n\t\t\t\t\t\t\t\t\t\t<div class=\"energy earth\">\r\n\t\t\t\t\t\t\t\t\t\t\t<img src=\"../../public/images/items/earth.png\">\r\n\t\t\t\t\t\t\t\t\t\t\t<div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<span>water</span>\r\n\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t<ul>\r\n\t\t\t\t\t\t\t\t\t\t\t<li>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"energy earth\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t<img src=\"../../public/images/items/earth.png\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t<div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span>water</span>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t\t\t\t\t\t<li>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"energy earth\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t<img src=\"../../public/images/items/earth.png\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t<div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span>water</span>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t\t\t\t\t</ul>\r\n\t\t\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t\t\t\t<li>\r\n\t\t\t\t\t\t\t\t\t\t<div class=\"energy earth\">\r\n\t\t\t\t\t\t\t\t\t\t\t<img src=\"../../public/images/items/earth.png\">\r\n\t\t\t\t\t\t\t\t\t\t\t<div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<span>water</span>\r\n\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t<ul>\r\n\t\t\t\t\t\t\t\t\t\t\t<li>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"energy earth\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t<img src=\"../../public/images/items/earth.png\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t<div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span>water</span>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t\t\t\t\t\t<li>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"energy earth\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t<img src=\"../../public/images/items/earth.png\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t<div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span>water</span>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t\t\t\t\t</ul>\r\n\t\t\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t\t\t</ul>\r\n\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t</ul>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\r\n\t\t\t<hr>\r\n\r\n\t\t\t<div class=\"row\">\r\n\t\t\t\t<div class=\"col-md-12 text-center\">\r\n\t\t\t\t\t<div class=\"energy fire\">\r\n\t\t\t\t\t\t<img src=\"../../public/images/items/fire.png\">\r\n\t\t\t\t\t\t<div>\r\n\t\t\t\t\t\t\t<span>fire</span>\r\n\t\t\t\t\t\t\t<span>10pcs</span>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<div class=\"energy water\">\r\n\t\t\t\t\t\t<img src=\"../../public/images/items/water.png\">\r\n\t\t\t\t\t\t<div>\r\n\t\t\t\t\t\t\t<span>water</span>\r\n\t\t\t\t\t\t\t<span>10pcs</span>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<div class=\"energy earth\">\r\n\t\t\t\t\t\t<img src=\"../../public/images/items/earth.png\">\r\n\t\t\t\t\t\t<div>\r\n\t\t\t\t\t\t\t<span>earth</span>\r\n\t\t\t\t\t\t\t<span>10pcs</span>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<div class=\"energy wind\">\r\n\t\t\t\t\t\t<img src=\"../../public/images/items/wind.png\">\r\n\t\t\t\t\t\t<div>\r\n\t\t\t\t\t\t\t<span>wind</span>\r\n\t\t\t\t\t\t\t<span>10pcs</span>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<div class=\"energy light\">\r\n\t\t\t\t\t\t<img src=\"../../public/images/items/light.png\">\r\n\t\t\t\t\t\t<div>\r\n\t\t\t\t\t\t\t<span>light</span>\r\n\t\t\t\t\t\t\t<span>10pcs</span>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<div class=\"energy darkness\">\r\n\t\t\t\t\t\t<img src=\"../../public/images/items/darkness.png\">\r\n\t\t\t\t\t\t<div>\r\n\t\t\t\t\t\t\t<span>darkness</span>\r\n\t\t\t\t\t\t\t<span>10pcs</span>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<div class=\"energy metal\">\r\n\t\t\t\t\t\t<img src=\"../../public/images/items/metal.png\">\r\n\t\t\t\t\t\t<div>\r\n\t\t\t\t\t\t\t<span>metal</span>\r\n\t\t\t\t\t\t\t<span>10pcs</span>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<div class=\"energy blood\">\r\n\t\t\t\t\t\t<img src=\"../../public/images/items/blood.png\">\r\n\t\t\t\t\t\t<div>\r\n\t\t\t\t\t\t\t<span>blood</span>\r\n\t\t\t\t\t\t\t<span>10pcs</span>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\r\n\t\t</div>\r\n\t</div>\r\n</div> -->\r\n\r\n<!-- views/3d/footer.ejs -->\r\n<% include ./footer.ejs %>\r\n<script src=\"/js/3dgame/index.js\"></script>\r\n<script src=\"/js/3dgame/dashboard.js\"></script>\r\n", filename: "D:\\server\\nodejs\\MRgame\\dev\\views\\3d\\dashboard.ejs" };
function rethrow(err, str, filename, lineno){
  var lines = str.split('\n')
    , start = Math.max(lineno - 3, 0)
    , end = Math.min(lines.length, lineno + 3);

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? ' >> ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'ejs') + ':'
    + lineno + '\n'
    + context + '\n\n'
    + err.message;

  throw err;
}
try {
var buf = [];
with (locals || {}) { (function(){ 
 buf.push('<!-- views/3d/header.ejs -->\n' + (function(){var buf = [];
 buf.push('<html lang="en">\n	<head>\n		<meta charset=\'utf-8\'>\n		<link rel="stylesheet" type="text/css" href="/libs/bootstrap.min.css">\n		<link rel="stylesheet" type="text/css" href="/libs/bootstrap-theme.min.css">\n		<link rel="stylesheet" type="text/css" href="/libs/scrollbar/jquery.mCustomScrollbar.min.css">\n		<link rel="stylesheet" type="text/css" href="/libs/jquery.contextMenu.min.css">\n		<link rel="stylesheet" type="text/css" href="/css/game.css">\n	</head>\n	<body>\n		<div id="wrap-mrScrollbar" class="mrScrollbar" data-mcs-theme="dark">');
return buf.join('');})() + '\n\n<div class="container">\n	<div class="row">\n		<nav class="navbar navbar-inverse">\n			<ul class="nav navbar-nav">\n				<li role="presentation" class="active"><a href="/dashboard">Dashboard</a></li>\n				<!-- <li role="presentation"><a href="#" id="find_game">Find Game (1x1)</a></li> -->\n				<!-- <li role="presentation"><a href="/createGame">Create Game</a></li> -->\n			</ul>\n\n			<ul class="nav navbar-nav pull-right">\n				<li role="presentation"><a href="/logout">Logout</a></li>\n			</ul>\n		</nav>\n	</div>\n\n	<div class="row">\n\n		<div class="col-md-9">\n			<div class="row">\n\n				<!-- chat -->\n				<div class="col-lg-12 shadow-box">\n					' + (function(){var buf = [];
 buf.push('<ul class="tabs">\n	<li class="active">Public</li>\n	<li>Service</li>\n	<li>Service 2</li>\n	<li>Service 3</li>\n	<li>Service 4</li>\n</ul>\n\n<div class="tab-public">\n	<div class="chat-area mrScrollbar" data-mcs-theme="dark">\n		<ul>\n			<li>\n				<span class="name">sgvcoder</span>\n				<span class="msg">message</span>\n				<span class="time">19:20:56</span>\n			</li>\n			<li>\n				<span class="name">sgvcoder</span>\n				<span class="msg">message</span>\n				<span class="time">19:20:56</span>\n			</li>\n			<li>\n				<span class="name you">you</span>\n				<span class="msg">message</span>\n				<span class="time">19:20:56</span>\n			</li>\n			<li>\n				<span class="name pm">pm: sgvcoder</span>\n				<span class="msg">message</span>\n				<span class="time">19:20:56</span>\n			</li>\n			<li>\n				<span class="name">sgvcoder</span>\n				<span class="msg">message</span>\n				<span class="time">19:20:56</span>\n			</li>\n			<li>\n				<span class="name party">party: sgvcoder</span>\n				<span class="msg">message</span>\n				<span class="time">19:20:56</span>\n			</li>\n			<li>\n				<span class="name">sgvcoder</span>\n				<span class="msg">message</span>\n				<span class="time">19:20:56</span>\n			</li>\n			<li>\n				<span class="name">sgvcoder</span>\n				<span class="msg">message</span>\n				<span class="time">19:20:56</span>\n			</li>\n			<li>\n				<span class="name">sgvcoder</span>\n				<span class="msg">message message message message message message message message message message message message message message message message message message message</span>\n				<span class="time">19:20:56</span>\n			</li>\n			<li>\n				<span class="name">sgvcoder</span>\n				<span class="msg">message</span>\n				<span class="time">19:20:56</span>\n			</li>\n			<li>\n				<span class="name">sgvcoder</span>\n				<span class="msg">message</span>\n				<span class="time">19:20:56</span>\n			</li>\n			<li>\n				<span class="name">sgvcoder</span>\n				<span class="msg">message</span>\n				<span class="time">19:20:56</span>\n			</li>\n			<li>\n				<span class="name">sgvcoder</span>\n				<span class="msg">message</span>\n				<span class="time">19:20:56</span>\n			</li>\n			<li>\n				<span class="name">sgvcoder</span>\n				<span class="msg">message</span>\n				<span class="time">19:20:56</span>\n			</li>\n			<li>\n				<span class="name">sgvcoder</span>\n				<span class="msg">message</span>\n				<span class="time">19:20:56</span>\n			</li>\n			<li>\n				<span class="name">sgvcoder</span>\n				<span class="msg">message</span>\n				<span class="time">19:20:56</span>\n			</li>\n			<li>\n				<span class="name">sgvcoder</span>\n				<span class="msg">message</span>\n				<span class="time">19:20:56</span>\n			</li>\n			<li>\n				<span class="name">sgvcoder</span>\n				<span class="msg">message</span>\n				<span class="time">19:20:56</span>\n			</li>\n		</ul>\n	</div>\n	<div class="chat-nav">\n		<input type="text" name="message" placeholder="Enter your message"></input>\n		<a href="#" class="chat-submit">Send</a>\n	</div>\n</div>\n');
return buf.join('');})() + '\n				</div>\n				<!-- end chat -->\n\n				<!-- pers info -->\n				<div class="col-lg-12 shadow-box padding-box dashboard-box">\n					<div class="row">\n						<div class="col-sm-2 text-center">\n							<span class="name" id="ch-name"></span>\n							<img src="/images/characters/butterfly.jpg" width="100%">\n						</div>\n						<div class="col-sm-2">\n							<span class="title">Statistics</span>\n							<ul class="statistics" id="ch-statistics"></ul>\n						</div>\n						<div class="col-sm-6">\n							<span class="title">Skills</span>\n							&nbsp; <a href="#" class="btn btn-dark btn-xs" id="skills-tree">[skills-tree]</a>\n							<ul class="skills" id="user-skills"></ul>\n						</div>\n						<div class="col-sm-12 text-right">\n							<a href="/3dscene" class="btn btn-dark btn-dark-red">Single Game</a>\n							<a href="#" class="btn btn-dark btn-dark-red" id="find_game">Find Game (1x1)</a>\n						</div>\n					</div>\n\n				</div>\n				<!-- end pers info -->\n\n			</div>\n		</div>\n\n		<!-- users list -->\n		<div class="col-md-3 shadow-box">\n			<ul class="tabs">\n				<li class="active">All</li>\n				<li>Friends</li>\n				<li>Party</li>\n			</ul>\n			<div class="users-list mrScrollbar" id="users-list" data-mcs-theme="dark">\n				<ul>\n					<li>\n						<span class="avatar"><img src="/images/characters/butterfly.jpg" width="100%"></span>\n						<span class="name">sgvcoder</span>\n					</li>\n					<li>\n						<span class="avatar"><img src="/images/characters/butterfly.jpg" width="100%"></span>\n						<span class="name">sgvcoder</span>\n					</li>\n					<li>\n						<span class="avatar"><img src="/images/characters/butterfly.jpg" width="100%"></span>\n						<span class="name">sgvcoder</span>\n					</li>\n					<li>\n						<span class="avatar"><img src="/images/characters/butterfly.jpg" width="100%"></span>\n						<span class="name">sgvcoder</span>\n					</li>\n					<li>\n						<span class="avatar"><img src="/images/characters/butterfly.jpg" width="100%"></span>\n						<span class="name">sgvcoder</span>\n					</li>\n					<li>\n						<span class="avatar"><img src="/images/characters/butterfly.jpg" width="100%"></span>\n						<span class="name">sgvcoder</span>\n					</li>\n					<li>\n						<span class="avatar"><img src="/images/characters/butterfly.jpg" width="100%"></span>\n						<span class="name">sgvcoder</span>\n					</li>\n					<li>\n						<span class="avatar"><img src="/images/characters/butterfly.jpg" width="100%"></span>\n						<span class="name">sgvcoder</span>\n					</li>\n					<li>\n						<span class="avatar"><img src="/images/characters/butterfly.jpg" width="100%"></span>\n						<span class="name">sgvcoder</span>\n					</li>\n					<li>\n						<span class="avatar"><img src="/images/characters/butterfly.jpg" width="100%"></span>\n						<span class="name">sgvcoder</span>\n					</li>\n					<li>\n						<span class="avatar"><img src="/images/characters/butterfly.jpg" width="100%"></span>\n						<span class="name">sgvcoder</span>\n					</li>\n					<li>\n						<span class="avatar"><img src="/images/characters/butterfly.jpg" width="100%"></span>\n						<span class="name">sgvcoder</span>\n					</li>\n				</ul>\n			</div>\n		</div>\n		<!-- end users list -->\n\n	</div>\n\n	<!-- <div class="row hidden">\n		<div class="col-lg-12 shadow-box upgrade-box">\n\n			<span class="title">Upgrade Page</span>\n\n			<div class="row">\n				<div class="col-md-6">\n					<div class="item-box">\n						<img src="../../public/images/items/crystal_1.png">\n						<span>[name 1]</span>\n					</div>\n					<div class="item-box">\n						<img src="../../public/images/items/crystal_2.png">\n						<span>[name 2]</span>\n					</div>\n				</div>\n			</div>\n\n			<br>\n\n			<div class="row">\n				<div class="col-lg-12">\n					<div class="tree">\n						<ul>\n							<li>\n								<div class="energy fire">\n									<img src="../../public/images/items/fire.png">\n									<div>\n										<span>fire</span>\n									</div>\n								</div>\n								<ul>\n									<li>\n										<div class="energy fire">\n											<img src="../../public/images/items/fire.png">\n											<div>\n												<span>fire</span>\n											</div>\n										</div>\n										<ul>\n											<li>\n												<div class="energy fire">\n													<img src="../../public/images/items/fire.png">\n													<div>\n														<span>fire</span>\n													</div>\n												</div>\n											</li>\n											<li>\n												<div class="energy fire">\n													<img src="../../public/images/items/fire.png">\n													<div>\n														<span>fire</span>\n													</div>\n												</div>\n											</li>\n										</ul>\n									</li>\n								</ul>\n							</li>\n							<li>\n								<div class="energy water">\n									<img src="../../public/images/items/water.png">\n									<div>\n										<span>water</span>\n									</div>\n								</div>\n								<ul>\n									<li>\n										<div class="energy water">\n											<img src="../../public/images/items/water.png">\n											<div>\n												<span>water</span>\n											</div>\n										</div>\n										<ul>\n											<li>\n												<div class="energy water">\n													<img src="../../public/images/items/water.png">\n													<div>\n														<span>water</span>\n													</div>\n												</div>\n											</li>\n											<li>\n												<div class="energy water">\n													<img src="../../public/images/items/water.png">\n													<div>\n														<span>water</span>\n													</div>\n												</div>\n											</li>\n										</ul>\n									</li>\n								</ul>\n							</li>\n							<li>\n								<div class="energy earth">\n									<img src="../../public/images/items/earth.png">\n									<div>\n										<span>water</span>\n									</div>\n								</div>\n								<ul>\n									<li>\n										<div class="energy earth">\n											<img src="../../public/images/items/earth.png">\n											<div>\n												<span>water</span>\n											</div>\n										</div>\n										<ul>\n											<li>\n												<div class="energy earth">\n													<img src="../../public/images/items/earth.png">\n													<div>\n														<span>water</span>\n													</div>\n												</div>\n											</li>\n											<li>\n												<div class="energy earth">\n													<img src="../../public/images/items/earth.png">\n													<div>\n														<span>water</span>\n													</div>\n												</div>\n											</li>\n										</ul>\n									</li>\n									<li>\n										<div class="energy earth">\n											<img src="../../public/images/items/earth.png">\n											<div>\n												<span>water</span>\n											</div>\n										</div>\n										<ul>\n											<li>\n												<div class="energy earth">\n													<img src="../../public/images/items/earth.png">\n													<div>\n														<span>water</span>\n													</div>\n												</div>\n											</li>\n											<li>\n												<div class="energy earth">\n													<img src="../../public/images/items/earth.png">\n													<div>\n														<span>water</span>\n													</div>\n												</div>\n											</li>\n										</ul>\n									</li>\n								</ul>\n							</li>\n						</ul>\n					</div>\n				</div>\n			</div>\n\n			<hr>\n\n			<div class="row">\n				<div class="col-md-12 text-center">\n					<div class="energy fire">\n						<img src="../../public/images/items/fire.png">\n						<div>\n							<span>fire</span>\n							<span>10pcs</span>\n						</div>\n					</div>\n					<div class="energy water">\n						<img src="../../public/images/items/water.png">\n						<div>\n							<span>water</span>\n							<span>10pcs</span>\n						</div>\n					</div>\n					<div class="energy earth">\n						<img src="../../public/images/items/earth.png">\n						<div>\n							<span>earth</span>\n							<span>10pcs</span>\n						</div>\n					</div>\n					<div class="energy wind">\n						<img src="../../public/images/items/wind.png">\n						<div>\n							<span>wind</span>\n							<span>10pcs</span>\n						</div>\n					</div>\n					<div class="energy light">\n						<img src="../../public/images/items/light.png">\n						<div>\n							<span>light</span>\n							<span>10pcs</span>\n						</div>\n					</div>\n					<div class="energy darkness">\n						<img src="../../public/images/items/darkness.png">\n						<div>\n							<span>darkness</span>\n							<span>10pcs</span>\n						</div>\n					</div>\n					<div class="energy metal">\n						<img src="../../public/images/items/metal.png">\n						<div>\n							<span>metal</span>\n							<span>10pcs</span>\n						</div>\n					</div>\n					<div class="energy blood">\n						<img src="../../public/images/items/blood.png">\n						<div>\n							<span>blood</span>\n							<span>10pcs</span>\n						</div>\n					</div>\n				</div>\n			</div>\n\n		</div>\n	</div>\n</div> -->\n\n<!-- views/3d/footer.ejs -->\n' + (function(){var buf = [];
 buf.push('		</div>\n\n		<!-- modal template -->\n		<div class="modal fade modal-dark" tabindex="-1" role="dialog" id="modal" data-backdrop="static" data-keyboard="false">\n			<div class="modal-dialog modal-lg">\n				<div class="modal-content">\n					<div class="modal-header">\n						<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n						<h4 class="modal-title"></h4>\n					</div>\n					<div class="modal-body"></div>\n					<div class="modal-footer">\n						<div class="modal-footer-nav"></div>\n						<button type="button" class="btn btn-dark" data-dismiss="modal">close</button>\n					</div>\n				</div>\n			</div>\n		</div>\n		<!-- end modal template -->\n\n		<script src="/libs/jquery-1.10.2.min.js"></script>\n		<script src="/libs/bootstrap.min.js"></script>\n		<script src="/libs/scrollbar/jquery.mCustomScrollbar.concat.min.js"></script>\n		<script src="/libs/jquery.contextMenu.min.js"></script>\n		<script src="/socket.io/socket.io.js"></script>\n\n		<script>\n		// sockets init\n		var socket = io(),\n			psocket = io(\'http://192.168.0.106:9001\');\n		socket.emit(\'findgame\', \'true\');\n\n		// popovers init\n		$(\'#users-list li .name\').popover({\n			placement: \'bottom\',\n			title: \'title\',\n			content: function(){\n				var content = \'content\';\n				return content;\n			},\n			html: true\n		}).on(\'click\', function(e){\n			$(\'#users-list li .name\').not(this).popover(\'hide\');\n		});\n\n		// set wrap height\n		setWrapHeight();\n		$(window).resize(setWrapHeight);\n\n		function setWrapHeight()\n		{\n			$(\'#wrap-mrScrollbar\').css({\n				height: $(window).height()\n			});\n		}\n\n		function ScrollbarInit()\n		{\n			// scroll init\n			$(".mrScrollbar").mCustomScrollbar();\n		}\n\n		function contextMenuInit()\n		{\n			$.contextMenu({\n			    selector: "body",\n			    items: {\n			        foo: {\n			        	name: "Foo",\n			        	callback: function(key, opt){\n			        		alert("Foo!");\n			        	}\n			        }\n			    }\n			});\n		}\n		</script>\n\n	</body>\n</html>');
return buf.join('');})() + '\n<script src="/js/3dgame/index.js"></script>\n<script src="/js/3dgame/dashboard.js"></script>\n'); })();
} 
return buf.join('');
} catch (err) {
  rethrow(err, __stack.input, __stack.filename, __stack.lineno);
}
};