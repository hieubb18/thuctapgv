;
(function($, window, document, undefined) {
  window.method = sha1;
  //method = sha1;

  $(document).ready(function() {
    var input = $('#hash_input_p'),
      output = $('#hash_output_p');
    var input_pchange = $('#hash_input_pchange'),
      output_pchange = $('#hash_output_pchange');
    var execute = function() {
      try {
        output.val(method(input.val()));
      } catch (e) {
        output.val(e);
      }
    }
    var excute_change = function() {
      try {
        output_pchange.val(method(input_pchange.val()));
      } catch (e) {
        output_pchange.val(e);
      }
    }

    function autoUpdate() {
      execute();
    }

    function autoUpdate_change() {
      excute_change();
    }
    if (input.length >= 0) {
      input.bind('input propertychange', autoUpdate);
      //Dữ liệu nhập vào - Tự động hóa Mã hóa
    }
    if (input_pchange.length >= 0) {
      input_pchange.bind('input propertychange', autoUpdate_change);
    }

  });
})(jQuery, window, document);


var script_url = "https://script.google.com/macros/s/AKfycbz-3jqC2TEfzWVk_Ne4Co92VIA4Df_seZIan_oZI4ypxKjlNBY/exec";

function update_pass_value() {
  var passgv_v1 = $("#hash_input_pchange").val();
  var passgv_v2 = $("#passgv_prof_repeat").val();
  if (passgv_v1 === passgv_v2 && passgv_v1.length >= 5 && passgv_v2.length >= 5)
    update_value();
  else {
    if (passgv_v1.length < 5 && passgv_v2.length < 5) {
      $("#re").html("<p style='text-align:center;color:red;'>Mật khẩu ít nhất 5 kí tự!</p>");
    } else {
      if (passgv_v1 == "" || passgv_v2 == "") {
        $("#re").html("<p style='text-align:center;color:red; font-size:16px;'>Mật khẩu không được bỏ trống!</p>");
      } else {
        $("#re").html("<p style='text-align:center;color:red; font-size:16px;'>Mật khẩu không trùng khớp!</p>");
      }
    }

  }

}

function update_value() {
  $("#re").css("visibility", "hidden");
  // document.getElementById("loader").style.visibility = "visible";
  var idgv = $("#idgv_prof").val().replace(/ /g, '');
  var passgv = $("#hash_output_pchange").val().replace(/ /g, '');
  var passgv_changed = $("#hash_input_pchange").val().replace(/ /g, '');

  var url = script_url + "?callback=ctrlq&passgv=" + passgv + "&passgv_changed=" + passgv_changed + "&idgv=" + idgv + "&action=update";
  var request = jQuery.ajax({
    crossDomain: true,
    url: url,
    method: "GET",
    dataType: "jsonp"
  });

  //  setTimeout("location.href= '/'",5000);
}

function ctrlq(e) {
  $("#re").html(e.result);
  $("#re").css("visibility", "visible");
}
// Khoong dung khoang trang cho mat khau
function BlockSpace(e) {
  var k = event ? event.which : window.event.keyCode;
  if (k == 32) return false;
}


function showhidepass() {
  var temp = document.getElementById("passgv_prof_repeat");
  var temp_repeat = document.getElementById("hash_input_pchange");

  if (temp.type === "password" || temp_repeat === "password") {
    temp.type = "text";
    temp_repeat.type = "text";
  } else {
    temp.type = "password";
    temp_repeat.type = "password";
  }
}
