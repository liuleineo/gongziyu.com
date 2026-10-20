///如何使用呢：
///1.页面放入<script src="neo/RandomRulesOfLife.js"></script>
///2.页面加入<div id="RandomRule">不断立新功，全心全意为人民服务。</div>
///3.RandomRule会被随机替换


var JsonData;
var AllRules = [];
var htmltext = '';//声明htmltext
fetch("http://gongziyu.com/tools/RulesOfLife/RulesOfLife.json").then(function (response) {
    return response.json();
}).then(function (data) {
    JsonData = data;
    ////////遍历数据
    JsonData.forEach(function (element) {

        //console.log(element.catName);


        /////二级遍历
        element.rules.forEach(function (element2) {

            //console.log(element2);
            AllRules.push(element2);

        });

        /////二级遍历



    });
    ////////遍历数据


    var RandomRule = AllRules[Math.round(Math.random() * AllRules.length)];
    console.log(RandomRule);
    htmltext = '<a href="http://gongziyu.com/tools/RulesOfLife/RulesOfLife.php" target="blank">' + RandomRule + '</a>';
    document.getElementById("RandomRule").innerHTML = htmltext;




}).catch(function (e) {
    console.log("Oops, error");
});
