$(document).ready(function () {
    $("#go").on("click", function (event) {
        event.preventDefault();
        const data = $("#ABC").serialize()
        $.ajax({
            type: 'POST',
            url: "/OrderMsg",
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