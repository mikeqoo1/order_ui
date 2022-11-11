$(document).ready(function () {
    $("#go").on("click", function (event) {
        event.preventDefault();
        const data = $("#RRR").serialize()
        $.ajax({
            type: 'GET',
            url: "/report",
            dataType: "json",
            data: data,
            success: function (res) {
                console.log(res)
                key = Object.keys(res);
                console.log(key)
                var ul = "<ul>";
                report = res["data"];
                count = res["筆數"];
                console.log(report)
                if (count == 0) {
                    $('#result').append("<h2>還沒有回報紀錄</h2>");
                } else {
                    for (i = 0; i < count; i++) {
                        公司別 = report[i].substr(0, 4)
                        傳送序號 = report[i].substr(4, 6)
                        異動別 = report[i].substr(10, 1)
                        櫃號 = report[i].substr(11, 1)
                        委託書號 = report[i].substr(12, 4)
                        網路單號 = report[i].substr(16, 6)
                        客戶帳號 = report[i].substr(22, 6)
                        檢查碼 = report[i].substr(28, 1)
                        商品代號 = report[i].substr(29, 6)
                        交易別 = report[i].substr(35, 1)
                        改前數量 = report[i].substr(36, 6)
                        改後數量 = report[i].substr(44, 6)
                        委託單價 = report[i].substr(52, 10)
                        買賣別 = report[i].substr(62, 1)
                        委託日期 = report[i].substr(63, 8)
                        委託時間 = report[i].substr(71, 9)
                        來源別 = report[i].substr(80, 1)
                        營業員 = report[i].substr(81, 3)
                        回報代碼 = report[i].substr(84, 1)
                        回報訊息 = report[i].substr(85, 60)
                        改價前單價 = report[i].substr(145, 10)
                        if (異動別 == "I") {
                            ul += "<p></p>"
                            ul += "<h6>新單回報</h6>";
                            console.log("新單回報")
                            ul += "<p></p>"
                        } else if (異動別 == "C") {
                            ul += "<p></p>"
                            ul += "<h6>改量回報</h6>"
                            console.log("改量回報")
                            ul += "<p></p>"
                        } else if (異動別 == "P") {
                            ul += "<p></p>"
                            ul += "<h6>改價回報</h6>"
                            console.log("改價回報")
                            ul += "<p></p>"
                        } else if (異動別 == "D") {
                            ul += "<p></p>"
                            ul += "<h6>刪單回報</h6>"
                            console.log("刪單回報")
                            ul += "<p></p>"
                        }
                        ul += "<li>公司別:" + 公司別 + "</li>";
                        ul += "<li>傳送序號:" + 傳送序號 + "</li>";
                        ul += "<li>異動別:" + 異動別 + "</li>";
                        ul += "<li>櫃號:" + 櫃號 + "</li>";
                        ul += "<li>委託書號:" + 櫃號 + "</li>";
                        ul += "<li>網路單號:" + 網路單號 + "</li>";
                        ul += "<li>客戶帳號:" + 客戶帳號 + "</li>";
                        ul += "<li>檢查碼:" + 檢查碼 + "</li>";
                        ul += "<li>商品代號:" + 商品代號 + "</li>";
                        ul += "<li>交易別:" + 交易別 + "</li>";
                        ul += "<li>改前數量:" + 改前數量 + "</li>";
                        ul += "<li>改後數量:" + 改後數量 + "</li>";
                        ul += "<li>委託單價:" + 委託單價 + "</li>";
                        ul += "<li>買賣別:" + 買賣別 + "</li>";
                        ul += "<li>委託日期:" + 委託日期 + "</li>";
                        ul += "<li>委託時間:" + 委託時間 + "</li>";
                        ul += "<li>來源別:" + 來源別 + "</li>";
                        ul += "<li>營業員:" + 營業員 + "</li>";
                        ul += "<li>回報代碼:" + 回報代碼 + "</li>";
                        ul += "<li>回報訊息:" + 回報訊息 + "</li>";
                        ul += "<li>改價前單價:" + 改價前單價 + "</li>";
                    }
                    ul += "</ul>";
                    $('#result').append(ul);
                }
            },
            error: function (XMLHttpRequest, textStatus) {
                alert(textStatus + XMLHttpRequest);
            },
        });
    });
});