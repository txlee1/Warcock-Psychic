var app = angular.module("myApp", ["ngRoute"]);
    var urlArray = ["https://www.youtube.com/embed/raE2wXNfLi0","https://www.youtube.com/embed/tb4NgNoIiLA", "https://www.youtube.com/embed/qRnhsw3ympk", "https://www.youtube.com/embed/r5wa-KzQo2A","https://www.youtube.com/embed/XAAAs44pSPs","https://www.youtube.com/embed/XtjP4fRkREc"];
    var myUrl="";
    
    
    app.controller('myCtrl', function($scope, $http) {
        $scope.user={};
    
        $scope.postQuestion = function() {
            console.log("starting post question")
            console.log("User is "+ $scope.user);
            console.log("User.question is "+ $scope.user.question);
            $http({
                method : 'POST',
                url : '/',
                data : $scope.user
            }).then(function(result) {
                console.log("Post successsful");
                console.dir(result);
                myUrl=result.data;
                window.location = "#!wisdom";
            }).catch(function() {
                var vidNum=Math.floor(Math.random()*6);
                myUrl= urlArray[vidNum];
                console.log("There is an error posting");
                window.location = "#!wisdom";
            });
    
        }
        
    });
    
    app.config(function($routeProvider) {
        var indexforme=Math.floor(Math.random()*6);
        $routeProvider
        .when("/", {
            template : ""
        })
        .when("/wisdom", {
            template : function(urlattr){
                    console.log("in /wisdom");
                    console.log("myURl is "+ myUrl)
                    var myVideoHTML;
                    if(myUrl.length>0){
                        myVideoHTML='<center> <iframe width="420" height="345" src=' + myUrl + '></iframe><br><p> <H2> Your answer lies in this video.</H2> </center>'
                    } 
                    console.log(myVideoHTML);
                    return myVideoHTML;}
        });
    });