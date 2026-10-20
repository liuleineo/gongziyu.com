<!doctype html>
<html>

<head>
    <meta charset="utf-8">
    <title>Rulse of life</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" href="../../assets/default.css">

    <style>
        #AllRules{padding:18px;line-height: 2;}
        #AllRules .cats ul{ list-style: decimal-leading-zero inside;}

    </style>

</head>


<body>
    <?php include '../../share/header.php';?>




    <div class="main" id="AllRules">









        <script>
            ///老哥，我们用fetch啦 https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch

            var JsonData;
            var htmltext ='';//声明htmltext
            fetch("http://gongziyu.com/tools/RulesOfLife/RulesOfLife.json").then(function (response) {
                return response.json();
            }).then(function (data) {
                JsonData = data;
                ////////遍历数据
                JsonData.forEach(function (element) {

                    console.log(element.catName);
                    htmltext += '<div class="cats"><h3>' + element.catName + '</h3><ul>';

                    /////二级遍历
                    element.rules.forEach(function (element2) {

                        console.log(element2);
                        htmltext += '<li>' + element2 + '</li>';
                    });

                    /////二级遍历
                    htmltext += '</ul></div>';


                });
                ////////遍历数据

                document.getElementById("AllRules").innerHTML = htmltext;




            }).catch(function (e) {
                console.log("Oops, error");
            });







        </script>






    </div>
















    <?php include '../../share/footer.php';?>
   
</body>

</html>