<!DOCTYPE html PUBLIC "">

<html>
<head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <title>ToDo</title>
    <meta name="keywords" content="" />
    <meta name="description" content="" />
    <link href="/TODO/css/style.css" rel="stylesheet" type="text/css" media="screen" />
    <link href="/TODO/css/start.css" rel="stylesheet" >
</head>
<body>
<div id="wrapper">
    <div id="menu">
        <ul>
            <li><a href="#"></a></li>
            <li class="current_page_item"><a href="#"></a></li>
            <li><a href="#"></a></li>
            <li><a href="#"></a></li>
            <li><a href="#"></a></li>
        </ul>
    </div>
    <div id="logo">
        <h1><a href="#">todo</a></h1>
        <h2>Do your tasks easily</h2>
    </div>
    <hr />

    <div id="page">
        <div id="content">

            <?php
                require_once "client_view.php";
            ?>

        </div>
        <!-- end #page -->
        <div id="footer">
            <p>(c) 2013 Some kind of task manager</p>
        </div>
    </div>

    <script type="text/javascript" src="/TODO/js/jquery-1.9.1.js"></script>
    <script type="text/javascript" src="/TODO/js/js.js"></script>
</body>
</html>
