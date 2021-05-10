var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var session = require('express-session');
var path = require('path');

const cors = require("cors");

var conn = mysql.createConnection({
  host: 'localhost', 
  user: 'root',      
  password: 'root',      
  database: 'svasthya_pro' 
}); 

conn.connect(function(err) {
  if (err) throw err;
  console.log('Database is connected successfully !');
});
module.exports = conn;



var app = express();
app.use(
  cors({
    origin: "http://localhost:3000/",
    credentials: true,
  })
)


app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.set("view engine",'ejs');

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'views')));

app.get('/',function(req,res){
    res.sendFile(path.join(__dirname,"views","login.html"));
});


app.post('/',function(request,response){
    var username = request.body.userID;
  	var password = request.body.password;

    conn.query('SELECT * FROM users WHERE userID = ? AND user_password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				app.use(express.static(path.join(__dirname,'views2')));
        response.render('home',{user: username});
				
			} else {
				console.log('Incorrect Username and/or Password!');
        response.redirect('/');
			}			
			
		});

  
    
});


app.post('/update',function(req,res){
  res.sendFile(path.join(__dirname,"views","update_lab.html"));
});

app.post('/update/check',function(req,res){
  var loginid = req.body.userID;
  var pass = req.body.password;

  conn.query('SELECT * FROM users WHERE userID = ? AND user_password = ?', [loginid, pass], function(error, results, fields) {
    if (results.length > 0) {
      conn.query('SELECT * FROM lab_appointments WHERE patient = ? ;',[loginid],function(error,results,fields){

        if (results.length > 0) {
          res.render('recent-labs', {userData: results});

    
        }

        else{
          res.redirect('/update/check');
        }


      });
      
    } else {
      console.log('Incorrect Username and/or Password!');
      response.redirect('/update/check');
    }			
    
  });


});





app.get('/register',function(req,res){
    res.sendFile(path.join(__dirname,"views","register.html"));
});

app.post('/register',function(request,response){
  var fullname = request.body.fullname;
  var username = request.body.userID;
  var password = request.body.password;
  var email = request.body.email;


  conn.query('INSERT INTO users(userID,user_password,userName,emailid) VALUES (?,?,?,?);', [username, password,fullname,email], function(error, results, fields) {
    response.redirect('/')
    
  });

});




app.get("/labTest", function(req, res) {
  res.sendFile(path.join(__dirname, "views", "labTest.html"));
});
app.post("/labTest", function(req, res) {
  var testname = req.body.TestName;
  var cityname = req.body.City;
 
 

  conn.query('SELECT * FROM labs WHERE Available_Tests = ? AND City = ? ;', [testname,cityname], function(error, results, fields) {
    if (results.length > 0) {
      res.render('labs-view', {userData: results});


    } else {
      
        
        res.redirect('/labTest');

      
    }
  });

});

app.get("/Appointment_lab",function(req,res){
  
  res.sendFile(path.join(__dirname, "views", "time-lab.html"));


    
    
    
});

app.get("/del_lab_app",function(req,res){
  res.sendFile(path.join(__dirname, "views", "del_lab_app.html"));
});

app.post("/del/lab/apt",function(req,res){
    var id = req.body.uniqueID;
    conn.query("DELETE FROM lab_appointments WHERE uniqueID = ? ;",[id],function(error,results,fields){

      
        res.sendFile(path.join(__dirname, "views", "suc-del.html"));
      
      
    });

});

app.post("/labs/Appointment/check",function(req,res){
    var labid = req.body.ID;
    var userid = req.body.userID;
    var appt_date = req.body.Date;
    var appt_timing = req.body.Timings;


    var uniqueID = labid+appt_date+appt_timing;

    conn.query("SELECT * FROM lab_appointments WHERE uniqueID = ?;",[uniqueID],function(error,results,fields){
        if(results.length>0){
          res.sendFile(path.join(__dirname, "views", "failure_lab.html"));
        }
        else{
          conn.query('INSERT INTO lab_appointments(uniqueID,patient,Lab_ID,appt_date,appt_time) VALUES (?,?,?,?,?);', [uniqueID,userid,labid,appt_date,appt_timing], function(error, results, fields) {
            res.sendFile(path.join(__dirname, "views", "success_appt.html"));
            // res.render("success_doc",{userID:userID});
    
          });
        }
    });

});



