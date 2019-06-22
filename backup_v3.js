// Get the input field
var input = document.getElementById("inGVSDT");
// Execute a function when the user releases a key on the keyboard
input.addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        document.getElementById("btnDoGV").click();
    }
});

function stepGetGiangVien() {
    doLoading()
        .then(doGetGiangVien)
        .then(doComplete);
}

function stepGetSinhVien() {
    doLoading()
        .then(doGetSinhVien)
        .then(doComplete)
        .then(doShowUpdate);
}


function doLoading() {
    return new Promise(function (resolve, reject) {
        document.querySelector('.js-loading').classList.remove('is-hidden');
        resolve();
    });
}

function doGetGiangVien() {
    return new Promise(function (resolve, reject) {
        giangVienGet();
        resolve();
    });
}

function doComplete() {
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            document.querySelector('.js-loading').classList.add('is-hidden');
        }, 1000);
        resolve();
    });
}

function giangVienGet() {

    var email = $.trim($("input[name='txtGVEmail']").val()).replace(/ /g, '');
    var sdt = $.trim($("input[name='txtGVSDT']").val()).replace(/ /g, '');
    var pass = $.trim($("input[name='txtPass']").val()).replace(/ /g, '');

    var sdt1 = sdt.substring(1, sdt.length);

    if (email == '' || sdt == '') {
        alert("VUI LÒNG NHẬP ĐỦ THÔNG TIN EMAIL VÀ SỐ ĐIỆN THOẠI");
        return false;
    }
    $("#profile_gv").html("");
    $("#InfoGV").html("");
    $("#countHDGV").html("");

        $.googleSheetToJSON('1nO2nV65Vi3dZWGlaIOXLEc-_JWEZK16XFbjQVH_3Q0U', 6)
            .done(function (rows) {
                var count = 0;
                rows.forEach(function (row) {
                    var strEmail = row['gvemail'];
                    var strDT = row['gvdienthoai'];
                    var strPass = row['password'];

                    if (strPass == pass && strEmail == email && (strDT == sdt || strDT == sdt1)) {
                        count++;
                        $.googleSheetToJSON('1nO2nV65Vi3dZWGlaIOXLEc-_JWEZK16XFbjQVH_3Q0U', 1)
                            .done(function (rows) {

                                var strTool = "<div id='popup-wrap-box'> <div class='popup-wrap'> <div class='popup-box'> <div class='popup-content'> </div> <a class='close-btn popup-close' href='#'>x</a> </div> </div> </div>";

                                strTool += "<div class='box-user-thongbao'> <a class='btn popup-btn slide-right' href='#' onclick='profileGet();'>Trang cá nhân </a> <marquee class='marquee-slide-right'>Thông báo: Yêu cầu giảng viên đỗi mật khẩu tra cứu thông tin</marquee> </div>";


                                $(document).ready(function() {
                                    $('.popup-btn').click(function(e) {
                                      $('.popup-wrap').fadeIn(500);
                                      $('.popup-box').removeClass('transform-out').addClass('transform-in');

                                      e.preventDefault();
                                    });

                                    $('.popup-close').click(function(e) {
                                      $('.popup-wrap').fadeOut(500);
                                      $('.popup-box').removeClass('transform-in').addClass('transform-out');

                                      e.preventDefault();
                                    });
                                  });
                                var strText = "<table class='dtable'>";
                                strText += "<tr><th>Tên SV</th>  <th>Lớp</th>  <th>Mã SV</th>  <th>Ngành</th>  <th>Ngày sinh</th>   <th>Email SV</th>  <th>SĐT SV</th>  <th>Môn</th><th>Xem Báo Cáo</th> ";
                                var count = 0;
                                var newMaSV;
                                rows.forEach(function (row) {
                                    var strEmail = row['gvemail'];
                                    var strDT = row['gvdienthoai'];
                                    if (strEmail == email && (strDT == sdt || strDT == sdt1)) {
                                        count++;
                                        strText += "<tr>";

                                        Object.getOwnPropertyNames(row).forEach(function (name) {

                                            if (name == 'sotc' || name == 'tt' || name == 'gvhoten' || name == 'gvemail' || name == 'gvdienthoai' || name == 'mand' || name == 'nhom' || name == 'mamh' || name === 'congty' || name === 'website' || name === 'ngaybatdau' || name === 'ngaydukienketthuc' || name === 'hotennguoiquanli' || name === 'dienthoaiquanly' || name === 'emailnguoiquanli' || name === 'chucvu' || name === 'vitricongviec' || name.match(/tuan.*/))
                                                return;
                                            var val = [].concat(row[name]).join(' / ');
                                            strText += "<td>" + val + "</td>";
                                            if (name == "masv")
                                                newMaSV = row[name];



                                        });
                                        strText += "<td><span onclick='xemBaoCao(" + newMaSV + ")' class='report_'>XEM BÁO CÁO</span></td>";
                                        strText += "</tr>";
                                    }
                                });
                                if (count == 0)
                                    $("#InfoGV").html('Không tìm thấy thông tin');
                                else {
                                    $("#profile_gv").html(strTool);
                                    $("#InfoGV").html(strText);
                                    $("#countHDGV").html("<h2>SLHD: " + count + "</h2>");
                                }
                            })
                            .fail(function (err) {
                                // console.log('error!', err);
                                // alert("LỖI DO MÁY CHỦ GOOGLE SHEET");
                            });


                    }
                });
                var strBoxError = "<div class='isa_error'> <i class='fa fa-times-circle'></i> Tra cứu thông tin thất bại. </div>";
                var strBoxSucess = "<div class='isa_success'> <i class='fa fa-check'></i> Tra cứu thông tin thành công </div>";
                if (count == 0)
                    $("#InfoGV").html(strBoxError);
                else {
                    $("#InfoGV").html(strBoxSucess);

                //   THONG BAO LOI TU HE THONG
                }
            })
            .fail(function (err) {
                // console.log('error!', err);
                // alert("LỖI DO MÁY CHỦ GOOGLE SHEET");
            });
}

