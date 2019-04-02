function countBadges() {
    var numNew = -1; //start at -1 to not count the badge in header
    $(".badge").each(function() {
        numNew++;
    });
    $("#new-count").text(numNew);
}

$(".article-badge").on("click", function() {
    $(this).remove();
    countBadges();
})

$(".notes").on("click", function() {
    populateNotes($(this).data("id"));
})

$("#add-note").on("click", function() {
    var yourName = $("#your-name").val().trim();
    var yourNote = $("#your-note").val().trim();
    if (yourName && yourNote) {
        $.ajax("/" + $(this).data("id"), {
            method: "PUT",
            data: { user: yourName, body: yourNote }
        }).then(function(response) {
            populateNotes(response._id)
        });
    };
});

$(document).on("click", ".delete-note", function() {
    $.ajax("/" + $("#add-note").data("id"), {
        method: "DELETE",
        data: { id: $(this).data("id") }
    }).then(function(response) {
        populateNotes($("#add-note").data("id"));
    })
})

function populateNotes(articleId) {
    $.ajax("/" + articleId, {
        method: "GET"
    }).then(function(response) {
        $("#notes-section").empty();
        $("#your-name").val("");
        $("#your-note").val("");
        $("#add-note").attr("data-id", response._id);
        $("#notes-modal h4").text(response.title);
        for (var i = 0; i < response.notes.length; i++) {
            var col = $("<div class='col s12'>");
            col.append($("<i data-id=" + response.notes[i]._id + " class='fas fa-trash-alt delete-note'>"));
            col.append($("<p class='note-body'>").text("   " + response.notes[i].user + " says: " + response.notes[i].body));
            var note = $("<div class='row note-row blue lighten-4'>").append(col);
            $("#notes-section").append(note);
        }
        $("#notes-modal").modal("open");
        M.updateTextFields();
    });
}

$(document).ready(function() {
    countBadges();
});