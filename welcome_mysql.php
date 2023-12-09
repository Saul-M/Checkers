<?php
// Initialize the session
session_start();
// If session variable is not set it will redirect to login page
if(!isset($_SESSION['username']) || empty($_SESSION['username'])){
  header("location: login_mysql.php");
  exit;
}
?>
 
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Welcome!</title> 
    <link rel="stylesheet" href="siteStyle.css">   
</head>
<body>


    <div class="webPageTitle">
        <h1>Checkers Game</h1>
    </div>
    <div class="mainPage">
        <h1> Welcome to this site <?php echo $_SESSION['username']; ?> !</h1>
    
        <div class="menu">
            <a href="index.html"><button id="betterButton">Play</button></a>
            <a href="leaderboard.php"><button id="betterButton">Leaderboard</button></a>
            <!--Sign up /sign in button -->
            <a href="signup.html"><button id="betterButton">Sign Up</button></a>  
            <a href="rules.html"><button id="betterButton">Rules</button></a>
            <a href="about.html"><button id="betterButton">About</button></a>
            <p><a href="logout_mysql.php">Sign out of your Account</a></p>
                
        </div>
    </div>
</body>
</html>