app.get("/doctorappt", function(req, res) {
  res.sendFile(path.join(__dirname, "views", "doctor_ap.html"));
});

app.post("/doctorappt",function(req,res){

  var sp = req.body.specialist;
  var cityname = req.body.City;
 
 

  conn.query('SELECT * FROM doctors WHERE Specialization = ? AND city = ? ORDER BY Visiting_Charge_in_Rs ;', [sp,cityname], function(error, results, fields) {
    if (results.length > 0) {
      res.render('doctors-view', {userData: results});


    } else {
      
        
        res.redirect('/doctorappt');

      
    }
  });


});


app.get("/Appointment_doc",function(req,res){
  
  res.sendFile(path.join(__dirname, "views", "time-doc.html"));


    
    
    
});

app.post("/doctors/Appointment/check",function(req,res){
  var labid = req.body.ID;
  var userid = req.body.userID;
  var appt_date = req.body.Date;
  var appt_timing = req.body.Timings;


  var uniqueID = labid+appt_date+appt_timing;

  conn.query("SELECT * FROM doctor_appointments WHERE uniqueID = ?;",[uniqueID],function(error,results,fields){
      if(results.length>0){
        res.sendFile(path.join(__dirname, "views", "failure_lab.html"));
      }
      else{
        conn.query('INSERT INTO doctor_appointments(uniqueID,patient,Doctor_ID,appt_date,appt_time) VALUES (?,?,?,?,?);', [uniqueID,userid,labid,appt_date,appt_timing], function(error, results, fields) {
          res.sendFile(path.join(__dirname, "views", "success_appt.html"));
          // res.render("success_doc",{userID:userID});
  
        });
      }
  });

});


app.post('/updatedoc',function(req,res){
  res.sendFile(path.join(__dirname,"views","update_doc.html"));
});

app.post('/update/doc',function(req,res){
  var loginid = req.body.userID;
  var pass = req.body.password;

  conn.query('SELECT * FROM users WHERE userID = ? AND user_password = ?', [loginid, pass], function(error, results, fields) {
    if (results.length > 0) {
      conn.query('SELECT * FROM doctor_appointments WHERE patient = ? ;',[loginid],function(error,results,fields){

        if (results.length > 0) {
          res.render('recent-docs', {userData: results});

    
        }

        else{
          res.redirect('/update/check');
        }


      });
      
    } else {
      console.log('Incorrect Username and/or Password!');
      response.redirect('/update/check');
    }			
    
  });


});



app.get("/del_doc_app",function(req,res){
  res.sendFile(path.join(__dirname, "views", "del_doc_app.html"));
});

app.post("/del/doc/apt",function(req,res){
  var id = req.body.uniqueID;
  conn.query("DELETE FROM doctor_appointments WHERE uniqueID = ? ;",[id],function(error,results,fields){

    
      res.sendFile(path.join(__dirname, "views", "suc-del.html"));
    
    
  });

});






app.get("/store",function(req,res){
  // var userID=req.body.userID;
  console.log("inside store");
  res.redirect("http://localhost:3000/store");
});

app.post("/store", function(req,res){
  // res.sendFile(path.join(__dirname, "views", "success.html"));

  var ID=req.body.userID;
  var cost=req.body.totalPrice;
  var items=req.body.cartItems.cartItems;
  items.map(function(item,index){
    var item_id=item.id;
    var item_name=item.name;
    var item_price=item.price;
    var item_qty=item.qty;

    conn.query('INSERT INTO store(ID,name,price,quantity) VALUES (?,?,?,?);', [item_id,item_name,item_price,item_qty], function(error, results, fields) {
  });
});
  // console.log(req.body.cartItems.cartItems[0].id);
  // ID_arr.map(function(currentID,index){
  //   if(currentID.toString() === button_id.toString()){
  //     pos=index;
  //   }
  console.log(cost);
  res.status(200).json({msg:"checked out"});
  // res.redirect("http://localhost:8080/checkout");

});

//----------checkout----------//
app.get("/checkout",function(req,res){
  // console.log("hi");
   res.sendFile(path.join(__dirname, "views", "checkout.html"));
});

//-------------------------thankyou----------------------------//
app.get("/thankyou",function(req,res){
  console.log("ji");
   res.sendFile(path.join(__dirname, "views", "thankyou.html"));
})






app.listen(8080,function(){
    console.log("Server is listening on port 8080.");
});
