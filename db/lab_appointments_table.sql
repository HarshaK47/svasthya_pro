USE svasthya_pro;

CREATE TABLE appointments(
    testname varchar(50) NOT NULL,
    cityname varchar(30) NOT NULL,
    timings text NOT NULL,
    lab varchar(30) NOT NULL,
    id char(100) PRIMARY KEY  NOT NULL
);

CREATE TABLE labs(
    Lab_ID varchar(30) NOT NULL,
    Lab_Name varchar(40) NOT NULL,
    Reg_Number INT NOT NULL,
    Available_Tests varchar(50) NOT NULL,
    City varchar(30) NOT NULL,
    UNIQUE (Lab_ID,Available_Tests)
);

INSERT INTO labs(Lab_ID,Lab_Name,Reg_Number,Available_Tests,City)
    VALUES ('1A667Max','Khaneja Pvt. Testing Lab',43562,'Complete Blood Count','Chandigarh'),
           ('1A667Max','Khaneja Pvt. Testing Lab',43562,'Prothrombin Time PT','Chandigarh'),
           ('1B569App','Blue Path Testing',48578,'Complete Blood Count','Chandigarh'),
           ('1A668su','Suraksha Testing Lab',43588,'Complete Blood Count','Panchkula'),
           ('1Adsd89','Charitable Trust Testing Lab',44344,'Complete Blood Count','Chandigarh');


INSERT INTO appointments(testname,cityname,timings,lab,id)
   VALUES ('bloodtest','chd','1700','lalpath','bloodtestchd1700lalpath');