function xemBaoCao(masv) {
    var worksheets = [
        '',
        'ouab0ad'
    ];
    strTextThongTinSV = "<div class='ten_mssv_sv'>" ;
    strTextThongTinSV += "<label class='lb_ttsv'>Thông tin sinh viên </label></br>";

    strTextCongTy = "<table class='dtable'>";
    strTextCongTy += "<tr><th>Chức vụ</th>  <th>Công ty</th>  <th>Điện thoại QL</th> <th>Email người QL</th> <th>Họ tên quản lý</th> <th>Ngày bắt đầu</th>  <th>Ngày dự kiến kết thúc</th>     <th>Vị trí công việc</th> <th>Website</th> ";

    strTextBaoCao = "<div id='baocao'>";
    strTextBaoCao += "<div class='body-baocao'>";
    strTextCongTy += "<tr class='sx-NDCTY'>";
    document.querySelector('.js-loading').classList.remove('is-hidden');
    worksheets.forEach(function (worksheet) {
        $.googleSheetToJSON('1nO2nV65Vi3dZWGlaIOXLEc-_JWEZK16XFbjQVH_3Q0U', worksheet)
        .done(function (rows) {
                rows.forEach(function (row) {
                    if (row["masv"] == masv) {
                        Object.getOwnPropertyNames(row).forEach(function (name) {
                            if(name === 'masv' ||  name === 'hoten')
                            {
                                //build div show info
                                var val = [].concat(row[name]).join(' / ');
                                strTextThongTinSV += "<span class='ttsv'>" + "<b>" + val + "</b>" + "</span> </br>";
                            }

                            if (name === 'congty' || name === 'website' || name === 'ngaybatdau' || name === 'ngaydukienketthuc' || name === 'hotennguoiquanli' || name === 'dienthoaiquanly' || name === 'chucvu' || name === 'emailnguoiquanli' || name === 'vitricongviec')
                            {
                                //buid table 1
                                var val = [].concat(row[name]).join(' / ');
                                if(val == '' || val.length < 1)
                                    strTextCongTy += "<td>" + "Chưa cập nhập" + "</td>";
                                strTextCongTy += "<td>" + val + "</td>";
                            }

                            else
                            {
                                if (name.match(/tuan.*/)) {

                                    //buid table 2
                                    var val = [].concat(row[name]).join(' / ');
                                    strTextBaoCao += "<div id="+name+" class='sort'>" + "<div class='box-header-report' style='height: 37px;'>" + "<strong id="+name+">" + name + "</strong>";
                                    strTextBaoCao += "<div class='box-noti'>";
                                    strTextBaoCao += "<button class='btn-view-ct' id="+"btn-"+name+" onclick=\"xemNoiDung(\'" +"ct"+name+"\');\" >Xem nội dung báo cáo</button><span id=" +"showhide-"+"ct"+name+ " class='new-notif' style='display:none;'></span></div><div id="+"time-"+name+" class='time-baocao'></div><div style='clear:both;'></div></div>"
                                    strTextBaoCao += "<div id="+"ct"+name+" class='view-report' style='display:none;' >"  + val + "</div>";


                                }
                            }
                        });


                    }
                    return;
                });
                document.querySelector('.js-loading').classList.add('is-hidden');
                strTextThongTinSV += "</div>";
                strTextCongTy += "</tr></table>";
                strTextBaoCao += "</div></div>";
                bootbox.alert({
                    message: strTextThongTinSV + strTextCongTy  + strTextBaoCao,
                    size: 'large'
                });

                addClassnameTUAN();
                getTime();
            })
            .fail(function (err) {
                //
            });

    });


}


