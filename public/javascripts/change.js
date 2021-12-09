$(document).ready(function () {
    $("#go").on("click", function (event) {
        event.preventDefault();
        const data = $("#DEF").serialize()
        $.ajax({
            type: 'POST',
            url: "/ChangeOrder",
            data: data,
            success: function (res) {
                alert(res);
            },
            error: function (XMLHttpRequest, textStatus) {
                alert(textStatus + XMLHttpRequest);
            },
        });
    });
});
