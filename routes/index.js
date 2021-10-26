var express = require("express");
var format = require("date-format"); //時間格式
var net = require("net");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
    res.render("index", { title: "Test Order UI" });
});

//開啟 Order page (新單畫面)
router.get("/order", function (req, res, next) {
    // use order.ejs
    res.render("order", { title: "新單下單介面" });
});


router.post("/OrderMsg", function (req, res, next) {

    //建立下單跟回報連線
    var SendClient = net.connect({ ip: '127.0.0.1', port: 8988 }, function () {
        console.log("下單client端：向server端請求連線")
    });

    var RecvCleint = net.connect({ ip: '127.0.0.1', port: 8989 }, function () {
        console.log("回報client端：向server端請求連線")
    });

    //connect event :與server端連線成功時的事件
    SendClient.on("connect", function (data) {
        console.log("下單client端：與server端連線成功， 可以開始傳輸資料")
    });
    RecvCleint.on("connect", function (data) {
        console.log("回報client端：與server端連線成功， 可以開始接收資料")
    });



    //組電文
    today = format("yyyyMMdd", new Date());
    nowtime = format("hhmmssSSS", new Date());
    var msg = {
        bhno: req.body.bhno,
        msgo: req.body.msgo,
        cdi: "I",
        insq: req.body.insq,
        ecode: req.body.ecode,
        tdate: today,
        ttime: nowtime,
        cseq: req.body.cseq = "982477",
        ckno: req.body.ckno = "4",
        fflag: "I",
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

    console.log(msg.tqty);
    console.log(msg.price);
    var sendmsg = msg.bhno + msg.msgo + msg.cdi + msg.insq + msg.ecode + msg.tdate + msg.ttime + msg.cseq + msg.ckno +
        msg.fflag + msg.stock + msg.tqty + msg.price + msg.bs + msg.sale + msg.fcode + msg.ocode + msg.filler + "\n"

    //Send Order Msg
    SendClient.write(sendmsg, function () {
        console.log("client端：開始傳輸資料，傳輸的資料為", sendmsg);
        //res.send("下單成功, 訊息:[" + sendmsg + "]");
    });

    RecvCleint.on('data', function (data) {
        console.log('client端：收到 server端 傳輸資料為 ' + data.toString())
        //結束client端 連線
        SendClient.end();
        RecvCleint.end();
        res.send("下單訊息:[" + sendmsg + "]。回報訊息:[" + data + "]");
    })

    SendClient.on("error", function (err) {
        console.log("!!!~~~下單發現錯誤~~~!!!");
        console.log(err);
        res.send("下單失敗, 訊息:[" + err + "]");
        //結束client端連線
        SendClient.end();
        RecvCleint.end();
    });


});



module.exports = router;
