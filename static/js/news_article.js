// 記事オブジェクト
var articles = {};

var article_parseDate = d3.timeParse("%Y/%m/%d");

// 記事データを読み込み、記事を生成する関数にデータを渡す
loadArticles("static/articleData/reuters_topNews_2009_normalization.csv", function(data) {
  articles.data = data;
  articles.display(data);
});

function loadArticles(filename, callback) {
  // 新聞記事のデータを読み込む
  d3.csv(filename, function(error, data) {
    // アンダースコア使えそう
    data.forEach(function(d) {
      d.date = article_parseDate(d.date);
      // console.log(d.date);
    });
    // articles.create(data)と処理は同じ
    callback(data);
  });
}

articles.display = function() {
  var display = true;

  // 記事の表題を生成
  d3.select(".articlePanel")
   // .style("overflow", 'scroll')
   .selectAll("li")
   .data(articles.data)
   .enter()
   .append("li")
   .on("click", function(d) {
      d3.selectAll("li").style("color", "black");
      d3.select(this).style("color", "red");
      // console.log(d.pubdate);
      d3.selectAll(".circle")
      .attr("r", function(d2) {
        var circleSize;
        if (String(d2.date) === String(d.date)) {
          circleSize = 8;
        }else{
          circleSize = 5;
        }
        return circleSize;
      })
      .attr("fill", function(d2) {
        var colorName;
        if (String(d2.date) === String(d.date)) {
          colorName = "red";
        }else{
          colorName = "blue";
        }
        return colorName;
      })
      .attr("stroke", function(d2) {
        var colorName;
        if (String(d2.date) === String(d.date)) {
          colorName = "red";
        }else{
          colorName = "blue";
        }
        return colorName;
      });

      d3.select(this).select("p").attr("style", function(d) {
        var open_key = this.style.display;
        // console.log(this);
        if (open_key == 'none') {
          return "display:block";
        }else {
          return "display:none";
        }
        //   "display:none"

      })
      .style("font-size", '100%');

      // d3.select(this).append("p").text(function(d) {
      //   console.log(display);
      //   if(display === true) {
      //     display = false;
      //     return d.body;
      //   }else{
      //     console.log(this);
      //     display = true;
      //   }
      // });
   });


   d3.selectAll("li").append("span")
   .text(function(d) {
     return d.head;
   })
   .attr("id", function(d, i) {
      d.id = i + 1;
       return i + 1;
     })
   .attr("class", function(d) {
       return Date.parse(d.date);
   })
   .style("font-size", '162.5%');

   // .style("text-decoration", 'underline')


   // 記事の本文を表示
  d3.select(".articlePanel").selectAll("li")
  .data(articles.data)
  .append("p")
  .text(function(d) {
    return d.body;
  })
  .attr("style", "display:none");
};

// 記事をハイライトする関数
articles.highlightArticles = function(date) {
  d3.select(".articlePanel")
  .selectAll("li")
  // .selectAll("p")
  .style("color", function(d) {
    if (String(date) === String(d.date)) {
      showIt(d.id);
      return "red";
    }
  });
};

// スクロールさせる関数
// function showIt(elID) {
//     var el = document.getElementById(elID);
//     el.scrollIntoView(true);
// }
