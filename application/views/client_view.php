
<div id="container" style="float: left">

</div>
<button class="btn" id="add" style="margin-left: 20px; height: 30px">Add Task</button>
<div style="float: right; text-align: center">
    <label style="font-size: 125%; ">Logs</label><br>
    <textarea value="" style="width: 200px; height: 100px; text-align: center; font-weight: bold;" disabled id="logs" maxlength="500"></textarea>
</div>
<div id="create_frame" style="margin-top: 30px;visibility: hidden">
    <label style="font-size: 110%; margin-left: 20px;" id="action_type"></label><br>
    <textarea list="true" style="width: 300px; height: 50px; margin-left: 20px; border: solid slategrey 2px" id="desc_newTask"></textarea><br>
    <select id="status_newTask" style="height: 30px; font-size: 105%;font-weight: bold;margin-left: 20px">
        <option value="false">In process</option>
        <option value="true">Done</option>
    </select>
    <input type="hidden" value="" id="id_keeper">
    <button id="confirm" style="height: 30px">Confirm</button>
</div>

