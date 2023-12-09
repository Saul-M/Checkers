<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Leaderboard</title>
    <link rel="stylesheet" href="siteStyle.css">
</head>
<body>
    <div class="leaderBoardDisplay">
        <h1 class="webPageTitle">Leaderboard</h1>
        <table id="leaderBoardTable">
            <tr>
                <th id="sortName" data-type="text">Name</th>
                <th id="sortWins" data-type="number">Wins</th>
                <th id="sortGamesPlayed" data-type="number">Games Played</th>
                <th id="sortBestTime" data-type="time">Best Time</th>

            </tr>
            <!-- PHP script to dynamically generate table rows -->
            <?php
            include 'config_mysql.php'; // Include your database configuration file

            $sql = "SELECT * FROM admin"; // Replace 'users' with your actual table name

            if($result = mysqli_query($link, $sql)){
                while($user = mysqli_fetch_assoc($result)) {
                    echo "<tr>";
                    echo "<td>" . htmlspecialchars($user['login']) . "</td>";
                    // Assuming 'wins', 'games_played', and 'best_time' are correct column names
                    echo "<td>" . htmlspecialchars($user['wins']) . "</td>";
                    echo "<td>" . htmlspecialchars($user['games_played']) . "</td>";
                    echo "<td>" . htmlspecialchars($user['best_time']) . "</td>";
                    echo "</tr>";
                }
                // Free result set
                mysqli_free_result($result);
            } else{
                echo "ERROR: Could not execute $sql. " . mysqli_error($link);
            }

            // Close connection
            mysqli_close($link);
            ?>
        </table>
    </div>
    <script src="./leaderBoardSort.js"></script>
</body>
</html>
