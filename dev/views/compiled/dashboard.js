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
var __stack = { lineno: 1, input: "<!-- views/3d/header.ejs -->\r\n<% include ./header.ejs %>\r\n\r\n<div class=\"container\">\r\n\t<nav class=\"navbar navbar-inverse\">\r\n\t\t<ul class=\"nav navbar-nav\">\r\n\t\t\t<li role=\"presentation\" class=\"active\"><a href=\"/dashboard\">Dashboard</a></li>\r\n\t\t\t<!-- <li role=\"presentation\"><a href=\"#\" id=\"find_game\">Find Game (1x1)</a></li> -->\r\n\t\t\t<!-- <li role=\"presentation\"><a href=\"/createGame\">Create Game</a></li> -->\r\n\t\t</ul>\r\n\t</nav>\r\n\r\n\t<div class=\"row\">\r\n\r\n\t\t<div class=\"col-md-9\">\r\n\t\t\t<div class=\"row\">\r\n\r\n\t\t\t\t<!-- chat -->\r\n\t\t\t\t<div class=\"col-lg-12 shadow-box\">\r\n\t\t\t\t\t<% include ./chat.ejs %>\r\n\t\t\t\t</div>\r\n\t\t\t\t<!-- end chat -->\r\n\r\n\t\t\t\t<!-- pers info -->\r\n\t\t\t\t<div class=\"col-lg-12 shadow-box padding-box dashboard-box\">\r\n\t\t\t\t\t<div class=\"row\">\r\n\t\t\t\t\t\t<div class=\"col-sm-2 text-center\">\r\n\t\t\t\t\t\t\t<span class=\"name\">[name]</span>\r\n\t\t\t\t\t\t\t<img src=\"/images/characters/butterfly.jpg\" width=\"100%\">\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t<div class=\"col-sm-2\">\r\n\t\t\t\t\t\t\t<span class=\"title\">Statistics</span>\r\n\t\t\t\t\t\t\t<ul class=\"statistics\">\r\n\t\t\t\t\t\t\t\t<li>\r\n\t\t\t\t\t\t\t\t\t<span>Health</span>\r\n\t\t\t\t\t\t\t\t\t<span>120</span>\r\n\t\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t\t\t<li>\r\n\t\t\t\t\t\t\t\t\t<span>Strength</span>\r\n\t\t\t\t\t\t\t\t\t<span>10</span>\r\n\t\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t\t\t<li>\r\n\t\t\t\t\t\t\t\t\t<span>Agility</span>\r\n\t\t\t\t\t\t\t\t\t<span>7</span>\r\n\t\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t\t\t<li>\r\n\t\t\t\t\t\t\t\t\t<span>Endurance</span>\r\n\t\t\t\t\t\t\t\t\t<span>4</span>\r\n\t\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t\t\t<li>\r\n\t\t\t\t\t\t\t\t\t<span>Trick</span>\r\n\t\t\t\t\t\t\t\t\t<span>7</span>\r\n\t\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t\t\t<li>\r\n\t\t\t\t\t\t\t\t\t<span>Attentiveness</span>\r\n\t\t\t\t\t\t\t\t\t<span>8</span>\r\n\t\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t\t\t<li>\r\n\t\t\t\t\t\t\t\t\t<span>Intellect</span>\r\n\t\t\t\t\t\t\t\t\t<span>5</span>\r\n\t\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t\t</ul>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t<div class=\"col-sm-6\">\r\n\t\t\t\t\t\t\t<span class=\"title\">Skills</span>\r\n\t\t\t\t\t\t\t<ul class=\"skills\">\r\n\t\t\t\t\t\t\t\t<li>\r\n\t\t\t\t\t\t\t\t\t<div class=\"skill-box\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"[skill name]\">\r\n\t\t\t\t\t\t\t\t\t\t<img src=\"/images/skills/icon_skill_magic18.jpg\">\r\n\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t\t</ul>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t<div class=\"col-sm-2\">\r\n\t\t\t\t\t\t\t<a href=\"#\" class=\"btn btn-default\" id=\"find_game\">Find Game<br>(1x1)</a>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</div>\r\n\r\n\t\t\t\t</div>\r\n\t\t\t\t<!-- end pers info -->\r\n\r\n\t\t\t</div>\r\n\t\t</div>\r\n\r\n\t\t<!-- users list -->\r\n\t\t<div class=\"col-md-3 shadow-box\">\r\n\t\t\t<ul class=\"tabs\">\r\n\t\t\t\t<li>All</li>\r\n\t\t\t\t<li>Friends</li>\r\n\t\t\t</ul>\r\n\t\t\t<div class=\"padding-box\">\r\n\t\t\t\t[users list]\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t<!-- end users list -->\r\n\r\n\t</div>\r\n\r\n\t<div class=\"row hidden\">\r\n\t\t<div class=\"col-lg-12 shadow-box upgrade-box\">\r\n\r\n\t\t\t<span class=\"title\">Upgrade Page</span>\r\n\r\n\t\t\t<div class=\"row\">\r\n\t\t\t\t<div class=\"col-md-6\">\r\n\t\t\t\t\t<div class=\"item-box\">\r\n\t\t\t\t\t\t<img src=\"../../public/images/items/crystal_1.png\">\r\n\t\t\t\t\t\t<span>[name 1]</span>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<div class=\"item-box\">\r\n\t\t\t\t\t\t<img src=\"../../public/images/items/crystal_2.png\">\r\n\t\t\t\t\t\t<span>[name 2]</span>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\r\n\t\t\t<br>\r\n\r\n\t\t\t<div class=\"row\">\r\n\t\t\t\t<div class=\"col-lg-12\">\r\n\t\t\t\t\t<div class=\"tree\">\r\n\t\t\t\t\t\t<ul>\r\n\t\t\t\t\t\t\t<li>\r\n\t\t\t\t\t\t\t\t<div class=\"energy fire\">\r\n\t\t\t\t\t\t\t\t\t<img src=\"../../public/images/items/fire.png\">\r\n\t\t\t\t\t\t\t\t\t<div>\r\n\t\t\t\t\t\t\t\t\t\t<span>fire</span>\r\n\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t<ul>\r\n\t\t\t\t\t\t\t\t\t<li>\r\n\t\t\t\t\t\t\t\t\t\t<div class=\"energy fire\">\r\n\t\t\t\t\t\t\t\t\t\t\t<img src=\"../../public/images/items/fire.png\">\r\n\t\t\t\t\t\t\t\t\t\t\t<div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<span>fire</span>\r\n\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t<ul>\r\n\t\t\t\t\t\t\t\t\t\t\t<li>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"energy fire\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t<img src=\"../../public/images/items/fire.png\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t<div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span>fire</span>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t\t\t\t\t\t<li>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"energy fire\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t<img src=\"../../public/images/items/fire.png\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t<div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span>fire</span>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t\t\t\t\t</ul>\r\n\t\t\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t\t\t</ul>\r\n\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t\t<li>\r\n\t\t\t\t\t\t\t\t<div class=\"energy water\">\r\n\t\t\t\t\t\t\t\t\t<img src=\"../../public/images/items/water.png\">\r\n\t\t\t\t\t\t\t\t\t<div>\r\n\t\t\t\t\t\t\t\t\t\t<span>water</span>\r\n\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t<ul>\r\n\t\t\t\t\t\t\t\t\t<li>\r\n\t\t\t\t\t\t\t\t\t\t<div class=\"energy water\">\r\n\t\t\t\t\t\t\t\t\t\t\t<img src=\"../../public/images/items/water.png\">\r\n\t\t\t\t\t\t\t\t\t\t\t<div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<span>water</span>\r\n\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t<ul>\r\n\t\t\t\t\t\t\t\t\t\t\t<li>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"energy water\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t<img src=\"../../public/images/items/water.png\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t<div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span>water</span>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t\t\t\t\t\t<li>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"energy water\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t<img src=\"../../public/images/items/water.png\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t<div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span>water</span>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t\t\t\t\t</ul>\r\n\t\t\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t\t\t</ul>\r\n\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t\t<li>\r\n\t\t\t\t\t\t\t\t<div class=\"energy earth\">\r\n\t\t\t\t\t\t\t\t\t<img src=\"../../public/images/items/earth.png\">\r\n\t\t\t\t\t\t\t\t\t<div>\r\n\t\t\t\t\t\t\t\t\t\t<span>water</span>\r\n\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t<ul>\r\n\t\t\t\t\t\t\t\t\t<li>\r\n\t\t\t\t\t\t\t\t\t\t<div class=\"energy earth\">\r\n\t\t\t\t\t\t\t\t\t\t\t<img src=\"../../public/images/items/earth.png\">\r\n\t\t\t\t\t\t\t\t\t\t\t<div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<span>water</span>\r\n\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t<ul>\r\n\t\t\t\t\t\t\t\t\t\t\t<li>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"energy earth\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t<img src=\"../../public/images/items/earth.png\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t<div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span>water</span>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t\t\t\t\t\t<li>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"energy earth\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t<img src=\"../../public/images/items/earth.png\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t<div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span>water</span>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t\t\t\t\t</ul>\r\n\t\t\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t\t\t\t<li>\r\n\t\t\t\t\t\t\t\t\t\t<div class=\"energy earth\">\r\n\t\t\t\t\t\t\t\t\t\t\t<img src=\"../../public/images/items/earth.png\">\r\n\t\t\t\t\t\t\t\t\t\t\t<div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<span>water</span>\r\n\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t<ul>\r\n\t\t\t\t\t\t\t\t\t\t\t<li>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"energy earth\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t<img src=\"../../public/images/items/earth.png\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t<div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span>water</span>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t\t\t\t\t\t<li>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"energy earth\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t<img src=\"../../public/images/items/earth.png\">\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t<div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span>water</span>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t\t\t\t\t</ul>\r\n\t\t\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t\t\t</ul>\r\n\t\t\t\t\t\t\t</li>\r\n\t\t\t\t\t\t</ul>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\r\n\t\t\t<hr>\r\n\r\n\t\t\t<div class=\"row\">\r\n\t\t\t\t<div class=\"col-md-12 text-center\">\r\n\t\t\t\t\t<div class=\"energy fire\">\r\n\t\t\t\t\t\t<img src=\"../../public/images/items/fire.png\">\r\n\t\t\t\t\t\t<div>\r\n\t\t\t\t\t\t\t<span>fire</span>\r\n\t\t\t\t\t\t\t<span>10pcs</span>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<div class=\"energy water\">\r\n\t\t\t\t\t\t<img src=\"../../public/images/items/water.png\">\r\n\t\t\t\t\t\t<div>\r\n\t\t\t\t\t\t\t<span>water</span>\r\n\t\t\t\t\t\t\t<span>10pcs</span>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<div class=\"energy earth\">\r\n\t\t\t\t\t\t<img src=\"../../public/images/items/earth.png\">\r\n\t\t\t\t\t\t<div>\r\n\t\t\t\t\t\t\t<span>earth</span>\r\n\t\t\t\t\t\t\t<span>10pcs</span>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<div class=\"energy wind\">\r\n\t\t\t\t\t\t<img src=\"../../public/images/items/wind.png\">\r\n\t\t\t\t\t\t<div>\r\n\t\t\t\t\t\t\t<span>wind</span>\r\n\t\t\t\t\t\t\t<span>10pcs</span>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<div class=\"energy light\">\r\n\t\t\t\t\t\t<img src=\"../../public/images/items/light.png\">\r\n\t\t\t\t\t\t<div>\r\n\t\t\t\t\t\t\t<span>light</span>\r\n\t\t\t\t\t\t\t<span>10pcs</span>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<div class=\"energy darkness\">\r\n\t\t\t\t\t\t<img src=\"../../public/images/items/darkness.png\">\r\n\t\t\t\t\t\t<div>\r\n\t\t\t\t\t\t\t<span>darkness</span>\r\n\t\t\t\t\t\t\t<span>10pcs</span>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<div class=\"energy metal\">\r\n\t\t\t\t\t\t<img src=\"../../public/images/items/metal.png\">\r\n\t\t\t\t\t\t<div>\r\n\t\t\t\t\t\t\t<span>metal</span>\r\n\t\t\t\t\t\t\t<span>10pcs</span>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<div class=\"energy blood\">\r\n\t\t\t\t\t\t<img src=\"../../public/images/items/blood.png\">\r\n\t\t\t\t\t\t<div>\r\n\t\t\t\t\t\t\t<span>blood</span>\r\n\t\t\t\t\t\t\t<span>10pcs</span>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n\r\n<!-- views/3d/footer.ejs -->\r\n<% include ./footer.ejs %>\r\n<script src=\"/js/3dgame/index.js\"></script>\r\n<script src=\"/js/3dgame/dashboard.js\"></script>\r\n", filename: "D:\\server\\nodejs\\MRgame\\dev\\views\\3d\\dashboard.ejs" };
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
 buf.push('<link rel="stylesheet" type="text/css" href="/libs/bootstrap.min.css">\n<link rel="stylesheet" type="text/css" href="/libs/bootstrap-theme.min.css">\n<link rel="stylesheet" type="text/css" href="/css/game.css">');
