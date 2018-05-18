var app = angular.module("myApp", ["ngRoute"]);
    var urlArray = ["https://www.youtube.com/embed/raE2wXNfLi0","https://www.youtube.com/embed/tb4NgNoIiLA", "https://www.youtube.com/embed/qRnhsw3ympk", "https://www.youtube.com/embed/r5wa-KzQo2A","https://www.youtube.com/embed/XAAAs44pSPs","https://www.youtube.com/embed/XtjP4fRkREc"];
    var myUrl="";
    
    
    app.controller('myCtrl', function($scope, $http) {
        $scope.user={};
        $scope.lastQuestion="";
    
        $scope.postQuestion = function() {
            console.log("starting post question")
            console.log("User is "+ $scope.user);
            console.log("User.question is "+ $scope.user.question);
            console.log("Last question is "+$scope.lastQuestion);
            $scope.user.questionMessage=""; 
            //Make sure they actually ask a question. 
            if($scope.user.question == null){
                $scope.user.questionMessage=generateMessageNull(); 
                window.location = "#!/";
                return;   
            }
            //Ping the server only if the question has changed
            if (questionHasChanged($scope)){
                $scope.lastQuestion=""+$scope.user.question;//cache the question asked.
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
            }else{
                console.log("Asked the same question again. Don't change the video");
                $scope.user.questionMessage=generateMessageForRepeatQuestion();
            }
    
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

function questionHasChanged($scope) {
    return $scope.lastQuestion != $scope.user.question;
}
function generateMessageForRepeatQuestion(){
    var possibilities=["Want a new answer? Ask a new question!","Stop repeating yourself!", 
    "Listen loser, I don't have time to answer the same question over and over","I already answered that.",
    "Same question. Same answer", "Why are you wasting my time with the same question again?",
     "Why do you repeat yourself so much?","We've done that one already"] ;
    var selection = Math.floor(Math.random()*possibilities.length);
    return possibilities[selection];
}
function generateMessageNull(){
    var possibilities=["Ask a question loser!", "You can't get woke if you don't ask a questiion", 
                        "I feel a loser on my psychic portal. Why don't you ask a question?", "You are wasting my time!",
                        "You don't seem to get the point of this. Ask a question.","Did you really just do that?"] ;
    var selection = Math.floor(Math.random()*possibilities.length);
    return possibilities[selection];
}
