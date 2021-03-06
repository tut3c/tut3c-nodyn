var currentPlayer = "X";
var apiUrl = "/api";

$(document).ready(function () {
  
  $.each($('.board td'), function(index, value) {
       $(value).on("click", function () {
          console.log(getJsonFrom($(value)));
          doMove(getJsonFrom($(value)));
       });
  });
  
  $('button').on("click", initBoard);
  
  initBoard();
});

var getJsonFrom = function(cell) {

  return { player: currentPlayer, coord: [cell.attr("data-x"), cell.attr('data-y')]};
};

var updateBoard = function(json) {
  $.each($('.board td'), function(index, value) {
      var val = json.board[$(value).attr("data-x")][$(value).attr("data-y")];
      if( val == null ) {
          $(value).html('&nbsp;');
      } else {
          $(value).html(val);
          $(value).addClass(val.toLowerCase());
      }
  });
};

var initBoard = function() {
		$.ajax(apiUrl, {
      contentType: "application/json",
      error: function(xhr, status, error) {
					$('.log').prepend($("<div>There was an error:" + status + "\n" + JSON.stringify(error) + "</div>"));
    			console.log(error);
      },
       success: function(result, status, xhr) {
  $('.log').prepend($("<div>" + result.status + "</div>"));
          updateBoard(result);
			},
      type: "GET"
      }
    );
};

var doMove = function(req) {
		$.ajax(apiUrl , 
    {
      contentType: "application/json",
      data: JSON.stringify(req),
      error: function(xhr, status, error) {
					$('.log').prepend($("<div>There was an error:" + status + "\n" + JSON.stringify(error) + "</div>"));
    			console.log(error);
      },
       success: function(result, status, xhr) {
          $('.log').prepend($("<div>" + result.status + "</div>"));
          if(statusOkay(result.status)) {
            updateBoard(result);
            if (currentPlayer === "X") {
              currentPlayer = "O";
            } else {
              currentPlayer = "X";
            }
          }
			},
      type: "POST"
      }
    );
};

var statusOkay = function(status) {
  return status.indexOf("Illegal") < 0;
} 