return buf.join('');})() + '\n\n<div class="container">\n	<nav class="navbar navbar-inverse">\n		<ul class="nav navbar-nav">\n			<li role="presentation" class="active"><a href="/dashboard">Dashboard</a></li>\n			<!-- <li role="presentation"><a href="#" id="find_game">Find Game (1x1)</a></li> -->\n			<!-- <li role="presentation"><a href="/createGame">Create Game</a></li> -->\n		</ul>\n	</nav>\n\n	<div class="row">\n\n		<div class="col-md-9">\n			<div class="row">\n\n				<!-- chat -->\n				<div class="col-lg-12 shadow-box">\n					' + (function(){var buf = [];
 buf.push('<ul class="tabs">\n	<li>Public</li>\n	<li>Service</li>\n	<li>Service 2</li>\n	<li>Service 3</li>\n	<li>Service 4</li>\n</ul>\n\n<div class="tab-public">\n	<div class="chat-area">\n		<ul>\n			<li>\n				<span class="name">sgvcoder</span>\n				<span class="msg">message</span>\n				<span class="time">19:20:56</span>\n			</li>\n			<li>\n				<span class="name">sgvcoder</span>\n				<span class="msg">message</span>\n				<span class="time">19:20:56</span>\n			</li>\n			<li>\n				<span class="name">sgvcoder</span>\n				<span class="msg">message</span>\n				<span class="time">19:20:56</span>\n			</li>\n			<li>\n				<span class="name">sgvcoder</span>\n				<span class="msg">message</span>\n				<span class="time">19:20:56</span>\n			</li>\n			<li>\n				<span class="name">sgvcoder</span>\n				<span class="msg">message</span>\n				<span class="time">19:20:56</span>\n			</li>\n			<li>\n				<span class="name">sgvcoder</span>\n				<span class="msg">message</span>\n				<span class="time">19:20:56</span>\n			</li>\n		</ul>\n	</div>\n</div>\n<div class="padding-box">\n\n</div>');
return buf.join('');})() + '\n				</div>\n				<!-- end chat -->\n\n				<!-- pers info -->\n				<div class="col-lg-12 shadow-box padding-box dashboard-box">\n					<div class="row">\n						<div class="col-sm-2 text-center">\n							<span class="name">[name]</span>\n							<img src="/images/characters/butterfly.jpg" width="100%">\n						</div>\n						<div class="col-sm-2">\n							<span class="title">Statistics</span>\n							<ul class="statistics">\n								<li>\n									<span>Health</span>\n									<span>120</span>\n								</li>\n								<li>\n									<span>Strength</span>\n									<span>10</span>\n								</li>\n								<li>\n									<span>Agility</span>\n									<span>7</span>\n								</li>\n								<li>\n									<span>Endurance</span>\n									<span>4</span>\n								</li>\n								<li>\n									<span>Trick</span>\n									<span>7</span>\n								</li>\n								<li>\n									<span>Attentiveness</span>\n									<span>8</span>\n								</li>\n								<li>\n									<span>Intellect</span>\n									<span>5</span>\n								</li>\n							</ul>\n						</div>\n						<div class="col-sm-6">\n							<span class="title">Skills</span>\n							<ul class="skills">\n								<li>\n									<div class="skill-box" data-toggle="tooltip" data-placement="bottom" title="[skill name]">\n										<img src="/images/skills/icon_skill_magic18.jpg">\n									</div>\n								</li>\n							</ul>\n						</div>\n						<div class="col-sm-2">\n							<a href="#" class="btn btn-default" id="find_game">Find Game<br>(1x1)</a>\n						</div>\n					</div>\n\n				</div>\n				<!-- end pers info -->\n\n			</div>\n		</div>\n\n		<!-- users list -->\n		<div class="col-md-3 shadow-box">\n			<ul class="tabs">\n				<li>All</li>\n				<li>Friends</li>\n			</ul>\n			<div class="padding-box">\n				[users list]\n			</div>\n		</div>\n		<!-- end users list -->\n\n	</div>\n\n	<div class="row hidden">\n		<div class="col-lg-12 shadow-box upgrade-box">\n\n			<span class="title">Upgrade Page</span>\n\n			<div class="row">\n				<div class="col-md-6">\n					<div class="item-box">\n						<img src="../../public/images/items/crystal_1.png">\n						<span>[name 1]</span>\n					</div>\n					<div class="item-box">\n						<img src="../../public/images/items/crystal_2.png">\n						<span>[name 2]</span>\n					</div>\n				</div>\n			</div>\n\n			<br>\n\n			<div class="row">\n				<div class="col-lg-12">\n					<div class="tree">\n						<ul>\n							<li>\n								<div class="energy fire">\n									<img src="../../public/images/items/fire.png">\n									<div>\n										<span>fire</span>\n									</div>\n								</div>\n								<ul>\n									<li>\n										<div class="energy fire">\n											<img src="../../public/images/items/fire.png">\n											<div>\n												<span>fire</span>\n											</div>\n										</div>\n										<ul>\n											<li>\n												<div class="energy fire">\n													<img src="../../public/images/items/fire.png">\n													<div>\n														<span>fire</span>\n													</div>\n												</div>\n											</li>\n											<li>\n												<div class="energy fire">\n													<img src="../../public/images/items/fire.png">\n													<div>\n														<span>fire</span>\n													</div>\n												</div>\n											</li>\n										</ul>\n									</li>\n								</ul>\n							</li>\n							<li>\n								<div class="energy water">\n									<img src="../../public/images/items/water.png">\n									<div>\n										<span>water</span>\n									</div>\n								</div>\n								<ul>\n									<li>\n										<div class="energy water">\n											<img src="../../public/images/items/water.png">\n											<div>\n												<span>water</span>\n											</div>\n										</div>\n										<ul>\n											<li>\n												<div class="energy water">\n													<img src="../../public/images/items/water.png">\n													<div>\n														<span>water</span>\n													</div>\n												</div>\n											</li>\n											<li>\n												<div class="energy water">\n													<img src="../../public/images/items/water.png">\n													<div>\n														<span>water</span>\n													</div>\n												</div>\n											</li>\n										</ul>\n									</li>\n								</ul>\n							</li>\n							<li>\n								<div class="energy earth">\n									<img src="../../public/images/items/earth.png">\n									<div>\n										<span>water</span>\n									</div>\n								</div>\n								<ul>\n									<li>\n										<div class="energy earth">\n											<img src="../../public/images/items/earth.png">\n											<div>\n												<span>water</span>\n											</div>\n										</div>\n										<ul>\n											<li>\n												<div class="energy earth">\n													<img src="../../public/images/items/earth.png">\n													<div>\n														<span>water</span>\n													</div>\n												</div>\n											</li>\n											<li>\n												<div class="energy earth">\n													<img src="../../public/images/items/earth.png">\n													<div>\n														<span>water</span>\n													</div>\n												</div>\n											</li>\n										</ul>\n									</li>\n									<li>\n										<div class="energy earth">\n											<img src="../../public/images/items/earth.png">\n											<div>\n												<span>water</span>\n											</div>\n										</div>\n										<ul>\n											<li>\n												<div class="energy earth">\n													<img src="../../public/images/items/earth.png">\n													<div>\n														<span>water</span>\n													</div>\n												</div>\n											</li>\n											<li>\n												<div class="energy earth">\n													<img src="../../public/images/items/earth.png">\n													<div>\n														<span>water</span>\n													</div>\n												</div>\n											</li>\n										</ul>\n									</li>\n								</ul>\n							</li>\n						</ul>\n					</div>\n				</div>\n			</div>\n\n			<hr>\n\n			<div class="row">\n				<div class="col-md-12 text-center">\n					<div class="energy fire">\n						<img src="../../public/images/items/fire.png">\n						<div>\n							<span>fire</span>\n							<span>10pcs</span>\n						</div>\n					</div>\n					<div class="energy water">\n						<img src="../../public/images/items/water.png">\n						<div>\n							<span>water</span>\n							<span>10pcs</span>\n						</div>\n					</div>\n					<div class="energy earth">\n						<img src="../../public/images/items/earth.png">\n						<div>\n							<span>earth</span>\n							<span>10pcs</span>\n						</div>\n					</div>\n					<div class="energy wind">\n						<img src="../../public/images/items/wind.png">\n						<div>\n							<span>wind</span>\n							<span>10pcs</span>\n						</div>\n					</div>\n					<div class="energy light">\n						<img src="../../public/images/items/light.png">\n						<div>\n							<span>light</span>\n							<span>10pcs</span>\n						</div>\n					</div>\n					<div class="energy darkness">\n						<img src="../../public/images/items/darkness.png">\n						<div>\n							<span>darkness</span>\n							<span>10pcs</span>\n						</div>\n					</div>\n					<div class="energy metal">\n						<img src="../../public/images/items/metal.png">\n						<div>\n							<span>metal</span>\n							<span>10pcs</span>\n						</div>\n					</div>\n					<div class="energy blood">\n						<img src="../../public/images/items/blood.png">\n						<div>\n							<span>blood</span>\n							<span>10pcs</span>\n						</div>\n					</div>\n				</div>\n			</div>\n\n		</div>\n	</div>\n</div>\n\n<!-- views/3d/footer.ejs -->\n' + (function(){var buf = [];
 buf.push('<script src="/libs/jquery-1.10.2.min.js"></script>\n<script src="/libs/bootstrap.min.js"></script>\n<script src="/socket.io/socket.io.js"></script>\n\n<script>\nvar socket = io(),\n	psocket = io(\'http://192.168.0.103:9001\');\nsocket.emit(\'findgame\', \'true\');\n</script>');
return buf.join('');})() + '\n<script src="/js/3dgame/index.js"></script>\n<script src="/js/3dgame/dashboard.js"></script>\n'); })();
} 
return buf.join('');
} catch (err) {
  rethrow(err, __stack.input, __stack.filename, __stack.lineno);
}
};