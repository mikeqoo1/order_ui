var express = require("express");
var format = require("date-format"); //時間格式
var net = require("net");
var router = express.Router();
var order_record = [];
var report_record = [];
var Iconv = require('iconv').Iconv;
var iconvToUtf8 = new Iconv('Big5', 'UTF8');



/* GET home page. */
router.get("/", function (req, res, next) {
    res.render("index", { title: "Test Order UI" });
});

//開啟 Order page (新單畫面)
router.get("/order", function (req, res, next) {
    // use order.hjs
    res.render("order", { title: "新單下單介面" });
});

//開啟刪單畫面
router.get("/delete", function (req, res, next) {
    // use delete.hjs
    res.render("delete", { title: "刪單下單介面" });
});

//開啟改單畫面
router.get("/change", function (req, res, next) {
    // use change.hjs
    res.render("change", { title: "改單下單介面" });
});

//取得回報畫面
router.get("/reportinfo", function (req, res, next) {
    res.render("report", { title: "回報介面" });
});

router.get("/report", function (req, res, next) {
    //解析回報
    report_record.push("8450000000IH000100000098261259996  000000000000300000000056000B01111102085018911 230R                                                            0000000000      ")
    report_record.push("8450000000PH000100000098261259996  000030000000000000000060000B01111102085032852 230R                                                            0000055000      ")
    report_record.push("8450000000CH000100000098261259996  000030000000290000000050000B01111102085043763 230R                                                            0000050000      ")
    report_record.push("8450000000DH000100000098261259996  000029000000000000000050000B01111102085046564 230R                                                            0000050000      ")
    var data
    report_record.forEach(function (item, index, array) {
        console.log(item, index);
        公司別 = item.substr(0, 4)
        傳送序號 = item.substr(4, 6)
        異動別 = item.substr(10, 1)
        櫃號 = item.substr(11, 1)
        委託書號 = item.substr(12, 4)
        網路單號 = item.substr(16, 6)
        客戶帳號 = item.substr(22, 6)
        檢查碼 = item.substr(28, 1)
        商品代號 = item.substr(29, 6)
        交易別 = item.substr(35, 1)
        改前數量 = item.substr(36, 6)
        改後數量 = item.substr(44, 6)
        委託單價 = item.substr(52, 10)
        買賣別 = item.substr(62, 1)
        委託日期 = item.substr(63, 8)
        委託時間 = item.substr(71, 9)
        來源別 = item.substr(80, 1)
        營業員 = item.substr(81, 3)
        回報代碼 = item.substr(84, 1)
        回報訊息 = item.substr(85, 60)
        改價前單價 = item.substr(145, 10)
        if (異動別 == "I")
            console.log("新單回報")
        if (異動別 == "C")
            console.log("改量回報")
        if (異動別 == "P")
            console.log("改價回報")
        if (異動別 == "D")
            console.log("刪單回報")

        console.log(公司別 + "|" + 傳送序號 + "|" + 異動別 + "|" + 櫃號 + "|" + 委託書號 + "|" + 網路單號 + "|" +
            客戶帳號 + "|" + 檢查碼 + "|" + 商品代號 + "|" + 交易別 + "|" + 改前數量 + "|" + 改後數量 + "|" +
            委託單價 + "|" + 買賣別 + "|" + 委託日期 + "|" + 委託時間 + "|" + 來源別 + "|" + 營業員 + "|" +
            回報代碼 + "|" + 回報訊息 + "|" + 改價前單價)
        data = {
            data: report_record,
            筆數: report_record.length
        }

    });
    res.json(data);
});

//新單
router.post("/OrderMsg", function (req, res, next) {

    //建立下單跟回報連線
    var SendClient = net.connect({ host: '127.0.0.1', port: 8988 }, function () {
        console.log("下單client端:向server端請求連線")
    });

    var RecvCleint = net.connect({ host: '127.0.0.1', port: 8989 }, function () {
        console.log("回報client端:向server端請求連線")
    });

    //connect event :與server端連線成功時的事件
    SendClient.on("connect", function (data) {
        console.log("下單client端:與server端連線成功, 可以開始傳輸資料")
    });
    RecvCleint.on("connect", function (data) {
        console.log("回報client端:與server端連線成功, 可以開始接收資料")
    });

    //組電文
    today = format("yyyyMMdd", new Date());
    nowtime = format("hhmmssSSS", new Date());
    var msg = {
        bhno: req.body.bhno,
        mgsq: req.body.mgsq,
        cdi: "I",
        insq: req.body.insq,
        ecode: req.body.ecode,
        tdate: today,
        ttime: nowtime,
        cseq: req.body.cseq,
        ckno: req.body.ckno,
        fflag: " ",
        stock: req.body.stock.padEnd(6, " "),
        tqty: req.body.tqty,
        price: req.body.price,
        bs: req.body.bs,
        sale: "123",
        fcode: req.body.fcode,
        ocode: req.body.ocode,
        filler: "                                               "
    };

    if (msg.ecode === "0") {
        msg.tqty = msg.tqty * 1000;
    }
    msg.tqty = msg.tqty.toString().padStart(8, 0);

    msg.price = msg.price * 10000;
    msg.price = msg.price.toString().padStart(10, 0);

    var sendmsg = msg.bhno + msg.mgsq + msg.cdi + msg.insq + msg.ecode + msg.tdate + msg.ttime + msg.cseq + msg.ckno +
        msg.fflag + msg.stock + msg.tqty + msg.price + msg.bs + msg.sale + msg.fcode + msg.ocode + msg.filler + "\n"

    //Send Order Msg
    SendClient.write(sendmsg, function () {
        console.log("client端:開始傳輸資料,傳輸的資料為[", sendmsg, "]");
        //res.send("下單成功, 訊息:[" + sendmsg + "]");
        order_record.push(sendmsg);
    });

    RecvCleint.on('data', function (data) {
        var buffer = iconvToUtf8.convert(data);
        console.log('client端:收到 server端 傳輸資料為\n' + buffer);
        //結束client端 連線
        SendClient.end();
        RecvCleint.end();
        report_record.push(buffer);
    })

    SendClient.on("error", function (err) {
        console.log("!!!~~~下單發現錯誤~~~!!!");
        console.log(err);
        //結束client端連線
        SendClient.end();
        RecvCleint.end();
        // res.send("下單發現錯誤");
        // res.end();
    });

    res.send("收到回報");
    res.end()
});