// Build profile user
function profileGet(){
  var email = $.trim($("input[name='txtGVEmail']").val()).replace(/ /g, '');
  var sdt = $.trim($("input[name='txtGVSDT']").val()).replace(/ /g, '');
  var pass = $.trim($("input[name='txtPass']").val()).replace(/ /g, '');
  var sdt1 = sdt.substring(1, sdt.length);

   var strTextProfile = "";


  $(".popup-content").html("");
      $.googleSheetToJSON('1nO2nV65Vi3dZWGlaIOXLEc-_JWEZK16XFbjQVH_3Q0U', 6)
          .done(function (rows) {
              var count = 0;
              rows.forEach(function (row) {
                var strEmail = row['gvemail'];
                var strDT = row['gvdienthoai'];
                var strPass = row['password'];

                if (strPass == pass)
                if (strPass == pass && strEmail == email && (strDT == sdt || strDT == sdt1)) {
                      count++;

                        //$("input[name=txtGVEmail_Profile]").val(row['gvemail']);
                        // var val = row['gvemail'];
                        strTextProfile += "<div class='form-wrapper' style='display:none;'> <label for='txtIDGV'>Mã giảng viên</label> <input id='idgv_prof' type='text' name='txtIDGV' class='form-control' readonly value="+row['idgv']+"> </div>";

                        strTextProfile += "<h3 style='text-align:center;COLOR:darkred'>THÔNG TIN GIẢNG VIÊN</h3>";
                        strTextProfile += "<div class='form-wrapper'> <label for='txtGVEmail_Profile'>Email</label> <input type='email' name='txtGVEmail' placeholder='Địa chỉ thư điện tử?' class='form-control' required='' oninvalid='this.setCustomValidity()' oninput='setCustomValidity()' readonly value="+row['gvemail']+"> </div>";

                        //  $("input[name=txtGVSDT]").val(row[name]);
                          strTextProfile += "<div class='form-wrapper' > <label for='txtGVEmail_Profile'>Số điện thoại</label> <input type='text' name='txtGVEmail_Profile' placeholder='Số điện thoại giảng viên' class='form-control' required='' oninvalid='this.setCustomValidity()' oninput='setCustomValidity()' readonly value="+row['gvdienthoai']+"> </div>";

                          strTextProfile += "<form id='update_form_gv' onsubmit='update_pass_value(); return false;' >";
                          strTextProfile += "<div class='form-wrapper'> <label for='txtGVEmail_Profile'>Mật khẩu</label> <input id='passgv_prof' type='password' placeholder='Mật khẩu mới?' class='form-control' onkeypress='return BlockSpace()' required=''  > </div>";
                          strTextProfile += "<div class='form-wrapper'> <label for='txtGVEmail_Profile'>Nhập lại mật khẩu</label> <input id='passgv_prof_repeat' type='password' placeholder='Nhập lại mật khẩu?' class='form-control' onkeypress='return BlockSpace()' required='' > </div>";

                          strTextProfile += "<span class='flit-left'> <input type='checkbox' onclick='showhidepass()'> <b>Hiễn thị mật khẩu</b> </span>";

                          strTextProfile += "<input type='submit' class='form-control flit-right' value='Cập nhật'>";
                          strTextProfile += "</form><p id='re'></p>";

                          //
                          // strTextProfile += "<a onclick='update_pass_value();' class='form-control update_infoGV'>Cập nhật</a><p id='re'></p>";


                    }
                  })


                  if (count == 0) {
                      $(".popup-content").html("<p style='text-align:center; font-size: 16px;'>Không tìm thấy thông tin hoặc bạn đã thay đỗi mật khẩu - xin vui lòng refresh trang và đăng nhập lại hoặc click <a href='/'>TRANG CHỦ </a> </p>");
                  } else {
                      // strTextProfile += "</form>";
                      $(".popup-content").html(strTextProfile);
                  }
              })


          .fail(function (err) {
              //
          });

}

