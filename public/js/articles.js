function countBadges() {
    var numNew = -1; //start at -1 to not count the badge in header
    $(".badge").each(function() {
        numNew++;
    });
    $("#new-count").text(numNew);
};

$(".article-badge").on("click", function() {
    $(this).remove();
    countBadges();
});

$(".article-link").on("click", function() {
    $(this).parent().parent().find(".badge").remove();
    countBadges();
});

$(".fa-star").on("click", function() {
    var favorite;
    if ($(this).hasClass("far")) {
        $(this).removeClass("far");
        $(this).addClass("fas");
        favorite = true;
    } else {
        $(this).removeClass("fas");
        $(this).addClass("far");
        favorite = false;
    }

    $.ajax("/favorites", {
        method: "POST",
        data: { articleId: $(this).attr("data-id"), favorite: favorite }
    }).then(function(response) {
        favorite ? M.toast({ html: 'Favorite Added', classes: 'rounded' }) : M.toast({ html: 'Favorite Removed', classes: 'rounded' });
    });

    if (window.location.pathname === "/favorites") $(this).parent().parent().remove();
})

$(".notes").on("click", function() {
    populateNotes($(this).attr("data-id"));
});

$("#add-note").on("click", function() {
    var yourName = $("#your-name").val().trim();
    var yourNote = $("#your-note").val().trim();
    if (yourName && yourNote) {
        $.ajax("/api/" + $(this).attr("data-id"), {
            method: "PUT",
            data: { user: yourName, body: yourNote }
        }).then(function(response) {
            populateNotes(response._id)
        });
    };
});

$(document).on("click", ".delete-note", function() {
    $.ajax("/api/" + $("#add-note").attr("data-id"), {
        method: "DELETE",
        data: { id: $(this).attr("data-id") }
    }).then(function(response) {
        populateNotes($("#add-note").attr("data-id"));
    })
})

function populateNotes(articleId) {
    $.ajax("/api/" + articleId, {
        method: "GET"
    }).then(function(response) {
        $("#notes-section").empty();
        $("#your-name").val("");
        $("#your-note").val("");
        $("#add-note").attr("data-id", response._id);
        $("#notes-modal h4").text(response.title);
        $(".notes[data-id=" + articleId + "]").text("VIEW/ADD NOTES (" + response.notes.length + ")");
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
};

$(document).ready(function() {
    if (window.location.pathname === "/favorites") $(".jumbotron h1").text("Favorites");
    countBadges();
});