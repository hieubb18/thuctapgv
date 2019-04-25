// Get the input field
var input = document.getElementById("inGVSDT");
// Execute a function when the user releases a key on the keyboard
input.addEventListener("keyup", function(event) {
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
        },1000);
        resolve();
    });
}

function giangVienGet() {
	
    var email = $.trim($("input[name='txtGVEmail']").val()).replace(/ /g,'');
    var sdt = $.trim($("input[name='txtGVSDT']").val()).replace(/ /g,'');
	
	var sdt1 = sdt.substring(1, sdt.length);
	
    if(email=='' || sdt =='')
    {
        alert("VUI LÒNG NHẬP ĐỦ THÔNG TIN EMAIL VÀ SỐ ĐIỆN THOẠI");
        return false;
    }
	
	$("#InfoGV").html("");
	$("#countHDGV").html("");

    var worksheets = [
        '', // defaults to first worksheet without id
        'ouab0ad'];
    worksheets.forEach(function (worksheet) {
        $.googleSheetToJSON('1XjLtjloEkXKTDAsDLanA6Ace9ujINXbw7dClFAn5yeA', worksheet)
            .done(function (rows) {
                var strText = "<table class='dtable'>";
                strText += "<tr><th>Tên SV</th>  <th>Lớp</th>  <th>Mã SV</th>  <th>Ngành</th>  <th>Ngày sinh</th>   <th>Email SV</th>  <th>SĐT SV</th>  <th>Môn</th> ";
                var count = 0;
                rows.forEach(function (row) {
                    var strEmail = row['gvemail'].replace(/ /g,'');
                    var strDT = row['gvdienthoai'].replace(/ /g,'');
				if (strEmail == email && (strDT == sdt || strDT == sdt1)) {
                        count++;
                        strText += "<tr class='hidden'>";
                        Object.getOwnPropertyNames(row).forEach(function (name) {
                            if (name == 'tuan1-ndbaocao' || name == 'sotc' || name == 'tt' || name == 'gvhoten' || name == 'gvemail' || name == 'gvdienthoai' || name == 'mand' || name == 'nhom' || name == 'mamh' )
                                return;
                            var val = [].concat(row[name]).join(' / ');
                            strText += "<td>" + val + "</td>";
                            
                        });
                        
                        //strText += ;                 
                        Object.getOwnPropertyNames(row).forEach(function (name) {
                            if (name == 'tuan1-ndbaocao')
                            {                           
                                var val = [].concat(row[name]).join(' / ');
                                strText +="<tr class='noidung-bc'>"+"<td colspan='8'>" + val + "<table class='dtable'> <tbody> <tr> <th> Tuần báo cáo</th> <th> Nội dung báo cáo</th> </tr> <tr> <td>Tuần 1</td> <td>Nội dung báo cáo tuần 1 <br> Nội dung báo cáo tuần 1 <br> Nội dung báo cáo tuần 1 <br> </td> </tr> <tr> <td>Tuần 2</td> <td>Nội dung báo cáo tuần 2 <br> Nội dung báo cáo tuần 2 <br> Nội dung báo cáo tuần 2 <br> </td> </tr> <tr> <td>Tuần 3</td> <td>Nội dung báo cáo tuần 3 <br> Nội dung báo cáo tuần 3 <br> Nội dung báo cáo tuần 3 <br> </td> </tr> </tbody> </table>" + "</td>" +"</tr>";
                            }
                        });
                        //strText += "</tr>";
                        strText += "</tr>";


                        

                    }
                });
                if (count == 0)
                    $("#InfoGV").html('Không tìm thấy thông tin');
                else
				{
                    $("#InfoGV").html(strText);
                    $("#countHDGV").html("<h2>SLHD: "+count+"</h2>");
				}
            })
            .fail(function (err) {
                console.log('error!', err);

            });
    });
}