function addClassnameTUAN() {
    // body...

    var liChangeID = ['tuan-mot','tuan-hai','tuan-ba','tuan-bon','tuan-nam','tuan-sau','tuan-bay','tuan-tam','tuan-chin','tuan-muoi','tuan-muoi-mot','tuan-muoi-hai'];
    var timeChangeID = ['time-tuan-mot','time-tuan-hai','time-tuan-ba','time-tuan-bon','time-tuan-nam','time-tuan-sau','time-tuan-bay',
                        'time-tuan-tam','time-tuan-chin','time-tuan-muoi','time-tuan-muoi-mot','time-tuan-muoi-hai'];

    for (var i = 0; i<liChangeID.length ; i++)
    {
        document.getElementById(liChangeID[i]).setAttribute("id",i);
        document.getElementById(timeChangeID[i]).setAttribute("id","time-"+i);

    }



    //tag id chuyen ve kieu so
    setTenTuan();
    $("#baocao .sort").sort(function (a, b) {
        return parseInt(a.id) - parseInt(b.id);
    }).each(function () {
        var elem = $(this);
        elem.remove();
        $(elem).appendTo("#baocao");
    });



}
function setTenTuan(){
    //Set ten tuan
    var weeks = new Array('Tuần 1:','Tuần 2:', 'Tuần 3:', 'Tuần 4:', 'Tuần 5:', 'Tuần 6:', 'Tuần 7:', 'Tuần 8:', 'Tuần 9:', 'Tuần 10:', 'Tuần 11:', 'Tuần 12:');
    var arrayStrongTagID = ['tuan-mot','tuan-hai','tuan-ba','tuan-bon','tuan-nam','tuan-sau','tuan-bay','tuan-tam','tuan-chin','tuan-muoi','tuan-muoi-mot','tuan-muoi-hai'];
    for( var i  =  0 ; i< weeks.length ; i++)
    {
        document.getElementById(arrayStrongTagID[i]).innerHTML = weeks[i];
    }
}

function getTime() {
    $("#thongtin_tuan").html('');
    var worksheets = [
    'Sheet3',
    '3'
    ];

    worksheets.forEach(function (worksheet) {
        $.googleSheetToJSON('1nO2nV65Vi3dZWGlaIOXLEc-_JWEZK16XFbjQVH_3Q0U', worksheet)
        .done(function (rows) {
            var ngayBatDau, soTuan;
            var count = 0;
            rows.forEach(function (row) {
                count++;
                Object.getOwnPropertyNames(row).forEach(function (name) {
                    if(name == 'ngaybatdau')
                        ngayBatDau = row[name];
                    else if(name == 'sotuanthuchien')
                        soTuan = row[name];
                });
                return;
            });
            if (count == 0) {
                $("#thongtin_tuan").html('Lỗi');
            } else {
                addThongtintuan(ngayBatDau, soTuan);
                kiemtraNoiDung();
            }
        })
        .fail(function (err) {
            //
        });
    });
}

function addThongtintuan(ngayBatDau, soTuan){
    var thoiGianBatDau, thoiGianKetThuc;
    var thongTinTuan;
    var danhSachTuan = [];
    var parts = ngayBatDau.split('/');
    var ngayBatDau = new Date(parts[2], parts[1] - 1, parts[0]);
    ngayBatDau = new Date(ngayBatDau.setDate(ngayBatDau.getDate()  - 7));
    for (var i = 0; i < soTuan; i++) {
        thongTinTuan = [];
        thoiGianBatDau = new Date(ngayBatDau.setDate(ngayBatDau.getDate() + 7));
        thongTinTuan.push("Từ "+thoiGianBatDau.toLocaleDateString('vi-VN'));
        thoiGianKetThuc = new Date(thoiGianBatDau.setDate(thoiGianBatDau.getDate() + 6));
        thongTinTuan.push(" đến "+thoiGianKetThuc.toLocaleDateString('vi-VN'));
        danhSachTuan.push(thongTinTuan);
    }
    // var table = document.getElementById("time-report-tuan");
    for(var i = 0; i < danhSachTuan.length; i++)
    {
        document.getElementById('time-'+i).innerHTML = danhSachTuan[i];
    }
}


function xemNoiDung(x){

    if(document.getElementById(x).style.display == 'none' ){
        document.getElementById(x).style.display = '';
    }
    else{
        document.getElementById(x).style.display = 'none';
    }
}

function kiemtraNoiDung(){
    var arrayND = ['cttuan-mot','cttuan-hai','cttuan-ba','cttuan-bon','cttuan-nam','cttuan-sau','cttuan-bay','cttuan-tam','cttuan-chin','cttuan-muoi','cttuan-muoi-mot','cttuan-muoi-hai',];
    var i;
    for(i = 0 ; i< arrayND.length; i++)
    {
        var content_ = document.getElementById(arrayND[i]).innerHTML;
        if(content_ != '---' || content_.length >= 5 )
            {
                document.getElementById('showhide-'+arrayND[i]).style.display = '';
                document.getElementById('showhide-'+arrayND[i]).innerHTML = 'Đã nộp';

            }

        else document.getElementById('showhide-'+arrayND[i]).style.display = 'none';
    }


}
$('.popup-btn').click(function(e) {
  $('.popup-wrap').fadeIn(500);
  $('.popup-box').removeClass('transform-out').addClass('transform-in');

  e.preventDefault();
});

$('.popup-close').click(function(e) {
  $('.popup-wrap').fadeOut(500);
  $('.popup-box').removeClass('transform-in').addClass('transform-out');

  e.preventDefault();
});
