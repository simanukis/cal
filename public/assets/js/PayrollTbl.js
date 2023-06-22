/***************************************************************************** 
    1.form要素（CSVファイルの中身）の取得する
        <form要素を取得し、FileReaderクラスでFile オブジェクト（CSV）の中身を読み込む>
    2.CSVの各データを配列として読み込む-1
        <読み込んだCSVを配列化して取得>
        <テーブルにした時の、1列の要素数を取得>
    3.CSVの各データを配列として読み込む-2
        <配列データを中身の要素数（エクセルの列数）で均等に分割する>
    4.テーブルに書き出す処理
        <取り込んだCSVファイルのデータをテーブルに書き出す>
    5.作成したテーブルの<tr>にidを付与する
        <CSSで見た目を修正するために各セルに正式なidを付与>
******************************************************************************/
var form = document.forms.userform;
form.userFile.addEventListener('change', function(e) {
    var result = e.target.files[0];
    var reader = new FileReader();
    reader.readAsText(result);

    // 1行ごとに配列化する
    reader.addEventListener('load', function() {
        var arr = reader.result.split('\n');

        // 全ての配列を個別に取得
        for (i = 0; i < arr.length; i++) {
            var arrayElements = new Array(arr[i]);
        }

        // 一番上にくる配列（<th>タグに入る）を取得
        // var first = arr[0];
        // var userData = reader.result.split(/,|;|\n/);

        // 1列の要素数を取得
        var rowCnt = parseInt(userData.length) / parseInt(arr.length);

        Array.prototype.divide = function(n) {
            var userArray = this;
            var indx = 0;
            var results = [];
            var length = userArray.length;

            // 配列データを中身の要素数（エクセルの列数）で均等に分割する
            while (indx + n < length) {
                var result = userArray.slice(indx, indx + n);
                results.push(result);
                indx = indx + n
            }

            var rest = userArray.slice(indx, length + 1);
            results.push(rest);
            return results;
        }

        userArray = reader.result.split(/,|;|\n/);
        dividedArrayData = userArray.divide(rowCnt);

        // 取り込んだCSVファイルのデータをテーブルに書き出す
        function makeTable(data, tableId) {
            var rows = [];
            var table = document.createElement("table");

            // 完成したテーブルに<table id="userCsvTable">というidを付与
            table.id = "userCsvTable"

            //（縦方向）の要素数を取得・縦方向の繰り返し処理回数を指定
            for (i = 0; i < data.length; i++) {
                rows.push(table.insertRow(-1));
                if (i === arr.length) {
                    break
                }
            }

            //（横方向）の要素数を取得・横方向の繰り返し処理回数を指定。これは要素数分、列を作成する処理
            for (j = 0; j < data[0].length; j++) {
                cell = rows[i].insertCell(-1);
                // 追加した行にセルを追加してテキストを書き込む
                cell.appendChild(document.createTextNode(data[i][j]));
                if (i == 0) {
                    // ヘッダー行（エクセルの、1行目）:<th>の部分・背景色と文字色の指定
                    cell.style.backgroundColor = "gray";
                    cell.style.color = "white";

                    // ヘッダー行:各セルのidにインデックス番号を入れる
                    //（ここでは０ゼロしか入らない・次のステップで正しい連番に置き換える。）
                    cell.id = i

                    //各セルのclassを追加。ここではヘッダー行は index としている。
                    cell.classList.add("index_" + i, "cellContents", "header-cell");
                } else {
                    //ヘッダー行以外の内容行（エクセルの、２行目以降）
                    cell.id = i
                        //各セルのclassを追加。２行目以降（ヘッダー行以外）は contents としている。
                    cell.classList.add("contents_" + i, "cellContents", "body-cell")
                }
            }
            // 指定したdiv要素にテーブルを追加する
            document.getElementById(tableId).appendChild(table);
        }
        // 表のデータ
        var data = dividedArrayData
            // 表を作成する
        makeTable(data, "table");

        //作成したテーブルのtrにidを付与する
        var trId = "userElementID_"
        var tmp = document.getElementsByTagName("tr");

        for (var i = 0; i <= arr.length - 1; i++) {
            //id追加
            tmp[i].setAttribute("id", trId + i);
        }

        //作成したテーブルの各セルにidを付与する ※テーブルに書き出す処理で先にセルにidを付与しないと動作しない。
        var idName = "cell_"
        var cellId = document.getElementsByClassName("cellContents");

        for (var i = 0; i <= tmp.length - 1; i++) {
            // idを追加
            cellId[i].setAttribute("id", idName + i);
        }
    });
});