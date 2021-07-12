//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const ejs = require("ejs");
const _ = require("lodash");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://admin-kajal:r88huH2pdSJCAFY@cluster0.fv2jx.mongodb.net/basicbankDB", { useNewUrlParser: true }, { useUnifiedTopology: true });

//Schema 
const dataSchema = new mongoose.Schema({
    name: String,
    emailId: String,
    currentbalance: Number
});
const tranSchema = new mongoose.Schema({
    from: String,
    to: String,
    amount: Number,
    ts: Date
});
const Data = mongoose.model("Data", dataSchema);
const Tran = mongoose.model("Tran", tranSchema);
const data1 = new Data({
    name: "Anita Sharma",
    emailId: "anitasharma@gmail.com",
    currentbalance: 50000

});
const data2 = new Data({

    name: "Jagriti Pant",
    emailId: "jagpant2@gmail.com",
    currentbalance: 30000

});
const data3 = new Data({

    name: "Manish Tyagi",
    emailId: "mt199@gmail.com",
    currentbalance: 30000

});
const data4 = new Data({

    name: "Ravi Dubey",
    emailId: "ravidubey@gmail.com",
    currentbalance: 80000

});
const data5 = new Data({

    name: "Manav Arya",
    emailId: "manav890@gmail.com",
    currentbalance: 89000

});
const data6 = new Data({

    name: "Kiran Singh",
    emailId: "kirans1992@gmail.com",
    currentbalance: 40000

});
const data7 = new Data({

    name: "Samiksha Verma",
    emailId: "samve@gmail.com",
    currentbalance: 30000

});
const data8 = new Data({

    name: "Mahima Mehta",
    emailId: "mmehta@gmail.com",
    currentbalance: 70000

});
const data9 = new Data({

    name: "Raunak Tyagi",
    emailId: "rtyagi8@gmail.com",
    currentbalance: 90000

});
const data10 = new Data({

    name: "Sonal Tripathi",
    emailId: "sonaltri40@gmail.com",
    currentbalance: 60000

});

const defaultData = [data1, data2, data3, data4, data5, data6, data7, data8, data9, data10];

app.get("/customer", function (req, res) {
    Data.find({}, function (err, foundData) {
        if (foundData.length === 0) {
            Data.insertMany(defaultData, function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("successfully saved to database");
                }
            });
            res.redirect("/customer");
        } else {

            res.render("customer", { newData: foundData });
        }

    });
});

app.set("view engine", "ejs");
app.get("/", function (req, res) {
    res.render("home");
});

app.get("/customer/:data", function (req, res) {
    const requestedTitle = _.lowerCase(req.params.data);

    Data.find({ name: { $ne: req.params.data } }, function (err, founddata) {
        
        Data.find({ name: req.params.data }, function (err, usr) {
            
            res.render("customerdata", {
                
                name: usr[0].name,
                emailId: usr[0].emailId,
                currentbalance: usr[0].currentbalance,
                newdata: founddata,
                
                
            })

        })
        
    });
});

app.post("/customer/:data", function (req, res) {
    const amount = req.body.inputvalue;
    const reqTitle = req.body.actholder;
    Data.updateOne({ name: reqTitle }, {
        $inc: { currentbalance: amount }
    }, function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log("successfully changed")
        }

    }
    
    );
    Data.updateOne({ name: req.params.data }, {
        $inc: { currentbalance: -amount }
    }, function (err) {

        if (err) {
            console.log(err)
        } else {
            console.log("successfully changed")
        }
        
    }
    
    );
    Tran.create(new Tran({
        from: req.params.data,
        to: reqTitle,
        amount: amount,
        ts: new Date()
    }), function (err) {
        console.log("entry saved")
    });
    res.redirect("/success")
    

});
app.get("/success",function(req,res){
    res.render("success");
});
app.get("/transaction", function (req, res) {
    Tran.find({}, function (err, transactions) {
        res.render("transaction", { newData: transactions });
        

    });
});
let port = process.env.PORT;
if (port == null || port =="")
{
    port=3000;
}

app.listen(port, function () {
    console.log("Server has started successfully");
});
