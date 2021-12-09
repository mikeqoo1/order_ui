$(document).ready(function () {
    $("#go").on("click", function (event) {
        event.preventDefault();
        const data = $("#GHI").serialize()
        $.ajax({
            type: 'POST',
            url: "/DeleteOrder",
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