//刪單
router.post("/DeleteOrder", function (req, res, next) {

    //建立下單跟回報連線
    var SendClient = net.connect({ host: '127.0.0.1', port: 8988 }, function () {
        console.log("下單client端:向server端請求連線")
    });

    var RecvCleint = net.connect({ host: '127.0.0.1', port: 8989 }, function () {
        console.log("回報client端:向server端請求連線")
    });

    //connect event :與server端連線成功時的事件
    SendClient.on("connect", function (data) {
        console.log("下單client端:與server端連線成功, 可以開始傳輸資料")
    });
    RecvCleint.on("connect", function (data) {
        console.log("回報client端:與server端連線成功, 可以開始接收資料")
    });

    //組電文
    today = format("yyyyMMdd", new Date());
    nowtime = format("hhmmssSSS", new Date());
    var msg = {
        bhno: req.body.bhno,
        mgsq: req.body.mgsq,
        cdi: "D",
        insq: req.body.insq,
        tdate: today,
        ttime: nowtime,
        term: req.body.term,
        desq: req.body.desq,
        ocode: req.body.ocode,
        filler: "                                                                                "
    };

    var sendmsg = msg.bhno + msg.mgsq + msg.cdi + msg.insq + msg.tdate + msg.ttime + msg.term + msg.desq + msg.ocode + msg.filler + "\n"

    //Send Msg
    SendClient.write(sendmsg, function () {
        console.log("client端:開始傳輸資料,傳輸的資料為", sendmsg);
        //res.send("下單成功, 訊息:[" + sendmsg + "]");
    });

    RecvCleint.on('data', function (data) {
        var buffer = iconvToUtf8.convert(data);
        console.log('client端:收到 server端 傳輸資料為\n' + buffer)
        //結束client端 連線
        SendClient.end();
        RecvCleint.end();
    })

    SendClient.on("error", function (err) {
        console.log("!!!~~~刪單發現錯誤~~~!!!");
        console.log(err);
        res.send("刪單失敗, 訊息:[" + err + "]");
        //結束client端連線
        SendClient.end();
        RecvCleint.end();
    });
    res.send("收到回報");
    res.end()
});

//改單
router.post("/ChangeOrder", function (req, res, next) {

    //建立下單跟回報連線
    var SendClient = net.connect({ host: '127.0.0.1', port: 8988 }, function () {
        console.log("下單client端:向server端請求連線")
    });

    var RecvCleint = net.connect({ host: '127.0.0.1', port: 8989 }, function () {
        console.log("回報client端:向server端請求連線")
    });

    //connect event :與server端連線成功時的事件
    SendClient.on("connect", function (data) {
        console.log("下單client端:與server端連線成功, 可以開始傳輸資料")
    });
    RecvCleint.on("connect", function (data) {
        console.log("回報client端:與server端連線成功, 可以開始接收資料")
    });

    //組電文
    today = format("yyyyMMdd", new Date());
    nowtime = format("hhmmssSSS", new Date());
    var msg = {
        bhno: req.body.bhno,
        mgsq: req.body.mgsq,
        cdi: req.body.cdi,
        insq: req.body.insq,
        tdate: today,
        ttime: nowtime,
        tqty: req.body.tqty,
        term: req.body.term,
        desq: req.body.desq,
        ocode: req.body.ocode,
        price: req.body.price,
        filler: "                                                              "
    };

    msg.tqty = msg.tqty.toString().padStart(8, 0);
    msg.price = msg.price * 10000;
    msg.price = msg.price.toString().padStart(10, 0);

    var sendmsg = msg.bhno + msg.mgsq + msg.cdi + msg.insq + msg.tdate + msg.ttime + msg.tqty + msg.term + msg.desq + msg.ocode + msg.price + msg.filler + "\n"

    //Send Msg
    SendClient.write(sendmsg, function () {
        console.log("client端:開始傳輸資料,傳輸的資料為", sendmsg);
        //res.send("下單成功, 訊息:[" + sendmsg + "]");
    });

    RecvCleint.on('data', function (data) {
        var buffer = iconvToUtf8.convert(data);
        console.log('client端:收到 server端 傳輸資料為\n' + buffer)
        //結束client端 連線
        SendClient.end();
        RecvCleint.end();
    })

    SendClient.on("error", function (err) {
        console.log("!!!~~~改單發現錯誤~~~!!!");
        console.log(err);
        //結束client端連線
        SendClient.end();
        RecvCleint.end();
        res.send("改單失敗, 訊息:[" + err + "]");
    });
    res.send("收到回報");
    res.end()
});


module.exports = router;